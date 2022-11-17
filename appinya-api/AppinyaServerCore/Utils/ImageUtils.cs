/**
 *  Appinya Open Source Project
 *  Copyright (C) 2019  Daniel Horta Vidal
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as
 *   published by the Free Software Foundation, either version 3 of the
 *   License, or (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 **/

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

using System.Text.RegularExpressions;
using ImageMagick;

namespace AppinyaServerCore.Utils
{
    public static class ImageUtils
    {

        public static String ConvertirImatgeABase64(byte[] src)
        {
            return Convert.ToBase64String(src);
        }
        public static byte[] ConvertirBase64AImatge(String src)
        {
            return Convert.FromBase64String(src);
        }
        /// <summary>
        /// Redueix la foto que envia l'usuari a un tamany definit pel servei
        /// </summary> 
        /// <param name="source"> foto en base64 que es vol reduir</param>
        /// <returns>Retorna la foto reduida en Base64 preparada per pujar a un IMG </returns>
        public static String ReduirQualitatImatgeBase64(String source, double tamanyMaxim)
        {
            try
            {

                if (source == null || source.Length == 0) return null;
                String fotoResult = "";
                String urlTemp = System.IO.Path.GetTempPath() + Guid.NewGuid().ToString() + ".jpg";
                int quality = 100;
                using (MagickImage fotoBitmap = ImageUtils.CrearImatgeJpg(source, urlTemp))
                {
                    FileInfo f = new FileInfo(urlTemp);
                    quality = (int)(((tamanyMaxim) / f.Length) * 100);

                    if (quality > 100) quality = 100;
                }
                ImageUtils.ReduirQualitatImatgeJpeg(urlTemp, urlTemp, quality);
                fotoResult = ImageUtils.ConvertirImatgeABase64(urlTemp);
                quality -= 5;
                while (quality > 0 && fotoResult.Length > tamanyMaxim)
                {

                    ImageUtils.ReduirQualitatImatgeJpeg(urlTemp, urlTemp, quality);
                    fotoResult = ImageUtils.ConvertirImatgeABase64(urlTemp);
                    quality -= 5;
                }
                if (fotoResult.Length > tamanyMaxim)
                {

                    //      log.Error(" S'ha enviat una foto  size: " + fotoResult.Length);
                    throw new Exception("La foto és massa gran");
                }
                // Esborrar foto
                //f.Delete();
                return fotoResult;
            }
            catch (Exception e)
            {
                // log.Error("Error pujar foto: " + e.Message);
                throw e;
            }
        }

        public static String ConvertirImatgeABase64(MagickImage imatge)
        {


            using (MemoryStream ms = new MemoryStream())
            {
                imatge.Write(ms);
                return Convert.ToBase64String(ms.ToArray());

            }

        }
        public static String ConvertirImatgeABase64(String urlImage)
        {
            using (MagickImage imatge = new MagickImage(urlImage))
            using (MemoryStream ms = new MemoryStream())
            {
                imatge.Write(ms);
                return Convert.ToBase64String(ms.ToArray());

            }

        }


        public static String ReduirImatgeBase64(String srcBase64, int resizeWidth, int resizeHeight, double tamanyMaxim)
        {
            return ReduirImatgeBase64(srcBase64, resizeHeight, resizeHeight, tamanyMaxim, System.IO.Path.GetTempPath() + Guid.NewGuid().ToString());

        }
        public static String ReduirImatgeBase64(String srcBase64, int resizeWidth, int resizeHeight, double tamanyMaxim, String outputFile)
        {
            String urlTemp = outputFile;
            ReduirResolucioImatgeBase64(srcBase64, urlTemp, resizeWidth, resizeHeight);

            FileInfo f = new FileInfo(urlTemp);

            if (tamanyMaxim < f.Length)
            {
                int quality = (int)(((tamanyMaxim) / f.Length) * 100);
                if (quality > 100) quality = 100;
                String urlTemp2 = outputFile.Replace(".jpg", "-qualitat.jpg"); // System.IO.Path.GetTempPath() + Guid.NewGuid().ToString() + "-qualitat.jpg";
                //log.Info(" S'ha enviat una foto  i es reduiex a  " + quality + "%" );
                ReduirQualitatImatgeJpeg(urlTemp, urlTemp2, quality);
                String fotoResult = ConvertirImatgeABase64(urlTemp2);
                f = new FileInfo(urlTemp2);
                if (f.Length > tamanyMaxim)
                {

                    // log.Error(" S'ha enviat una foto  size: " + fotoResult.Length);
                    throw new Exception("La foto és massa gran");
                }
                return fotoResult;

            }
            else
            {
                return ConvertirImatgeABase64(urlTemp);
            }
        }

        /// <summary>
        /// Crear una minimatge de 250x250
        /// </summary>
        /// <param name="srcBase64">Base 64 source</param>
        /// <param name="rutaDesti">URL desti </param>
        public static void CrearMiniImatge(String srcBase64, String rutaDesti)
        {
            ReduirResolucioImatgeBase64(srcBase64, rutaDesti, 250, 250);
        }

        /// <summary>
        /// Redueix la resolucio de la imatge
        /// </summary>
        /// <param name="srcBase64">Origen Base64</param>
        /// <param name="rutaDesti">ruta desti</param>
        /// <param name="resizeWidth">tamany maxim llarg</param>
        /// <param name="ResizeHeight">tamany maxim ample</param>
        public static void ReduirResolucioImatgeBase64(String srcBase64, String rutaDesti, int resizeWidth, int resizeHeight)
        {
            var math = Regex.Match(srcBase64, @"data:image/(?<type>.+?),(?<data>.+)");
            var base64Data = math.Groups["data"].Value;
            if (String.IsNullOrEmpty(base64Data)) base64Data = srcBase64;


            var binDataSource = Convert.FromBase64String(base64Data);

            using (MagickImage img = new MagickImage(binDataSource))
            {
                img.Format = MagickFormat.Jpeg;
                img.Resize(resizeWidth, resizeHeight);
                img.Write(rutaDesti);
            }
        }
        public static void ReduirResolucioImatge(String rutaOrigen, String rutaDesti, int resizeWidth, int resizeHeight)
        {
            using (MagickImage inputPhotoBitmap = new MagickImage(rutaOrigen))
            {

                double aspectRatio = (double)inputPhotoBitmap.Width / inputPhotoBitmap.Height;
                double boxRatio = resizeWidth / resizeHeight;
                double scaleFactor = 0;

                // Calcula la escala per fer Alt i ample de la foto
                if (inputPhotoBitmap.Width < resizeWidth && inputPhotoBitmap.Height < resizeHeight)
                {
                    scaleFactor = 1.0;
                }
                else
                {
                    if (boxRatio > aspectRatio)
                        scaleFactor = resizeHeight / inputPhotoBitmap.Height;
                    else
                        scaleFactor = resizeWidth / inputPhotoBitmap.Width;
                }

                int newWidth = (int)(inputPhotoBitmap.Width * scaleFactor);
                int newHeight = (int)(inputPhotoBitmap.Height * scaleFactor);


                inputPhotoBitmap.Resize(resizeWidth, resizeHeight);

                inputPhotoBitmap.Write(rutaDesti);

            }
        }
        public static MagickImage CrearImatgeJpg(String srcBase64, String ruta)
        {
            if (String.IsNullOrEmpty(srcBase64)) return null;
            var base64Data = Regex.Match(srcBase64, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;

            var binDataSource = ImageUtils.ConvertirBase64AImatge(base64Data);

            using (MagickImage img = new MagickImage(binDataSource))
            {
                img.Format = MagickFormat.Jpeg;
                img.Write(ruta);
                return img;
            }
        }
        public static byte[] CrearImatgeBinary(String srcBase64, int resizeWidth, int resizeHeight)
        {
            if (String.IsNullOrEmpty(srcBase64)) return null;
            var base64Data = Regex.Match(srcBase64, @"data:image/(?<type>.+?),(?<data>.+)").Groups["data"].Value;

            var binDataSource = ImageUtils.ConvertirBase64AImatge(base64Data);

            using (MagickImage img = new MagickImage(binDataSource))
            {
                img.Format = MagickFormat.Jpeg;
                img.Resize(resizeWidth, resizeHeight);
                return img.ToByteArray();
            }
        }
        /// <summary>
        /// Funcio per reduir una foto JPEG
        /// </summary> 
        /// <param name="rutaOrigen"> URL Origen</param>
        /// <param name="rutaDesti"> URL desti </param>
        /// <param name="qualitat">de 1 a 100 el percentatge de qualitat de la imatge</param> 

        public static void ReduirQualitatImatgeJpeg(String rutaOrigen, String rutaDesti, int qualitat)
        {

            if (qualitat < 0 || qualitat > 100)
                throw new ArgumentOutOfRangeException(nameof(qualitat));
            using (MagickImage img = new MagickImage(rutaOrigen))
            {
                img.Format = MagickFormat.Jpeg;
                img.Quality = qualitat;
                img.Write(rutaDesti);
                //log.Info("Se ha grabado al " + qualitat + "% un imagen en " + rutaDesti); 
            }
        }


    }
}
