import File from './File.js';
import { TYPE } from '../DataModel.js';

export default class FileXml extends File {

    constructor(startFrom, data) {
        super(TYPE.XML, startFrom, data);
        this.type = TYPE.XML;
    }
    
    getFileContents() {
        return this.data;
    }

    getSavePath() {
        return process.env.FOLDER_NAME_XML + "/" + this.name;
    }

}