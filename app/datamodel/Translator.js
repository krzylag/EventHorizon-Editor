import { parseString } from 'xml2js'
import arrayToString from "./arrayToString.js"

export const TRANSLATION_FILENAME = 'English'

export default class Translator {

    static setSource(data) {

        const xmlString = arrayToString(data)
        
        this.json = {}
        parseString(xmlString, (err, result) => {
            result.resources.string.forEach((row)=>{
                this.json[row['$']['name']] = row['_'].replace(/[^\w\d]/gi, '_')
            })
        })
    }

    static get(key = null) {
        if (key === null || this.json[key] === undefined) return null
        else return this.json[key]
    }

}