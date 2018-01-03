"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ImageZoomLens = (function () {
    function ImageZoomLens(_elementRef) {
        this._elementRef = _elementRef;
        this.el = this._elementRef.nativeElement;
        this.setVisibility(false);
    }
    ImageZoomLens.prototype.onMousemove = function (event) {
        this.parentImageContainer.onMousemove(event);
    };
    ImageZoomLens.prototype.onMouseleave = function (event) {
        var x = event.clientX;
        var y = event.clientY;
        if (x <= this.parentImageContainer.img.x || x >= (this.parentImageContainer.img.x + this.parentImageContainer.img.width)) {
            this.parentImageContainer.onMouseleave(event);
        }
        else if (y <= this.parentImageContainer.img.y || y >= (this.parentImageContainer.img.y + this.parentImageContainer.img.height)) {
            this.parentImageContainer.onMouseleave(event);
        }
        else {
            this.parentImageContainer.onMousemove(event); // "mouseleave" event was just the mouse moving faster than the lens
        }
    };
    ImageZoomLens.prototype.onMouseScroll = function (event) {
        this.parentImageContainer.onMouseScroll(event);
    };
    ImageZoomLens.prototype.setLensSize = function (width, height) {
        this.el.style.width = width + 'px';
        this.el.style.height = height + 'px';
        this.lensWidth = width;
        this.lensHeight = height;
    };
    ImageZoomLens.prototype.setWindowPosition = function (left, top) {
        this.el.style.left = left + 'px';
        this.el.style.top = top + 'px';
        this.left = left;
        this.top = top;
    };
    ImageZoomLens.prototype.setOptions = function (borderSize) {
        this.el.style.border = borderSize + "px solid rgb(136, 136, 136)";
        this.borderSize = borderSize;
    };
    ImageZoomLens.prototype.setVisibility = function (visible) {
        this.el.style.display = visible ? 'block' : 'none';
        this.visible = visible;
    };
    ImageZoomLens.prototype.setParentImageContainer = function (parentImageContainer) {
        this.parentImageContainer = parentImageContainer;
    };
    return ImageZoomLens;
}());
ImageZoomLens.decorators = [
    { type: core_1.Component, args: [{
                selector: 'image-zoom-lens',
                template: "",
                styles: ["\n        :host {\n            float: right;\n            overflow: hidden;\n            z-index: 999;\n            opacity: .4;\n            zoom: 1;\n            cursor: default;\n            border: 1px solid rgb(0, 0, 0);\n            position: absolute;\n            background: rgb(255, 255, 255) no-repeat 0 0;\n            pointer-events: none;\n        }\n    "]
            },] },
];
/** @nocollapse */
ImageZoomLens.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
]; };
ImageZoomLens.propDecorators = {
    'onMousemove': [{ type: core_1.HostListener, args: ['mousemove', ['$event'],] },],
    'onMouseleave': [{ type: core_1.HostListener, args: ['mouseleave', ['$event'],] },],
    'onMouseScroll': [{ type: core_1.HostListener, args: ['MozMousePixelScroll', ['$event'],] }, { type: core_1.HostListener, args: ['DOMMouseScroll', ['$event'],] }, { type: core_1.HostListener, args: ['mousewheel', ['$event'],] },],
};
exports.ImageZoomLens = ImageZoomLens;
//# sourceMappingURL=image-zoom-lens.component.js.map