import dotenv from 'dotenv';
import fs from 'fs';
import Packager from './packager/Packager.js';
import DataModel from './datamodel/DataModel.js';

dotenv.config();

if (fs.existsSync(process.env.FOLDER_OUTPUT)) {
    fs.rmdirSync(process.env.FOLDER_OUTPUT, { recursive: true });
}
if (!fs.existsSync(process.env.FOLDER_OUTPUT)) {
    fs.mkdirSync(process.env.FOLDER_OUTPUT);
}

for (let fname of fs.readdirSync(process.env.FOLDER_INPUT)) {
    if (fname !== '.gitkeep') {

        let unpacked = Packager.unpack(fs.readFileSync("./"+process.env.FOLDER_INPUT+"/"+fname));

        fs.writeFileSync("./"+process.env.FOLDER_OUTPUT+"/"+fname+".dec", unpacked);

        let model = new DataModel(unpacked);

        for (let idx in model.files) {
            model.files[idx].save("./"+process.env.FOLDER_OUTPUT+"/"+model.mod_name);
        }

        // fs.writeFileSync("./"+process.env.FOLDER_OUTPUT+"/"+model.mod_name+"/id", model.mod_name+"\n"+model.mod_guid)

        console.log({
            name: model.mod_name,
            guid: model.mod_guid,
            files: model.files.length
        })
    }
}
