export const getTime = (dateString) => dateString.split(" ").slice(-1)[0];
// @TODO validate time

export const timeTo24 = (timeString) => {
    // To make 24 hour time, add 12 to all PM times except 12:00 - 12:59pm
    const meridiem = timeString.slice(-2)
    const [hours, minutes] = timeString.replace(/am|pm/g,'').split(":");
    if(meridiem === "pm" && hours !== "12"){
        return `${parseInt(hours) + 12}:${minutes}`;
    }
    return `${hours}:${minutes}`;
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

export const diffInDays = (start, end) => {
    // https://www.grepper.com/answers/300372/
    const diffInMs   = new Date(end) - new Date(start)
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    if(diffInDays === 'NaN') {
        throw new Error(`Cannot calculate difference between dates ${start} and ${end}`)
    }
    return diffInDays;
}

export const validateDateRange = (date1, date2) => {
    const dates = [];
    const diff = diffInDays(date1, date2);
    const startDate = diff > 0 ? date1 : date2;
    const lengthInDays = Math.abs(diff);

    if ( lengthInDays > 30 ){
        throw new Error(`Date range ${date1} to ${date2} exceeds maximum range of 30 days`);
    }

    for ( let i=0; i <= lengthInDays; i++){
        const date = getOffsetDate(startDate,i)
        dates.push(date)
    }

    return dates
}

export const validateDateString = (dateString) => {
    const dateObj = new Date(dateString);
    if( dateObj.toString() === "Invalid Date" ) {
        throw new Error(`Invalid date string ${dateString}`);
    }
}

export const getOffsetDate = (dateString, offset) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + offset);
    return date.toISOString().substring(0, 10);
}


// console.log(getTime("Friday,  February 10\n      at\n\n      6:00pm"));
// console.log(timeTo24("6:00m"));
// console.log(await parseEvent({
//     "venueSlug": "zony-mash-beer-project",
//     "title": "The Rumble: Tribute to The Wild Magnolias",
//     "timeString": "Friday,  February 10\n      at\n\n      9:00pm",
//     "slug": "864111"
//   }, "2022-2-13"))