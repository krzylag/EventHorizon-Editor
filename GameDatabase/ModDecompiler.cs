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
        private FileStream stream;
        private string outFolder;

        public ModDecompiler(FileStream stream, string outFolder)
        {
            this.stream = stream;
            this.outFolder = outFolder;
        }

        public void Decompile()
        {
            try
            {
                FileStream inp = new FileStream("c:\\Users\\klagan\\Desktop\\End.Of.Paradox", FileMode.Open);

                var size = (uint)this.stream.Length - 1;
                byte[] data = new byte[size];
                inp.Read(data, 0, (int)size);

                var decodedData = this.DecodeArray(data);

                var unzippedData = ZlibStream.UncompressBuffer(decodedData);

                //FileStream outp = new FileStream("c:\\Users\\klagan\\Desktop\\End.Of.Paradox.decompiled", FileMode.Create);
                //outp.Write(unzippedData, 0, unzippedData.Length);
                //outp.Close();

            }
            finally
            {
                stream.Close();
            }
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

            if (checksumm != 0)
            {
                return null;
            }
            else
            {
                return result;
            }
        }

        private static uint random(ref uint w, ref uint z)
        {
            z = 36969 * (z & 65535) + (z >> 16);
            w = 18000 * (w & 65535) + (w >> 16);
            return (z << 16) + w;  /* 32-bit result */
        }
    }
}
