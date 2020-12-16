import FileImage from './file/FileImage.js';
import FileJson from './file/FileJson.js';
import FileSound from './file/FileSound.js';
import FileXml from './file/FileXml.js';
import pluckString from '../functions/pluckString.js';
import createInt32 from '../functions/createInt32.js';
import xml2json from 'xml2json';

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
        this.namesDictionary={};
        this.englishTranslation=null;
        
        let pointer = mod_guid.pointer;

        while (pointer<data.length) {

            let fileType = data[pointer];
            pointer++;

            let file = null;
            switch (fileType) {
                case TYPE.JSON:     
                    file = new FileJson(pointer, data);
                    let json = JSON.parse(file.getFileContents());
                    if (typeof json.ItemType !== 'undefined' && typeof json.Id !== 'undefined' && typeof json.Name !=='undefined') {
                        if (typeof this.namesDictionary["t"+json.ItemType]==='undefined') this.namesDictionary["t"+json.ItemType]={};
                        this.namesDictionary["t"+json.ItemType]["i"+json.Id]=json.Name;
                    }
                    break;
                case TYPE.IMAGE:    file = new FileImage(pointer, data);    break;
                case TYPE.XML:      
                    file = new FileXml(pointer, data);      
                    if (file.getName()==='English') {

                        let json = JSON.parse(xml2json.toJson(file.getFileContents()));
                        this.englishTranslation={};
                        for (let i in json.resources.string) {
                            this.englishTranslation[json.resources.string[i].name]=json.resources.string[i]['$t']
                        }

                    }
                    break;
                case TYPE.WAV:      file = new FileSound(pointer, data);      break;
            }

            if (file===null) break;
            
            this.files[this.files.length]=file;
            pointer = file.getStopAt()+1;

            
        }


        if (this.englishTranslation!==null) {
            for (let i in this.namesDictionary) {
                for (let j in this.namesDictionary[i]) {
                    let name = this.namesDictionary[i][j].replace("$",'');
                    if (typeof this.englishTranslation[name]!=='undefined') {
                        name = this.englishTranslation[name].trim();
                    }
                    this.namesDictionary[i][j]=name;
                }
            }
        }

    }

    save(rootDir) {
        for (let idx in this.files) {
            this.files[idx].save(rootDir, this.namesDictionary);
        }
    }
    
}