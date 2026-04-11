const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 800 });

    // Assuming we can inject local storage to bypass login
    await page.goto('http://localhost:5173/login');
    
    // Try to login if we can
    await page.type('input[type="email"]', 'admin@college.edu');
    await page.type('input[type="password"]', 'password123'); // or admin123
    
    // Check if there is a role selector, default might be student. Admin is usually needed.
    // If there is a selector to click:
    const roleSelectors = await page.$$('button');
    for(let btn of roleSelectors) {
        const text = await page.evaluate(el => el.textContent, btn);
        if(text && text.toLowerCase().includes('admin') && !text.toLowerCase().includes('login')) {
            await btn.click();
        }
    }
    
    // click login
    const loginBtns = await page.$$('button');
    for(let btn of loginBtns) {
        const text = await page.evaluate(el => el.textContent, btn);
        if(text && text.toLowerCase() === 'sign in') {
            await btn.click();
        }
    }
    
    // Wait for navigation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.goto('http://localhost:5173/admin/approvals', { waitUntil: 'networkidle0' });
    
    // ensure it's loaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await page.screenshot({ path: 'C:\\Users\\Piyus\\OneDrive\\Desktop\\college\\admin-approval-screenshot.png' });
    
    await browser.close();
})();
