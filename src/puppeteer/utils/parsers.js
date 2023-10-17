export const getTime = (dateString) => dateString.split(" ").slice(-1)[0];
// @TODO validate time

export const timeTo24 = (timeString) => {
    let timeFormatted, hours, minutes;
    if(timeString.indexOf('pm') > 0){
        timeFormatted = timeString.replace('pm','').split(":");
        hours = parseInt(timeFormatted[0])
        minutes = timeFormatted[1];
        return `${hours + 12}:${minutes}`;
    } else if (timeString.indexOf('am') > 0) {
        timeFormatted = timeString.replace('am','').split(":");
        hours = parseInt(timeFormatted[0])
        minutes = timeFormatted[1];
        return `${hours}:${minutes}`;
    } else {
        console.error(`Cannot parse time ${timeString}`);
        new Error(`Cannot parse time ${timeString}`);
    }
}

export const parseEvent = async ({timeString, slug, title: rawTitle, venueSlug}, dateString) => {
    let time = getTime(timeString);
    time = timeTo24(time);
    console.log(`${dateString} ${time} GMT-0600`); // @TODO: consider daylight savings?
    const date = await new Date(`${dateString} ${time} GMT-0600`);
    let title = sanitizeString(rawTitle)

    return {
      slug, 
      title, 
      dateString,
      venueSlug,
      time,
      date
    }
}

export const parseVenue = ({ slug, name }) => ({
    slug: sanitizeString(slug),
    name: sanitizeString(name)
})

export const sanitizeString = (string) => string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const diffInDays = (date1, date2) => {
    // https://www.grepper.com/answers/300372/
    const diffInMs   = new Date(date1) - new Date(date2)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    if(diffInDays !== 'NaN') {
        throw new Error(`Cannot calculate difference between dates ${date1} and ${date2}`)
    }
    console.log(Math.abs(diffInDays))
    return Math.abs(diffInDays);
}

export const validateDateRange = (date1, date2) => {
    if ( diffInDays(date1, date2) > 30 ){
        throw new Error(`Date range ${date1} to ${date2} exceeds maximum range of 30 days`);
    }
}

export const validateDateString = (date) => {
    const dateObj = new Date(date);
    if( dateObj.toString() === "Invalid Date" ) {
        throw new Error(`Invalid date string ${date}`);
    }
}


// console.log(getTime("Friday,  February 10\n      at\n\n      6:00pm"));
// console.log(timeTo24("6:00m"));
// console.log(await parseEvent({
//     "venueSlug": "zony-mash-beer-project",
//     "title": "The Rumble: Tribute to The Wild Magnolias",
//     "timeString": "Friday,  February 10\n      at\n\n      9:00pm",
//     "slug": "864111"
//   }, "2022-2-13"))