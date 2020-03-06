import PseudoRandom from './classes/PseudoRandom.js';
import SmallPart from './classes/SmallPart.js';
import fs from 'fs';
import uint32 from 'uint32';
import zlib from 'zlib';
import BigPart from './classes/BigPart.js';


export const DECOMPRESS_PATH_ROOT = "../RESULT";
const SOURCE_FILE = '../CGL.enc.02.bin';

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
while (position < fileSize-1) {
    big_parts[index]=new BigPart(position, deflatedData)
    big_parts[index].saveFile();
    position = big_parts[index].ends_at+1;
    index++;
}

fs.writeFileSync(DECOMPRESS_PATH_ROOT+"/id", mod_name.toString()+"\n"+mod_guid.toString());

console.log(mod_name.toString());
console.log(mod_guid.toString());