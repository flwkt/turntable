# Turntable

Create a turntable view from your GLB/GLTF model.

<p align="center">
  <img src="files/turntable.gif" alt="Turntable">
</p>

 powered by [Flowkit's GLB 2 PNG](https://www.flowkit.app/glb2png)

## Demo

[Demo on CodeSandbox](https://codesandbox.io/p/sandbox/turntable-demo-vlwftg)

## Usage

### Vanilla
```html
<div
  style="max-width: 256px; margin: 0 auto"
  data-turntable-file="https://github.com/KhronosGroup/glTF-Sample-Models/raw/refs/heads/main/2.0/Avocado/glTF-Binary/Avocado.glb"
></div>

<script src="https://unpkg.com/@flwkt/turntable@0.3.0/npm/autoinit.js" />
```

### Module

1. Install from [NPM](https://www.npmjs.com/package/@flwkt/turntable) 

```bash
npm install @flwkt/turntable
```

2. Use it in your project

```html
<div
  id="your-div"
  style="max-width: 256px; margin: 0 auto"
  data-turntable-file="https://github.com/KhronosGroup/glTF-Sample-Models/raw/refs/heads/main/2.0/Avocado/glTF-Binary/Avocado.glb"
></div>
```

```js
import Turntable from '@flwkt/turntable'

const turntable = new Turntable();
turntable.init(document.querySelector('#your-div'));
```

## Settings

### `data-turntable-file`

The URL of the GLB/GLTF file to load.

### `data-turntable-count`

The number of images to generate from the GLB/GLTF file.

For example, if you set `data-turntable-count="14"` then the 360° view will be split into 14 images.

It's recommended to set `data-turntable-count` as small as posiible because all images need to be loaded on your users device.

Currently the maximum is 20 images.

### `data-turntable-scroll`

if `true` the turntable will rotate automatically when the user scrolls and the image is in the viewport.

### `data-turntable-lazy`

if `true` the images will be loaded lazily.

This is a beta feature right now and leads to flickering.

