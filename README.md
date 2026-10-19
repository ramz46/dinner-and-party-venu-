# The Rosewood Glasshouse & Atrium
### Rehearsal Dinner & Engagement Party Celebration Venue

A polished, production-quality multi-page venue website built exclusively with **HTML5, modern CSS, and vanilla JavaScript** (zero frameworks, zero build tools, zero external dependencies).

---

## 🌹 Brand & Visual Identity

- **Brand:** *The Rosewood Glasshouse & Atrium*
- **Aesthetic:** Editorial luxury, warm romantic candlelight, organic botanical glasshouses, and fine dining.
- **Color Palette:**
  - **Warm Ivory:** `#FDFBF7` (background base)
  - **Champagne:** `#F7F1EA` (surface warm)
  - **Muted Rose:** `#BA7384` / `#F7EBEE` (accent highlights & eyebrows)
  - **Deep Plum Ink:** `#3E1E2C` / `#1F181B` (primary headings & buttons)
  - **Refined Champagne Gold:** `#C29B58` (borders, accents, & badges)
- **Typography:**
  - Headlines: *Cormorant Garamond* & *Playfair Display*
  - Body & UI: *Plus Jakarta Sans*
- **Accessibility & Motion:**
  - Full keyboard focus states (`:focus-visible` with gold rings)
  - Semantic HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<aside>`, `<article>`, `<footer>`)
  - Full `prefers-reduced-motion` compliance for animations.

---

## 📁 Project Structure

```
dinner & party venue/
├── index.html                  # Home 1: General Venue Landing
├── home-celebrations.html      # Home 2: Rehearsals & Engagements Landing
├── about.html                  # About Us: Mission, History, Team & Awards
├── services.html               # Curated Services Overview
├── service-details.html        # Private Dining & Chef Tasting Menu Details + FAQ
├── spaces.html                 # Venue Spaces & Capacities Guide + Filter
├── packages.html               # Celebration Packages & Comparison Matrix
├── pricing.html                # Pricing Guide & Interactive Cost Estimator
├── blog.html                   # Celebration Journal & Searchable Article Listing
├── blog-details.html           # Full Article Layout, Pull Quotes & Cocktail Recipe
├── contact.html                # Inquiries, Opening Hours & Stylized Estate Map
├── auth.html                   # Client Login & Register with Demo Prefill
├── dashboard.html              # Client Couple Portal (RSVPs, Countdown, Menu Picker)
├── admin.html                  # Admin Management Portal (KPIs, SVG Charts, Bookings)
├── 404.html                    # Custom 404 Not Found Page
├── coming-soon.html            # Maintenance / 2027 Season Opening Countdown
├── css/
│   ├── main.css                # Design tokens, typography, dark mode, RTL & reset
│   ├── components.css          # Nav, drawer, cards, buttons, modals, toasts, tabs
│   └── pages.css               # Page-specific layouts, calculator, hero splits, admin
├── js/
│   ├── data.js                 # Central mock data store (spaces, packages, RSVPs)
│   ├── main.js                 # Theme toggle, RTL toggle, mobile drawer, toasts, modals
│   ├── calculator.js           # Interactive pricing & guest budget estimator
│   ├── forms.js                # Real-time form validation, accordions, tabs, filters
│   ├── dashboard.js            # Couple dashboard RSVP cycling, guest adding, export
│   └── admin.js                # Admin charts (SVG), bookings filter, approve/decline
└── assets/
    └── images/
        ├── logo-monogram.svg   # Luxury intertwined R & A brand monogram
        ├── favicon.svg         # Crisp SVG browser favicon
        └── floral-divider.svg  # Subtle editorial floral divider motif
```

---

## 🌟 Pages Overview (16 Complete Pages)

1. **`index.html` (Home 1 — Estate Overview):**
   Full-bleed ambient hero with video/photo styling, key statistics, exclusivity philosophy, signature spaces teaser, testimonials, high-resolution photo gallery with modal lightbox, and booking CTAs.

2. **`home-celebrations.html` (Home 2 — Niche Celebrations):**
   Tailored specifically to couples planning rehearsal dinners and engagement parties. Features occasion comparison cards, interactive sample timelines (5:30 PM to 9:30 PM flow), and package highlights.

3. **`about.html` (About Us):**
   The estate’s 1912 botanical origins, restoration timeline, mission, profiles for Executive Chef Julien Beauchamp, Sommelier Antoine Laurent, Event Director Genevieve Moreau, and Floral Artisan Clara Hawthorne, plus industry awards.

4. **`services.html` (Services):**
   Visual cards detailing in-house catering, sommelier pairings, run-of-show coordination, tablescape design, speech acoustics, and private valet concierge.

5. **`service-details.html` (Service Details):**
   Deep-dive into bespoke dining and catering. Includes an Autumn 4-course sample tasting menu with wine pairings, pricing table, and interactive accordion FAQs.

6. **`spaces.html` (Spaces & Capacities):**
   Organized by guest capacity (The Glasshouse Conservatory, Rosewood Cellar Lounge, Veranda Courtyard, Grand Solarium). Features capacity filters (Intimate, Medium, Grand) and detailed amenity breakdowns.

7. **`packages.html` (Celebration Packages):**
   "The Twilight Rehearsal", "The Golden Hour Soirée", and "The Grand Gala". Includes guest minimums, inclusions, dietary accommodations, and a side-by-side comparison matrix.

8. **`pricing.html` (Pricing & Cost Estimator):**
   Interactive financial estimator powered by `js/calculator.js`. Move the guest count slider (20 to 180 guests), toggle seasons, select packages, and check optional luxury enhancements to view real-time calculated subtotals, taxes, and effective per-guest prices.

9. **`blog.html` (The Celebration Journal):**
   Searchable and filterable article directory. Type in keywords or click category chips ("Planning Tips", "Food & Wine", "Design & Spaces") to filter articles live without page reloads.

10. **`blog-details.html` (Journal Article):**
    Editorial layout for *"The Modern Rehearsal Dinner Guide"*, featuring pull quotes, speech order guidelines, a signature cocktail feature box (*The Rosewood Smoked Rosemary Old Fashioned*), and an interactive comment form.

11. **`contact.html` (Contact & Estate Tours):**
    Concierge contact numbers, visiting hours, a custom-designed vector estate map, and a validated multi-field inquiry form with instant error feedback.

12. **`auth.html` (Client Login & Register):**
    Dual-tab authentication interface with client-side validation, password toggles, and one-click demo prefill buttons for both the Couple Portal and the Admin Console.

13. **`dashboard.html` (Client Couple Dashboard):**
    Interactive client portal for Victoria & Liam. Features a live countdown timer to the rehearsal dinner date, interactive RSVP list with cycling status buttons (Attending &rarr; Pending &rarr; Declined), an "Add Guest" modal, catering package switcher, and "Export Summary" text generator.

14. **`admin.html` (Admin Operations Dashboard):**
    KPI metric cards, an interactive responsive SVG revenue trend chart, celebration type breakdown donut chart, live searchable/filterable bookings table with "Approve" and "Decline" actions, booking detail modal, and CSV export.

15. **`404.html` (Custom 404):**
    Editorial "Detour in the Gardens" error page with routes back to the conservatory spaces, packages, and home.

16. **`coming-soon.html` (Maintenance & Expansion):**
    Announcement of the 1914 Orangery expansion with a live countdown timer to the 2027 season opening and a priority update signup form.

---

## ⚡ Interactive Features & Demo Guide

| Feature | Where to Test | How It Works |
|---|---|---|
| **Light / Dark Mode** | Header moon/sun icon on any page | Toggles `[data-theme="dark"]`, instantly shifts palettes to deep midnight plum and glowing champagne gold, and saves to `localStorage`. |
| **RTL Layout Toggle** | Header `RTL` button on any page | Switches `dir="rtl"` and `lang="ar"`, mirrors directional elements, margins, padding, and carousels, and saves to `localStorage`. |
| **Quick Tour Booking Modal** | "Book a Tour" buttons on all pages | Accessible modal with date/time pickers, guest select, and real-time form validation. |
| **Interactive Cost Estimator** | `pricing.html` | Drag guest slider (20–180), select packages and season to watch total investment update live. |
| **Client RSVP Cycling** | `dashboard.html` | Click any guest's status badge to toggle between `Attending`, `Pending`, and `Declined`. Counters and statistics update dynamically. |
| **Add Guest to RSVP** | `dashboard.html` (`+ Add Guest` button) | Opens modal, adds guest to local state, updates table and counters, and displays toast feedback. |
| **Export Event Summary** | `dashboard.html` (`Export Summary` button) | Generates and downloads a clean `.txt` document summarizing event details, headcount, and menu. |
| **Admin Booking Approvals** | `admin.html` | Search bookings, filter by status, and click "Approve" or "Decline" to update status in real-time. |
| **Export Bookings CSV** | `admin.html` (`Export Bookings CSV` button) | Generates and downloads a formatted `.csv` file with all current bookings. |
| **Blog Live Search & Filter** | `blog.html` | Type keywords or click category chips to filter articles instantly. |
| **Demo Login Prefill** | `auth.html` | Click "Couple: Victoria & Liam" or "Venue Director (Admin)" to autofill credentials and test one-click login. |

---

## 🚀 How to Open and Run

Because this project is built entirely with standard HTML5, CSS3, and vanilla JavaScript without external build tools or server backends, you can run it immediately:

### Option 1: Direct File Opening
Double-click `index.html` in your file manager (Finder on macOS) to open it in Google Chrome, Safari, Firefox, or Edge.

### Option 2: Local Static Server (Recommended)
From your terminal in the project directory, run:
```bash
# Using Python 3:
python3 -m http.server 8000

# Open in browser:
http://localhost:8000
```
