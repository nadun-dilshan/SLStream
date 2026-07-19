# 📺 SLStream

**Live at [slstream.nadun.me](https://slstream.nadun.me)**

A modern IPTV / Live TV streaming web application built with **React.js** and **Tailwind CSS**.

Designed for:
- 📱 Mobile
- 📲 Tablet
- 💻 Desktop
- 📺 Smart TV / Android TV

with a premium OTT-style interface.

---

## ✨ Features

### 🎬 Live TV Streaming
- HLS (.m3u8) stream support
- Fast live playback
- Custom video player
- Fullscreen support
- Volume controls
- Play / Pause controls

### 📡 Adaptive Quality Streaming

Supports automatic quality switching using **HLS.js**.

Features:
- Auto quality mode (adaptive bitrate)
- Manual quality selection

Available qualities:
```
Auto
240p
360p
480p
720p
1080p
```

The player automatically adjusts quality based on:
- Network speed
- Buffer health
- Stream bandwidth

---

## 📱 Multi Device Support

Optimized for:

### Desktop
- Mouse navigation
- Large layouts
- Keyboard shortcuts

### Mobile
- Touch friendly UI
- Responsive cards
- Bottom navigation

### Smart TV
- Large buttons
- Remote friendly navigation
- Focus states
- 10-foot UI design

---

## 🚀 Tech Stack

- React.js
- Tailwind CSS
- React Router DOM
- HLS.js
- Zustand
- Framer Motion
- Lucide React

---

## 📂 Project Structure

```
src/
│
├── app/
│   └── routes.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Player.jsx
│   ├── Favorites.jsx
│   ├── Category.jsx
│   └── Search.jsx
│
├── components/
│   ├── VideoPlayer.jsx
│   ├── ChannelCard.jsx
│   ├── ChannelGrid.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
│
├── store/
│   └── tvStore.js
│
├── lib/
│   └── channelData.js
│
└── hooks/
    └── useKeyboardNavigation.js
```

---

## 📺 Channel Data

All channels are loaded from:

```
src/lib/channelData.js
```

Example:

```js
{
 id: "12393",
 url: "https://example.com/master.m3u8",
 name: "9X Jalwa",
 category: "Music",
 logo: "logo-url",
 number: "48"
}
```

---

## 🔥 Core Features

### ⭐ Favorites
- Add/remove channels
- Persistent storage (localStorage)

### 🕒 Recently Watched
- Auto track last watched channels
- Quick resume support

### 🔎 Search
- Search by channel name
- Search by category

### 📂 Categories
- Sports
- Music
- News
- Entertainment
- Others

---

## ⌨️ Keyboard Controls

```
Space → Play / Pause
F → Fullscreen
Arrow Up → Previous Channel
Arrow Down → Next Channel
```

---

## ⚙️ Installation

```bash
git clone your-repo-url
cd kufa-tv
npm install
npm run dev
```

---

## 🏗️ Build

```bash
npm run build
npm run preview
```

---

## 🎨 UI Design

SLStream features a modern OTT-style UI inspired by:
- Netflix
- YouTube TV
- Modern IPTV apps

Includes:
- Dark theme
- Glassmorphism UI
- Smooth animations
- Gradient accents

---

## ⚡ Performance

- Lazy loading
- Optimized rendering
- Memoized components
- Fast channel switching

---

## 📌 Future Improvements

- EPG (TV Guide)
- User login system
- Cloud sync
- Chromecast support
- Multi-audio support

---

## 📄 License

This project is for personal and educational use only.

Make sure you have rights to stream any content used in **SLStream**.