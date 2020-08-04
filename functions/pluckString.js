import createUint8Array from "./createUint8Array.js";

export default function pluckString(startsFrom, data) {

    let arr = createUint8Array(startsFrom, data);

    return {
        pointer: startsFrom+4+arr.length,
        value: new TextDecoder(process.env.ENCODING).decode(arr)
    }

}