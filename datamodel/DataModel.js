import FileImage from './file/FileImage.js';
import FileJson from './file/FileJson.js';
import FileSound from './file/FileSound.js';
import FileXml from './file/FileXml.js';
import pluckString from '../functions/pluckString.js';
import createInt32 from '../functions/createInt32.js';

export const TYPE = {
    JSON: 1,
    IMAGE: 2,
    XML: 3,
    WAV: 4
}

export default class DataModel {

    constructor(data) {

        let mod_name = pluckString(0, data);
        let mod_guid = pluckString(mod_name.pointer, data);

        this.mod_name = mod_name.value;
        this.mod_guid = mod_guid.value;
        this.files = [];
        
        let pointer = mod_guid.pointer;

        while (pointer<data.length) {

            let fileType = data[pointer];
            pointer++;

            let file = null;
            switch (fileType) {
                case TYPE.JSON:     file = new FileJson(pointer, data);     break;
                case TYPE.IMAGE:    file = new FileImage(pointer, data);    break;
                case TYPE.XML:      file = new FileXml(pointer, data);      break;
                case TYPE.WAV:      file = new FileSound(pointer, data);      break;
            }

            if (file===null) break;
            
            this.files[this.files.length]=file;
            pointer = file.getStopAt()+1;

        }
    }
    
}