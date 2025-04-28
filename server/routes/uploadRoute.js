import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { protectRoute } from "../middleware/authMiddleware.js";
import PV from "../models/pvModel.js";

const router = express.Router();

// Obtenir le __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assurer que le dossier d'upload existe
const uploadDir = path.join(__dirname, "../../uploads/images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({ storage });

// Route pour uploader des images à un PV existant
router.post("/pv-images", protectRoute, upload.array("images", 10), async (req, res) => {
  try {
    const { pvId } = req.body;
    
    if (!pvId) {
      return res.status(400).json({
        success: false,
        message: "ID du PV manquant"
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Aucune image n'a été téléchargée" 
      });
    }

    // Rechercher le PV
    const pv = await PV.findById(pvId);
    
    if (!pv) {
      return res.status(404).json({
        success: false,
        message: "PV non trouvé"
      });
    }
    
    // Vérifier que c'est un PV de surveillance
    if (pv.type !== "surveillance") {
      return res.status(400).json({
        success: false,
        message: "Les images ne peuvent être ajoutées qu'aux PV de surveillance"
      });
    }

    // Générer les URLs des images
    const imageUrls = req.files.map(file => `/uploads/images/${file.filename}`);

    // Ajouter les nouvelles images au tableau existant
    if (!pv.surveillance) {
      pv.surveillance = { Constation: "", images: [] };
    } else if (!pv.surveillance.images) {
      pv.surveillance.images = [];
    }
    
    pv.surveillance.images = [...pv.surveillance.images, ...imageUrls];
    await pv.save();

    res.status(200).json({
      success: true,
      message: "Images ajoutées avec succès au PV",
      imageUrls
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout des images au PV:", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'ajout des images au PV: " + error.message 
    });
  }
});

// Route pour supprimer une image d'un PV
router.delete("/delete-image", protectRoute, async (req, res) => {
  try {
    const { pvId, imageUrl } = req.body;
    
    if (!pvId || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "ID du PV et URL de l'image requis"
      });
    }
    
    // Rechercher le PV
    const pv = await PV.findById(pvId);
    
    if (!pv) {
      return res.status(404).json({
        success: false,
        message: "PV non trouvé"
      });
    }
    
    // Vérifier que c'est un PV de surveillance avec des images
    if (pv.type !== "surveillance" || !pv.surveillance?.images || !pv.surveillance.images.includes(imageUrl)) {
      return res.status(400).json({
        success: false,
        message: "Image non trouvée dans le PV"
      });
    }
    
    // Extraire le nom du fichier de l'URL
    const fileName = imageUrl.split('/').pop();
    const filePath = path.join(process.cwd(), 'uploads', 'images', fileName);
    
    // Supprimer le fichier physique
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    // Supprimer l'URL de l'image du tableau
    pv.surveillance.images = pv.surveillance.images.filter(img => img !== imageUrl);
    await pv.save();
    
    res.status(200).json({
      success: true,
      message: "Image supprimée avec succès"
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de l'image"
    });
  }
});

// Route pour tester l'accès aux fichiers (utile pour le débogage)
router.get('/test-uploads', (req, res) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads/images');
    
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      res.json({ 
        success: true, 
        files,
        uploadDir
      });
    } else {
      res.json({ 
        success: false, 
        message: 'Le dossier uploads n\'existe pas',
        uploadDir 
      });
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du dossier uploads:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la lecture du dossier uploads', 
      error: error.message
    });
  }
});

export default router;