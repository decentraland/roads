import { Map } from '../types'
import { CORNER, ROAD, OPEN_ROAD, CROSS_ROADS, OPEN_CORNER, OPEN_FORK, FORK, DEAD_END, DISTRICT_ID, NORTH, SOUTH, EAST, WEST, NS, EW } from '../const'
import { processMap } from '../parseMap'

try {

const testCase: Map = {
    parcels: [
        { x: 1, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 1, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 1, y: 0, id: 'a', district_id: DISTRICT_ID },
    ]
}

const result1 = processMap(testCase)
if (result1[1][2].roadType !== DEAD_END) console.log('Missed dead end')
if (result1[1][0].roadType !== DEAD_END) console.log('Missed dead end')
if (result1[1][2].orientation !== NORTH) console.log('Missed dead end, north')
if (result1[1][0].orientation !== SOUTH) console.log('Missed dead end, south')
if (result1[1][1].roadType !== ROAD) console.log('Missed north-south')
if (result1[1][1].orientation !== NS) console.log('Missed north-south orientation')

const case2: Map = {
    parcels: [
        { x: 1, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 1, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 1, y: 0, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 0, id: 'a', district_id: DISTRICT_ID },
    ]
}

const result2 = processMap(case2)
if (result2[1][2].roadType !== OPEN_CORNER) console.log('Missed NW corner')
if (result2[2][2].roadType !== OPEN_CORNER) console.log('Missed NE corner')
if (result2[1][0].roadType !== OPEN_CORNER) console.log('Missed SW corner')
if (result2[2][0].roadType !== OPEN_CORNER) console.log('Missed SE corner')
if (result2[1][1].roadType !== OPEN_ROAD) console.log('Missed north-south double')
if (result2[2][1].roadType !== OPEN_ROAD) console.log('Missed north-south double')

} catch (e) {
    console.log(e.stack)
}
