"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ImageZoomContainer = (function () {
    function ImageZoomContainer(_elementRef) {
        this._elementRef = _elementRef;
        this.el = this._elementRef.nativeElement;
        this.setVisibility(false);
    }
    ImageZoomContainer.prototype.onMousemove = function (event) {
        this.parentImageContainer.onMousemove(event);
    };
    ImageZoomContainer.prototype.onMouseleave = function (event) {
        this.parentImageContainer.onMouseleave(event);
    };
    ImageZoomContainer.prototype.onMouseScroll = function (event) {
        this.parentImageContainer.onMouseScroll(event);
    };
    ImageZoomContainer.prototype.generateStyles = function () {
        this.el.style.width = this.windowWidth + 'px';
        this.el.style.height = this.windowHeight + 'px';
        this.el.style.border = this.borderSize + "px solid rgb(136, 136, 136)";
        this.el.style.left = this.left + 'px';
        this.el.style.top = this.top + 'px';
        this.el.style.backgroundImage = "url(" + this.image + ")";
    };
    ImageZoomContainer.prototype.setBackgroundPostion = function (x, y) {
        this.el.style.backgroundPosition = x + "px " + y + "px";
        this.positionX = x;
        this.positionY = y;
    };
    ImageZoomContainer.prototype.setZoomSize = function (width, height) {
        this.el.style.backgroundSize = width + "px " + height + "px";
        this.imageWidth = width;
        this.imageHeight = height;
    };
    ImageZoomContainer.prototype.setWindowPosition = function (left, top) {
        this.el.style.left = left + 'px';
        this.el.style.top = top + 'px';
        this.left = left;
        this.top = top;
    };
    ImageZoomContainer.prototype.setOptions = function (windowWidth, windowHeight, borderSize, image) {
        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
        this.borderSize = borderSize;
        this.image = image;
        this.generateStyles();
    };
    ImageZoomContainer.prototype.setVisibility = function (visible) {
        this.el.style.display = visible ? 'block' : 'none';
        this.visible = visible;
    };
    ImageZoomContainer.prototype.setParentImageContainer = function (parentImageContainer) {
        this.parentImageContainer = parentImageContainer;
    };
    return ImageZoomContainer;
}());
ImageZoomContainer.decorators = [
    { type: core_1.Component, args: [{
                selector: 'image-zoom-container',
                template: "",
                styles: ["\n        :host {\n            position: absolute;\n            text-align: center;\n            overflow: hidden;\n            z-index: 100;\n            float: left;\n            background: rgb(255, 255, 255) no-repeat;\n            pointer-events: none;\n        }\n    "]
            },] },
];
/** @nocollapse */
ImageZoomContainer.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
]; };
ImageZoomContainer.propDecorators = {
    'onMousemove': [{ type: core_1.HostListener, args: ['mousemove', ['$event'],] },],
    'onMouseleave': [{ type: core_1.HostListener, args: ['mouseleave', ['$event'],] },],
    'onMouseScroll': [{ type: core_1.HostListener, args: ['MozMousePixelScroll', ['$event'],] }, { type: core_1.HostListener, args: ['DOMMouseScroll', ['$event'],] }, { type: core_1.HostListener, args: ['mousewheel', ['$event'],] },],
};
exports.ImageZoomContainer = ImageZoomContainer;
//# sourceMappingURL=image-zoom-container.component.js.map