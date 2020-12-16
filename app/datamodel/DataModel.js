import deserialize from './deserialize.js'
import { TYPE } from './File.js'
import Translator, { TRANSLATION_FILENAME } from './Translator.js'

export default class DataModel {

    constructor(data) {

        const parts = deserialize(data)

        const translationSource = parts.files.filter(f => (f.type === TYPE.XML && (f.name === TRANSLATION_FILENAME || f.name === TRANSLATION_FILENAME+'.xml' ) ))
        if (translationSource.length > 0) {
            Translator.setSource(translationSource[0].data)
            parts.files.filter(f => (f.type === TYPE.JSON)).forEach(file => {
                file.attemptFilenameTranslation()
            })
        }

        this.name = parts.name
        this.guid = parts.guid
        this.files = parts.files

    }

    save(parentPath) {
        const path = `${parentPath}/${this.name.replace(/[^\d\w]/gi, '_')}`
        this.files.forEach(item => {
            item.save(path)
        })
    }
}
