import createInt32 from './createInt32.js';

export default function createUint8Array(startsFrom, data) {

    let size = createInt32(startsFrom, data);
    let dataPart = new Uint8Array(size);
    
    let index=0;
    for (let i=startsFrom+4; i<startsFrom+4+size; i++) {
        dataPart[index] = data[i];
        index++;
    }

    return dataPart;

}