# KITCHENcraft – Interactive Modular Kitchen Designer

**KITCHENcraft** is a premium, full-stack architectural modular kitchen planning platform with real-time 3D visualization, AI-powered kitchen transformation, and automated itemized Indian cost estimation.

---

## 🎨 1. Design Language & Palette

- **Primary Background:** Warm Cream (`#F8F5EF`)
- **Secondary Background:** Pure White (`#FFFFFF`)
- **Primary Accent:** Dark Olive Green (`#52634A`)
- **Secondary Accent:** Warm Beige (`#D9C8AE`)
- **Text:** Charcoal Black (`#292929`)
- **Highlight:** Muted Gold (`#B69A65`)
- **Typography:** Cormorant Garamond (Serif Headings) + Plus Jakarta Sans (Clean Body)

---

## 🚀 2. Key Modules & Features

### A. Advanced 3D Kitchen Visualization (Three.js & WebGL)
- **360° Real-time Orbit & Zoom:** Inspect your kitchen from any angle with smooth camera controls.
- **Multiple Camera Presets:** Instant perspective, Top View / Architectural floor plan, Front elevation, Island focus, and Isometric modes.
- **Cinematic 3D Walkthrough:** Smooth automated tour that guides the homeowner through the hob, sink, island, and overhead storage zones.
- **Lighting Controls:** Warm Daylight and Cozy Evening lighting modes with realistic shadows and under-cabinet LED profile glow.
- **Live Texture & Color Swapping:** Change cabinet shutters (Matte acrylic, High gloss, Walnut wood veneer, Lacquered glass), countertop slabs (Calacatta Gold quartz, Absolute Black granite, Sintered stone), and handles in real time.
- **High-Res Screenshot Export:** Download PNG snapshots of your 3D design.

### B. AI-Powered Kitchen Transformation
- **Existing Kitchen Upload:** Drag and drop smartphone photos with rotation and brightness adjustment.
- **Structural Preservation Intelligence:** Analyzes room perspective, natural window light, ceiling height, and locked plumbing drainage points.
- **Interactive Before-and-After Comparison Slider:** Smooth draggable split-screen slider comparing existing photos with modular concepts.
- **8 Curated Styles:** Modern Minimalist, Contemporary, Luxury European, Scandinavian, Traditional Indian, Industrial, Rustic, and Modern Luxury.

### C. 6 Modular Kitchen Layouts
- **Architectural Layout Explorer:** Detailed analysis for Straight, L-Shaped, U-Shaped, Parallel, Island, and G-Shaped kitchens.
- **Space Planning:** Minimum recommended dimensions, golden work triangle optimization, and traffic clearance metrics.

### D. Comprehensive Material Catalogue (10 Categories)
- **80+ Realistic Products:** Real Indian market prices in INR (`₹`), quality grades (Standard, Premium, Luxury), durability specifications, care instructions, and warranties.
- **Top Indian & Global Brands:** Hettich, Häfele, Blum, Bosch, Faber, Elica, Siemens, Franke, Jaquar, Kajaria, Asian Paints, CenturyPly, and Merino.
- **Side-by-Side Product Comparison:** Compare up to 3 products across pricing, thickness, and grade.

### E. Automatic Kitchen Cost Estimator
- **12 Itemized Breakdown Categories:** Carcass, Shutters, Countertop, Backsplash, Hardware, Storage, Appliances, Sinks, Lighting, Flooring, Labour, and 18% GST.
- **3 Budget Tiers:** Budget Kitchen (`₹2.5L–₹3.5L`), Premium Kitchen (`₹4.5L–₹6.5L`), and Luxury Kitchen (`₹7.5L–₹14L+`).
- **Visual SVG Donut Chart:** Dynamic visual breakdown updating instantly as dimensions or materials change.
- **Formal PDF Quotation:** Official letterhead format with itemized bill and print/PDF download.

### F. Consultation Booking System
- Preferred date picker, time slot selection, project attachment, and live booking status tracking (`Pending`, `Confirmed`, `Completed`).

### G. Admin Control Center
- Role-based administration view with platform analytics, live material price manager, consultation approval workflow, and user directory.

---

## 🔑 3. Default Demo Accounts

- **Admin Account:** `admin@kitchencraft.com` / `admin123`
- **Homeowner Account:** `sarah@example.com` / `user123`

---

## 🛠️ 4. Quick Start & Execution

Double-click `start_kitchencraft.bat` or run:

```bash
# Start unified full-stack server
node server/src/server.js
```

Open your browser at: **`http://localhost:5000`**
