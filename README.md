# CodeAlpha_Calculator

A clean, iOS-inspired calculator built with vanilla HTML, CSS, and JavaScript — no dependencies.

## Features

- Basic arithmetic: addition, subtraction, multiplication, division
- Percentage (`%`) and sign toggle (`+/-`)
- Live expression display showing the full operation as you type
- Division-by-zero error handling with auto-clear
- Up to 12-digit input with dynamic font scaling
- Full keyboard support
- Accessible markup with ARIA roles and live regions
- Responsive layout down to 320px screens
- Respects `prefers-reduced-motion`

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `0–9` | Input digit |
| `.` or `,` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last digit |
| `Escape` | Clear (AC) |
| `%` | Percent |

## Project Structure

```
CodeAlpha_Calculator/
├── index.html   # Markup and layout
├── styles.css   # Styling and animations
└── script.js    # Calculator logic
```

## Getting Started

No build step required. Open `index.html` directly in a browser:

```bash
# Option 1 — just open the file
start index.html

# Option 2 — Just click the weblink below
https://ios-calculator-codealpha.netlify.app
```

## License

This project was built as part of the [CodeAlpha](https://www.codealpha.tech) internship program made by Malik AbdulMoiz Awan.
