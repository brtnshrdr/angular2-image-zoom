import {Component, ElementRef} from '@angular/core';

@Component({
    selector : 'zoom-lens-container',
    template : ``,
    styles : [`
        :host {
            float: right;
            overflow: hidden;
            position: absolute;
            z-index: 999;
            opacity: .4;
            zoom: 1;
            cursor: pointer;
            border: 1px solid rgb(0, 0, 0);
            background: rgb(255, 255, 255) no-repeat 0px 0px;
        }
    `]
})
export class ZoomLensContainer {
    private visible: boolean;
    private lensWidth: number;
    private lensHeight: number;
    private top: number;
    private left: number;

    private el: HTMLElement;


    public setPostion(x: number, y: number) {
        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
        this.left = x;
        this.top = y;
    }

    public setSize(width: number, height: number) {
        this.el.style.width = `${width}px`;
        this.el.style.height = `${height}px`;
        this.lensWidth = width;
        this.lensHeight = height;
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