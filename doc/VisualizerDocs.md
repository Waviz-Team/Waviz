# 📊 Waviz Visualizer Documentation

## 🧱 Getting Started

### Creating a New Visualization

To implement the Waviz visualizer, create a new instance of `Waviz` by passing in an HTML `<canvas>` element and an audio source element:

```ts
import Waviz from '../core/waviz';

// Document Elements
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const audio = document.getElementById('audio') as HTMLAudioElement;

// Waviz Instance
const viz = new Waviz(canvas, audio);
```

---

## ▶️ Starting the Visualizer

Once the instance is initialized, call the `.render()` method on the visualizer to begin rendering:

```ts
viz.visualizer.render();
```

> ⚠️ It's recommended to call `.render()` inside a user gesture like an event listener for playback:

```ts
audio.addEventListener('play', () => {
  viz.visualizer.render();
});
```

---

## ⏹️ Stopping the Visualizer

If you are playing from a finite source (e.g., audio or video file), stop the visualizer when playback stops to conserve resources:

```ts
audio.addEventListener('pause', () => {
  viz.stop();
});
```

---

## ⚙️ Options Overview

The `Waviz` visualizer can be customized using a configuration object or an array of configuration objects. Each object supports five fields:

```ts
{
  domain: [],
  coord: [],
  viz: [],
  color: [],
  style: [],
}
```

You can mix and match these fields to customize your visualization layer(s).

---

## 🎚️ Domain

Controls the **type and shape of audio data** input.

```ts
domain: [<domainType>, <amplitude>, <range>]
```

- `<domainType>`: `'time'` *(default)* or `'freq'`
  - `'time'` → Original waveform (TimeDomain).
  - `'freq'` → Frequency data via FFT.

- `<amplitude>`: *(default `100`)*
  - Controls the height or intensity of the waveform.

- `<range>`: *(default `1024`)*
  - Controls how much of the audio data is used, useful to trim high-end frequencies.

---

## 🧭 Coordinates

Controls the **coordinate system** for rendering.

```ts
coord: [<coordinateSystem>, <radius?>]
```

- `<coordinateSystem>`: `'rect'` *(default)* or `'polar'`
  - `'rect'` → Cartesian XY space.
  - `'polar'` → Circular coordinate system.

- `<radius>` *(only for polar)*: *(default `100`)*
  - Sets the radius of the circular drawing area.

---

## 🖍️ Visualizer

Controls **what type of visual representation** to draw.

```ts
viz: [<visualizationType>, <...params>]
```

### Available Visualizations:

#### `'line'` *(default)*
Draws a waveform line.

```ts
viz: ['line', <sampling?>]
```

- `<sampling>`: Number of points to sample. *(default `1024`)*

#### `'bars'`
Draws vertical bars based on amplitude.

```ts
viz: ['bars', <numBars?>]
```

- `<numBars>`: Number of bars. *(default `8`)*  
  > ⚠️ Not compatible with `'polar'` coordinates.

#### `'polarBars'` *(beta)*
Draws bars around a circle in polar mode.

```ts
viz: ['polarBars']
```

> 🚧 This mode is experimental and may produce unpredictable results.

#### `'dots'`
Draws a series of animated dots.

```ts
viz: ['dots', <numDots?>]
```

- `<numDots>`: Number of dots. *(default `100`)*

#### `'particles'`
Spawns reactive particles from waveform data.

```ts
viz: ['particles', <initialVelocity>, <gravity>, <lifespan>, <birthrate>, <sampling>]
```

- `<initialVelocity>`: `[x, y]` pair *(default `[1, 1]`)*
- `<gravity>`: Force applied on Y-axis *(default `1`)*
- `<lifespan>`: Frames particles remain alive *(default `Infinity`)*
- `<birthrate>`: How often particles spawn *(default `1`)*
- `<sampling>`: Number of particle spawn points *(default `100`)*

> ⚠️ Large particle counts can degrade performance. Adjust `lifespan` and `birthrate` to optimize.

---

## 🎨 Color

Defines the **color mode** for the visualizer.

```ts
color: [<colorMode>, <...args>]
```

### Available Modes:

#### Solid Color
Use any CSS color or HEX code:

```ts
color: ['red']
color: ['#23AB87']
```

#### Linear Gradient

```ts
color: ['linearGradient', 'red', 'blue']
```

- Creates a vertical color blend from `color1` to `color2`.

#### Radial Gradient

```ts
color: ['radialGradient', 'red', 'blue']
```

- Creates a center-out radial gradient.

#### Random Color (Per Frame)

```ts
color: ['randomColor']
```

- Assigns a new random color every frame.

#### Random Palette (Per Frame)

```ts
color: ['randomPalette', ['red', 'green', 'blue']]
```

- Chooses a new color from a custom palette each frame.

---

## 🖌️ Style

**[🚧 TODO]**  
The `style` array will control stroke width, fill styles, and dash patterns.

---

## 🧅 Layering Multiple Visualizations

Waviz supports rendering **multiple visualizations simultaneously** on the same canvas using a layer system. This is useful for combining different visual effects (e.g., polar + rectangular, particles + bars).

To use layering, pass an **array of options objects** to the `.render()` method:

```ts
viz.visualizer.render([
  {
    domain: ['time'],
    coord: ['rect'],
    viz: ['particles', [2, 2], 3],
    color: ['linearGradient'],
    style: [2],
  },
  {
    domain: ['time'],
    coord: ['polar'],
    viz: ['particles', [3, 3], 1, 20],
    color: ['linearGradient'],
    style: [2],
  },
]);
```

Each object in the array defines one **layer**, and Waviz will render them in order from bottom to top.

> ✅ Tip: You can mix coordinate systems, visualizer types, and color schemes across layers for dynamic, complex effects.


---

## 🛠️ Convenience Methods

Waviz also includes a few built-in shorthand methods for common visualizations. These methods can quickly generate preset visualizations and allow for color customization.

#### .simpleLine(\<color>)

Renders a basic line visualization in rectangular coordinates with a single color.

```ts
viz.visualizer.simpleLine('#E34AB0');
```

---

#### .simpleBars(\<color>)

Renders vertical bars using TimeDomain data with increased amplitude and thick strokes.

```ts
viz.visualizer.simpleBars('#E34AB0');
```

---

#### .simplePolarLine(\<color>)

Renders a circular line visualization using polar coordinates.

```ts
viz.visualizer.simplePolarLine('#E34AB0');
```

---

#### .simplePolarBars(\<color>)

Renders radial bars in a circular layout.

```ts
viz.visualizer.simplePolarBars('#E34AB0');
```
