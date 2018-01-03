"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var image_zoom_container_component_1 = require("./image-zoom-container.component");
var image_zoom_lens_component_1 = require("./image-zoom-lens.component");
var ImageZoom = (function () {
    function ImageZoom(_elementRef, _componentFactoryResolver, _viewContainerRef) {
        var _this = this;
        this._elementRef = _elementRef;
        this._componentFactoryResolver = _componentFactoryResolver;
        this._viewContainerRef = _viewContainerRef;
        this.allowZoom = true;
        this.clickToZoom = false;
        this.scrollZoom = true;
        this.windowPosition = 1;
        this.lensStyle = 'WINDOW';
        this.lensWidth = 300;
        this.lensHeight = 300;
        this.lensBorder = 2;
        this.delay = 100;
        this.minZoomLevel = .2;
        this.zoomLevel = 1;
        this.zoomLevelIncrement = .1;
        this.isZooming = false;
        this._zoomedImageLoaded = false;
        this._autoCalculateZoom = true;
        this._currentX = 0;
        this._currentY = 0;
        this._mouseMoveDebounce = 0;
        this._mouseEnterDebounce = 0;
        this._imageLoaded = false;
        this._componentsCreated = false;
        if (this._elementRef.nativeElement.nodeName !== 'IMG') {
            console.error('ImageZoom not placed on image element', this._elementRef.nativeElement);
            return;
        }
        this.img = this._elementRef.nativeElement;
        this.img.onload = function () {
            _this._imageLoaded = true;
            if (_this._componentsCreated) {
                _this.imageChanged();
            }
        };
        var imageZoomContainerFactory = this._componentFactoryResolver.resolveComponentFactory(image_zoom_container_component_1.ImageZoomContainer);
        var imageZoomLensFactory = this._componentFactoryResolver.resolveComponentFactory(image_zoom_lens_component_1.ImageZoomLens);
        this._imageZoomContainerRef = this._viewContainerRef.createComponent(imageZoomContainerFactory);
        this.imageZoomContainer = this._imageZoomContainerRef.instance;
        this.imageZoomContainer.setParentImageContainer(this);
        this._imageZoomLensRef = this._viewContainerRef.createComponent(imageZoomLensFactory);
        this.imageZoomLens = this._imageZoomLensRef.instance;
        this.imageZoomLens.setParentImageContainer(this);
        this._componentsCreated = true;
        if (this._imageLoaded) {
            this.imageChanged();
        }
    }
    Object.defineProperty(ImageZoom.prototype, "maxZoomLevel", {
        set: function (maxZoomLevel) {
            this._maxZoomLevel = maxZoomLevel;
            this._autoCalculateZoom = false;
        },
        enumerable: true,
        configurable: true
    });
    ImageZoom.prototype.imageChanged = function () {
        var _this = this;
        this._zoomedImageLoaded = false;
        this._zoomedImage = new Image();
        this._zoomedImage.onload = function () {
            _this._zoomedImageWidth = _this._zoomedImage.width;
            _this._zoomedImageHeight = _this._zoomedImage.height;
            if (_this._zoomedImageWidth < _this.img.width) {
                _this.allowZoom = false;
                return;
            }
            _this._zoomedImageLoaded = true;
            _this.calculateOffsets();
            _this.setImageZoomContainer();
            _this.setImageZoomLens();
            _this.setImageZoomLensPosition();
            _this.setImageZoomLensSize();
            if (_this._autoCalculateZoom) {
                if (_this._zoomedImageWidth > _this._zoomedImageHeight) {
                    _this._maxZoomLevel = _this._zoomedImageHeight / _this.lensHeight;
                }
                else {
                    _this._maxZoomLevel = _this._zoomedImageWidth / _this.lensWidth;
                }
            }
            _this.zoomLevel = (_this._maxZoomLevel / 1.5);
            _this.changeZoomLevel();
        };
        this._zoomedImage.src = this.imageZoom ? this.imageZoom : this.img.src;
    };
    ImageZoom.prototype.setImageZoomContainer = function () {
        this.imageZoomContainer.setOptions(this.lensWidth, this.lensHeight, this.lensBorder, this._zoomedImage.src);
    };
    ImageZoom.prototype.setImageZoomContainerVisiblity = function (visible) {
        this.imageZoomContainer.setVisibility(visible);
    };
    ImageZoom.prototype.setImageZoomLens = function () {
        this.imageZoomLens.setOptions(this.lensBorder);
    };
    ImageZoom.prototype.setImageZoomLensVisibility = function (visible) {
        if (!visible || this.lensStyle.toUpperCase() === 'WINDOW') {
            this.imageZoomLens.setVisibility(visible);
        }
    };
    ImageZoom.prototype.setImageZoomLensPosition = function () {
        this.imageZoomLens.setWindowPosition(this._currentX - (this.lensWidth / this._widthRatio / 2) - this._containerOffsetX, this._currentY - (this.lensHeight / this._heightRatio / 2) - this._containerOffsetY);
    };
    ImageZoom.prototype.setImageZoomLensSize = function () {
        this.imageZoomLens.setLensSize(this.lensWidth / this._widthRatio, this.lensHeight / this._heightRatio);
    };
    ImageZoom.prototype.setImageBackgroundPosition = function () {
        var x = (((this._currentX - this._containerOffsetX) - this._elementOffsetX) * this._widthRatio - this.lensWidth / 2) * -1;
        var y = (((this._currentY - this._containerOffsetY) - this._elementOffsetY) * this._heightRatio - this.lensHeight / 2) * -1;
        this.imageZoomContainer.setBackgroundPostion(x, y);
    };
    ImageZoom.prototype.setWindowPosition = function () {
        if (this.lensStyle.toUpperCase() === 'LENS') {
            this.imageZoomContainer.setWindowPosition(this._currentX - (this.lensWidth / 2) - this.lensBorder - this._containerOffsetX, this._currentY - (this.lensHeight / 2) - this.lensBorder - this._containerOffsetY); // Account for lens border shifting image down and to the right
        }
        else if (this.lensStyle.toUpperCase() === 'WINDOW') {
            var windowX = this._elementPosX + this.img.width;
            var windowY = this._elementPosY;
            switch (this.windowPosition) {
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
            switch (this.windowPosition) {
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
    };
    ImageZoom.prototype.changeZoomLevel = function () {
        this._widthRatio = (this._zoomedImageWidth / this.zoomLevel) / this.img.width;
        this._heightRatio = (this._zoomedImageHeight / this.zoomLevel) / this.img.height;
        this.imageZoomContainer.setZoomSize(this._zoomedImageWidth / this.zoomLevel, this._zoomedImageHeight / this.zoomLevel);
        this.setImageBackgroundPosition();
    };
    ImageZoom.prototype.calculateOffsets = function () {
        this._elementPosX = this.img.getBoundingClientRect().left;
        this._elementPosY = this.img.getBoundingClientRect().top;
        if (this.lensHeight > this.img.height) {
            this.lensHeight = this.img.height;
        }
        var parent = this.img.offsetParent;
        var offsetX = 0;
        var offsetY = 0;
        while (parent !== undefined && parent !== null && parent.offsetParent !== undefined && parent.offsetParent !== null) {
            offsetX += parent.offsetLeft;
            offsetY += parent.offsetTop;
            parent = parent.offsetParent;
        }
        this._containerOffsetX = offsetX;
        this._containerOffsetY = offsetY;
        this._elementOffsetX = this.img.offsetLeft;
        this._elementOffsetY = this.img.offsetTop;
        this.setImageZoomContainer();
    };
    ImageZoom.prototype.calculateBoundaries = function (clientX, clientY) {
        var xPos = clientX - this._elementOffsetX;
        var rightBoundary = (this.img.width - ((this.lensWidth / 2) / this._widthRatio)) + this._containerOffsetX;
        var leftBoundary = ((this.lensWidth / 2) / this._widthRatio) + this._containerOffsetX;
        if (xPos >= rightBoundary) {
            this._currentX = rightBoundary + this._elementOffsetX;
        }
        else if (xPos <= leftBoundary) {
            this._currentX = leftBoundary + this._elementOffsetX;
        }
        else {
            this._currentX = clientX;
        }
        var yPos = clientY - this._elementOffsetY;
        var topBoundary = ((this.lensHeight / 2) / this._heightRatio) + this._containerOffsetY;
        var bottomBoundary = (this.img.height - ((this.lensHeight / 2) / this._heightRatio)) + this._containerOffsetY;
        if (yPos >= bottomBoundary) {
            this._currentY = bottomBoundary + this._elementOffsetY;
        }
        else if (yPos <= topBoundary) {
            this._currentY = topBoundary + this._elementOffsetY;
        }
        else {
            this._currentY = clientY;
        }
    };
    ImageZoom.prototype.allowZooming = function () {
        return this.allowZoom && this._imageLoaded && this._zoomedImageLoaded;
    };
    ImageZoom.prototype.onMousemove = function (event) {
        var _this = this;
        if (this.allowZooming()) {
            this._lastEvent = event; // Make sure we end up at the right place, without calling too frequently
            if (this._mouseMoveDebounce !== 0) {
                return;
            }
            this._mouseMoveDebounce = window.setTimeout(function () {
                if (!_this.isZooming && _this._mouseEnterDebounce === 0) {
                    _this.onMouseenter(event);
                }
                _this.calculateBoundaries(_this._lastEvent.clientX, _this._lastEvent.clientY);
                _this.setImageBackgroundPosition();
                _this.setImageZoomLensPosition();
                _this.setWindowPosition();
                _this._mouseMoveDebounce = 0;
            }, 10); // Wait 10ms to be more performant
        }
    };
    ImageZoom.prototype.onMouseenter = function (event) {
        var _this = this;
        if (!this.isZooming) {
            if (this.allowZooming()) {
                this.calculateOffsets();
                if (this._mouseEnterDebounce !== 0) {
                    clearTimeout(this._mouseEnterDebounce);
                }
                this._mouseEnterDebounce = window.setTimeout(function () {
                    _this.isZooming = true;
                    clearTimeout(_this._mouseEnterDebounce);
                    _this._previousCursor = _this.img.style.cursor;
                    _this.img.style.cursor = 'pointer';
                    _this.setImageZoomContainerVisiblity(true);
                    _this.setImageZoomLensVisibility(true);
                }, this.delay);
            }
        }
    };
    ImageZoom.prototype.onMouseleave = function (event) {
        var x = event.clientX;
        var y = event.clientY;
        if (y <= this.img.getBoundingClientRect().top || y >= (this.img.getBoundingClientRect().top + this.img.height) || x <= this.img.getBoundingClientRect().left || x >= (this.img.getBoundingClientRect().left + this.img.width)) {
            if (this._mouseEnterDebounce !== 0) {
                clearTimeout(this._mouseEnterDebounce);
            }
            if (this.isZooming) {
                this.img.style.cursor = this._previousCursor;
                this.setImageZoomContainerVisiblity(false);
                this.setImageZoomLensVisibility(false);
                this.isZooming = false;
            }
        }
        else {
            this.onMousemove(event); // "mouseleave" event was just the mouse focus going to the lens
        }
    };
    ImageZoom.prototype.onMouseScroll = function (event) {
        if (this.scrollZoom && this.allowZooming()) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
            var pos = event.wheelDeltaY | event.wheelDelta | event.deltaY | event.detail * -1;
            if (pos > 0) {
                if (this.zoomLevel > (this.minZoomLevel + this.zoomLevelIncrement)) {
                    this.zoomLevel -= this.zoomLevelIncrement;
                    this.changeZoomLevel();
                }
            }
            else {
                if (this.zoomLevel < (this._maxZoomLevel - this.zoomLevelIncrement)) {
                    this.zoomLevel += this.zoomLevelIncrement;
                    this.changeZoomLevel();
                }
            }
            this.calculateBoundaries(this._lastEvent.clientX, this._lastEvent.clientY);
            this.setWindowPosition();
            this.setImageZoomLensSize();
            this.setImageZoomLensPosition();
            return false;
        }
        else {
            return true;
        }
    };
    ImageZoom.prototype.onClick = function (event) {
        if (this.clickToZoom) {
            this.allowZoom = !this.allowZoom;
            if (this.allowZooming()) {
                this.onMousemove(event);
            }
            else {
                this.onMouseleave(event);
            }
        }
    };
    ImageZoom.prototype.ngOnChanges = function (changeRecord) {
        for (var prop in changeRecord) {
            if (!changeRecord[prop].isFirstChange()) {
                if (prop === 'imageZoom') {
                    this.imageChanged();
                }
                else if (prop === 'lensWidth' || prop === 'lensHeight') {
                    if (this.lensHeight > this.img.height) {
                        this.lensHeight = this.img.height;
                    }
                    this.setImageZoomContainer();
                    this.setImageBackgroundPosition();
                }
                else if (prop === 'zoomLevel') {
                    this.changeZoomLevel();
                }
            }
        }
    };
    ImageZoom.prototype.ngOnInit = function () {
        if (this.clickToZoom) {
            this.allowZoom = false;
        }
    };
    ImageZoom.prototype.ngOnDestroy = function () {
        this._imageZoomContainerRef.destroy();
        this._imageZoomLensRef.destroy();
    };
    return ImageZoom;
}());
ImageZoom.decorators = [
    { type: core_1.Directive, args: [{
                selector: '[imageZoom]'
            },] },
];
/** @nocollapse */
ImageZoom.ctorParameters = function () { return [
    { type: core_1.ElementRef, },
    { type: core_1.ComponentFactoryResolver, },
    { type: core_1.ViewContainerRef, },
]; };
ImageZoom.propDecorators = {
    'imageZoom': [{ type: core_1.Input },],
    'allowZoom': [{ type: core_1.Input },],
    'clickToZoom': [{ type: core_1.Input },],
    'scrollZoom': [{ type: core_1.Input },],
    'windowPosition': [{ type: core_1.Input },],
    'lensStyle': [{ type: core_1.Input },],
    'lensWidth': [{ type: core_1.Input },],
    'lensHeight': [{ type: core_1.Input },],
    'lensBorder': [{ type: core_1.Input },],
    'delay': [{ type: core_1.Input },],
    'minZoomLevel': [{ type: core_1.Input },],
    'zoomLevel': [{ type: core_1.Input },],
    'maxZoomLevel': [{ type: core_1.Input },],
    'zoomLevelIncrement': [{ type: core_1.Input },],
    'onMousemove': [{ type: core_1.HostListener, args: ['mousemove', ['$event'],] },],
    'onMouseenter': [{ type: core_1.HostListener, args: ['mouseenter', ['$event'],] },],
    'onMouseleave': [{ type: core_1.HostListener, args: ['mouseleave', ['$event'],] },],
    'onMouseScroll': [{ type: core_1.HostListener, args: ['MozMousePixelScroll', ['$event'],] }, { type: core_1.HostListener, args: ['DOMMouseScroll', ['$event'],] }, { type: core_1.HostListener, args: ['mousewheel', ['$event'],] }, { type: core_1.HostListener, args: ['window:scroll', ['$event'],] },],
    'onClick': [{ type: core_1.HostListener, args: ['click', ['$event'],] },],
};
exports.ImageZoom = ImageZoom;
//# sourceMappingURL=image-zoom.directive.js.map