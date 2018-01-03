import {Component, HostListener, ElementRef} from '@angular/core';
import {ImageZoom} from './image-zoom.directive';

@Component({
    selector : 'image-zoom-lens',
    template : ``,
    styles : [`
        :host {
            float: right;
            overflow: hidden;
            z-index: 999;
            opacity: .4;
            zoom: 1;
            cursor: default;
            border: 1px solid rgb(0, 0, 0);
            position: absolute;
            background: rgb(255, 255, 255) no-repeat 0 0;
            pointer-events: none;
        }
    `]
})
export class ImageZoomLens {
    private visible: boolean;
    private lensWidth: number;
    private lensHeight: number;
    private top: number;
    private left: number;
    private borderSize: number;

    private el: HTMLElement;

    private parentImageContainer: ImageZoom;

    @HostListener('mousemove', ['$event'])
    private onMousemove(event: MouseEvent) {
        this.parentImageContainer.onMousemove(event);
    }

    @HostListener('mouseleave', ['$event'])
    public onMouseleave(event: MouseEvent) {
        let x: number = event.clientX;
        let y: number = event.clientY;
        if(x <= this.parentImageContainer.img.x || x >= (this.parentImageContainer.img.x + this.parentImageContainer.img.width)) {
            this.parentImageContainer.onMouseleave(event);
        } else if(y <= this.parentImageContainer.img.y || y >= (this.parentImageContainer.img.y + this.parentImageContainer.img.height)){
            this.parentImageContainer.onMouseleave(event);
        } else {
            this.parentImageContainer.onMousemove(event); // "mouseleave" event was just the mouse moving faster than the lens
        }
    }

    @HostListener('MozMousePixelScroll', ['$event'])
    @HostListener('DOMMouseScroll', ['$event'])
    @HostListener('mousewheel', ['$event'])
    public onMouseScroll(event: any) { // MouseWheelEvent is throwing undefined error in SystemJS
        this.parentImageContainer.onMouseScroll(event);
    }

    public setLensSize(width: number, height: number) {
        this.el.style.width = width + 'px';
        this.el.style.height = height + 'px';
        this.lensWidth = width;
        this.lensHeight = height;
    }

    setWindowPosition(left: number, top: number) {
        this.el.style.left = left + 'px';
        this.el.style.top = top + 'px';
        this.left = left;
        this.top = top;
    }


    public setOptions(borderSize: number) {
        this.el.style.border = `${borderSize}px solid rgb(136, 136, 136)`;
        this.borderSize = borderSize;
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