import roadData from './responses/here'  // from HERE API
import weatherData from './responses/weather'  // from OpenWeather

import { svgWind, svgDroplet, svgDashCircle } from './svg/main';
import {
    toMiles, toFarenheit, toFeet, getIconUrl, getTime, getTimeShift,
    getSpeed, getAttrib, timeExistsAndValid, geoLocation, degToCompass
} from './utils/main';

const validDistanceForTemp = 3.5; //miles
const validTimeframeForTime = 30*60; //30 min in sec

const data = []
roadData['link'].forEach((link, index) => {
    const dataPoint = {}
    const { shape, length, remainTime, attributes } = link
    const lat = shape[0]
    const lng = shape[1]

    // Vehicle
    dataPoint['lat'] = lat
    dataPoint['lng'] = lng

    dataPoint['dist'] = toFeet(length).toFixed(0);

    dataPoint['rtime'] = remainTime;
    dataPoint['etime'] = roadData.travelTime - remainTime;

    // Road Info
    dataPoint['speed'] = getSpeed(attributes, 'SPEED_LIMITS_FCN', 'TO_REF_SPEED_LIMIT');
    dataPoint['street'] = getAttrib(attributes, 'ROAD_GEOM_FCN', 'NAME');
    dataPoint['paved'] = getAttrib(attributes, 'LINK_ATTRIBUTE_FCN', 'PAVED');
    dataPoint['ramp'] = getAttrib(attributes, 'LINK_ATTRIBUTE_FCN', 'RAMP')

    // Weather
    dataPoint['time'] = index ? getTimeShift(weatherData[0]['dt'], dataPoint['etime']) : getTime(weatherData[0]['dt']);

    data.push(dataPoint);
});

for (let i = 0; i < weatherData.length; i++) {
    const arrLinks = data.filter(x => {
        return timeExistsAndValid(weatherData[i]['dt'], x['time'], validTimeframeForTime) &&
            geoLocation(x['lat'], x['lng'], weatherData[i]['coord']['lat'], weatherData[i]['coord']['lon']) < validDistanceForTemp;
    });

    arrLinks.forEach(x => {
        x['imgPath'] = getIconUrl(weatherData[i].weather[0].icon);
        x['temp'] = toFarenheit(weatherData[i]['main']['temp']).toFixed(2);
        x['flike'] = toFarenheit(weatherData[i]['main']['feels_like']).toFixed(2);
        x['wind'] = toMiles(weatherData[i]['wind']['speed']).toFixed(2);
        x['wdir'] = weatherData[i]['wind']['deg'];
        x['humidity'] = weatherData[i]['main']['humidity'];
    });
}

//troubleshooting
const arrLinks = data.filter(x => {
    return !(x['temp']);
});

arrLinks.length ? console.log("no temperature for", arrLinks.length, "link(s)") : console.log("temperature exists for all links");



const columns = [
    {
        Header: 'Vehicle',
        columns: [
            {
                Header: 'Latitude',
                accessor: 'lat',
            },
            {
                Header: 'Longitude',
                accessor: 'lng',
            },
            {
                Header: 'Distance Traveled,ft',
                accessor: 'dist'
            },
            {
                Header: 'Remain Time,s',
                accessor: 'rtime'
            },
            {
                Header: 'Elapsed Time,s',
                accessor: 'etime'
            },
        ]
    },
    {
        Header: 'Road Info',
        columns: [
            {
                Header: 'Speed,mph',
                accessor: 'speed',
            },
            {
                Header: 'Street',
                accessor: 'street',
            },
            {
                Header: 'Paved',
                accessor: 'paved',
                Cell: (data) => {
                    return <div className='temp-container'>
                        <div className='my-text'>{(data.row.original.paved === "Y") ? "Y" : svgDashCircle}</div>
                    </div>
                },
            },
            {
                Header: 'Ramp',
                accessor: 'ramp',
            },


        ]
    },
    {
        Header: 'Weather',
        columns: [
            {
                Header: 'Temperature,F',
                accessor: 'temp',
                Cell: (data) => {
                    return <div className='temp-container'>
                        <img className='my-icon' height={36} src={data.row.original.imgPath} alt='icon'/>
                        <div className='my-text'>{data.row.original.temp}</div>
                    </div>
                },
            },
            {
                Header: 'Feels like,F',
                accessor: 'flike',
            },
            {
                Header: 'Wind,mph',
                accessor: 'wind',
                Cell: (data) => {
                    return <div className='temp-container'>
                        <div className='my-wind'>{data.row.original.wind ? svgWind : ''}</div>
                        <div className='my-text'>{degToCompass(data.row.original.wdir)} </div>
                        <div className='my-text'>{data.row.original.wind}</div>
                    </div>
                },
            },
            {
                Header: 'Humidity',
                accessor: 'humidity',
                Cell: (data) => {
                    return <div className='temp-container'>
                        <div className='my-wind'>{data.row.original.humidity ? svgDroplet : ''}</div>
                        <div className='my-text'>{data.row.original.humidity}</div>
                    </div>
                },
            },
            {
                Header: 'Time',
                accessor: 'time',
            },
        ]
    }
]

export {
    columns,
    data
}
