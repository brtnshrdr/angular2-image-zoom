import {Component, ElementRef} from '@angular/core';

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
            border: 4px solid rgb(136, 136, 136);
            background: rgb(255, 255, 255) no-repeat;
        }
    `]
})
export class ImageZoomContainer {
    private visible: boolean;
    private windowWidth: number;
    private windowHeight: number;
    private imageHeight: number;
    private imageWidth: number;
    private top: number;
    private left: number;
    private positionX: number;
    private positionY: number;
    private image: string;

    private el: HTMLElement;


    private generateStyles() {
        this.el.style.width = this.windowWidth+'px';
        this.el.style.height = this.windowHeight+'px';
        this.el.style.left = this.left+'px';
        this.el.style.top = this.top+'px';
        this.el.style.backgroundImage = `url(${this.image})`;
    }

    public setPostion(x: number, y: number){
        this.el.style.backgroundPosition = `${x}px ${y}px`;
        this.positionX = x;
        this.positionY = y;
    }

    public setZoomSize(width: number, height: number){
        this.el.style.backgroundSize = `${width}px ${height}px`;
        this.imageWidth = width;
        this.imageHeight = height;
    }


    public setOptions(windowWidth: number, windowHeight: number, left: number, top: number, image: string) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.left = left;
        this.top = top;
        this.image = image;
        this.generateStyles();
    }

    public setVisibility(visible: boolean) {
        this.el.style.display = visible ? 'block' : 'none';
        this.visible = visible;
    }

    constructor(private _elementRef: ElementRef) {
        this.el = this._elementRef.nativeElement;
        this.setVisibility(false);
    }

}