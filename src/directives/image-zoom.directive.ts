import {Directive, Input, HostListener, ComponentResolver, ComponentFactory, ComponentRef, ViewContainerRef, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit, ElementRef} from '@angular/core';
import {ImageZoomContainer} from './image-zoom-container.component';
@Directive({
    selector : '[imageZoom]'
})
export class ImageZoom implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() private imageZoom: string;
    @Input() private allowZoom: boolean = true;
    @Input() private scrollZoom: boolean = true;
    @Input() private lensStyle: string = 'WINDOW';
    @Input() private lensWidth: number = 300;
    @Input() private lensHeight: number = 300;
    @Input() private lensBorder: number = 2;
    @Input() private delay: number = 100;
    @Input() private minZoomLevel: number = .2;

    @Input()
    private set maxZoomLevel(maxZoomLevel: number) {
        this._maxZoomLevel = maxZoomLevel;
        this._autoCalculateZoom = false;
    }

    @Input() private zoomLevelIncrement: number = .1;

    public img: HTMLImageElement;
    public imageZoomContainer: ImageZoomContainer;

    public isZooming: boolean = false;
    public zoomLevel: number = 1;

    private _elementPosX: number;
    private _elementPosY: number;
    private _elementOffsetX: number;
    private _elementOffsetY: number;

    private _zoomImage: HTMLImageElement;
    private _imageLoaded: boolean = false;
    private _zoomedImageWidth: number;
    private _zoomedImageHeight: number;
    private _maxZoomLevel: number;
    private _autoCalculateZoom: boolean = true;

    private _widthRatio: number;
    private _heightRatio: number;

    private _currentX: number = 0;
    private _currentY: number = 0;
    private _mouseMoveDebounce: number = 0;
    private _mouseEnterDebounce: number = 0;
    private _lastEvent: MouseEvent;
    private _previousCursor: string;

    private _imageZoomContainerRef: ComponentRef<ImageZoomContainer>;

    constructor(private _elementRef: ElementRef, private _componentResolver: ComponentResolver, private _viewContainerRef: ViewContainerRef) {
        if(this._elementRef.nativeElement.nodeName !== 'IMG') {
            console.error('ImageZoom not placed on image element', this._elementRef.nativeElement);
            return;
        }
        this.img = this._elementRef.nativeElement;
        this.imageChanged();

        this._componentResolver.resolveComponent(ImageZoomContainer)
                .then((factory: ComponentFactory<ImageZoomContainer>) => {
                    this._imageZoomContainerRef = this._viewContainerRef.createComponent(factory, 0, this._viewContainerRef.injector);
                    this.imageZoomContainer = this._imageZoomContainerRef.instance;
                    this.imageZoomContainer.setParentImageContainer(this);
                    return this._imageZoomContainerRef;
                });
    }

    private imageChanged() {
        this._imageLoaded = false;
        this._zoomImage = new Image();
        this._zoomImage.onload = () => {
            this._zoomedImageWidth = this._zoomImage.width;
            this._zoomedImageHeight = this._zoomImage.height;
            this.imageZoomContainer.setZoomSize(this._zoomedImageWidth / this.zoomLevel, this._zoomedImageHeight / this.zoomLevel);
            if(this._autoCalculateZoom) {
                if(this._zoomedImageWidth > this._zoomedImageHeight) {
                    this._maxZoomLevel = this._zoomedImageHeight / this.lensHeight;
                } else {
                    this._maxZoomLevel = this._zoomedImageWidth / this.lensWidth;
                }
            }
            this._imageLoaded = true;
            this.changeZoomLevel();
            this.setImageZoomContainer();
        };
    }

    private setImageZoomContainer() {
        this.imageZoomContainer.setOptions(this.lensWidth, this.lensHeight, this._elementPosX + this.img.width + 20, this._elementPosY, this.lensBorder, this._zoomImage.src);
    }

    private setImageZoomContainerVisiblity(visible: boolean) {
        this.imageZoomContainer.setVisibility(visible);
    }

    private setImageBackgroundPosition() {
        let x: number = ((this._currentX - this._elementOffsetX) * this._widthRatio - this.lensWidth / 2) * -1;
        let y: number = ((this._currentY - this._elementOffsetY) * this._heightRatio - this.lensHeight / 2) * -1;
        this.imageZoomContainer.setBackgroundPostion(x, y);
    }

    private setWindowPosition() {
        if(this.lensStyle.toUpperCase() === 'LENS') {
            this.imageZoomContainer.setWindowPosition(this._currentX - (this.lensWidth / 2) - this.lensBorder, this._currentY - (this.lensHeight / 2) - this.lensBorder); // Account for lens border shifting image down and to the right
        } else if(this.lensStyle.toUpperCase() === 'WINDOW') {
            this.imageZoomContainer.setWindowPosition(this._elementPosX + this.img.width + 20, this._elementPosY);
        }
    }

    private changeZoomLevel() {
        this._widthRatio = (this._zoomedImageWidth / this.zoomLevel) / this.img.width;
        this._heightRatio = (this._zoomedImageHeight / this.zoomLevel) / this.img.height;
        this.imageZoomContainer.setZoomSize(this._zoomedImageWidth / this.zoomLevel, this._zoomedImageHeight / this.zoomLevel);
        this.setImageBackgroundPosition();
    }

    private calculateBoundaries(clientX: number, clientY: number) {
        if(this.lensStyle.toUpperCase() === 'LENS') {
            let xPos = clientX - this._elementOffsetX;
            let rightBoundary: number = (this.img.width - ((this.lensWidth / 2) / this._widthRatio)) + (this.lensBorder * 2);
            let leftBoundary: number = ((this.lensWidth / 2) / this._widthRatio);
            if(xPos >= rightBoundary) {
                this._currentX = rightBoundary + this._elementOffsetX;
            } else if(xPos <= leftBoundary) {
                this._currentX = leftBoundary + this._elementOffsetX;
            } else {
                this._currentX = clientX;
            }

            let yPos = clientY - this._elementOffsetY;
            let topBoundary: number = ((this.lensHeight / 2) / this._heightRatio);
            let bottomBoundary: number = ((this.img.height - ((this.lensHeight / 2) / this._heightRatio) + this.lensBorder));
            if(yPos >= bottomBoundary) {
                this._currentY = bottomBoundary + this._elementOffsetY;
            } else if(yPos <= topBoundary) {
                this._currentY = topBoundary + this._elementOffsetY;
            } else {
                this._currentY = clientY;
            }
        } else if(this.lensStyle.toUpperCase() === 'WINDOW') {
            this._currentX = clientX; // TODO
            this._currentY = clientY;
        }
    }

    @HostListener('mousemove', ['$event'])
    public onMousemove(event: MouseEvent) {
        this._lastEvent = event; // Make sure we end up at the right place, without calling too frequently
        if(this._mouseMoveDebounce !== 0) {
            return;
        }
        this._mouseMoveDebounce = setTimeout(() => {
            if(!this.isZooming) {
                this.onMouseenter(event);
            }

            this.calculateBoundaries(this._lastEvent.clientX, this._lastEvent.clientY);
            this.setImageBackgroundPosition();
            this.setWindowPosition();
            this._mouseMoveDebounce = 0;
        }, 10); // Wait 10ms to be more performant
    }

    @HostListener('mouseenter', ['$event'])
    public onMouseenter(event: MouseEvent) {
        if(this._imageLoaded && this.allowZoom) {
            this._mouseEnterDebounce = setTimeout(() => {
                this._mouseEnterDebounce = 0;
                this.isZooming = true;
                this._previousCursor = this.img.style.cursor;
                this.img.style.cursor = 'pointer';
                this.setImageZoomContainerVisiblity(true);
            }, this.delay);
        }
    }

    @HostListener('mouseleave', ['$event'])
    public onMouseleave(event: MouseEvent) {
        if(this._mouseEnterDebounce !== 0) {
            clearTimeout(this._mouseEnterDebounce);
            return;
        }
        if(this.isZooming) {
            this.isZooming = false;
            this.img.style.cursor = this._previousCursor;
            this.setImageZoomContainerVisiblity(false);
        }
    }

    @HostListener('MozMousePixelScroll', ['$event'])
    @HostListener('DOMMouseScroll', ['$event'])
    @HostListener('mousewheel', ['$event'])
    public onMouseScroll(event: any) { // MouseWheelEvent is throwing undefined error in SystemJS
        if(this.scrollZoom) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();

            let pos: number = event.wheelDeltaY | event.detail * -1;
            if(pos > 0) { // Scroll up
                if(this.zoomLevel > (this.minZoomLevel + this.zoomLevelIncrement)) {
                    this.zoomLevel -= this.zoomLevelIncrement;
                    this.changeZoomLevel();
                }
            } else { // Scroll down
                if(this.zoomLevel < (this._maxZoomLevel - this.zoomLevelIncrement)) {
                    this.zoomLevel += this.zoomLevelIncrement;
                    this.changeZoomLevel();
                }
            }
            this.calculateBoundaries(this._lastEvent.clientX, this._lastEvent.clientY);
            this.setWindowPosition();
            return false;
        } else {
            return true;
        }
    }

    ngOnChanges(changeRecord: SimpleChanges) {
        for (let prop in changeRecord) {
            if(!changeRecord[prop].isFirstChange()) {
                if(prop === 'imageZoom') { // Image changed
                    this.imageChanged();
                    this.ngAfterViewInit();
                    this._zoomImage.src = changeRecord[prop].currentValue ? changeRecord[prop].currentValue : this.img.src;
                } else if(prop === 'lensWidth' || prop === 'lensHeight') {
                    if(this.lensHeight > this.img.height) {
                        this.lensHeight = this.img.height;
                    }
                    this.setImageZoomContainer();
                    this.setImageBackgroundPosition();
                }
            }
        }
    }

    ngAfterViewInit() {
        this._elementPosX = this.img.x;
        this._elementPosY = this.img.y;
        if(this.lensHeight > this.img.height) {
            this.lensHeight = this.img.height;
        }
        this._elementOffsetX = this.img.offsetLeft;
        this._elementOffsetY = this.img.offsetTop;
        this.setImageZoomContainer();
    }

    ngOnInit() {
        this._zoomImage.src = this.imageZoom ? this.imageZoom : this.img.src;
    }

    ngOnDestroy() {
        this._imageZoomContainerRef.destroy();
    }

}























