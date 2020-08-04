import { createInt32 } from '../functions/create_int.js';

export default class SmallPart {

    constructor(from, data) {

        this.size = createInt32(from, data);
        this.data = new Uint8Array(this.size);
        this.starts_at = from;
        this.ends_at = this.starts_at + this.size + 4 - 1;

        let index = 0;
        for (let i=this.starts_at+4; i<this.starts_at+4+this.size; i++) {
            this.data[index] = data[i];
            index++;
        }
        
        //console.log("small part length: "+this.data.length+", starts at: "+this.starts_at.toString(16)+", ends at: "+this.ends_at.toString(16));
    }

    toString() {
        let result = '';
        for (var i in this.data) {
            result += String.fromCharCode(this.data[i]);
        }
        return result;
    }

    toFileBuffer() {
        return this.data;
    }


}