import fs from 'fs';
import arrayToString from "./arrayToString.js"
import map from './File_mappings.json'
import Translator from './Translator.js';

export const TYPE = {
    JSON: 1,
    IMAGE: 2,
    XML: 3,
    WAV: 4
}

export const PATH = {
    JSON: '/json',
    IMAGE: '/image',
    XML: '/xml',
    WAV: '/sounds',
}
export default class File {

    static key = 0

    constructor(type, parts) {

        this.key = File.key
        File.key++
    
        this.type = type
        this.name = null
        this.path = null
        this.data = null
        this.json = null

        switch (type) {
            case TYPE.JSON:
                const details = this.getJsonDetails(parts[0].data)
                if (details === null) {
                    this.name = `file${this.key}.json`
                    this.path = PATH.JSON
                    this.data = parts[0].data
                } else {
                    this.json = details.json
                    this.name = details.name
                    this.path = `${PATH.JSON}${details.path}`
                    this.data = parts[0].data
                }
                break
            case TYPE.IMAGE:
                this.name = arrayToString(parts[0].data)
                this.path = PATH.IMAGE
                this.data = parts[1].data
                break
            case TYPE.XML:
                this.name = arrayToString(parts[0].data)+'.xml'
                this.path = PATH.XML
                this.data = parts[1].data
                break
            case TYPE.WAV:
                this.name = arrayToString(parts[0].data)+'.wav'
                this.path = PATH.WAV
                this.data = parts[1].data
                break
            default:
                console.error(`Unknown file type ${type}`)
        }
    }

    getJsonDetails(data) {
        try {
            const json = JSON.parse(arrayToString(data))
            if (!json.ItemType) return null
            const ItemId = json.Id ? json.Id : null
            const path = this.findProp('ItemType', json.ItemType, map.ItemTypePath, 'Path', '/_undef')
            const fileNamePrefix = this.findProp('ItemType', json.ItemType, map.ItemTypeNamePrefix, 'Prefix', '_undef')
            return {
                path: path,
                name: `${fileNamePrefix}_${ItemId ? ItemId : 'undef'}_${this.key}.json`,
                json: json
            }
        } catch {
            return null
        }
    }

    findProp(searchKey, searchValue, arr, returnKey, defaultValue = null) {
        const foundElement = arr.find(elem => ( elem[searchKey] === searchValue))
        if (foundElement === undefined) return defaultValue
        else return foundElement[returnKey]
    }

    attemptFilenameTranslation() {
        if (this.json !== null && this.json.Name !== undefined) {
            const part = Translator.get(this.json.Name.replace('$',''))
            if (part !== null ) {
                this.name = `${part}_${this.key}.json`
            } else {
                this.name = `${this.json.Name.replace('$','').replace(/[^\d\w]/gi, '_')}_${this.key}.json`
            }
        }
    }

    save(parentPath) {
        const path = `${parentPath}${this.path}`
        fs.mkdirSync(path, { recursive: true });
        const savePath = `${path}/${this.name}`
        if (fs.existsSync(savePath)) {
            console.error(`File exists: ${savePath}`)
        }
        fs.writeFileSync(savePath, this.data, { recursive: true })
    }

}