# 🛠️ Developer Notes & Project History

This file documents the technical decisions, challenges, and solutions implemented during the development of the Ramadan Bag Invitation Generator.

## 📌 Project Overview

A web application for generating Ramadan food basket ("قفة رمضان") distribution invitations from Excel files with full Arabic/RTL support.

### Core Features
- Excel file upload and parsing
- Column mapping for flexible data binding
- Live preview of invitations
- Print directly from browser (no PDF download)

## 🕒 Session History

### 1. Project Initialization & Arabic Support

- **Goal**: Create a tool for generating Arabic invitations.
- **Tech**: Hono + Bun.
- **Challenge**: RTL support and Arabic fonts.
- **Solution**: Integrated 'Tajawal' (Google Fonts) and 'Samir.Khouaja.Maghribi' (custom) fonts. Applied `dir="rtl"` globally.

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

- **Requirement**: One invitation per A4 page, properly formatted for printing.
- **Solutions**:
  - Set exact A4 dimensions (210mm x 297mm)
  - Configured @media print styles for clean output
  - Card height: 90mm per page
  - Proper RTL alignment throughout

### 5. Custom Typography

- **Requirement**: Use a premium Arabic font for titles.
- **Implementation**:
  - 'Tajawal' font from Google Fonts for body text
  - 'Samir.Khouaja.Maghribi' font for invitation titles
  - Hono serves the custom .ttf file

### 6. PDF Generation Approach

- **Initial**: Used server-side PDF generation with Puppeteer
- **Current**: Browser-based print using `@media print` - simpler and matches preview exactly
- **Flow**: Preview HTML → Browser Print → PDF/Print

## 📦 Project Structure

```
├── src/
│   ├── index.ts       # Main server (Hono)
│   └── client.js      # Client-side logic
├── ui/
│   └── omniversify.ts # UI layout and styles
├── fonts/
│   └── Samir.Khouaja.Maghribi.ttf
├── template.html      # Invitation template
├── package.json
└── README.md
```

## 📌 Key Technical Details

- **Print**: Uses browser's native `@media print` for exact preview matching
- **Fonts**: Tajawal (body) + Samir.Khouaja.Maghribi (titles)
- **RTL**: Full right-to-left support with `dir="rtl"`
- **Excel**: SheetJS (xlsx) for parsing with proper date handling

## 🔧 Adding New Fields

If adding new fields:
1. Update `columnMapping` object in `client.js`
2. Update `template.html` placeholders
3. Update the mapping section in `index.ts`

## ⚠️ Important Notes

- The `formatValue` function in `client.js` handles all data formatting
- Puppeteer is still available in dependencies but not actively used
- Print directly from browser - no PDF download button
