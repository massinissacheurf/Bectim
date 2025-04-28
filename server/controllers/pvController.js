import asyncHandler from "express-async-handler";
import PV from "../models/pvModel.js";
import Task from "../models/taskModel.js";

// Créer un nouveau PV
const createPV = asyncHandler(async (req, res) => {
  try {
    const { data } = req.body;
    const { taskId } = req.params;
    const { userId } = req.user;

    // Vérifier si la tâche existe
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        status: false,
        message: "Tâche non trouvée",
      });
    }

    // Créer un nouveau PV
    const newPV = new PV({
      taskId,
      type: data.type,
      numBL: data.numBL,
      importateur: data.importateur,
      numTC: data.numTC,
      numScelle: data.numScelle,
      nbColis: data.nbColis,
      navire: data.navire,
      portChargement: data.portChargement,
      portDechargement: data.portDechargement,
      grosArticle: data.grosArticle,
      createdBy: userId,
    });

    if (data.type === "surveillance") {
      newPV.numFacture = data.numFacture;
      newPV.dateIntervention = data.dateIntervention || new Date();
      newPV.transitaire = data.transitaire;
      newPV.lieuIntervention = data.lieuIntervention;
      newPV.dateArrivee = data.dateArrivee || new Date();
      newPV.natureMarchandise = data.natureMarchandise;
      newPV.surveillance = {
        Constation: data.surveillance?.Constation || data.constatations || "",
      };
    } else if (data.type === "depotage") {
      // Pour le dépotage, on peut utiliser lieuDepotage ou lieuIntervention
      newPV.lieuIntervention = data.lieuDepotage || data.lieuIntervention || "";
      newPV.dateArrivee = data.dateArrivee || new Date();

      // Initialiser l'objet depotage avec les valeurs fournies
      newPV.depotage = {
        numCde: data.depotage?.numCde,
        lieuDepotage: data.lieuDepotage || "",
        observations: data.depotage?.observations || "",
        produit: data.depotage?.produit || "",
        nuance: data.depotage?.nuance || "",
        quantite: Number(data.depotage?.quantite) || 0,
        lot: [],
        conteneur: [],
      };

      // Ajouter les lots s'ils existent
      if (data.depotage?.lot && Array.isArray(data.depotage.lot)) {
        newPV.depotage.lot = data.depotage.lot.map((lot) => ({
          numLot: lot.numLot || "",
          bonEtat: Number(lot.bonEtat) || 0,
          manquant: Number(lot.manquant) || 0,
          avarie: Number(lot.avarie) || 0,
        }));
      }

      // Ajouter le conteneur
      if (data.numTC) {
        newPV.depotage.conteneur.push({
          numConteneur: data.numTC,
          numScelle: data.numScelle,
          quantite: Number(data.depotage?.quantite) || 0,
          nuance: data.depotage?.nuance || "",
          conforme: true,
        });
      }
    }

    // Sauvegarder le PV
    const savedPV = await newPV.save();

    console.log("PV sauvegardé:", {
      id: savedPV._id,
      type: savedPV.type,
      numPvSurveillance: savedPV.numPvSurveillance,
      numPvDepotage: savedPV.numPvDepotage,
    });

    // Mettre à jour la tâche avec la référence au PV
    task.pvs = task.pvs || [];
    task.pvs.push(savedPV._id);

    let pvNumberInfo = "";
    if (savedPV.type === "surveillance" && savedPV.numPvSurveillance) {
      pvNumberInfo = `SURV-${savedPV.numPvSurveillance
        .toString()
        .padStart(3, "0")}`;
    } else if (savedPV.type === "depotage" && savedPV.numPvDepotage) {
      pvNumberInfo = `DEPO-${savedPV.numPvDepotage
        .toString()
        .padStart(3, "0")}`;
    }

    // Ajouter une activité
    task.activities.push({
      type: "commented",
      activity: `a créé un PV de ${
        data.type === "surveillance" ? "surveillance" : "dépotage"
      }`,
      by: userId,
      date: new Date(),
    });

    await task.save();

    res.status(201).json({
      status: true,
      message: `PV de ${data.type} créé avec succès`,
      pv: savedPV,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Récupérer tous les PVs d'une tâche
const getPVsByTask = asyncHandler(async (req, res) => {
  try {
    const { taskId } = req.params;

    const pvs = await PV.find({ taskId })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      pvs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Récupérer un PV par son ID
const getPVById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const pv = await PV.findById(id).populate("createdBy", "name email");

    if (!pv) {
      return res.status(404).json({
        status: false,
        message: "PV non trouvé",
      });
    }

    res.status(200).json({
      status: true,
      pv,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Mettre à jour un PV
const updatePV = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const { userId } = req.user;

    // Trouver le PV
    const pv = await PV.findById(id);
    if (!pv) {
      return res.status(404).json({
        status: false,
        message: "PV non trouvé",
      });
    }

    // Mettre à jour les champs de base
    pv.numBL = data.numBL;
    if (pv.type === "surveillance") {
      pv.numFacture = data.numFacture;
      pv.dateIntervention = data.dateIntervention;
      pv.transitaire = data.transitaire;
      pv.natureMarchandise = data.natureMarchandise;
      pv.lieuIntervention = data.lieuIntervention;
    }

    pv.importateur = data.importateur;
    pv.numTC = data.numTC;
    pv.numScelle = data.numScelle;
    pv.nbColis = data.nbColis;
    pv.dateArrivee = data.dateArrivee;
    pv.navire = data.navire;
    pv.portChargement = data.portChargement;
    pv.portDechargement = data.portDechargement;
    pv.grosArticle = data.grosArticle;

    // Mettre à jour les champs spécifiques selon le type de PV
    if (pv.type === "surveillance" && data.surveillance) {
      pv.surveillance = {
        Constation: data.surveillance.Constation || "",
      };
    } else if (pv.type === "depotage" && data.depotage) {
      // Mettre à jour les champs de dépotage
      pv.depotage = {
        numCde: data.depotage.numCde || pv.depotage?.numCde,
        lieuDepotage:
          data.depotage.lieuDepotage || pv.depotage?.lieuDepotage || "",
        observations:
          data.depotage.observations || pv.depotage?.observations || "",
        produit: data.depotage.produit || pv.depotage?.produit || "",
        nuance: data.depotage.nuance || pv.depotage?.nuance || "",
        quantite: Number(data.depotage.quantite) || pv.depotage?.quantite || 0,
        lot: [], // Initialiser un tableau vide
        conteneur: pv.depotage?.conteneur || [],
      };

      // Ajouter les lots s'ils existent
      if (data.depotage.lot && Array.isArray(data.depotage.lot)) {
        pv.depotage.lot = data.depotage.lot.map((lot) => ({
          numLot: lot.numLot || "",
          bonEtat: Number(lot.bonEtat) || 0,
          manquant: Number(lot.manquant) || 0,
          avarie: Number(lot.avarie) || 0,
        }));
      }

      if (pv.depotage.conteneur.length === 0 && data.numTC) {
        pv.depotage.conteneur.push({
          numConteneur: data.numTC,
          numScelle: data.numScelle,
          quantite: Number(data.depotage.quantite) || 0,
          nuance: data.depotage.nuance || "",
          conforme: true,
        });
      } else if (pv.depotage.conteneur.length > 0) {
        // Mettre à jour le premier conteneur
        pv.depotage.conteneur[0].numConteneur = data.numTC;
        pv.depotage.conteneur[0].numScelle = data.numScelle;
        pv.depotage.conteneur[0].quantite = Number(data.depotage.quantite) || 0;
        pv.depotage.conteneur[0].nuance = data.depotage.nuance || "";
      }
    }

    // Sauvegarder les modifications
    const updatedPV = await pv.save();

    const task = await Task.findById(pv.taskId);
    if (task) {
      // Déterminer le bon numéro à utiliser selon le type
      const pvNumber =
        pv.type === "surveillance"
          ? `SURV-${pv.numPvSurveillance}`
          : `DEPO-${pv.numPvDepotage}`;

      task.activities.push({
        type: "commented",
        activity: `a mis à jour le PV: ${pvNumber}`,
        by: userId,
        date: new Date(),
      });
      await task.save();
    }

    res.status(200).json({
      status: true,
      message: "PV mis à jour avec succès",
      pv: updatedPV,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Compléter un PV
const completePV = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted } = req.body;
    const { userId } = req.user;

    const pv = await PV.findById(id);
    if (!pv) {
      return res.status(404).json({
        status: false,
        message: "PV non trouvé",
      });
    }

    pv.isCompleted = isCompleted;
    await pv.save();

    // Ajouter une activité
    const task = await Task.findById(pv.taskId);
    if (task) {
      // Déterminer le bon numéro à utiliser selon le type
      const pvNumber =
        pv.type === "surveillance"
          ? `SURV-${pv.numPvSurveillance}`
          : `DEPO-${pv.numPvDepotage}`;

      task.activities.push({
        type: "commented",
        activity: `a marqué le PV ${pvNumber} comme ${
          isCompleted ? "terminé" : "non terminé"
        }`,
        by: userId,
        date: new Date(),
      });
      await task.save();
    }

    res.status(200).json({
      status: true,
      message: isCompleted
        ? "PV marqué comme terminé"
        : "PV marqué comme non terminé",
      isCompleted,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

// Supprimer un PV
const deletePV = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Rechercher le PV à supprimer
    const pv = await PV.findById(id);
    if (!pv) {
      return res.status(404).json({
        status: false,
        message: "PV non trouvé",
      });
    }

    // Mettre à jour la tâche pour supprimer la référence au PV
    await Task.findByIdAndUpdate(pv.taskId, { $pull: { pvs: id } });

    await Task.findByIdAndUpdate(pv.taskId, { $pull: { pvs: id } });

    // Ajouter une activité pour tracer la suppression
    const task = await Task.findById(pv.taskId);
    if (task) {
      // Déterminer le bon numéro à utiliser selon le type
      const pvNumber =
        pv.type === "surveillance"
          ? `SURV-${pv.numPvSurveillance?.toString().padStart(3, "0")}`
          : `DEPO-${pv.numPvDepotage?.toString().padStart(3, "0")}`;

      task.activities.push({
        type: "commented",
        activity: `a supprimé le PV ${pvNumber}`,
        by: userId,
        date: new Date(),
      });
      await task.save();
    }

    // Supprimer le PV
    await PV.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: "PV supprimé avec succès",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

export { createPV, getPVsByTask, getPVById, updatePV, completePV, deletePV };
