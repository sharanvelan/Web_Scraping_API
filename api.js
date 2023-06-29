const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

const app = express();

app.listen(8090, () => {
  console.log('Server listening on port 8090');
});

app.get('/:id', async (req, res) => {
  const search = req.params.id;

  try {
    const data = await gatherData(search);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while scraping data.' });
  }
});

async function gatherData(search) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.on('console', (msg) => console.log('Page Log:', msg.text()));

  await page.goto(`https://www.plasticstoday.com/search/node/${search}`);

  const articles = await page.evaluate(() => {
    const articleElements = document.querySelectorAll('.article-teaser__search.article-teaser.article-teaser__icon__article');
    const articlesArray = [];

    articleElements.forEach((article) => {
      console.log(article.innerHTML);
      const titleElement = article.querySelector('.title');
      const summaryElement = article.querySelector('.summary-wrapper');
      const imageElement = article.querySelector('.img-container img');
      const anchorElement = article.querySelector('.img-container a');
      const dateElement = article.querySelector('.date');

      const title = titleElement ? titleElement.innerText : null;
      const summary = summaryElement ? summaryElement.innerText : null;
      const imageUrl = imageElement ? imageElement.getAttribute('data-src') : null;
      const link = anchorElement ? 'https://www.plasticstoday.com' + anchorElement.getAttribute('href') : null;
      const date = dateElement ? dateElement.innerText : null;

      articlesArray.push({ title, summary, imageUrl, link, date });
    });

    return articlesArray;
  });

  console.log(articles.length);

  const data = JSON.stringify(articles, null, 2);
  fs.writeFileSync('output.json', data);

  await browser.close();

  return articles;
}
