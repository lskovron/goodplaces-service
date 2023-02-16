import puppeteer from "puppeteer";

export const scrapeForVenues = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const linkTexts = await page.$$eval("h3.panel-title a", (elements) =>
    elements.map((item) => ({
      name: item.textContent.trim(),
      path: item.getAttribute("href").replace('/organizations/',''),
    }))
  );

  browser.close();
  return linkTexts;
};

export const scrapeForEvents = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const linkTexts = await page.$$eval(".calendar-info", (elements) =>
    elements.map((item) => ({
      name: item.querySelector('.truncate a').textContent.trim(),
      date: item.querySelector('p:not(.truncate)').textContent.trim(),
    }))
  );

  browser.close();
  return linkTexts;
};

// scrapeForEvents("https://www.wwoz.org/organizations/21st-amendment");
// scrapeForVenues("https://www.wwoz.org/calendar/livewire-music?date=2023-02-10");
