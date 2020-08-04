import File from './File.js';
import { TYPE } from '../DataModel.js';

export default class FileSound extends File {

    constructor(startFrom, data) {
        super(TYPE.SOUND, startFrom, data);
        this.type = TYPE.SOUND;
    }
    
    getFileContents() {
        return this.data;
    }

    getSavePath() {
        return process.env.FOLDER_NAME_IMAGES + "/" + this.name;
    }
}