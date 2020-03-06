
import SmallPart from './SmallPart.js';
import fs from 'fs';
import { DECOMPRESS_PATH_ROOT } from '../start.js';

export const TYPE = {
    JSON: 1,
    IMAGE: 2,
    XML: 3,
    WAV: 4
}


export default class BigPart {

    constructor(from, data) {

        this.small_parts = [];
        this.starts_at = from;
        let position = from+1;

        this.type = data[from];
        switch (this.type) {
            case TYPE.JSON:
                this.small_parts[0] = new SmallPart(position, data);
                position = this.small_parts[0].ends_at+1;
                break;

            case TYPE.IMAGE:
                this.small_parts[0] = new SmallPart(position, data);
                position = this.small_parts[0].ends_at+1;
                this.small_parts[1] = new SmallPart(position, data);
                position = this.small_parts[1].ends_at+1;
                break;

            case TYPE.XML:
                this.small_parts[0] = new SmallPart(position, data);
                position = this.small_parts[0].ends_at+1;
                this.small_parts[1] = new SmallPart(position, data);
                position = this.small_parts[1].ends_at+1;
                break;

            case TYPE.WAV:
                this.small_parts[0] = new SmallPart(position, data);
                position = this.small_parts[0].ends_at+1;
                this.small_parts[1] = new SmallPart(position, data);
                position = this.small_parts[1].ends_at+1;
                break;

            default:
                console.log('__undef! position: '+position+", type = "+ this.type);
        }

        this.ends_at = position-1;

    }


    saveFile() {

        if (!fs.existsSync(DECOMPRESS_PATH_ROOT)) fs.mkdirSync(DECOMPRESS_PATH_ROOT, { recursive: true });
        
        let filePath = DECOMPRESS_PATH_ROOT + this._decideTypeSaveLocation(this.type);
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });

        let fileName = null;
        let fileContents = null;

        switch (this.type) {
            case TYPE.JSON:
                fileContents = this.small_parts[0].toString();
                let json = JSON.parse(fileContents);
                filePath = filePath + this._decideJsonSaveLocation(json);
                fileName = this._decideJsonFileName(json);
                break;
            case TYPE.IMAGE:
                fileName = this.small_parts[0].toString();
                fileContents = this.small_parts[1].toFileBuffer();
                break;
            case TYPE.XML:
                fileName = this.small_parts[0].toString()+".xml";
                fileContents = this.small_parts[1].toFileBuffer();
                break;
            case TYPE.WAV:
                fileName = this.small_parts[0].toString()+".wav";
                fileContents = this.small_parts[1].toFileBuffer();
                break;

            default:
        }

        if (fileName!==null) {
            if (!fs.existsSync(filePath)) fs.mkdirSync(filePath, { recursive: true });
            let fullName = filePath+"/"+fileName;
            fs.writeFileSync(fullName, fileContents);
            console.log('saved '+fullName);
        }
    }

    _decideTypeSaveLocation(type) {
        switch(type) {
            case TYPE.JSON:     return "/json";
            case TYPE.IMAGE:    return "/images";
            case TYPE.XML:      return "/xml";
            case TYPE.WAV:      return "/sounds";
            default:            return "/_undefined";
        }
    }

    _decideJsonSaveLocation(json) {
        switch (json.ItemType) {
            case 1:   return "/Component";
            case 2:   return "/Device";
            case 3:   return "/Weapon";
            case 4:   return "/Ammunition/Obsolete";
            case 5:   return "/Dronebay";
            case 6:   return "/Ship";
            case 7:   return "/Satellite";
            case 8:   return "/Ship/Builds";
            case 9:   return "/Satellite/Builds";
            case 10:  return "/Technology";
            case 11:  return "/Component/Stats";
            case 12:  return "/Component/Modifications";
            case 14:  return "/Faction";
            case 15:  return "/Quests";
            case 16:  return "/Quests/Loot";
            case 18:  return "/Quests/Fleets";
            case 19:  return "/Quests/Characters";
            case 20:  return "/Quests/Items";
            case 25:  return "/Ammunition";
            case 26:  return "/Ammunition/Effects";
            case 27:  return "/Ammunition/Bullets";
            case 100: return "/Settings";
            case 101: return "/Settings";
            default:    return "/_unclassified";
        }
    }

    _decideJsonFileName(json) {
        return json.Id+".json";
    }
}