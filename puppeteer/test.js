const puppeteer = require('puppeteer');

const screenshot =  'page-category.png';

(async () => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.setViewport({ width: 1280, height: 800 })
	await page.goto('https://www.linkedin.com/products/categories/business-management-software', { waitUntil: 'networkidle2' })
	await page.screenshot({ path: screenshot })
	await browser.close()
	console.log('See screen shot: ' + screenshot)
})();