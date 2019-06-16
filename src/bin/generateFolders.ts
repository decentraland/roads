import fs = require('fs-extra')

import { genesis } from '../genesis'
import { processMap } from '../parseMap'
import {
    NORTH, EAST, SOUTH, WEST, TYPE_MAP
} from '../const'

const allParcels = genesis['data']['assets']['parcels'].map(x => ({
    x: x.x,
    y: x.y,
    district_id: x.district_id
}))

const minX = -150, maxX = 150, minY = -150, maxY = 150
// const minX = -3, maxX = -2, minY = 10, maxY = 14

const topBottom = allParcels.filter(x => (x.x >= minX) && (x.x <= maxX) && (x.y >= minY) && (x.y <= maxY))

const result = processMap({ parcels: topBottom }) 

let gameTemplate = fs.readFileSync('./data/game_template.js').toString()
let sceneTemplate = fs.readFileSync('./data/scene_template.json').toString()

const endsWithGlb = x => x.endsWith('.glb')
const fileBasename = x => x.slice(0, x.lastIndexOf('.'))
const cachedVariations: Record<string, string[]> = {}
function getModelVariations(modelFolder: string): string[] {
    if (!cachedVariations[modelFolder]) {
        cachedVariations[modelFolder] = fs.readdirSync(modelFolder).filter(endsWithGlb).map(fileBasename)
    }
    return cachedVariations[modelFolder]
}

const ORIENTATION = {
    [NORTH]: 180,
    [EAST]: 270,
    [SOUTH]: 0,
    [WEST]: 90
}
const OUTPUT = 'output'

for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
        try {
        const parcel = result[i][j]
        if (!parcel) {
	// console.log('not found', i, j, result[i])
            continue
        } else {
	// console.log('found', i, j, result[i][j])
        }
        // mkdir
        const targetFolder = `${OUTPUT}/${i}.${j}`
        fs.ensureDirSync(targetFolder)
	// console.log('Built folder', targetFolder)
        // Copy model
        const { roadType, orientation } = parcel

        const modelName = roadType
        const index = TYPE_MAP[modelName]

        const folderName =`models/${index}. ${modelName}`
	// console.log(getModelVariations(folderName))
	const variations = getModelVariations(folderName)
	const variation = variations[Math.abs(i + j) % (variations.length)]

        const gltfName = `${folderName}/${variation}.glb`
	// console.log('Copying files...', gltfName)
        fs.copyFileSync(gltfName, `${targetFolder}/${variation}.glb`)

        // Make game.js
        fs.writeFileSync(
            `${targetFolder}/game.js`,
            gameTemplate
                .replace('__MODEL__', variation)
                .replace('__ROTATION__', '' + ORIENTATION[orientation])
        )
        // Make scene.json
        fs.writeFileSync(
            `${targetFolder}/scene.json`,
            sceneTemplate
                .replace('__COORDINATES__', `${i},${j}`)
                .replace('__COORDINATES__', `${i},${j}`)
                .replace('__TITLE__', `Road at ${i},${j} (${modelName} ${variation})`)
        )
        } catch (e) {
            console.log(e.stack)
        }
    }
}
