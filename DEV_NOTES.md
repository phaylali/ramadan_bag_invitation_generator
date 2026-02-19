# 🛠️ Developer Notes & Project History

This file documents the technical decisions, challenges, and solutions implemented during the development of the Ramadan Bag Invitation Generator.

### High-Quality PDF Generation (Puppeteer Migration)
- **Challenge**: `html2canvas` + `jspdf` produced blurry text, memory issues with large files, and inconsistent scaling.
- **Solution**: Migrated to server-side PDF generation using **Puppeteer**. This uses an actual Chrome engine to "Print to PDF," guaranteeing professional quality.
- **Precision Alignment**:
    - Reduced card width to **208mm** (from 210mm) to provide a 1mm safety margin, preventing "right-side clipping" on physical printers.
    - Enabled `preferCSSPageSize: true` in Puppeteer to respect the `@page` CSS rules.
    - Removed `margin: 0 auto` centering to prevent sub-pixel offsets in RTL layouts.

## 🕒 Session History

### 1. Project Initialization & Arabic Support
- **Goal**: Create a tool for generating Arabic invitations.
- **Tech**: Hono + Bun.
- **Challenge**: RTL support and Arabic fonts.
- **Solution**: Integrated 'Cairo' and 'Arabswell' fonts. Applied `direction: rtl` globally.

### 2. Excel Parsing & Encoding Issues
- **Problem**: Arabic headers were appearing as "gibberish" when reading Excel files.
- **Solution**: Switched from `readAsBinaryString` to `readAsArrayBuffer` and used `XLSX.read(data, { type: 'array' })`.

### 3. Date Parsing (The 1947 vs 2047 Bug)
- **Problem**: Dates like `01/01/1947` were being parsed as `1/1/47` and then misinterpreted by `new Date()` as `2047`.
- **Solution**: 
  - Configured `XLSX.read` with `cellDates: true`.
  - Used `XLSX.SSF.parse_date_code()` for raw numbers.
  - Implemented a custom `formatValue` helper with a safeguard for 2-digit years (`y < 100`).
  - Final fix: Ensure `YYYY-MM-DD` strict formatting.

### 4. Layout Optimization (A4 Printing)
- **Requirement**: 3 invitations per A4 page, stacked vertically.
- **Issue**: Content felt cramped with golden frames, and there was extra space at the bottom of the A4.
- **Solutions**:
  - Reduced page margins and internal card padding.
  - Moved "Intro Text" to be side-by-side with the "Recipient Line" using Flexbox.
  - Increased card height from 85mm to 94mm to fill the A4 page (3 * 94mm = 282mm, close to A4's 297mm).

### 5. Custom Typography
- **Requirement**: Use a specific premium font (`arabswell_1.ttf`) for titles.
- **Implementation**:
  - Configured Hono to serve `.ttf` files with `font/ttf` mime type.
  - Added `@font-face` in CSS.
  - Applied the font specifically to the website header and invitation `<h1>`.

### 6. High-Quality PDF Generation (Puppeteer Migration)
- **Challenge**: `html2canvas` + `jspdf` produced blurry text, memory issues with large files, and inconsistent scaling.
- **Solution**: Migrated to server-side PDF generation using **Puppeteer**. This uses an actual Chrome engine to "Print to PDF," guaranteeing professional quality.
- **Precision Alignment**:
    - Reduced card width to **208mm** (from 210mm) to provide a 1mm safety margin, preventing "right-side clipping" on physical printers.
    - Enabled `preferCSSPageSize: true` in Puppeteer to respect the `@page` CSS rules.
    - Removed `margin: 0 auto` centering to prevent sub-pixel offsets in RTL layouts.

## 📦 Asset Management
- `template.html`: Structured layout replacing the original Markdown for better control over official headers and signature boxes.
- `src/client.js`: Contains all the logic for XLSX parsing, JS-Date formatting, and the new Puppeteer fetch request.
- `fonts/arabswell_1.ttf`: Custom font served by the backend for a premium aesthetic.

## 📌 Future Reminders
- If adding new fields, update the `columnMapping` object in `client.js` and the `template.html` placeholders.
- The `formatValue` function in `client.js` is the gatekeeper for all data rendering.
- Always check the `Puppeteer` arguments in `index.ts` if running in constrained environments (e.g., Docker).
