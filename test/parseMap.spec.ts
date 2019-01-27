import { DclMap } from '../src/types'
import {
    CORNER, ROAD, OPEN_ROAD, CROSS_ROADS, OPEN_CORNER, OPEN_FORK, FORK, DEAD_END,
    EMPTY_FORK,
    DISTRICT_ID,
    NORTH, SOUTH, EAST, WEST,
    NS, EW
} from '../src/const'
import { processMap } from '../src/parseMap'

try {

const testCase: DclMap = {
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
if (result1[1][1].orientation !== NORTH) console.log('Missed north-south orientation')

const case2: DclMap = {
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


const case3: DclMap = {
    parcels: [
        { x: 1, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 2, id: 'a', district_id: DISTRICT_ID },
    ]
}

const result3 = processMap(case3)
if (result3[1][1].roadType !== DEAD_END) console.log('Missed left dead end')
if (result3[1][1].orientation !== WEST) console.log('Missed left dead end orientation')
if (result3[2][1].roadType !== FORK) console.log('Missed middle fork')
if (result3[2][1].orientation !== EAST) console.log('Missed middle end orientation')
if (result3[2][2].roadType !== DEAD_END) console.log('Missed middle dead end')
if (result3[2][2].orientation !== NORTH) console.log('Missed middle dead end orientation')

const case4: DclMap = {
    parcels: [
        { x: 0, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 1, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 4, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 0, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 1, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 4, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 3, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 0, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 0, id: 'a', district_id: DISTRICT_ID },
    ]
}

const result4 = processMap(case4)
if (result4[2][2].roadType !== EMPTY_FORK) console.log('Missed empty fork')
if (result4[2][2].orientation !== SOUTH) console.log('Missed empty fork orientation')
if (result4[2][1].roadType !== OPEN_FORK) console.log('Missed open fork')
if (result4[2][1].orientation !== NORTH) console.log('Missed open fork orientation')

const case5: DclMap = {
    parcels: [
        { x: 1, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 3, id: 'a', district_id: DISTRICT_ID },
    ]
}

const result5 = processMap(case5)
if (result5[3][1].roadType !== CORNER) console.log('Missed closed corner')

const case6: DclMap = {
    parcels: [
        { x: 1, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 2, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 1, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 2, id: 'a', district_id: DISTRICT_ID },
        { x: 3, y: 3, id: 'a', district_id: DISTRICT_ID },
    ]
}

const result6 = processMap(case6)
if (result6[3][1].roadType !== CORNER) console.log('Missed closed corner')

} catch (e) {
    console.log(e.stack)
}
