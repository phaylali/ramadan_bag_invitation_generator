let excelData = [];
let headers = [];
let columnMapping = {
    name: '',
    cin: '',
    idcs: '',
    birth: '',
    adress: ''
};

const fileInput = document.getElementById('excel-file');
const mappingSection = document.getElementById('mapping-section');
const previewSection = document.getElementById('preview-section');
const previewContainer = document.getElementById('preview-container');
const templateSource = document.getElementById('template-source');

// Handle File Upload
fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const wb = XLSX.read(data, { type: 'array', cellDates: true });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        excelData = XLSX.utils.sheet_to_json(ws, { raw: true, cellDates: true });

        if (excelData.length > 0) {
            headers = Object.keys(excelData[0]);
            showMappingUI();
        }
    };
    reader.readAsArrayBuffer(file);
});

function showMappingUI() {
    mappingSection.classList.remove('hidden');
    const selectors = ['name', 'cin', 'idcs', 'birth', 'adress'];
    selectors.forEach(key => {
        const select = document.getElementById(`select-${key}`);
        select.innerHTML = '<option value="">اختر العمود...</option>';
        headers.forEach(h => {
            const opt = document.createElement('option');
            opt.value = h;
            opt.textContent = h;
            select.appendChild(opt);
        });

        // Auto-match if possible (simple heuristic)
        const match = headers.find(h => h.includes(key === 'name' ? 'الاسم' : key === 'cin' ? 'البطاقة' : key === 'idcs' ? 'معرف' : key === 'birth' ? 'ازدياد' : 'عنوان'));
        if (match) select.value = match;

        columnMapping[key] = select.value;
        select.onchange = (e) => columnMapping[key] = e.target.value;
    });
}

async function generatePreview() {
    const template = await fetchTemplate();
    previewContainer.innerHTML = '';

    // Group into pages of 3
    for (let i = 0; i < excelData.length; i += 3) {
        const page = document.createElement('div');
        page.className = 'invitation-page';

        for (let j = 0; j < 3 && (i + j) < excelData.length; j++) {
            const row = excelData[i + j];
            const card = document.createElement('div');
            card.className = 'invitation-card';

            const formatValue = (val, isBirth = false) => {
                if (val === null || val === undefined) return '';

                // If it's already a Date object (expected from cellDates: true)
                if (val instanceof Date) {
                    const y = val.getFullYear();
                    const m = String(val.getMonth() + 1).padStart(2, '0');
                    const d = String(val.getDate()).padStart(2, '0');
                    const res = `${y}-${m}-${d}`;
                    if (isBirth) console.log('Birth Date Obj:', val, '->', res);
                    return res;
                }

                // If it's a number and we expect a birth date (raw Excel serial date)
                if (isBirth && typeof val === 'number') {
                    const date = XLSX.SSF.parse_date_code(val);
                    const y = date.y;
                    const m = String(date.m).padStart(2, '0');
                    const d = String(date.d).padStart(2, '0');
                    const res = `${y}-${m}-${d}`;
                    console.log('Birth Number:', val, '->', res);
                    return res;
                }

                // If it's a string, try to parse it but be careful with 2-digit years
                if (isBirth && typeof val === 'string' && val.trim() !== '') {
                    const parsed = Date.parse(val);
                    if (!isNaN(parsed)) {
                        const date = new Date(parsed);
                        let y = date.getFullYear();
                        // Fix for 2-digit years if they appear
                        if (y < 100) y += (y < 50 ? 2000 : 1900);
                        const m = String(date.getMonth() + 1).padStart(2, '0');
                        const d = String(date.getDate()).padStart(2, '0');
                        const res = `${y}-${m}-${d}`;
                        console.log('Birth String:', val, '->', res);
                        return res;
                    }
                }

                return String(val);
            };

            let htmlContent = template;
            htmlContent = htmlContent.replace('{{name}}', formatValue(row[columnMapping.name]));
            htmlContent = htmlContent.replace('{{cin}}', formatValue(row[columnMapping.cin]));
            htmlContent = htmlContent.replace('{{idcs}}', formatValue(row[columnMapping.idcs]));
            htmlContent = htmlContent.replace('{{birth}}', formatValue(row[columnMapping.birth], true));
            htmlContent = htmlContent.replace('{{adress}}', formatValue(row[columnMapping.adress]));
            htmlContent = htmlContent.replace('{{order_no}}', (i + j + 1));

            card.innerHTML = htmlContent;
            page.appendChild(card);
        }
        previewContainer.appendChild(page);
    }

    previewSection.style.display = 'block';
    previewSection.scrollIntoView({ behavior: 'smooth' });
}

async function fetchTemplate() {
    const res = await fetch('/template.html');
    return await res.text();
}

async function downloadPDF() {
    const btn = document.querySelector('.btn-download');
    const originalText = btn.textContent;
    btn.textContent = '...جاري التحميل';
    btn.disabled = true;

    try {
        const formatValue = (val, isBirth = false) => {
            if (val === null || val === undefined) return '';
            if (val instanceof Date) {
                const y = val.getFullYear();
                const m = String(val.getMonth() + 1).padStart(2, '0');
                const d = String(val.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }
            if (isBirth && typeof val === 'number') {
                const date = XLSX.SSF.parse_date_code(val);
                return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
            }
            return String(val);
        };

        const dataRows = excelData.map((row, index) => ({
            name: formatValue(row[columnMapping.name]),
            cin: formatValue(row[columnMapping.cin]),
            idcs: formatValue(row[columnMapping.idcs]),
            birth: formatValue(row[columnMapping.birth], true),
            adress: formatValue(row[columnMapping.adress]),
            order_no: index + 1
        }));

        const response = await fetch('/generate-pdf-v2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataRows })
        });

        if (!response.ok) throw new Error('فشل توليد ملف PDF');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'دعوات_القفة.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

    } catch (err) {
        console.error('PDF Error:', err);
        alert('حدث خطأ أثناء تحميل الملف.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}
function printPDF() {
    window.print();
}

window.generatePreview = generatePreview;
window.downloadPDF = downloadPDF;
window.printPDF = printPDF;
