import mongoose from "mongoose";
const { Schema } = mongoose;

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const pvSchema = new Schema(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["surveillance", "depotage"],
    },
    numPvSurveillance: {
      type: Number,
    },
    numPvDepotage: {
      type: Number,
    },
    numBL: {
      type: String,
      required: true,
    },
    // Ces champs sont obligatoires uniquement pour la surveillance
    numFacture: {
      type: String,
      required: function() { return this.type === 'surveillance'; }
    },
    dateIntervention: {
      type: Date,
      required: function() { return this.type === 'surveillance'; }
    },
    importateur: {
      type: String,
      required: true,
    },
    transitaire: {
      type: String,
      required: function() { return this.type === 'surveillance'; }
    },
    lieuIntervention: {
      type: String,
      required: function() { return this.type === 'surveillance'; }
    },
    numTC: {
      type: String,
      required: true,
    },
    numScelle: {
      type: String,
      required: true,
    },
    nbColis: {
      type: Number,
      required: true,
    },
    dateArrivee: {
      type: Date,
      // Obligatoire pour surveillance, optionnel pour dépotage
      required: function() { return this.type === 'surveillance'; }
    },
    navire: {
      type: String,
      required: true,
    },
    portChargement: {
      type: String,
      required: true,
    },
    portDechargement: {
      type: String,
      required: true,
    },
    natureMarchandise: {
      type: String,
      required: function() { return this.type === 'surveillance'; }
    },
    grosArticle: {
      type: String,
      required: true,
    },

    // Champs spécifiques au type de PV
    surveillance: {
      Constation: String,
      images: [String], 
    },

    depotage: {
      numCde: {
        type: Number,
        required: function() { return this.type === 'depotage'; }
      },
      lieuDepotage: String,
      observations: String,
      produit: String,
      nuance: String,
      quantite: Number,
      conteneur: [{
        numConteneur: String,
        numScelle: String,
        quantite: Number,
        nuance: String,
        conforme: Boolean,
      }],
      lot: [
        {
          numLot: String,
          bonEtat: {
            type: Number,
            default: 0,
          },
          manquant: {
            type: Number,
            default: 0,
          },
          avarie: {
            type: Number,
            default: 0,
          },
        },
      ],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Remplacez votre middleware pre-save par celui-ci:
pvSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      console.log("Creating new PV with type:", this.type);
      if (this.type === "surveillance") {
        const counter = await Counter.findByIdAndUpdate(
          "surveillance",
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        console.log("Generated surveillance number:", counter.seq);
        this.numPvSurveillance = counter.seq;
      } else if (this.type === "depotage") {
        const counter = await Counter.findByIdAndUpdate(
          "depotage",
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        console.log("Generated depotage number:", counter.seq);
        this.numPvDepotage = counter.seq;
      }
    }
    next();
  } catch (error) {
    console.error("Error in pre-save middleware:", error);
    next(error);
  }
});

// Index pour améliorer les performances des requêtes
pvSchema.index({ taskId: 1 });
pvSchema.index({ type: 1 });
pvSchema.index({ createdBy: 1 });
pvSchema.index({ numPvSurveillance: 1 });
pvSchema.index({ numPvDepotage: 1 });

const PV = mongoose.model("PV", pvSchema);

export default PV;