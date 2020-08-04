import uint32 from 'uint32';

export default function createInt32(index, data) {
    return uint32.fromBytesBigEndian(
        data[index+3],
        data[index+2],
        data[index+1],
        data[index]
    );
}
