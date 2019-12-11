const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    executablePath: '/usr/bin/google-chrome'
  })
  const page = await browser.newPage()

  try {
    await page.goto('https://nginx/')
    await page.waitForSelector('p')
    const text = await page.evaluate(() => {
      return document.querySelector('p').textContent
    })
    await browser.close()
  
    if (text == "Hello, World!") {
      process.exit(0)
    } else {
      process.exit(1)
    }
  } catch (e) {
    console.log(e)
    process.exit(1)
  }
})()
