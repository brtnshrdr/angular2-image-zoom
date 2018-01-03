import { ElementRef } from '@angular/core';
import { ImageZoom } from './image-zoom.directive';
export declare class ImageZoomContainer {
    private _elementRef;
    private visible;
    private windowWidth;
    private windowHeight;
    private borderSize;
    private imageHeight;
    private imageWidth;
    private top;
    private left;
    private positionX;
    private positionY;
    private image;
    private el;
    private parentImageContainer;
    private onMousemove(event);
    onMouseleave(event: MouseEvent): void;
    onMouseScroll(event: any): void;
    private generateStyles();
    setBackgroundPostion(x: number, y: number): void;
    setZoomSize(width: number, height: number): void;
    setWindowPosition(left: number, top: number): void;
    setOptions(windowWidth: number, windowHeight: number, borderSize: number, image: string): void;
    setVisibility(visible: boolean): void;
    setParentImageContainer(parentImageContainer: ImageZoom): void;
    constructor(_elementRef: ElementRef);
}
