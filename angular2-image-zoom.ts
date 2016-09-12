import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageZoom} from './src/directives/image-zoom.directive';
import {ImageZoomLens} from './src/directives/image-zoom-lens.component';
import {ImageZoomContainer} from './src/directives/image-zoom-container.component';

export {ImageZoom, ImageZoomContainer, ImageZoomLens};

@NgModule({
    imports : [CommonModule],
    exports : [ImageZoom],
    declarations : [ImageZoom, ImageZoomContainer, ImageZoomLens],
    entryComponents: [ImageZoomContainer, ImageZoomLens]
})
export class ImageZoomModule {
}
