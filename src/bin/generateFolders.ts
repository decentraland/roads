import fs = require('fs')

import { genesis } from '../genesis'
import { processMap } from '../parseMap'
import { DISTRICT_ID,
    ROAD,
    OPEN_FORK,
    OPEN_ROAD,
    OPEN_CORNER,
    CROSS_ROADS,
    EMPTY_FORK,
    CORNER,
    DEAD_END,
    FORK,
    NORTH, EAST, SOUTH, WEST, TYPE_MAP, MODEL_FILENAME
} from '../const'

const allParcels = genesis['data']['assets']['parcels'].map(x => ({
    x: x.x,
    y: x.y,
    district_id: x.district_id
}))

// const minX = -150, maxX = 150, minY = -150, maxY = 150
const minX = -49, maxX = -40, minY = 45, maxY = 50

const topBottom = allParcels.filter(x => (x.x >= minX) && (x.x <= maxX) && (x.y >= minY) && (x.y <= maxY))

const result = processMap({ parcels: topBottom }) 
console.log(result)

let gameTemplate = fs.readFileSync('./data/game_template.js').toString()
let sceneTemplate = fs.readFileSync('./data/scene_template.json').toString()

const variations = ['A', 'B', 'C', 'D']
const ORIENTATION = {
    [NORTH]: 0,
    [EAST]: 90,
    [SOUTH]: 180,
    [WEST]: 270
}
const OUTPUT = 'output'

for (let i = minX; i <= maxX; i++) {
    for (let j = minY; j <= maxY; j++) {
        try {
        const parcel = result[i][j]
        if (!parcel) {
            console.log('not found', i, j, result[i])
            continue
        } else {
            console.log('found', i, j, result[i][j])
        }
        // mkdir
        const targetFolder = `${OUTPUT}/${i}.${j}`
        fs.mkdirSync(targetFolder)
        console.log('Built folder', targetFolder)
        // Copy model
        const { roadType, orientation } = parcel

        const modelName = roadType
        const index = TYPE_MAP[modelName]
        const modelFilename = MODEL_FILENAME[modelName]
        const variation = variations[Math.abs((i + j) % 4)]

        const folderName =`models/${index}. ${modelName}`
        const gltfName = `${folderName}/${modelFilename}_${variation}.gltf`
        const binName = `${folderName}/${modelFilename}_${variation}.bin`
        const texture = `${folderName}/Texture_Roads.png`
        console.log('Copying files...', gltfName, binName, texture)
        fs.copyFileSync(gltfName, `${targetFolder}/${modelFilename}_${variation}.gltf`)
        fs.copyFileSync(binName, `${targetFolder}/${modelFilename}_${variation}.bin`)
        fs.copyFileSync(texture, `${targetFolder}/Texture_Roads.png`)

        // Make game.js
        fs.writeFileSync(
            `${targetFolder}/game.js`,
            gameTemplate
                .replace('__MODEL__', `${modelFilename}_${variation}`)
                .replace('__ROTATION__', '' + ORIENTATION[orientation])
        )
        // Make scene.json
        fs.writeFileSync(
            `${targetFolder}/scene.json`,
            sceneTemplate
                .replace('__COORDINATES__', `${i},${j}`)
                .replace('__COORDINATES__', `${i},${j}`)
                .replace('__TITLE__', `Road at ${i},${j} (${modelFilename} ${variation})`)
        )
        } catch (e) {
            console.log(e.stack)
        }
    }
}
