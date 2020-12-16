import { ENCODING } from "../../index.js";

export default function arrayToString(arr) {
    return new TextDecoder(ENCODING).decode(arr)
}