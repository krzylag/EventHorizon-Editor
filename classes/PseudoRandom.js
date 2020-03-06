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

// size:18514693
// initial  => w: 321836413, z: 2256519204
// iter:0 => w: 321836413, z: 2256519204
//     old w:321836413, old z:2256519204
//     new w:983758910, new z:1818465603
// iter:1 => w: 983758910, z: 1818465603
//     old w:983758910, old z:1818465603
//     new w:1143915010, new z:1412650206
// iter:2 => w: 1143915010, z: 1412650206
//     old w:1143915010, old z:1412650206
//     new w:894005454, new z:803210049
// iter:3 => w: 894005454, z: 803210049
//     old w:894005454, old z:803210049
//     new w:519817641, new z:30807433
// iter:4 => w: 519817641, z: 30807433
//     old w:519817641, old z:30807433
//     new w:929257931, new z:203810567
// iter:5 => w: 929257931, z: 203810567
//     old w:929257931, old z:203810567
//     new w:413780179, new z:2186460676
