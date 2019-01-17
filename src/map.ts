import fs = require('fs')
import { DclMap } from './types'

export const mainnet: DclMap = JSON.parse(fs.readFileSync('./data/mainnet.json').toString())['data']
