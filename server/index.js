import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";
import uploadRoutes from "./routes/uploadRoute.js";
import dbConnection from "./utils/connectDB.js";
import fs from 'fs';

dotenv.config();

dbConnection();

const port = process.env.PORT || 5000;

const app = express();

// Obtenir le __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer les dossiers d'uploads s'ils n'existent pas
const uploadsDir = path.join(__dirname, '../uploads');
const imagesDir = path.join(uploadsDir, 'images');

if (!fs.existsSync(uploadsDir)) {
  console.log('Création du dossier uploads:', uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(imagesDir)) {
  console.log('Création du dossier images:', imagesDir);
  fs.mkdirSync(imagesDir, { recursive: true });
}

// IMPORTANT : Configurer le middleware pour servir les fichiers statiques
// Cela doit être fait AVANT de définir les routes API
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log('Dossier statique configuré:', path.join(__dirname, '../uploads'));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

// Ajouter la route d'upload après les autres routes
app.use("/api/upload", uploadRoutes);

// Ajoutez après les configurations de routes
app.get('/test-uploads', (req, res) => {
  const uploadDir = path.join(__dirname, '../uploads/images');
  
  // Vérifier si le dossier existe
  if (fs.existsSync(uploadDir)) {
    // Lire les fichiers du dossier
    const files = fs.readdirSync(uploadDir);
    res.json({
      success: true,
      uploadDirExists: true,
      uploadDirPath: uploadDir,
      files: files,
      urls: files.map(file => `/uploads/images/${file}`)
    });
  } else {
    res.json({
      success: false,
      message: "Le dossier d'uploads n'existe pas",
      uploadDirPath: uploadDir
    });
  }
});

app.use(routeNotFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on ${port}`));
