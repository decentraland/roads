import fs = require('fs')

import { genesis } from './genesis'
import { processMap } from './parseMap'
import { DISTRICT_ID, ROAD, OPEN_FORK, OPEN_ROAD, OPEN_CORNER, CROSS_ROADS, EMPTY_FORK, CORNER, DEAD_END, FORK  } from './const'

const allParcels = genesis['data']['assets']['parcels'].map(x => ({
    x: x.x,
    y: x.y,
    district_id: x.district_id
}))

const minX = -49, maxX = -1, minY = 1, maxY = 49

const topBottom = allParcels.filter(x => (x.x >= -49) && (x.x < 1) && (x.y >= 1) && (x.y <= 49))

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
        if (!result[i][j]) continue;
        const posX = i * width + 50*width
        const posY = -j * width + 50*width
        const parcel = result[i][j]
        const color = colorRoad[parcel.roadType]
        appendText += (
            `<div class="tile" style="top: ${
                posY
            }px; left: ${
                posX
            }px; background-color: ${
                color
            }">${parcel.orientation}</div>`
        )
    }
}

const content = htmlTemplate.replace('ENTER', appendText)
console.log(content)
