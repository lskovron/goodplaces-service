import puppeteer from "puppeteer";

export const scrapeForVenues = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const linkTexts = await page.$$eval("h3.panel-title a", (elements) =>
    elements.map((item) => ({
      name: item.textContent.trim(),
      slug: item.getAttribute("href").replace("/organizations/", ""),
    }))
  );

  const error = linkTexts.length === 0 ? { msg: `No venues found at URL ${url}` } : null;

  browser.close();
  return [linkTexts, error];
};

export const scrapeForEvents = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const linkTexts = await page.$$eval(".calendar-info", (elements) =>
    elements.map((item) => ({
      name: item.querySelector(".truncate a").textContent.trim(),
      date: item.querySelector("p:not(.truncate)").textContent.trim(),
      id: item
        .querySelector(".truncate a")
        .getAttribute("href")
        .replace("/events/", ""),
    }))
  );

  const error = linkTexts.length === 0 ? { msg: `No events found at URL ${url}` } : null;

  browser.close();
  return [linkTexts, error];
  // @TODO: get venue data with events
};

// scrapeForVenues("https://www.wwoz.org/calendar/livewire-music?date=2023-02-10");
// scrapeForEvents("https://www.wwoz.org/organizations/21st-amendment");
// const events = await scrapeForEvents("https://www.wwoz.org/calendar/livewire-music?date=2023-02-10");
// console.log(events);
