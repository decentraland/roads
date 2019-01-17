import { mainnet } from './map'
import { DISTRICT_ID,
    NORTH, SOUTH, EAST, WEST,
    NS, EW, NE, SW, SE,
    ROAD, OPEN_ROAD, OPEN_CORNER, CROSS_ROADS, 
    EMPTY_FORK, CORNER, DEAD_END, FORK, OPEN_FORK
} from './const'
import { DclMap, Parcel, Road, Roadmap, CoordinateMap } from './types'

const filterRoads = (x: Parcel[]) => x.filter(x => x.district_id == DISTRICT_ID)

export function getType(parcel: Parcel, roads: CoordinateMap<Parcel>): Road {

    function get(x, y) {
        return roads[x] && roads[x][y]
    }

    const { x, y } = parcel
    const emptyVertical = !get(x,y+1) && !get(x,y-1)
    const emptyOneVertical = (!get(x,y+1) || !get(x,y-1)) && !emptyVertical
    const fullVertical = !!get(x,y+1) && !!get(x,y-1)

    const emptySides = !get(x+1,y) && !get(x-1,y)
    const emptyOneSide = (!get(x+1,y) || !get(x-1,y)) && !emptySides
    const fullSides = !!get(x+1,y) && !!get(x-1,y)

    const ne = get(x+1,y+1)
    const se = get(x+1,y-1)
    const nw = get(x-1,y+1)
    const sw = get(x-1,y-1)

    // Simpler Cases for ROADs
    if (fullSides && fullVertical) {
        const count = (+!!ne) + (+!!se) + (+!!nw) + (+!!sw)
        if (count === 4) {
            return {
                roadType: CROSS_ROADS,
                orientation: NORTH
            }
        } else if (count === 3) {
            return {
                roadType: OPEN_FORK,
                orientation: !sw ? NORTH
                    : !nw ? EAST
                    : !ne ? SOUTH
                    : WEST
            }
        } else if (count === 2) {
            const orientation =
                !nw ? ( !ne ? NORTH : /* !sw */ WEST )
              : !se ? ( !ne ? EAST  : /* !sw */ SOUTH )
            : /* fallback */ NORTH
            return {
                roadType: EMPTY_FORK,
                orientation
            }
        }
        // 1, 0 currently don't have a model. Fall back to CROSS_ROADS
        return {
            roadType: CROSS_ROADS,
            orientation: NORTH
        }
    }
    // Case for Roads or Dead End
    if (emptySides || emptyVertical) {
        if (emptyOneVertical || emptyOneSide) {
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
            orientation: emptySides ? NORTH : EAST
        }
    }
    // Case for Forks and Open Roads
    if ((fullVertical && emptyOneSide) || (fullSides && emptyOneVertical)) {
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
    }
    // Corner and open Corners
    if (emptyOneSide && emptyOneVertical) {
        const orientation =
                (get(x-1,y) && get(x,y-1)) ? NORTH
              : (get(x+1,y) && get(x,y+1)) ? SOUTH
              : (get(x-1,y) && get(x,y+1)) ? EAST
              : (get(x+1,y) && get(x,y-1)) ? WEST
              : null
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
    throw new Error('Invalid formation of tiles')
}

export function processMap(map: DclMap): Roadmap {
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
