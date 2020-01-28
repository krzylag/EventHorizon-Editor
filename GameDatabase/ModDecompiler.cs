using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Ionic.Zlib;

namespace GameDatabase
{
    class ModDecompiler
    {
        private string modFilename;
        private string outFolder;
        
        public enum AnalyzeAction : byte
        {
            None = 0,
            Type = 1,
            ItemSize = 2,
            ItemContents = 3
        }

        public ModDecompiler(string modFilename, string outFolder)
        {
            this.modFilename = modFilename;
            this.outFolder = outFolder;
        }

        public void Decompile()
        {
            try
            {

                FileStream dec = new FileStream("c:\\Users\\klagan\\Desktop\\CGL.dec.bin", FileMode.Open);
                FileStream enc = File.Create("c:\\Users\\klagan\\Desktop\\CGL.enc.bin");
                var rawdata = new byte[dec.Length];
                dec.Read(rawdata, 0, (int)dec.Length);
                var data = ZlibStream.CompressBuffer(rawdata.ToArray());

                var size = (uint)data.Length;
                byte checksumm = 0;
                uint w = 0x12345678 ^ size;
                uint z = 0x87654321 ^ size;
                for (int i = 0; i < size; ++i)
                {
                    checksumm += data[i];
                    data[i] = (byte)(data[i] ^ (byte)random(ref w, ref z));
                }

                enc.Write(data, 0, data.Length);
                enc.WriteByte((byte)(checksumm ^ (byte)random(ref w, ref z)));
                enc.Close();
                return;

                /*
                FileStream stream = new FileStream(this.modFilename, FileMode.Open);

                var size = (uint)stream.Length;
                byte[] data = new byte[size];
                stream.Read(data, 0, (int)size);

                var decodedData = this.DecodeArray(data);

                if (decodedData != null)
                {
                    var unzippedData = ZlibStream.UncompressBuffer(decodedData.ToArray());

                    //FileStream dec = File.Create("c:\\Users\\klagan\\Desktop\\CGL.dec.bin");
                    //dec.Write(unzippedData, 0, unzippedData.Length);
                    //dec.Close();
                    //return;


                    List<ModDecompilerFile> files = new List<ModDecompilerFile>();

                    uint position = 0;

                    byte[] modName = PluckNextPart(unzippedData, position);
                    position += (uint)(modName.Length + 4);
                    byte[] modGuid = PluckNextPart(unzippedData, position);
                    position += (uint)(modGuid.Length + 4);

                    while (position < size)
                    {
                        byte fileType = unzippedData[position];
                        position++;
                        switch (fileType)
                        {
                            case (byte)ModBuilder.FileType.Data:
                                byte[] contentsData = PluckNextPart(unzippedData, position);
                                position += (uint)contentsData.Length + 4;
                                files.Add(new ModDecompilerFile(fileType, null, contentsData));
                                break;
                            case (byte)ModBuilder.FileType.Image:
                                byte[] nameImage = PluckNextPart(unzippedData, position);
                                position += (uint)nameImage.Length+4;
                                byte[] contentsImage = PluckNextPart(unzippedData, position);
                                position += (uint)contentsImage.Length + 4;
                                files.Add(new ModDecompilerFile(fileType, nameImage, contentsImage));
                                break;
                            case (byte)ModBuilder.FileType.Localization:
                                byte[] nameLoc = PluckNextPart(unzippedData, position);
                                position += (uint)nameLoc.Length + 4;
                                byte[] contentsLoc = PluckNextPart(unzippedData, position);
                                position += (uint)contentsLoc.Length + 4;
                                files.Add(new ModDecompilerFile(fileType, nameLoc, contentsLoc));
                                break;
                            case (byte)ModBuilder.FileType.WaveAudio:
                                byte[] nameWav = PluckNextPart(unzippedData, position);
                                position += (uint)nameWav.Length + 4;
                                byte[] contentsWav = PluckNextPart(unzippedData, position);
                                position += (uint)contentsWav.Length + 4;
                                files.Add(new ModDecompilerFile(fileType, nameWav, contentsWav));
                                break;
                            default:
                                break;
                        }


                        files.Last().saveFile(outFolder);
                    }

                    File.AppendAllText(outFolder + "\\id", modName + Environment.NewLine + modGuid);

                }
                */

            }
            finally
            {

            }
        }

        private byte[] PluckNextPart(byte[] data, uint startFrom)
        {
            byte[] bytes = { data[startFrom], data[startFrom+1], data[startFrom+2], data[startFrom+3] };
            if (BitConverter.IsLittleEndian) Array.Reverse(bytes.ToArray());
            var itemSize = BitConverter.ToUInt32(bytes.ToArray(), 0);
            return data.Skip((int)startFrom+4).Take((int)itemSize).ToArray();
        }

        private byte[] DecodeArray(byte[] data)
        {
            if ((uint)data.Length <= 1) return null;
            var size = ((uint)data.Length - 1);

            byte[] result = new byte[size];
            byte checksumm = 0;

            uint w = 0x12345678 ^ size;
            uint z = 0x87654321 ^ size;

            for (int i = 0; i < size; ++i)
            {
                result[i] = (byte)(data[i] ^ (byte)random(ref w, ref z));
                checksumm += result[i];
            }

            checksumm = (byte)(checksumm ^ (byte)random(ref w, ref z));

            return result;
            
        }

        private static uint random(ref uint w, ref uint z)
        {
            z = 36969 * (z & 65535) + (z >> 16);
            w = 18000 * (w & 65535) + (w >> 16);
            return (z << 16) + w;  /* 32-bit result */
        }
    }
}
