import uint32 from 'uint32'
import arrayToString from './arrayToString.js'
import File from './File.js'
import { TYPE } from './File.js'

export default function deserialize(data) {

    const modName = getSmallPart(0, data)
    const modGuid = getSmallPart(modName.next, data)

    let pointer = modGuid.next
    const files = []
    while (pointer < data.length-1) {
        const type = data[pointer]
        pointer++

        switch(type) {
            case TYPE.JSON:
                const part1a = getSmallPart(pointer, data)
                pointer = part1a.next
                files.push(new File(type, [ part1a ]))
                break;
            case TYPE.IMAGE:
                const part1b = getSmallPart(pointer, data)
                pointer = part1b.next
                const part2b = getSmallPart(pointer, data)
                pointer = part2b.next
                files.push(new File(type, [ part1b, part2b ]))
                break;
            case TYPE.XML:
                const part1c = getSmallPart(pointer, data)
                pointer = part1c.next
                const part2c = getSmallPart(pointer, data)
                pointer = part2c.next
                files.push(new File(type, [ part1c, part2c ]))
                break;
            case TYPE.WAV:
                const part1d = getSmallPart(pointer, data)
                pointer = part1d.next
                const part2d = getSmallPart(pointer, data)
                pointer = part2d.next
                files.push(new File(type, [ part1d, part2d ]))
                break;
            default:
                console.error(`Unknown file type at position ${pointer} (${pointer.toString(16)}h) !`)
        }
    }

    return {
        name: arrayToString(modName.data),
        guid: arrayToString(modGuid.data),
        files: files
    }
}

function getSmallPart(from, data) {
    const bytesCount = uint32.fromBytesBigEndian(data[from+3], data[from+2], data[from+1], data[from])
    return {
        data: data.slice(from+4, from+4+bytesCount),
        size: bytesCount,
        next: from+4+bytesCount
    }
}
