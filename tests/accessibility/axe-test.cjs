const { chromium } = require('playwright');
const fs = require('fs');
const axePlaywright = require('@axe-core/playwright').default;

const injectAxe = axePlaywright.injectAxe;
const getViolations = axePlaywright.getViolations;

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('🌐 Navigiere zu http://localhost:5000 …');
    await page.goto('http://localhost:5000');

    await injectAxe(page);
    const violations = await getViolations(page);

    console.log(`🚨 ${violations.length} Accessibility-Verletzungen gefunden`);

    const reportPath = './axe-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(violations, null, 2));
    console.log(`📄 Axe-Report gespeichert unter ${reportPath}`);

    await browser.close();

    if (violations.length > 0) {
        console.error('❌ Accessibility-Probleme vorhanden!');
        process.exit(1);
    } else {
        console.log('✅ Keine Accessibility-Probleme gefunden.');
    }
})();
