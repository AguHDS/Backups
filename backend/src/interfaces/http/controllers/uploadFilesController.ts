import { RequestHandler } from "express";
import { cloudinary } from "../../../services/cloudinary.js";
import streamifier from "streamifier";

interface FileData {
  url: string;
  public_id: string;
}

interface FileResponse {
  files: FileData[];
}

const uploadToCloudinary: RequestHandler<{}, FileResponse | { message: string } > = async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    const uploadPromise = files.map((file) => {
      return new Promise<FileData>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "Files_collection" },
          (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
          }
        );

        //send data to Cloudinary first transforming multer's buffer to stream
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const results = await Promise.all(uploadPromise);
    console.log(results);
    res.status(200).json({ files: results });
    return;
  } catch (error) {
    console.error("Cloudinary Upload Error: ", error);
    res.status(500).json({ message: "Error uploading files to Cloudinary" });
    return;
  }
};

export default uploadToCloudinary;

/* flujo pensado (puedo estar equivocado)
1. cada usuario puede subir archivos a Cloudinary, se crea una carpeta para cada usuario con sus archivos, se logra pasando su id
- como se obtiene el almacenamiento total de cada usuario que tiene en su carpeta? averiguar esto
2. guardar en una tabla el public_id de cada imagen 
3. en el cliente solicita el public_id de cada archivo/imagen en la base de datos para renderearla.
*/