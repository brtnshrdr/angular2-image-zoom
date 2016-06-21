# angular2-image-zoom

## Installation

To install this library, run:

```bash
$ npm install angular2-image-zoom --save
```

## Examples
First, import the ImageZoom directive

```typescript
import {ImageZoom} from 'angular2-image-zoom';
```

Then, add ImageZoom to your components directives array

```typescript
@Component({
    selector : 'example',
    directives : [ImageZoom],
})
```
Then just add the [imageZoom] tag to your img element

```html
<img [imageZoom]="zoomedImageSrc" [src]="smallImageSrc" [style.width.px]="width" [style.height.px]="height">
```

# Options
Name | Type | Default | Description |
---|---|---|--- |
imageZoom | string | null | Link to larger [src] image
allowZoom | boolean | true | Whether or not zooming is enabled
scrollZoom | boolean | true | Allow mousewheel to change zoom level
lensStyle | string | 'WINDOW' | Type of zoom ('LENS', 'WINDOW')
lensWidth | number | 300 | Width of zoom lens
lensHeight | number | 300 | Height of zoom lens
lensBorder | number | 2 | Size of lens border (in pixels)
delay | number | 100 | Delay before zoom lens appears (in milliseconds)
minZoomLevel | number | .2 | TODO
maxZoomLevel | number | auto-calculated | TODO
zoomLevelIncrement | number | .1 | Size of each change in zoom level while scrolling






This library is a work in progress and any issues/pull-requests are welcomed!

## TODO
1. Create unit and E2E tests
2. Allow window to be placed anywhere
3. Show viewing lens over image to show zoom area
4. ~~Allow mouse scrolling to change zoom level~~
5. ~~Allow inner zoom lens~~
6. Lots more....

## Development

To generate all `*
}.js`, `*.js.map` and `*.d.ts` files:

```bash
$ npm run tsc
```

## License

MIT © [Nick Richardson](nick.richardson@mediapixeldesign.com)
