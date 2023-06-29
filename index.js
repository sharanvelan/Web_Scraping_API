const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({headless: false, defaultViewport: null, args: ["--disable-popup-blocking"],});

  const page = await browser.newPage();


  page.on("console", (msg) => console.log("Page Log:", msg.text()));

  await page.goto("https://www.plasticstoday.com/search/node/epr");

  const articles = await page.evaluate(() => {
    const articleElements = document.querySelectorAll(
      ".article-teaser__search.article-teaser.article-teaser__icon__article"
    );

    const articlesArray = [];

    articleElements.forEach((article) => {
      console.log(article.innerHTML);
      const titleElement = article.querySelector(".title");
      const summaryElement = article.querySelector(".summary-wrapper");
      const imageElement = article.querySelector(".img-container img");
      const anchorElement = article.querySelector(".img-container a");
      const dateElement = article.querySelector(".date");

      const title = titleElement ? titleElement.innerText : null;
      const summary = summaryElement ? summaryElement.innerText : null;
      const imageUrl = imageElement
        ? imageElement.getAttribute("data-src")
        : null;
      const link = anchorElement
        ? "https://www.plasticstoday.com" + anchorElement.getAttribute("href")
        : null;
      const date = dateElement ? dateElement.innerText : null;

      articlesArray.push({ title, summary, imageUrl, link, date });
    });

    return articlesArray;
  });

  console.log(articles.length);

  const data = JSON.stringify(articles, null, 2);
  fs.writeFileSync("output.json", data);
  await browser.close();

})();


