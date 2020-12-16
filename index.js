import fs from 'fs';
import Packager from './app/packager/Packager.js'
import DataModel from './app/datamodel/DataModel.js'

export const FOLDER_INPUT = './INPUT'
export const FOLDER_OUTPUT = './OUTPUT'
export const ENCODING = 'utf-8'

if (!fs.existsSync(FOLDER_INPUT)) {
    fs.mkdirSync(FOLDER_INPUT);
}
if (fs.existsSync(FOLDER_OUTPUT)) {
    fs.rmdirSync(FOLDER_OUTPUT, { recursive: true });
}
fs.mkdirSync(FOLDER_OUTPUT);


for (let fname of fs.readdirSync(FOLDER_INPUT)) {

    if (fname === '.gitkeep') continue

    const unpacked = Packager.unpack(
        fs.readFileSync("./"+FOLDER_INPUT+"/"+fname)
    )
    let model = new DataModel(unpacked)

    model.save(FOLDER_OUTPUT)

}
