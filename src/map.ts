import fs from 'fs'

import Map from './types'

export const mainnet: Map = JSON.parse(fs.readFileSync('./genesis.json').toString())['data']['assets']
