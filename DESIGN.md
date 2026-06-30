---
name: TNDNB Weather System
version: 1.0.0
---

# Design System: TNDNB Weather System

## 1. Visual Theme & Atmosphere
A balanced, clean, and highly readable card interface with a modern glassy/acrylic feel (backdrop-blur). The atmosphere is clinical, minimal, yet inviting. Colors are muted with a single subtle accent, preventing the generic "neon dashboard" look.

## 2. Color Palette & Roles
*   **Off-White Canvas** (`#FAFAFA`) — Primary background surface for light mode
*   **Slate Ink** (`#09090B`) — Primary text for light mode (Zinc-950 depth)
*   **Charcoal Dark** (`#09090B`) — Primary background surface for dark mode
*   **Pure Light Surface** (`#FFFFFF`) — Cards and container fill in light mode
*   **Soft Dark Surface** (`#18181B`) — Cards and container fill in dark mode (Zinc-900)
*   **Muted Steel** (`#71717A`) — Secondary text, descriptions, and timestamps (Zinc-500)
*   **Whisper Border Light** (`rgba(228, 228, 231, 0.6)`) — Card borders in light mode (Zinc-200 / 60%)
*   **Whisper Border Dark** (`rgba(63, 63, 70, 0.4)`) — Card borders in dark mode (Zinc-700 / 40%)
*   **Sky Accent** (`#0284C7`) — Single accent color for rain indicators and active highlights (Sky-600)

## 3. Typography Rules
*   **Display:** Satoshi / Sans-Serif — Tight tracking, bold weights for temperatures, controlled scale hierarchy
*   **Body:** Sans-Serif — Relaxed line height, Slate/Zinc-900 color for readability, max 65 characters per line
*   **Mono:** Geist Mono / JetBrains Mono — Used for exact timestamps (e.g. `08:00`) and numeric percentages

## 4. Component Stylings
*   **Cards (Widget Container):** Generously rounded corners (`1rem`/`16px`), subtle 1px border, light backdrop blur (`backdrop-blur-xl`). No heavy shadows.
*   **Hourly Forecast Items:**
    *   Rounded containers (`1rem`/`16px`) with 1px border.
    *   Subtle spring-physics scale transition (`scale-105`) and background tint highlight on hover.
*   **Advice Alert Box:**
    *   Replaces emojis with clean SVG alerts.
    *   Tinted background matching the weather type (e.g. Sky-500/10 for rain, Amber-500/10 for heat) with a 1px left accent border.
*   **Scroll Indicators:** Clean, transparent overflow containing 8 hourly cards without aggressive scrollbars.

## 5. Layout Principles
*   **Grid First:** Responsive layout. Columns collapse to 1-column on mobile viewports (< 768px).
*   **Containment:** The Weather Widget spans the available dashboard space cleanly.
*   **Spacing:** Balanced gaps (`gap-3` to `gap-4`) between hourly cards, avoiding crowding when displaying 8 milestones.

## 6. Motion & Interaction
*   **Spring Physics:** Use smooth spring motion for expanding/collapsing details and hovering cards.
*   **Waterfall reveals:** Subtle stagger animations for hourly items when the widget expands.

## 7. Anti-Patterns (Banned)
*   No raw emojis in text descriptions.
*   No pure black (`#000000`) for text or backgrounds.
*   No neon outer glowing shadows.
*   No excessive gradient headings.
*   No custom mouse cursors.
*   No hardcoded 3-column equal grids for fluid weather components.
