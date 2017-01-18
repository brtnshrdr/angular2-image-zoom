import {Component, HostListener, ElementRef} from '@angular/core';
import {ImageZoom} from './image-zoom.directive';

@Component({
    selector : 'image-zoom-container',
    template : ``,
    styles : [`
        :host {
            position: absolute;
            text-align: center;
            overflow: hidden;
            z-index: 100;
            float: left;
            background: rgb(255, 255, 255) no-repeat;
            pointer-events: none;
        }
    `]
})
export class ImageZoomContainer {
    private visible: boolean;
    private windowWidth: number;
    private windowHeight: number;
    private borderSize: number;
    private imageHeight: number;
    private imageWidth: number;
    private top: number;
    private left: number;
    private positionX: number;
    private positionY: number;
    private image: string;

    private el: HTMLElement;

    private parentImageContainer: ImageZoom;

    @HostListener('mousemove', ['$event'])
    private onMousemove(event: MouseEvent) {
        this.parentImageContainer.onMousemove(event);
    }

    @HostListener('mouseleave', ['$event'])
    public onMouseleave(event: MouseEvent) {
        this.parentImageContainer.onMouseleave(event);
    }

    @HostListener('MozMousePixelScroll', ['$event'])
    @HostListener('DOMMouseScroll', ['$event'])
    @HostListener('mousewheel', ['$event'])
    public onMouseScroll(event: any) { // MouseWheelEvent is throwing undefined error in SystemJS
        this.parentImageContainer.onMouseScroll(event);
    }


    private generateStyles() {
        this.el.style.width = this.windowWidth + 'px';
        this.el.style.height = this.windowHeight + 'px';
        this.el.style.border = `${this.borderSize}px solid rgb(136, 136, 136)`;
        this.el.style.left = this.left + 'px';
        this.el.style.top = this.top + 'px';
        this.el.style.backgroundImage = `url(${this.image})`;
    }

    public setBackgroundPostion(x: number, y: number) {
        this.el.style.backgroundPosition = `${x}px ${y}px`;
        this.positionX = x;
        this.positionY = y;
    }

    public setZoomSize(width: number, height: number) {
        this.el.style.backgroundSize = `${width}px ${height}px`;
        this.imageWidth = width;
        this.imageHeight = height;
    }

    setWindowPosition(left: number, top: number) {
        this.el.style.left = left + 'px';
        this.el.style.top = top + 'px';
        this.left = left;
        this.top = top;
    }


    public setOptions(windowWidth: number, windowHeight: number, borderSize: number, image: string) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.borderSize = borderSize;
        this.image = image;
        this.generateStyles();
    }

    public setVisibility(visible: boolean) {
        this.el.style.display = visible ? 'block' : 'none';
        this.visible = visible;
    }


    public setParentImageContainer(parentImageContainer: ImageZoom) {
        this.parentImageContainer = parentImageContainer;
    }

    constructor(private _elementRef: ElementRef) {
        this.el = this._elementRef.nativeElement;
        this.setVisibility(false);
    }

}