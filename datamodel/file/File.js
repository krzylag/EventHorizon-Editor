import fs from 'fs';
import { TYPE } from '../DataModel.js';
import createUint8Array from '../../functions/createUint8Array.js';
import pluckString from '../../functions/pluckString.js';

export default class File {

    constructor(type, startFrom, data) {

        if (type==TYPE.JSON) {

            this.startFrom = startFrom;
            this.name = null;
            this.data = createUint8Array(this.startFrom, data);
            this.stopAt = this.startFrom+4+this.data.length-1;

        } else if (type===TYPE.IMAGE || type===TYPE.XML || type===TYPE.WAV) {

            this.startFrom = startFrom;
            let pointer = startFrom;
            let plucked = pluckString(pointer, data);
            this.name = plucked.value;
            pointer = plucked.pointer;
            this.data = createUint8Array(pointer, data);
            this.stopAt = pointer+4+this.data.length-1;

        }

    }

    getStopAt() {
        return this.stopAt;
    }

    save(modPath) {
        let savePath = modPath+"/"+this.getSavePath();
        let parent = savePath.split("/").filter((v,i,a)=>(i<a.length-1)).join("/");

        if (fs.existsSync(savePath)) {
            savePath = savePath+Date.now()+".json";
        }

        fs.mkdirSync(parent, { recursive: true });

        fs.writeFileSync(savePath, this.data, { recursive: true })
    }
    
}