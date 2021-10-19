//init of dotenv
require("dotenv").config();

const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const ip = require('ip')
const fetch = require('fetch').fetchUrl

let token = {};

//generateToken();

function generateToken() {
    const grantToken = Buffer.from(`${process.env.KEY}:${process.env.SECRET}`, 'utf-8').toString('base64');
    let tok = fetch('https://api.vasttrafik.se/token', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${grantToken}`,
            'grant_type': `client_credentials`,
        },
        payload: "grant_type=client_credentials&scope=123",
        method: 'POST'
    }, function (error, meta, body) {
        token = JSON.parse(body);
        console.log("\nNEW TOKEN!\n" + JSON.stringify(token));
    })
}

function getStation(input) {
    return new Promise(function (resolve, reject) {
        fetch(`https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input=${input.replace(" ", "%20")}&format=json`, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            },
        }, (error, meta, body) => {
            resolve(JSON.parse(body.toString()).LocationList.StopLocation[0])
        })
    })
}

function getDepatureBoard(station, date) {
    return new Promise(function (resolve, reject) {
        fetch(`https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=${station.id}&date=${getDate(date)}&time=${date.toLocaleTimeString().slice(0, -3)}&format=json`, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            },
        }, (error, meta, body) => {
            console.log(body.toString())
            resolve(JSON.parse(body.toString()))
        })
    })
}

function getDate(date) {
    const offset = date.getTimezoneOffset()
    date = new Date(date.getTime() - (offset * 60 * 1000))
    return date.toISOString().split('T')[0]
}

function getTrip(start, end, date){
    return new Promise(function (resolve, reject) {
        fetch(`https://api.vasttrafik.se/bin/rest.exe/v2/trip?originId=${start.id}&destId=${end.id}&date=${getDate(date)}&time=${date.toLocaleTimeString().slice(0, -3)}&format=json`, {
            headers: {
                'Authorization': `Bearer ${token.access_token}`
            },
        }, (error, meta, body) => {
            console.log(body.toString())
            resolve(JSON.parse(body.toString()))
        })
    })
}

app.use(cors())

app.get('/api/getTrip', async (req, res) => {
    res.send(await getDepatureBoard(await getStation(req.query.startStation), await getStation(req.query.endStation), new Date()))
});

app.get('/api/getDepatureBoard', async (req, res) => {
    res.send(await getDepatureBoard(await getStation(req.query.station), new Date()))
});

app.get('/api/getStation', async (req, res) => {
    res.send(await getStation(req.query.station))
});

app.listen(port, () => {
    console.log(`\nApp running at:\n- Local: \x1b[36mhttp://localhost:${ port }/\x1b[0m\n- Network \x1b[36mhttp://${ ip.address() }:${ port }/\x1b[0m\n\nTo run for production, run \x1b[36mnpm run start\x1b[0m`)
});