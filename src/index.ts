import { Hono } from 'hono'
import { createLayout } from '../ui/omniversify'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import puppeteer from 'puppeteer'

const app = new Hono()

app.post('/generate-pdf', async (c) => {
  const { html } = await c.req.json();

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set the content and wait for network to be idle to ensure fonts/images load
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  await browser.close();

  return c.body(pdfBuffer, 200, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="invitations.pdf"'
  });
});

app.get('/', (c) => {
  const content = `
    <div class="card">
      <h2>1. تحميل ملف إكسيل</h2>
      <div class="file-input-wrapper">
        <div class="file-btn">اختر ملف إكسيل (.xlsx)</div>
        <input type="file" id="excel-file" accept=".xlsx, .xls" />
      </div>
    </div>

    <div id="mapping-section" class="card hidden">
      <h2>2. تحديد الأعمدة</h2>
      <p style="margin-bottom: 1rem; color: var(--muted);">يرجى تحديد العمود المقابل لكل حقل مطلوب:</p>
      <div class="mapping-grid">
        <div class="select-group">
          <label>الاسم الكامل</label>
          <select id="select-name"></select>
        </div>
        <div class="select-group">
          <label>رقم البطاقة الوطنية (CIN)</label>
          <select id="select-cin"></select>
        </div>
        <div class="select-group">
          <label>المعرف الرقمي المدني و الاجتماعي (IDCS)</label>
          <select id="select-idcs"></select>
        </div>
        <div class="select-group">
          <label>تاريخ الازدياد (Birth)</label>
          <select id="select-birth"></select>
        </div>
        <div class="select-group">
          <label>العنوان</label>
          <select id="select-adress"></select>
        </div>
      </div>
      <div style="text-align: center; margin-top: 1rem;">
        <button class="btn btn-primary" onclick="generatePreview()">توليد المعاينة</button>
      </div>
    </div>

    <div id="preview-section">
      <div class="card">
          <div class="action-btns">
            <button class="btn btn-primary btn-download" onclick="downloadPDF()">تحميل PDF</button>
            <button class="btn btn-secondary btn-print" onclick="printPDF()">طباعة</button>
          </div>
          <div id="preview-container"></div>
      </div>
    </div>
  `;
  return c.html(createLayout('مولد دعوات رمضان', content))
})

app.get('/client.js', async (c) => {
  const content = await readFile(join(process.cwd(), 'src/client.js'), 'utf-8');
  return c.text(content, 200, { 'Content-Type': 'application/javascript' });
});

app.get('/fonts/arabswell_1.ttf', async (c) => {
  const content = await readFile(join(process.cwd(), 'fonts/arabswell_1.ttf'));
  return c.body(content, 200, { 'Content-Type': 'font/ttf' });
});

app.get('/template.html', async (c) => {
  const content = await readFile(join(process.cwd(), 'template.html'), 'utf-8');
  return c.text(content);
});

export default app;
