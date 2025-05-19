import { Request, Response } from "express";
import { CloudinaryUploader } from "../../../infraestructure/adapters/CloudinaryUploader.js";
import { UploadFilesUseCase } from "../../../application/useCases/UploadFilesUseCase.js";

const uploader = new CloudinaryUploader();
const uploadUseCase = new UploadFilesUseCase(uploader);

/** Upload user files to Cloudinary */
export const uploadFilesController = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const results = await uploadUseCase.execute(files);
    
    res.status(200).json({ files: results });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : "Unknown error" });
  }
};

/* flujo pensado (puedo estar equivocado)
1. cada usuario puede subir archivos a Cloudinary, se crea una carpeta para cada usuario con sus archivos (actualmente, todas las imagenes
subidas por los usuarios se almacenan en una unica carpeta llamada Files_collection), se logra pasando su id
- como se obtiene el almacenamiento total de cada usuario que tiene en su carpeta? averiguar esto
2. guardar en una tabla el public_id de cada imagen 
3. en el cliente solicita el public_id de cada archivo/imagen en la base de datos para renderearla.
*/