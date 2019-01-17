export interface Parcel {
    id: string
    x: number
    y: number
    owner?: string
    district_id: string
}

export interface DclMap {
    parcels: Parcel[]
}

export interface CoordinateMap<X> {
    [x: number]: { [y: number]: X }
}

export interface Road {
    roadType: string
    orientation: string
}

export type Roadmap = CoordinateMap<Road>
