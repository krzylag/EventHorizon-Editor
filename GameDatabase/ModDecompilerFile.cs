using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace GameDatabase
{

    class ModDecompilerFile
    {

        private byte fileType;
        private string name;
        private byte[] data;
        private string folderName;

        public ModDecompilerFile (byte fileType, byte[] nameBytes, byte[] dataBytes)
        {
            this.fileType = fileType;
            this.data = dataBytes;
            switch (this.fileType)
            {
                case (byte)ModBuilder.FileType.Data: this.folderName = "json"; break;
                case (byte)ModBuilder.FileType.Image: this.folderName = "image"; break;
                case (byte)ModBuilder.FileType.Localization: this.folderName = "xml"; break;
                case (byte)ModBuilder.FileType.WaveAudio: this.folderName = "sound"; break;
                default: this.folderName = "other"; break;
            }
            if (nameBytes!=null && nameBytes.Length>0) 
            {
                this.name = Encoding.UTF8.GetString(nameBytes, 0, nameBytes.Length);
            } 
            else
            {
                string raw = Encoding.UTF8.GetString(dataBytes, 0, dataBytes.Length);
                var ob = JsonConvert.DeserializeObject<dynamic>(raw);
                
                try
                {
                    var id = ob.Id;
                    this.name = id + ".json";
                }
                catch
                {
                    Guid guid = Guid.NewGuid();
                    this.name = guid + ".json";
                }

                switch ((string)ob.ItemType)
                {
                    case "1": this.folderName += "\\Component"; break;
                    case "2": this.folderName += "\\Device"; break;
                    case "3": this.folderName += "\\Weapon"; break;
                    case "4": this.folderName += "\\Ammunition\\Obsolete"; break;
                    case "5": this.folderName += "\\Dronebay"; break;
                    case "6": this.folderName += "\\Ship"; break;
                    case "7": this.folderName += "\\Satellite"; break;
                    case "8": this.folderName += "\\Ship\\Builds"; break;
                    case "9": this.folderName += "\\Satellite\\Builds"; break;
                    case "10": this.folderName += "\\Technology"; break;
                    case "11": this.folderName += "\\Component\\Stats"; break;
                    case "12": this.folderName += "\\Component\\Modifications"; break;
                    case "14": this.folderName += "\\Faction"; break;
                    case "15": this.folderName += "\\Quests"; break;
                    case "16": this.folderName += "\\Quests\\Loot"; break;
                    case "18": this.folderName += "\\Quests\\Fleets"; break;
                    case "19": this.folderName += "\\Quests\\Characters"; break;
                    case "20": this.folderName += "\\Quests\\Items"; break;
                    case "25": this.folderName += "\\Ammunition"; break;
                    case "26": this.folderName += "\\Ammunition\\Effects"; break;
                    case "27": this.folderName += "\\Ammunition\\Bullets"; break;
                    case "100": this.folderName += "\\Settings"; break;
                    case "101": this.folderName += "\\Settings"; break;
                    default: this.folderName += "\\_unclassified"; break;
                }
            }
            
        }

        public void saveFile(string outFolder)
        {
            string folder = checkFolder(outFolder);
            if (folder!=null)
            {
                FileStream outp = new FileStream(folder + "\\"+this.name, FileMode.Create);
                outp.Write(this.data, 0, this.data.Length);
                outp.Close();
            }
        }

        private string checkFolder(string path)
        {
            if (this.folderName!=null)
            {
                Directory.CreateDirectory(path + "\\" + this.folderName);
                return path + "\\" + this.folderName;
            } else
            {
                return null;
            }
        }

        public string toString()
        {
            return this.name;
        }
    }
}
