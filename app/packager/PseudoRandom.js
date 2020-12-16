import uint32 from 'uint32';

const W_SEED = 0x12345678;
const Z_SEED = 0x87654321;

export default class PseudoRandom {

    constructor(size) {
        this.count = -1;
        this.w = uint32.xor(W_SEED, size);
        this.z = uint32.xor(Z_SEED, size);
    }

    get() {
        this.count++;
        this.z = 36969 * uint32.and(this.z, 65535) + uint32.shiftRight(this.z, 16);
        this.w = 18000 * uint32.and(this.w, 65535) + uint32.shiftRight(this.w, 16);
        return uint32.shiftLeft(this.z, 16) + this.w;  /* 32-bit result */
    }

}
