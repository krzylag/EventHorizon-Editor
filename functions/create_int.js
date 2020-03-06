import uint32 from 'uint32';

export var createInt32 = function(index, data) {
    return uint32.fromBytesBigEndian(
        data[index+3],
        data[index+2],
        data[index+1],
        data[index]
    );
}
