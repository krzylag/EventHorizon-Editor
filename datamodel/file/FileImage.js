import File from './File.js';
import { TYPE } from '../DataModel.js';

export default class FileImage extends File {

    constructor(startFrom, data) {
        super(TYPE.IMAGE, startFrom, data);
        this.type = TYPE.IMAGE;
    }

    getFileContents() {
        return this.data;
    }

    getSavePath() {
        return process.env.FOLDER_NAME_IMAGES + "/" + this.name;
    }
}