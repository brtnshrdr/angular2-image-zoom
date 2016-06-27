import {Directive, Input, HostListener, ComponentResolver, ComponentFactory, ComponentRef, ViewContainerRef, OnInit, OnDestroy, OnChanges, SimpleChanges, AfterViewInit, ElementRef} from '@angular/core';
import {ImageZoomContainer} from './image-zoom-container.component';
import {ImageZoomLens} from './image-zoom-lens.component';
@Directive({
    selector : '[imageZoom]'
})
export class ImageZoom implements OnInit, OnDestroy, AfterViewInit, OnChanges {
    @Input() private imageZoom: string;
    @Input() private allowZoom: boolean = true;
    @Input() private clickToZoom: boolean = false;
    @Input() private scrollZoom: boolean = true;
    @Input() private windowPosition: number = 1;
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
    public imageZoomLens: ImageZoomLens;

    public isZooming: boolean = false;
    public zoomLevel: number = 1;

    private _elementPosX: number;
    private _elementPosY: number;
    private _elementOffsetX: number;
    private _elementOffsetY: number;
    private _containerOffsetX: number;
    private _containerOffsetY: number;

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
    private _imageZoomLensRef: ComponentRef<ImageZoomLens>;

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
        this._componentResolver.resolveComponent(ImageZoomLens)
                .then((factory: ComponentFactory<ImageZoomLens>) => {
                    this._imageZoomLensRef = this._viewContainerRef.createComponent(factory, 0, this._viewContainerRef.injector);
                    this.imageZoomLens = this._imageZoomLensRef.instance;
                    this.imageZoomLens.setParentImageContainer(this);
                    return this._imageZoomLensRef;
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
            this.setImageZoomLens();
            this.setImageZoomLensPosition();
            this.setImageZoomLensSize();
        };
    }

    private setImageZoomContainer() {
        this.imageZoomContainer.setOptions(this.lensWidth, this.lensHeight, this.lensBorder, this._zoomImage.src);
    }

    private setImageZoomContainerVisiblity(visible: boolean) {
        this.imageZoomContainer.setVisibility(visible);
    }

    private setImageZoomLens() {
        this.imageZoomLens.setOptions(this.lensBorder);
    }

    private setImageZoomLensVisibility(visible: boolean) {
        if(!visible || this.lensStyle.toUpperCase() === 'WINDOW') {
            this.imageZoomLens.setVisibility(visible);
        }
    }

    private setImageZoomLensPosition() {
        this.imageZoomLens.setWindowPosition(this._currentX - (this.lensWidth / this._widthRatio / 2) - this._containerOffsetX, this._currentY - (this.lensHeight / this._heightRatio / 2) - this._containerOffsetY);
    }

    private setImageZoomLensSize() {
        this.imageZoomLens.setLensSize(this.lensWidth / this._widthRatio, this.lensHeight / this._heightRatio);
    }

    private setImageBackgroundPosition() {
        let x: number = (((this._currentX - this._containerOffsetX) - this._elementOffsetX) * this._widthRatio - this.lensWidth / 2) * -1;
        let y: number = (((this._currentY - this._containerOffsetY) - this._elementOffsetY) * this._heightRatio - this.lensHeight / 2) * -1;
        this.imageZoomContainer.setBackgroundPostion(x, y);
    }

    private setWindowPosition() {
        if(this.lensStyle.toUpperCase() === 'LENS') {
            this.imageZoomContainer.setWindowPosition(this._currentX - (this.lensWidth / 2) - this.lensBorder - this._containerOffsetX, this._currentY - (this.lensHeight / 2) - this.lensBorder - this._containerOffsetY); // Account for lens border shifting image down and to the right
        } else if(this.lensStyle.toUpperCase() === 'WINDOW') {
            let windowX: number = this._elementPosX + this.img.width;
            let windowY: number = this._elementPosY;
            switch (this.windowPosition) { // Calculate x position
                case 1:
                case 2:
                case 3:
                case 4:
                case 16:
                    break; // Default above
                case 5:
                case 15:
                    windowX -= this.lensWidth;
                    break;
                case 6:
                case 14:
                    windowX -= ((this.lensWidth / 2) + (this.img.width / 2));
                    break;
                case 7:
                case 13:
                    windowX -= this.img.width;
                    break;
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                    windowX -= (this.img.width + this.lensWidth);
                    break;
            }
            switch (this.windowPosition) { // Calculate Y position
                case 1:
                case 11:
                    break; // Default above
                case 2:
                case 10:
                    windowY += ((this.img.height / 2) - (this.lensHeight / 2));
                    break;
                case 3:
                case 9:
                    windowY += (this.img.height - this.lensHeight);
                    break;
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    windowY += (this.img.height);
                    break;
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                    windowY -= (this.lensHeight);
                    break;
            }
            this.imageZoomContainer.setWindowPosition(windowX - this._containerOffsetX, windowY - this._containerOffsetY);
        }
    }

    private changeZoomLevel() {
        this._widthRatio = (this._zoomedImageWidth / this.zoomLevel) / this.img.width;
        this._heightRatio = (this._zoomedImageHeight / this.zoomLevel) / this.img.height;
        this.imageZoomContainer.setZoomSize(this._zoomedImageWidth / this.zoomLevel, this._zoomedImageHeight / this.zoomLevel);
        this.setImageBackgroundPosition();
    }

    private calculateOffsets() {
        this._elementPosX = this.img.x;
        this._elementPosY = this.img.y;
        if(this.lensHeight > this.img.height) {
            this.lensHeight = this.img.height;
        }
        let parent: HTMLElement = (<HTMLElement>this.img.offsetParent);
        let offsetX: number = 0;
        let offsetY: number = 0;
        while (parent.offsetParent !== undefined && parent.offsetParent !== null) {
            offsetX += parent.offsetLeft;
            offsetY += parent.offsetTop;
            parent = (<HTMLElement>parent.offsetParent);
        }
        this._containerOffsetX = offsetX;
        this._containerOffsetY = offsetY;
        this._elementOffsetX = this.img.offsetLeft;
        this._elementOffsetY = this.img.offsetTop;
        this.setImageZoomContainer();
    }

    private calculateBoundaries(clientX: number, clientY: number) {
        let xPos = clientX - this._elementOffsetX;
        let rightBoundary: number = (this.img.width - ((this.lensWidth / 2) / this._widthRatio)) + this._containerOffsetX;
        let leftBoundary: number = ((this.lensWidth / 2) / this._widthRatio) + this._containerOffsetX;
        if(xPos >= rightBoundary) {
            this._currentX = rightBoundary + this._elementOffsetX;
        } else if(xPos <= leftBoundary) {
            this._currentX = leftBoundary + this._elementOffsetX;
        } else {
            this._currentX = clientX;
        }

        let yPos = clientY - this._elementOffsetY;
        let topBoundary: number = ((this.lensHeight / 2) / this._heightRatio) + this._containerOffsetY;
        let bottomBoundary: number = (this.img.height - ((this.lensHeight / 2) / this._heightRatio)) + this._containerOffsetY;
        if(yPos >= bottomBoundary) {
            this._currentY = bottomBoundary + this._elementOffsetY;
        } else if(yPos <= topBoundary) {
            this._currentY = topBoundary + this._elementOffsetY;
        } else {
            this._currentY = clientY;
        }
    }

    @HostListener('mousemove', ['$event'])
    public onMousemove(event: MouseEvent) {
        if(this.allowZoom) {
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
                this.setImageZoomLensPosition();
                this.setWindowPosition();
                this._mouseMoveDebounce = 0;
            }, 10); // Wait 10ms to be more performant
        }
    }

    @HostListener('mouseenter', ['$event'])
    public onMouseenter(event: MouseEvent) {
        if(!this.isZooming) {
            this.ngAfterViewInit();
            if(this._imageLoaded && this.allowZoom) {
                if(this._mouseEnterDebounce !== 0) {
                    clearTimeout(this._mouseEnterDebounce);
                }
                this._mouseEnterDebounce = setTimeout(() => {
                    this.isZooming = true;
                    this._mouseEnterDebounce = 0;
                    this._previousCursor = this.img.style.cursor;
                    this.img.style.cursor = 'pointer';
                    this.setImageZoomContainerVisiblity(true);
                    this.setImageZoomLensVisibility(true);
                }, this.delay);
            }
        }
    }

    @HostListener('mouseleave', ['$event'])
    public onMouseleave(event: MouseEvent) {
        let x: number = event.clientX;
        let y: number = event.clientY;
        if(y <= this.img.y || y >= (this.img.y + this.img.height) || x <= this.img.x || x >= (this.img.x + this.img.width)) {
            if(this._mouseEnterDebounce !== 0) {
                clearTimeout(this._mouseEnterDebounce);
            }
            if(this.isZooming) {
                this.img.style.cursor = this._previousCursor;
                this.setImageZoomContainerVisiblity(false);
                this.setImageZoomLensVisibility(false);
                this.isZooming = false;
            }
        } else {
            this.onMousemove(event); // "mouseleave" event was just the mouse focus going to the lens
        }

    }

    @HostListener('MozMousePixelScroll', ['$event'])
    @HostListener('DOMMouseScroll', ['$event'])
    @HostListener('mousewheel', ['$event'])
    public onMouseScroll(event: any) { // MouseWheelEvent is throwing undefined error in SystemJS
        if(this.scrollZoom && this.allowZoom) {
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
            this.setImageZoomLensSize();
            this.setImageZoomLensPosition();
            return false;
        } else {
            return true;
        }
    }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        if(this.clickToZoom) {
            this.allowZoom = !this.allowZoom;
            if(this.allowZoom) {
                this.onMousemove(event);
            } else {
                this.onMouseleave(event);
            }
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
        this.calculateOffsets();
    }

    ngOnInit() {
        if(this.clickToZoom) {
            this.allowZoom = false;
        }
        this._zoomImage.src = this.imageZoom ? this.imageZoom : this.img.src;
    }

    ngOnDestroy() {
        this._imageZoomContainerRef.destroy();
    }

}























