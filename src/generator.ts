import puppeteer from 'puppeteer';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export interface InvitationData {
    name: string;
    cin: string;
    idcs: string;
    birth: string;
    adress: string;
    order_no: number;
}

export class PDFGenerator {
    async generate(data: InvitationData[]): Promise<Uint8Array> {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        const html = this.createMultiPageHtml(data);
        
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        await browser.close();
        
        return new Uint8Array(pdfBuffer);
    }

    private createInvitationCard(item: InvitationData): string {
        return `
        <div class="card">
            <div class="header">
                <div class="header-right">
                    المملكة المغربية<br>
                    وزارة الداخلية<br>
                    إقليم تطوان<br>
                    باشوية واد لو
                </div>
                <div class="header-center">
                    <div class="title">دعوة استلام قفة رمضان</div>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="info">
                <div class="info-row name-row">
                    <span class="label">إلى السيد(ة):</span>
                    <span class="value name-value">${this.escapeHtml(item.name)}</span>
                    <span class="order-no">${item.order_no}</span>
                </div>
                <div class="info-row">
                    <span class="label">رقم البطاقة الوطنية:</span>
                    <span class="value">${this.escapeHtml(item.cin)}</span>
                </div>
                <div class="info-row">
                    <span class="label">المعرف الرقمي المدني و الاجتماعي:</span>
                    <span class="value">${this.escapeHtml(item.idcs)}</span>
                </div>
                <div class="info-row">
                    <span class="label">تاريخ الازدياد:</span>
                    <span class="value">${this.escapeHtml(item.birth)}</span>
                </div>
                <div class="info-row">
                    <span class="label">العنوان:</span>
                    <span class="value">${this.escapeHtml(item.adress)}</span>
                </div>
                <div class="signature-line"></div>
                <div class="info-row" style="margin-top: 2mm;">
                    <span class="label">عليكم الحضور لدار الطالبة واد لو، يوم الإثنين 23 فبراير 2026 على الساعة الحادية عشرة صباحا، لاستلام قفة رمضان الخاصة بكم</span>
                </div>
            </div>

            <div class="signature-box">
                <p>التوقيع أوالختم</p>
            </div>
            
            <div class="footer">
                <p>شكرا لتعاونكم</p>
            </div>
        </div>`;
    }

    private createMultiPageHtml(data: InvitationData[]): string {
        let cardsHtml = '';
        
        for (const item of data) {
            cardsHtml += this.createInvitationCard(item);
        }

        return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body {
            width: 210mm;
            min-height: 297mm;
            font-family: 'Tajawal', sans-serif;
            font-weight: 400;
        }
        .card {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            page-break-after: always;
            display: flex;
            flex-direction: column;
        }
        .card:last-child {
            page-break-after: auto;
        }
        .header {
            display: flex;
            border-bottom: 1px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
        }
        .header-right {
            width: 35mm;
            text-align: right;
            font-size: 10pt;
            line-height: 1.3;
        }
        .header-center {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .title {
            text-align: center;
            font-size: 20pt;
            font-weight: 700;
            margin: 15px 0;
            padding-bottom: 10px;
            border-bottom: 1px dashed #ccc;
        }
        .divider {
            border-bottom: 1px solid #333;
            margin-bottom: 15px;
        }
        .info {
            text-align: right;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .info-row {
            display: flex;
            font-size: 11pt;
            margin: 4px 0;
        }
        .label {
            font-weight: 500;
            color: #444;
        }
        .value {
            font-weight: normal;
            color: #000;
        }
        .name-row {
            justify-content: space-between;
            align-items: baseline;
        }
        .name-value {
            flex-grow: 1;
            font-weight: bold;
            font-size: 13pt;
        }
        .order-no {
            font-weight: bold;
            font-size: 13pt;
        }
        .signature-line {
            margin-top: 5mm;
            border-bottom: 1px solid #000;
            width: 80%;
        }
        .signature-box {
            width: 30%;
            border: 1px solid #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding-top: 1mm;
        }
        .signature-box p {
            font-weight: bold;
        }
        .footer {
            margin-top: auto;
            padding-top: 10px;
            border-top: 1px solid #ccc;
            text-align: center;
            font-size: 12px;
        }
    </style>
</head>
<body>
    ${cardsHtml}
</body>
</html>`;
    }

    private escapeHtml(text: string): string {
        const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}
