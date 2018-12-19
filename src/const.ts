export const DISTRICT_ID = 'f77140f9-c7b4-4787-89c9-9fa0e219b079'

export const EMPTY = 'empty'
export const ROAD = 'road'
export const OPEN_ROAD = 'open road'
export const CROSS_ROADS = 'crossroads'
export const CORNER = 'corner'
export const DEAD_END = 'dead end'
export const OPEN_CORNER = 'open corner'
export const FORK = 'fork'
export const OPEN_FORK = 'open fork'

export const TYPE_INDEX = [
    ROAD, // Done
    OPEN_ROAD, // DOne
    OPEN_CORNER, // Done
    CROSS_ROADS, // DONE
    EMPTY, // DONE
    CORNER,  // DONE
    DEAD_END, // DONE
    FORK // DONE
]
export const TYPE_MAP = {}
TYPE_INDEX.forEach(
    (item, index) => TYPE_MAP[item] = index
)

export const NORTH = 'north'
export const SOUTH = 'south'
export const EAST = 'east'
export const WEST = 'west'

export const NE = 'north east'
export const NW = 'north west'
export const SE = 'south east'
export const SW = 'south west'

export const NS = 'north - south'
export const EW = 'east - west'
