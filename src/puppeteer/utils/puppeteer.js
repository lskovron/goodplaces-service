import puppeteer from "puppeteer";


export const scrapeDate = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.$$eval(".livewire-listing .panel-default", (elements) => {
    let venues = [], events = [];
    elements.map((item) => {
      // add venue data to 'venues' array
      const venueHtml = item.querySelector(".panel-title a");
      const venueSlug = venueHtml.getAttribute("href").replace("/organizations/", "");
      const venue = {
        name: venueHtml.textContent.trim(),
        slug: venueSlug
      }
      venues.push(venue);

      // loop events and add to 'events' array
      const eventList = [...item.querySelectorAll('.calendar-info')];
      eventList.map(ev => {
        events.push({
          venueSlug,
          title: ev.querySelector(".truncate a").textContent.trim(),
          timeString: ev.querySelector("p:not(.truncate)").textContent.trim(),
          slug: ev
            .querySelector(".truncate a")
            .getAttribute("href")
            .replace("/events/", ""),
        })
      })
    })
    return {
      venues,
      events
    }
  });

  const missingVenues = data.venues.length === 0;
  const missingEvents = data.events.length === 0;
  const missingData = [
    ...(missingVenues ? ['venues'] : []),
    ...(missingEvents ? ['events'] : []),
  ];
  const error = missingData.length > 0 ? { msg: `No ${missingData.join(', ')} found at URL ${url}` } : 'no error!';

  browser.close();
  return [data, error];
};


// const [{ venues, events },error] = await scrapeDate("https://www.wwoz.org/calendar/livewire-music?date=2023-02-10");
// console.log(JSON.stringify(venues), JSON.stringify(events), error)
