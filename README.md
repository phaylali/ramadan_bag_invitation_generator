# 🌙 Ramadan Bag Invitation Generator (مولد دعوات قفة رمضان)

[English](./README.md) | [العربية](./README_AR.md) | [ⵣⴰⵡⴰⵔⵉⵢⵏ](./README_ZGH.md)

A simple application for generating Ramadan food basket distribution invitations from Excel files with full Arabic support and print-ready PDF formatting.

## 📋 Excel Preparation Requirements

Before uploading your Excel file, please ensure the following to ensure the application works correctly:

1.  **File Format**: The file must be in **.xlsx** format. If you have an old `.xls` file, please open it in Excel and save it as `Excel Workbook (.xlsx)`.
2.  **Row Formatting**:
    - Make sure the **first row** contains column headers.
    - If there's an empty first row, please delete it completely.
3.  **Date Data**: It is recommended that the "Birth Date" column be formatted as `Date` in Excel, and the application will automatically convert it to `YYYY-MM-DD` format.

## 🚀 How to Use

1. Run the application via `bun run dev`.
2. Open `http://localhost:3000` in your browser.
3. Select your prepared Excel file.
4. Map the required fields (Name, National ID, etc.) to the corresponding columns in your file.
5. Click "توليد المعاينة" (Generate Preview).
6. Click "طباعة" (Print) to use direct browser printing.

## 🛠️ Technologies Used

- **Bun & Hono**: For the backend server.
- **Puppeteer**: For PDF generation (Server-side PDF).
- **XLSX (SheetJS)**: For Excel file processing.
- **Tajawal & Samir.Khouaja.Maghribi**: Premium Arabic fonts.
