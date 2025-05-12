# 🎬 Vue Video Gallery Slider

Video gallery built with Vue 3, using **Swiper Element** for the slider and custom `VideoPlayer.vue` component for playback.

## 📦 Features

✅ Video slider with [Swiper Web Components](https://swiperjs.com/element)  

✅ Dynamic video loading from external JSON files  

✅ Responsive aspect ratios (supports):
- 16x9 (default)
- 4x3
- 1x1
- 9x16  

✅ Custom `VideoPlayer` component with:
- Poster image
- Poster alt text
- Aspect ratio support
- Subtitles
- Video options:
  - Controls
  - Autoplay
  - Loop
  - Muted
  - Allow fullscreen
  - Enable/disable Picture-in-Picture
  - Preview on hover

✅ Smart behavior:
- Autoplay preview on hover (muted, looped)
- Auto-pause other videos when one is played
- Global audio setting stored via `localStorage` (remembers last preference)

✅ Customized slider styles using `injectStyles` and Shadow DOM


## 🧱 Technologies Used

- Node.js 14 or higher
- [Vue 3](https://vuejs.org/) (with `<script setup>`)
- [Swiper Element](https://swiperjs.com/element)
- Custom `video-player` component
- Shadow DOM, scoped styles, and injected styles
- JSON-based configuration system

## 🗂 Project Structure
```
├── public/
│ ├── video-data.json
│ └── video-global-options.json
├── src/
│ ├── components/
│ │ └── VideoPlayer.vue
│ ├── composables/
│ │ ├── useAspectRatio.js
│ │ ├── useAudioSettings.js
│ │ ├── useButtonHandler.js
│ │ ├── useFetchData.js
│ │ ├── useMimeTyps.js
│ │ ├── useOptions.js
│ │ ├── useVideoController.js
│ │ ├── useVideoEvenrts.js
│ │ ├── useVideoMap.js
│ │ └── useVideoPlayer.js
│ └── App.vue
```


## 🚀 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-folder>
```
2. Install dependencies:
```bash
pnpm install
```
3. Start the development server:
```bash
pnpm dev
```


4. Open browser at http://localhost:5173

## 🧠 Technical Details

### 📄HTML Configuration
In HTML file, define where to load JSON data:

```html
<div id="videoApp" json-path="/data/" json-files='["video-data.json", "video-global-options.json"]'></div>
```

- Videos are loaded from `video-data.json`

- Global options from `video-global-options.json`


### 📹 `VideoPlayer.vue` Props

```json
props: {
  sources: Array,         // array of { src, type }
  poster: String,         // poster image
  description: String,    // alt text or description
  aspectRatio: String,    // e.g. "16:9"
  subtitles: Array,       // optional subtitles
  options: Object,        // individual video options
  globalOptions: Object   // shared/global options
}

```
### 📁 Example JSON Files

`video-data.json`
```json
{
  "videos": [
    {
      "sources": [
        "https://files.vidstack.io/agent-327/720p.mp4", 
        "https://files.vidstack.io/agent-327/720p.ogg"
      ],
      "poster": "/videos/agent-327-poster.png",
      "posterAlt": "Preview image for demo clip",
      "aspectRatio": "9/16",
      "options": {
        "controls": true,
        "autoplay": false,
        "loop": false,
        "muted": true,
        "allowFullscreen": false,
        "disablePictureInPicture": true,
        "allowPreview": true
      },
      "subtitles": [
        {
          "src": "/sintel-en.vtt",
          "lang": "en",
          "label": "English",
          "default": true
        },
        {
          "src": "/sintel-es.vtt",
          "lang": "es",
          "label": "Spanish"
        }
      ]
    }
  ]
}
```
\
`video-global-options.json`
```json
{
  "controls": true,
  "autoplay": false,
  "loop": false,
  "muted": false,
  "allowFullscreen": true,
  "disablePictureInPicture": false,
  "allowPreview": true,
  "overlay": true
}
```

## 💡 ToDo
- Add video title
- YouTube, Vimeo support
- Custom controller bar
- Options:
  - Add allowFullScreen (via Javascript)
  - Add show center play/pause buttons

---