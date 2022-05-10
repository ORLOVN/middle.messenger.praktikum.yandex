export function beautifulDate(date: Date) {
    const monthStr = 'января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',');
    const comparisonDate = new Date()
    if (compareDates(comparisonDate, date)) {
        return 'сегодня'
    }

    comparisonDate.setDate(comparisonDate.getDate() - 1)

    if (compareDates(comparisonDate, date)) {
        return 'вчера'
    }

    comparisonDate.setDate(comparisonDate.getDate() + 1)

    if (comparisonDate.getFullYear() === date.getFullYear()) {
        return `${date.getDate()+1} ${monthStr[date.getMonth()]}`
    }

    return `${date.getDate()+1} ${monthStr[date.getMonth()]} ${date.getFullYear()}`
}


function compareDates(date1: Date, date2: Date): boolean {
    return  date1.getDate()     === date2.getDate()      &&
            date1.getMonth()    === date2.getMonth()     &&
            date1.getFullYear() === date2.getFullYear()
}
