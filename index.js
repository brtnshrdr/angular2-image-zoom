"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var image_zoom_directive_1 = require("./src/image-zoom.directive");
var image_zoom_lens_component_1 = require("./src/image-zoom-lens.component");
var image_zoom_container_component_1 = require("./src/image-zoom-container.component");
__export(require("./src/image-zoom.directive"));
__export(require("./src/image-zoom-lens.component"));
__export(require("./src/image-zoom-container.component"));
var ImageZoomModule = (function () {
    function ImageZoomModule() {
    }
    return ImageZoomModule;
}());
ImageZoomModule.decorators = [
    { type: core_1.NgModule, args: [{
                imports: [common_1.CommonModule],
                exports: [image_zoom_directive_1.ImageZoom],
                declarations: [image_zoom_directive_1.ImageZoom, image_zoom_container_component_1.ImageZoomContainer, image_zoom_lens_component_1.ImageZoomLens],
                entryComponents: [image_zoom_container_component_1.ImageZoomContainer, image_zoom_lens_component_1.ImageZoomLens]
            },] },
];
/** @nocollapse */
ImageZoomModule.ctorParameters = function () { return []; };
exports.ImageZoomModule = ImageZoomModule;
//# sourceMappingURL=index.js.map