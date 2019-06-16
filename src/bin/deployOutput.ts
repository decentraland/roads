import fs = require('fs')
import path = require('path')
import child = require('child_process')
import { genesis } from '../genesis'
import { keys } from '../keys'

const spawn = child.spawn

const concurrency = 50
let concurrents = 0
const waitTime = 300

async function delay(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })
}

async function execute(x, y, key) {
    return new Promise((resolve, reject) => {
        const subprocess = spawn('dcl', ['deploy', '-y', path.join('output', `${x}.${y}`)], {
            cwd: process.cwd(),
            shell: true,
            env: {
                'DCL_PRIVATE_KEY': key,
		'PATH': process.env.PATH,
		'HOME': '/Users/usr'
            }
        })
        subprocess.stdout.on('data', (data) => {
	//console.log(`stdout: ${data}`)
        })
        subprocess.stderr.on('data', (data) => {
	//console.log(`stderr: ${data}`)
        })
        subprocess.on('close', resolve)
    })
}

async function executeDeploy(x, y, keys) {
    while (concurrents >= concurrency) await delay(waitTime);
    concurrents++;
    execute(x, y, keys).then(() => concurrents--)
}

const estateToKey = {}
const mappingToEstate = {}

for (let parcel of genesis.data.assets.parcels) {
    if (parcel['estate_id']) {
        mappingToEstate[parcel.x] = mappingToEstate[parcel.x] || {}
        mappingToEstate[parcel.x][parcel.y] = parcel['estate_id']
    }
}
for (let deployer of keys) {
    estateToKey[deployer['estateId']] = deployer['privateKey']
}

async function runDirs() {
    const dirs = fs.readdirSync(path.join(process.cwd(), 'output'))
    let i = 0
    for (let dir of dirs) {
        if (!dir) continue
        const [x, y] = dir.split('.')
        if (!mappingToEstate[x]) {
            continue;
        }
        const estateId = mappingToEstate[x][y]
        if (!estateId) {
            console.log('mapping not found for', x, y)
            continue;
        }
        const key = estateToKey[estateId]
        if (!key) {
            console.log('key not found for estate', estateId)
            continue;
        }
        await executeDeploy(x, y, key)
	i++;
	console.log(`Progress: Deployed ${x}, ${y}, ${i} from ${dirs.length} done`)
    }
}

runDirs()
