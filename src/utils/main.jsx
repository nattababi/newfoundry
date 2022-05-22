import moment from 'moment';

function toMiles(km) {
    return (km / 1.609);
}

function toFarenheit(kelvin) {
    return (((kelvin - 273.15) * 1.8) + 32);
}

function toFeet(m) {
    return m * 3.28;
}

function getIconUrl(name) {
    return "http://openweathermap.org/img/w/" + name + ".png"
}

function getTime(time) {
    return moment.unix(time).format('MMMM Do YYYY, h:mm:ss a');
}

function getTimeShift(t, sec) {
    return moment.unix(t).add(sec, 'seconds').format('MMMM Do YYYY, h:mm:ss a');
}

function getSpeed(attr, value1, value2) {
    const res = getAttrib(attr, value1, value2);
    return (res !== '') ? Math.round(toMiles(res)) : '-';
}

function getAttrib(attr, value1, value2) {
    return attr[value1] ? attr[value1][0][value2] : "";
}

function timeExistsAndValid(t1, t2, seconds) {
    const mom = moment(t2, 'MMMM Do YYYY, h:mm:ss a');
    return moment.unix(t1).isSameOrBefore(mom) && moment.unix(t1).add(seconds, 'seconds').isSameOrAfter(mom);
}

function geoLocation(x, y, refX, refY) {
    return getDistanceFromLatLonInMi(x, y, refX, refY);
}

function getDistanceFromLatLonInMi(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km

    return toMiles(d);
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function degToCompass(degree) {
    const value = Math.round((degree / 22.5) + 0.5);
    const arrCompass = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arrCompass[(value % 16)];
}

export {
    toMiles, toFarenheit, toFeet, getIconUrl, getTime, getTimeShift, getSpeed,
    getAttrib, timeExistsAndValid, geoLocation, degToCompass
}