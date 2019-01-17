import * as fs from 'fs'

export const genesis = JSON.parse(fs.readFileSync('./data/mainnet.json').toString())
