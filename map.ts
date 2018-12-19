import fs from 'fs'

import Map from './types'

export const mainnet: Map = JSON.parse(fs.readFileSync('./chunk').toString())['data']['assets']
