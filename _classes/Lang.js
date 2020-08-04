export default class Lang {

    constructor(json) {
        this.strings = json.resources.string;
    }

    get(whatJson) {
        if (whatJson.name!==null && whatJson.name!=='') {
            
        
            let result = whatJson.name.replace('$','');
            for (let key in this.strings) {
                if (this.strings[key]['name']==result) {
                    // result = this.strings[key]['$t'].replace(/[^a-zA-Z0-9_-\/]/, "_")+"_"+whatJson.id+".json";
                    result = this.strings[key]['$t']+"_"+whatJson.id;
                    break;
                }
            }
            return result+".json";

        } else {
            return null;
        }
    }
}