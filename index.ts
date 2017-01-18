import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageZoom} from './src/image-zoom.directive';
import {ImageZoomLens} from './src/image-zoom-lens.component';
import {ImageZoomContainer} from './src/image-zoom-container.component';

export * from './src/image-zoom.directive';
export * from './src/image-zoom-lens.component';
export * from './src/image-zoom-container.component';

@NgModule({
    imports : [CommonModule],
    exports : [ImageZoom],
    declarations : [ImageZoom, ImageZoomContainer, ImageZoomLens],
    entryComponents: [ImageZoomContainer, ImageZoomLens]
})
export class ImageZoomModule {
}
