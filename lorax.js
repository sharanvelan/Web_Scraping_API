const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless:false});
  const page = await browser.newPage();
  await page.goto("https://loraxcompliance.com/blog/epr.html");

  // Handle popups
  page.on('dialog', async (dialog) => {
    console.log(dialog.message);
    await dialog.dismiss();
  });

  // Get the HTML file from the class="cell colspan2"
  const htmlFile = await page.evaluate(() => {
    const htmlFile = document.querySelector('.cell colspan2').innerHTML;
    return htmlFile;
  });

  // Print the HTML file
  console.log(htmlFile);

  await browser.close();
})();
