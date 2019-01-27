import fs = require('fs')

import { genesis } from '../genesis'
import { processMap } from '../parseMap'
import { DISTRICT_ID, ROAD, OPEN_FORK, OPEN_ROAD, OPEN_CORNER, CROSS_ROADS, EMPTY_FORK, CORNER, DEAD_END, FORK  } from '../const'

const allParcels = genesis['data']['assets']['parcels'].map(x => ({
    x: x.x,
    y: x.y,
    district_id: x.district_id
}))

//const minX = -150, maxX = 150, minY = -150, maxY = 150
const minX = -50, maxX = 0, minY = 0, maxY = 50

const topBottom = allParcels.filter(x => (x.x >= minX) && (x.x < maxX) && (x.y >= minY) && (x.y <= maxY))

const result = processMap({ parcels: topBottom }) 

const width = 20
let htmlTemplate = fs.readFileSync('./data/template.html').toString()
htmlTemplate = htmlTemplate.replace('WIDTH', '' + width).replace('WIDTH', '' + width)

const colorRoad = {
    [ROAD]: 'red',
    [OPEN_ROAD]: 'blue',
    [OPEN_CORNER]: 'green',
    [CROSS_ROADS]: 'yellow',
    [EMPTY_FORK]: 'black',
    [CORNER]: 'cyan',
    [DEAD_END]: 'grey',
    [FORK]: 'pink',
    [OPEN_FORK]: 'purple',
}

let appendText = ''
for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
        if (!result[i]) continue;
        if (!result[i][j]) continue;
        const posX = i * width + (Math.abs(minX-maxX+1))*width
        const posY = -j * width + (Math.abs(minX-maxX+1))*width
        const parcel = result[i][j]
        const color = colorRoad[parcel.roadType]
        appendText += (
            `<div class="tile" style="top: ${
                posY
            }px; left: ${
                posX
            }px; background-color: ${
                color
            }">${
                parcel.roadType
            }</div>`
        )
    }
}

const content = htmlTemplate.replace('ENTER', appendText)
console.log(content)
