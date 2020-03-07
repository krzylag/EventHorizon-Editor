import PseudoRandom from './classes/PseudoRandom.js';
import SmallPart from './classes/SmallPart.js';
import fs from 'fs';
import uint32 from 'uint32';
import zlib from 'zlib';
import xml2json from 'xml2json';
import Lang from './classes/Lang.js';
import BigPart from './classes/BigPart.js';
import { TYPE } from './classes/BigPart.js';

export const SOURCE_FILE = "../CGL_Mod_01.bin";
export const DECOMPRESS_PATH_ROOT = "../output";

let fileData = fs.readFileSync(SOURCE_FILE);
let fileSize = fileData.length - 1;

var PR = new PseudoRandom(fileSize);

let unshiftedData = new Uint8Array(fileSize);

console.log("fileSize: "+fileSize);

for (let i=0; i<fileSize; i++) {
    unshiftedData[i] = uint32.xor(fileData[i], uint32.and(PR.get(), 0xFF));
}

let deflatedData = zlib.inflateSync(unshiftedData);
fileSize = deflatedData.length;

let mod_name = new SmallPart(0, deflatedData);
let mod_guid = new SmallPart(mod_name.ends_at+1, deflatedData);

let big_parts = [];
let position = mod_guid.ends_at+1;
let index = 0;
let indexWithTranslations = null;
while (position < fileSize-1) {
    big_parts[index]=new BigPart(position, deflatedData);
    if (big_parts[index].type===TYPE.XML && big_parts[index].file.name==="English.xml") {
        indexWithTranslations=index;
        // console.log("translations index: "+index+", name: ["+big_parts[index].file.name+"]");
    }
    position = big_parts[index].ends_at+1;
    index++;
}


if (indexWithTranslations!==null) {
    let lang = new Lang(
        JSON.parse(
            xml2json.toJson(
                big_parts[indexWithTranslations].toString()
            )
        )
    );
    console.log("strings size: "+lang.strings.length);

    for (let key in big_parts) {
        if (big_parts[key].type===TYPE.JSON) {
            big_parts[key].updateFileName(lang);
        }
    }
}

for (let i in big_parts) {
    big_parts[i].saveFile();
}
fs.writeFileSync(DECOMPRESS_PATH_ROOT+"/id", mod_name.toString()+"\n"+mod_guid.toString());

console.log("name: "+mod_name.toString()+"; guid: "+mod_guid.toString());
