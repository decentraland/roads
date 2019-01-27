import * as fs from 'fs'

export const keys = JSON.parse(fs.readFileSync('./data/deployers.json').toString())
