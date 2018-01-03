import { ElementRef } from '@angular/core';
import { ImageZoom } from './image-zoom.directive';
export declare class ImageZoomLens {
    private _elementRef;
    private visible;
    private lensWidth;
    private lensHeight;
    private top;
    private left;
    private borderSize;
    private el;
    private parentImageContainer;
    private onMousemove(event);
    onMouseleave(event: MouseEvent): void;
    onMouseScroll(event: any): void;
    setLensSize(width: number, height: number): void;
    setWindowPosition(left: number, top: number): void;
    setOptions(borderSize: number): void;
    setVisibility(visible: boolean): void;
    setParentImageContainer(parentImageContainer: ImageZoom): void;
    constructor(_elementRef: ElementRef);
}
