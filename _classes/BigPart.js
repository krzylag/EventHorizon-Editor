
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

        let position = from+1;

        this.starts_at = from;
        this.type = data[from];

        this.parts = {
            name: null,
            contents: null
        };

        this.file = {
            name:       null,
            path:       DECOMPRESS_PATH_ROOT + this._decideTypeSaveLocation(this.type),
            full_path:  null,
            contents:   null
        };

        this.json_attr = {
            id:         null,
            name:       null,
            item_type:  null
        };

        if (this.type === TYPE.JSON) {

            this.parts.contents = new SmallPart(position, data);
            position = this.parts.contents.ends_at+1;
            this.file.contents = this.parts.contents.toString();

            let json = JSON.parse(this.file.contents);
            this.json_attr = {
                id:         typeof(json.Id)!=='undefined' ? parseInt(json.Id) : null,
                name:       typeof(json.Name)!=='undefined' ? json.Name : null,
                item_type:  typeof(json.ItemType)!=='undefined' ? parseInt(json.ItemType) : null
            };
            this.file.name = this.json_attr.id+".json";
            this.file.path = this.file.path+this._decideJsonSaveLocation(this.json_attr.item_type);
            this.file.full_path = this.file.path+"/"+this.file.name;

        } else if (this.type===TYPE.IMAGE || this.type===TYPE.XML || this.type===TYPE.WAV) {

            this.parts.name = new SmallPart(position, data);
            position = this.parts.name.ends_at+1;
            this.parts.contents = new SmallPart(position, data);
            position = this.parts.contents.ends_at+1;

            switch (this.type){
                case TYPE.XML:      this.file.name = this.parts.name.toString()+".xml"; break;
                case TYPE.WAV:      this.file.name = this.parts.name.toString()+".wav"; break;
                default:            this.file.name = this.parts.name.toString();
            }
            
            this.file.full_path = this.file.path+"/"+this.file.name;
            this.file.contents = this.parts.contents.toFileBuffer();

        } else {
            console.error('__undef! position: '+position+", type = "+ this.type);
        }

        this.ends_at = position-1;

    }


    saveFile() {
        if (!fs.existsSync(this.file.path)) fs.mkdirSync(this.file.path, { recursive: true });
        fs.writeFileSync(this.file.full_path, this.file.contents);
    }

    toString() {
        return this.parts.contents.toString();
    }

    updateFileName(lang) {
        if (this.type===TYPE.JSON) {
            this.file.name = lang.get(this.json_attr);
            this.file.full_path = this.file.path+"/"+this.file.name;
            //console.log(this.file.name);
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

    _decideJsonSaveLocation(ItemType) {
        switch (ItemType) {
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
            default:  return "/_unclassified";
        }
    }

}