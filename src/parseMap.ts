import { DISTRICT_ID,
    NORTH, SOUTH, EAST, WEST,
    ROAD, OPEN_ROAD, OPEN_CORNER, CROSS_ROADS, HALF_FORK_LEFT, HALF_FORK_RIGHT,
    EMPTY_FORK, CORNER, DEAD_END, FORK, OPEN_FORK
} from './const'
import { DclMap, Parcel, Road, Roadmap, CoordinateMap } from './types'

const filterRoads = (x: Parcel[]) => x.filter(x => x.district_id == DISTRICT_ID)

export function turnOrientation(orientation: string) {
  switch (orientation) {
    case NORTH: return EAST
    case EAST: return SOUTH
    case SOUTH: return WEST
    case WEST: return NORTH
    default: return null
  }
}

export function getType(parcel: Parcel, roads: CoordinateMap<Parcel>): Road {

    function get(x, y) {
        return roads[x] && roads[x][y]
    }

    const { x, y } = parcel

    const n = !!get(x,y+1)
    const s = !!get(x,y-1)
    const e = !!get(x+1,y)
    const w = !!get(x-1,y)
    const ne = !!get(x+1,y+1)
    const se = !!get(x+1,y-1)
    const nw = !!get(x-1,y+1)
    const sw = !!get(x-1,y-1)
    const countEdges = (+ne) + (+se) + (+nw) + (+sw)

    const emptyVertical = !n && !s
    const emptyOneVertical = !n || !s && (n || s)
    const fullVertical = n && s

    const emptySides = !e && !w
    const emptyOneSide = !w || !e && (e || w)
    const fullSides = e && w

    console.log(JSON.stringify({ x, y, n, s, e, w, countEdges, emptyVertical, emptySides, emptyOneSide, emptyOneVertical}))

    // Simpler Cases for ROADs
    if (fullSides && fullVertical) {
        if (countEdges === 0) {
            return {
                roadType: CROSS_ROADS,
                orientation: NORTH
            }
        } else if (countEdges === 1) {
            return {
                roadType: OPEN_FORK,
                orientation: (!sw && !se) ? NORTH
                    : (!nw && !sw) ? EAST
                    : (!ne && !nw) ? SOUTH
                    : WEST
            }
        } else if (countEdges === 2) {
            const orientation =
                !nw ? ( !ne ? EAST : /* !sw */ SOUTH )
              : !se ? ( !ne ? WEST  : /* !sw */ NORTH )
            : /* fallback */ NORTH
            return {
                roadType: EMPTY_FORK,
                orientation
            }
        } else if (countEdges === 3) {
            const roadType = OPEN_FORK
            const orientation = !ne ? SOUTH
                : !nw ? EAST
                : !se ? WEST
                : !sw ? NORTH
                : null
            if (orientation === null) {
                throw new Error(`Imposible to determine orientation of ${x}, ${y}`)
            }
            return {
              roadType,
              orientation
            }
        }
        // 4 is not really a thing in the map. Fall back to CROSS_ROADS
        return {
            roadType: CROSS_ROADS,
            orientation: NORTH
        }
    }
    // Case for Roads or Dead End
    if (emptySides || emptyVertical) {
        if (fullSides || fullVertical) {
            return {
                roadType: ROAD,
                orientation: emptySides ? EAST : NORTH
            }
        } else {
            return {
                roadType: DEAD_END,
                orientation: w ? SOUTH
                    : n ? WEST
                    : e ? NORTH
                    : s ? EAST
                    : null
            }
        }
    }
    // Case for Forks and Open Roads
    if ((fullVertical && emptyOneSide) || (fullSides && emptyOneVertical)) {
        const orientation =
                !n ? NORTH
              : !s ? SOUTH
              : !e ? EAST
              : !w ? WEST
              : null
        const roadType =
          (orientation == NORTH && se && sw) ? OPEN_ROAD
        : (orientation == SOUTH && ne && nw) ? OPEN_ROAD
        : (orientation == EAST && sw && nw) ? OPEN_ROAD
        : (orientation == WEST && se && ne) ? OPEN_ROAD
        : (orientation == NORTH && !se && sw) ? HALF_FORK_LEFT
        : (orientation == NORTH && se && !sw) ? HALF_FORK_RIGHT
        : (orientation == SOUTH && !ne && nw) ? HALF_FORK_RIGHT
        : (orientation == SOUTH && ne && !nw) ? HALF_FORK_LEFT
        : (orientation == EAST && !nw && sw) ? HALF_FORK_LEFT
        : (orientation == EAST && nw && !sw) ? HALF_FORK_RIGHT
        : (orientation == WEST && !ne && se) ? HALF_FORK_RIGHT
        : (orientation == WEST && ne && !se) ? HALF_FORK_LEFT
        : FORK
        return { orientation, roadType }
    }
    // Corner and open Corners
    if (emptyOneSide && emptyOneVertical) {
        const orientation =
                (s && e) ? NORTH
              : (n && w) ? SOUTH
              : (s && w) ? EAST
              : (n && e) ? WEST
              : null
        const roadType =
            (orientation == NORTH && !se) ? CORNER
          : (orientation == SOUTH && !nw) ? CORNER
          : (orientation == EAST && !sw) ? CORNER
          : (orientation == WEST && !ne) ? CORNER
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
