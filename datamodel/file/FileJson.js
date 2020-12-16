import fs from 'fs';
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

    getSavePath(namesDictionary) {
        let json = JSON.parse(this.getFileContents());
        let path = process.env.FOLDER_NAME_JSON + this._decideJsonSaveLocation(json) + "/" + this._decideJsonFilename(json, namesDictionary);

        if (fs.existsSync(path+".json")) {
            console.log("Possible name collision at "+path);
            path += Date.now();
        }
        
        return path + '.json';
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
            case 102: return "/Settings";
            case 103: return "/Settings";
            default:  return "/_unclassified";
        }
    }

    _decideJsonFilename(json, namesDictionary) {
        switch (json.ItemType) {
            case 8:     return this._getNameFromDictionary({ ItemType: 6, Id: json.ShipId }, json.Id, json.Id, namesDictionary);
            case 10:    return this._getNameFromDictionary({ ItemType: 1, Id: json.ItemId }, json.Faction, json.Id, namesDictionary);
            case 100:   return "Ships";
            case 101:   return "Galaxy";
            case 102:   return "Database";
            case 103:   return "Exploration";
            default:    return this._getNameFromDictionary({ ItemType: json.ItemType, Id: json.Id }, json.Name, json.Id, namesDictionary);
        }
    }

    _getNameFromDictionary(jsonLookup, defaultName, id, namesDictionary) {
        let buildName = '';
        if (typeof jsonLookup.ItemType!=='undefined' 
                && typeof jsonLookup.Id!=='undefined' 
                && typeof namesDictionary["t"+jsonLookup.ItemType]!=='undefined'
                && typeof namesDictionary["t"+jsonLookup.ItemType]["i"+jsonLookup.Id]!=='undefined'
        ) {
            buildName = namesDictionary["t"+jsonLookup.ItemType]["i"+jsonLookup.Id];
        } else if (typeof(defaultName)!=='undefined' && defaultName!==null) {
            buildName = defaultName.toString().replace("$","");
        }
        if (typeof(id)!=='undefined' && id!==null) buildName += " id_"+id;
        if (buildName==='') buildName = Date.now();
        return buildName.replace(/[^\d]/g,'');
    }

}