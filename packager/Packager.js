import uint32 from 'uint32';
import zlib from 'zlib';
import PseudoRandom from './PseudoRandom.js';

export default class Packager {

    static unpack(fileData) {

        let fileSize = fileData.length-1;
        let PR = new PseudoRandom(fileSize);

        let unshiftedData = new Uint8Array(fileSize);
        for (let i=0; i<fileSize; i++) {
            unshiftedData[i] = uint32.xor(fileData[i], uint32.and(PR.get(), 0xFF));
        }
        return zlib.inflateSync(unshiftedData);
        
    }

    
}