import {Directive, Input, HostListener, HostBinding, ComponentResolver, ComponentFactory, ComponentRef, ViewContainerRef, OnInit, OnDestroy, AfterViewInit, ElementRef} from '@angular/core';
import {ImageZoomContainer} from './image-zoom-container.component';
@Directive({
    selector : '[imageZoom]'
})
export class ImageZoom implements OnInit, OnDestroy, AfterViewInit {
    @Input() private imageZoom: string;
    @Input() private lensWidth: number = 300;
    @Input() private lensHeight: number = 300;

    public img: HTMLImageElement;
    public imageZoomContainer: ImageZoomContainer;

    public canZoom: boolean = false;
    public isZooming: boolean = false;
    public zoomLevel: number = 1;

    private elementPosX: number;
    private elementPosY: number;
    private elementOffsetX: number;
    private elementOffsetY: number;

    private zoomImage: HTMLImageElement = new Image();
    private zoomedImageWidth: number;
    private zoomedImageHeight: number;

    private widthRatio: number;
    private heightRatio: number;

    private currentX: number = 0;
    private currentY: number = 0;
    private debounce: number = 0;
    private lastEvent: MouseEvent;
    private previousCursor: string;

    constructor(private _elementRef: ElementRef, private _componentResolver: ComponentResolver, private _viewContainerRef: ViewContainerRef) {
        if(this._elementRef.nativeElement.nodeName !== 'IMG') {
            console.error('ImageZoom not placed on image element', this._elementRef.nativeElement);
            return;
        }
        this.img = this._elementRef.nativeElement;

        this.zoomImage.onload = () => {
            this.zoomedImageWidth = this.zoomImage.width;
            this.zoomedImageHeight = this.zoomImage.height;
            this.widthRatio = this.zoomedImageWidth / this.img.width;
            this.heightRatio = this.zoomedImageHeight / this.img.height;
            this.imageZoomContainer.setZoomSize(this.zoomedImageWidth / this.zoomLevel, this.zoomedImageHeight / this.zoomLevel);
            this.canZoom = true;
            console.dir(this);
        };


        this._componentResolver.resolveComponent(ImageZoomContainer)
                .then((factory: ComponentFactory<ImageZoomContainer>) => {
                    let container: ComponentRef<ImageZoomContainer> = this._viewContainerRef.createComponent(factory, 0, this._viewContainerRef.injector);
                    this.imageZoomContainer = container.instance;
                    return container;
                });
    }

    private setImageZoomContainer() {
        this.imageZoomContainer.setOptions(this.lensWidth, this.lensHeight, this.elementPosX + this.img.width + 20, this.elementPosY, this.zoomImage.src);
    }

    private setImageZoomContainerVisiblity(visible: boolean) {
        this.imageZoomContainer.setVisibility(visible);
    }

    private setImageWindowPosition() {
        let x: number = ((this.currentX - this.elementOffsetX) * this.widthRatio - this.lensWidth / 2) * -1;
        let y: number = ((this.currentY - this.elementOffsetY) * this.heightRatio - this.lensHeight / 2) * -1;
        this.imageZoomContainer.setPostion(x, y);
    }

    @HostListener('mousemove', ['$event'])
    private onMousemove(event: MouseEvent) {
        this.lastEvent = event; // Make sure we end up at the right place, without calling too frequently
        if(this.debounce !== 0) {
            return;
        }
        this.debounce = setTimeout(() => {
            this.currentX = this.lastEvent.clientX;
            this.currentY = this.lastEvent.clientY;
            this.debounce = 0;
            this.setImageWindowPosition();
        }, 10); // Wait 50ms to be more performant
    }

    @HostListener('mouseenter', ['$event'])
    private onMouseenter(event: MouseEvent) {
        if(this.canZoom) {
            this.isZooming = true;
            this.previousCursor = this.img.style.cursor;
            this.img.style.cursor = 'pointer';
            this.setImageZoomContainerVisiblity(true);
            console.log('start zooming');
        }
    }

    @HostListener('mouseleave', ['$event'])
    private onMouseleave(event: MouseEvent) {
        if(this.canZoom) {
            this.isZooming = false;
            this.img.style.cursor = this.previousCursor;
            this.setImageZoomContainerVisiblity(false);
            console.log('stop zooming');
            console.dir(this);
        }
    }

    private ngAfterViewInit() {
        this.elementPosX = this.img.x;
        this.elementPosY = this.img.y;
        if(this.lensHeight > this.img.height) {
            this.lensHeight = this.img.height;
        }
        this.elementOffsetX = this.img.offsetLeft;
        this.elementOffsetY = this.img.offsetTop;
        this.setImageZoomContainer();
    }

    private ngOnInit() {
        this.zoomImage.src = this.imageZoom ? this.imageZoom : this.img.src;
    }

    private ngOnDestroy() {

    }

}























