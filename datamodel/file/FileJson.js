import File from './File.js';
import { TYPE } from '../DataModel.js';

export default class FileJson extends File {

    constructor(startFrom, data) {
        super(TYPE.JSON, startFrom, data);
        this.type = TYPE.JSON;
    }

    getFileContents() {
        return new TextDecoder(process.env.ENCODING).decode(this.data)
    }

    getSavePath() {
        let json = JSON.parse(this.getFileContents());
        let subDir = this._decideJsonSaveLocation(json.ItemType);
        let name = typeof(json.Name)!=='undefined' ? json.Name : '';
        name += typeof(json.Id)!=='undefined' ? "_"+json.Id : '';
        if (name==='') name = Date.now();
        
        return process.env.FOLDER_NAME_JSON + subDir + "/" + name + '.json';
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