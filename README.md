[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://typewriter-bay.vercel.app/)
# 🖊️ Remington — Living Typewriter

A vintage typewriter experience built with vanilla HTML, CSS, and JavaScript. Type on real round keys, hear mechanical clicks, watch the carriage move, and feel the bell ding at the end of every line.

![Typewriter Preview](assets/preview.png)

---

## ✨ Features

- 🎹 **Clickable round keys** — on-screen + full physical keyboard support
- 🔊 **Procedural audio** — mechanical clicks, heavy space bar thud, and a bell ding on return (Web Audio API, no files needed)
- 📜 **Living paper** — lined paper with red margin rule, auto-scrolls as you type
- ⚙️ **Animated ribbon spools** — spin on every keypress
- 🎯 **Carriage handle** — slides in real-time based on cursor column position
- 📱 **Touch support** — works on mobile too
- 🗒️ **Status bar** — live line, column, and word count

---

## 📁 Project Structure

```
typewriter/
├── index.html   # Markup & layout
├── style.css    # All visual styling
├── script.js    # Audio engine, typing logic, keyboard bindings
├── assets/
│   └── preview.png   # Screenshot for README
└── README.md
```

---

## 🛠️ Local Development

No build tools needed. Just open `index.html` in any browser:

```bash
# With Python
python3 -m http.server 3000

# With Node
npx serve .

# Or just double-click index.html
```

---

## License

MIT — use it, remix it, make it yours.
