import { mainnet } from './map'
import { DISTRICT_ID, NORTH, SOUTH, EAST, WEST, NS, EW, NE, SW, SE, ROAD, DEAD_END, CORNER, OPEN_CORNER, OPEN_ROAD, FORK, CROSS_ROADS } from './const'
import { Map, Parcel, Road, Roadmap, CoordinateMap } from './types'

const filterRoads = (x: Parcel[]) => x.filter(x => x.district_id == DISTRICT_ID)

export function getType(parcel: Parcel, roads: CoordinateMap<Parcel>): Road {

    function get(x, y) {
        return roads[x] && roads[x][y]
    }

    const { x, y } = parcel
    const emptyVertical = !get(x,y+1) && !get(x,y-1)
    const emptyOneVertical = !get(x,y+1) || !get(x,y-1)
    const fullVertical = !!get(x,y+1) && !!get(x,y-1)

    const emptySides = !get(x+1,y) && !get(x-1,y)
    const emptyOneSide = !get(x+1,y) || !get(x-1,y)
    const fullSides = !!get(x+1,y) && !!get(x-1,y)

    // Easy ROADs
    if (emptySides || emptyVertical) {
        if (emptySides && emptyVertical) {
            return {
                roadType: CROSS_ROADS,
                orientation: ''
            }
        }
        if ((emptySides && emptyOneVertical) ||
            (emptyVertical && emptyOneSide)
        ) {
            return {
                roadType: DEAD_END,
                orientation: get(x,y-1) ? NORTH
                    : get(x,y+1) ? SOUTH
                    : get(x-1,y) ? EAST
                    : get(x+1,y) ? WEST
                    : null
            }
        }
        return {
            roadType: ROAD,
            orientation: emptySides ? NS : EW
        }
    }
    if (emptyOneSide || emptyOneVertical) {
        const countEmpty = (+!get(x+1,y)) + (+!get(x-1,y)) + (+!get(x,y+1)) + (+!get(x,y-1))

        if (countEmpty === 1) {
            const orientation =
                    !get(x+1,y) ? NORTH
                  : !get(x-1,y) ? SOUTH
                  : !get(x,y-1) ? EAST
                  : !get(x,y+1) ? WEST
                  : null
            const roadType =
              (orientation == NORTH || orientation == EAST && get(x-1,y+1)) ? OPEN_ROAD 
            : (orientation == SOUTH || orientation == WEST && get(x+1,y-1)) ? OPEN_ROAD : FORK
            return { orientation, roadType }
        } else if (countEmpty === 2) {
            const orientation =
                    (get(x-1,y) && get(x,y-1)) ? NORTH
                  : (get(x+1,y) && get(x,y+1)) ? SOUTH
                  : (get(x-1,y) && get(x,y+1)) ? EAST
                  : (get(x+1,y) && get(x,y-1)) ? WEST
                  : null
            if (orientation == null) throw new Error('impossible to detect')
            const roadType =
                (orientation == NORTH && !get(x-1,y-1)) ? CORNER
              : (orientation == SOUTH && !get(x+1,y+1)) ? CORNER
              : (orientation == EAST && !get(x-1,y+1)) ? CORNER
              : (orientation == WEST && !get(x+1,y-1)) ? CORNER
              : OPEN_CORNER
            return {
                roadType, orientation
            }
        }
    }
    throw new Error('Invalid formation of tiles')
}

export function processMap(map: Map): Roadmap {
    const roads: Parcel[] = filterRoads(map.parcels)
    const mapRoads: CoordinateMap<Parcel> = {}
    for (let road of roads) {
        mapRoads[road.x] = mapRoads[road.x] || {}
        mapRoads[road.x][road.y] = road
    }
    const infoRoad: Roadmap = {}
    for (let road of roads) {
        infoRoad[road.x] = infoRoad[road.x] || {}
        infoRoad[road.x][road.y] = getType(road, mapRoads)
    }
    return infoRoad
}
