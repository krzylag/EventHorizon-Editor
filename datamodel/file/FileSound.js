import File from './File.js';
import { TYPE } from '../DataModel.js';

export default class FileSound extends File {

    constructor(startFrom, data) {
        super(TYPE.SOUND, startFrom, data);
        this.type = TYPE.SOUND;
        // console.log(this.name)
        // console.log(startFrom)
        // let a = [data[startFrom+4], data[startFrom+5], data[startFrom+6], data[startFrom+7]]
        // console.log(a)

    }
    
    getFileContents() {
        return this.data;
    }

    getSavePath() {
        return process.env.FOLDER_NAME_SOUND + "/" + this.name;
    }
}