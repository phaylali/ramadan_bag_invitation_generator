/**
 * Excel Compare UI Library
 * Customized Omniversify design system
 */

export const Theme = {
    colors: {
        primary: '#D4AF37', // Metallic Gold
        secondary: '#006400', // Deep Dark Green
        primaryPurple: '#a855f7',
        secondaryGreen: '#22c55e',
        black: '#0a0a0a',
        white: '#ffffff',
        surface: '#121212',
        muted: 'rgba(255, 255, 255, 0.6)',
        border: 'rgba(212, 175, 55, 0.3)',
    },
    fonts: {
        heading: "'Maghribi', serif",
        body: "'Tajawal', sans-serif",
        arabic: "'Tajawal', sans-serif"
    }
};

export function generateStyles(): string {
    return `
        @font-face {
            font-family: 'Maghribi';
            src: url('/fonts/Samir.Khouaja.Maghribi.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }

        :root {
            --primary: ${Theme.colors.primary};
            --secondary: ${Theme.colors.secondary};
            --purple: ${Theme.colors.primaryPurple};
            --green: ${Theme.colors.secondaryGreen};
            --black: ${Theme.colors.black};
            --white: ${Theme.colors.white};
            --surface: ${Theme.colors.surface};
            --muted: ${Theme.colors.muted};
            --border: ${Theme.colors.border};
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: ${Theme.fonts.body};
            background-color: var(--black);
            color: var(--white);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            line-height: 1.6;
            direction: rtl;
            text-align: right;
        }
        h1, h2, h3 {
            font-family: ${Theme.fonts.heading};
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 1.2px;
        }
        header {
            padding: 3rem 1rem;
            text-align: center;
            border-bottom: 2px solid var(--border);
            margin-bottom: 2rem;
            background: linear-gradient(to bottom, #111, var(--black));
        }
        header h1 {
            font-size: 2.5rem;
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 1rem;
            width: 100%;
        }
        .card {
            background: var(--surface);
            border: 1px solid var(--border);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            margin-bottom: 2rem;
        }
        
        .file-input-wrapper {
            position: relative;
            margin-top: 1.5rem;
            border: 2px dashed var(--border);
            padding: 2rem;
            text-align: center;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .file-input-wrapper:hover {
            border-color: var(--primary);
            background: rgba(212, 175, 55, 0.05);
        }
        .file-input-wrapper input[type="file"] {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            opacity: 0;
            cursor: pointer;
        }
        .file-btn {
            display: inline-block;
            padding: 1rem 2rem;
            background: var(--primary);
            color: var(--black);
            font-weight: bold;
            border-radius: 4px;
            text-transform: uppercase;
            cursor: pointer;
        }

        .mapping-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }
        .select-group {
            margin-bottom: 1.5rem;
        }
        .select-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--primary);
            font-weight: bold;
        }
        .select-group select {
            width: 100%;
            padding: 0.8rem;
            background: #1a1a1a;
            border: 1px solid var(--border);
            color: white;
            border-radius: 4px;
            font-family: inherit;
        }
        
        #preview-section {
            margin-top: 3rem;
            display: none;
        }

        #preview-container {
            padding: 2rem;
            background: #f0f0f0;
            color: black;
            min-height: 500px;
            border-radius: 8px;
            overflow-y: auto;
            overflow-x: hidden;
            direction: ltr; /* PDF layout usually ltr container for RTL content */
        }

        .invitation-page {
            width: 210mm;
            min-height: 297mm;
            padding: 10mm;
            margin: 0 auto 10mm auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            gap: 8mm;
            box-sizing: border-box;
        }

        .invitation-card {
            width: 100%;
            min-height: 90mm;
            border: 2px solid #D4AF37;
            padding: 3mm; 
            box-sizing: border-box;
            background-color: white;
            color: black;
            position: relative;
            direction: rtl;
            text-align: right;
            overflow: hidden;
            page-break-inside: avoid;
            margin-bottom: 0;
        }

        /* Print Styles */
        @media print {
            @page {
                size: A4;
                margin: 0;
            }
            html {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
            }
            body {
                width: 210mm;
                height: 297mm;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                overflow: visible !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            header, footer, .card, #mapping-section, .action-btns, .instructions {
                display: none !important;
            }
            main.container {
                width: 210mm !important;
                margin: 0 !important;
                padding: 0 !important;
                max-width: none !important;
            }
            #preview-section {
                display: block !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                width: 210mm !important;
            }
            #preview-section .card {
                display: block !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
            }
            #preview-section h2 {
                display: none !important;
            }
            #preview-container {
                padding: 0 !important;
                background: white !important;
                overflow: visible !important;
            }
            .invitation-page {
                width: 210mm !important;
                height: 297mm !important;
                min-height: 297mm !important;
                margin: 0 !important;
                padding: 8mm !important;
                box-shadow: none !important;
                border: none !important;
                page-break-after: always;
                page-break-inside: avoid;
                page-break-before: always;
                position: relative;
                box-sizing: border-box;
                overflow: hidden;
                gap: 5mm !important;
            }
            .invitation-page:first-child {
                page-break-before: auto;
            }
            .invitation-card {
                width: 100% !important;
                height: auto !important;
                min-height: 90mm;
                box-shadow: none !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                border: 2px solid #D4AF37 !important;
                page-break-inside: avoid;
                margin-bottom: 0 !important;
                padding: 2mm !important;
            }
        }
        
        .action-btns {
            display: flex;
            gap: 1rem;
            justify-content: center;
            margin-top: 2rem;
            margin-bottom: 3rem;
        }
        .btn {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            font-family: inherit;
            transition: opacity 0.2s;
        }
        .btn:hover { opacity: 0.8; }
        .btn-primary { background: var(--primary); color: var(--black); }
        .btn-secondary { background: #333; color: white; }

        .hidden { display: none !important; }
    `;
}

export function createLayout(title: string, content: string): string {
    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
    <style>${generateStyles()}</style>
</head>
<body>
    <header><h1>🌙 مولد دعوات قفة رمضان</h1></header>
    <main class="container">${content}</main>
    <footer style="padding: 2rem; text-align: center; font-size: 0.8rem; color: var(--muted); opacity: 0.5;">
        ✨ تم التطوير بواسطة OMNIVERSIFY & Bun ⚡
    </footer>
    <script src="/client.js"></script>
</body>
</html>`;
}
