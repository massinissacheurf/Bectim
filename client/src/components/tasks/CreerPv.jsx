import { Dialog } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreatePVMutation } from "../../redux/slices/api/pvApiSlice";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";
import ChoixPV from "../ChoixPv";

const CreerPv = ({ open, setOpen, id }) => {
  const [showTypeSelect, setShowTypeSelect] = useState(true);
  const [pvType, setPvType] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "depotage.lot",
  });

  useEffect(() => {
    if (pvType === "depotage") {
      // Vider les champs actuels et ajouter un lot vide
      append({
        numLot: "",
        bonEtat: 0,
        manquant: 0,
        avarie: 0,
      });
    }
  }, [pvType, append]);

  const [createPV, { isLoading }] = useCreatePVMutation();

  const handleSelectPvType = (type) => {
    setPvType(type);
    setShowTypeSelect(false);
  };

  const handleOnSubmit = async (data) => {
    try {
      // Préparer les données pour l'API
      let pvData = { ...data, type: pvType };

      // Si c'est un PV de dépotage, formater correctement les données des lots
      if (pvType === "depotage" && data.depotage?.lot) {
        // Formatter les lots en s'assurant que les valeurs numériques sont des nombres
        const formattedLots = data.depotage.lot.map((lot) => ({
          numLot: lot.numLot || "",
          bonEtat: Number(lot.bonEtat) || 0,
          manquant: Number(lot.manquant) || 0,
          avarie: Number(lot.avarie) || 0,
        }));

        // Mettre à jour l'objet depotage avec les lots formatés
        pvData.depotage = {
          ...pvData.depotage,
          lot: formattedLots,
        };
      }

      console.log("Données à envoyer:", pvData);

      const res = await createPV({ data: pvData, taskId: id }).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
        // Réinitialiser l'état pour la prochaine ouverture
        setTimeout(() => {
          setShowTypeSelect(true);
          setPvType(null);
        }, 300);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  // Si on est à l'étape de sélection du type de PV
  if (showTypeSelect) {
    return (
      <ChoixPV
        open={open}
        setOpen={setOpen}
        onSelectType={handleSelectPvType}
      />
    );
  }

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {pvType === "surveillance"
              ? "CRÉER PV DE SURVEILLANCE"
              : "CRÉER PV DE DÉPOTAGE"}
          </Dialog.Title>

          {/* Bouton retour */}
          <button
            type="button"
            onClick={() => setShowTypeSelect(true)}
            className="text-sm text-blue-600 mb-4 flex items-center hover:underline"
          >
            ← Retour à la sélection de type
          </button>

          <div className="mt-2 flex flex-col gap-6">
            {pvType === "surveillance" && (
              <>
                <div className="flex items-center gap-4">
                  <Textbox
                    placeholder="Numéro BL"
                    type="text"
                    name="numBL"
                    label="Numéro BL"
                    className="w-full rounded"
                    register={register("numBL", {
                      required: "Numéro BL est requis!",
                    })}
                    error={errors.numBL ? errors.numBL.message : ""}
                  />
                  <Textbox
                    placeholder="Numéro Facture"
                    type="text"
                    name="numFacture"
                    label="Numéro Facture"
                    className="w-full rounded"
                    register={register("numFacture", {
                      required: "Numéro Facture est requis!",
                    })}
                    error={errors.numFacture ? errors.numFacture.message : ""}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Textbox
                    placeholder="Date d'Intervention"
                    type="date"
                    name="dateIntervention"
                    label="Date d'Intervention"
                    className="w-full rounded"
                    register={register("dateIntervention", {
                      required: "Date est requise!",
                    })}
                    error={
                      errors.dateIntervention
                        ? errors.dateIntervention.message
                        : ""
                    }
                  />
                  <Textbox
                    placeholder="Importateur"
                    type="text"
                    name="importateur"
                    label="Importateur"
                    className="w-full rounded"
                    register={register("importateur", {
                      required: "Importateur est requis!",
                    })}
                    error={errors.importateur ? errors.importateur.message : ""}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Textbox
                    placeholder="Transitaire"
                    type="text"
                    name="transitaire"
                    label="Transitaire"
                    className="w-full rounded"
                    register={register("transitaire", {
                      required: "Transitaire est requis!",
                    })}
                    error={errors.transitaire ? errors.transitaire.message : ""}
                  />
                  <Textbox
                    placeholder="Lieu Intervention"
                    type="text"
                    name="lieuIntervention"
                    label="Lieu Intervention"
                    className="w-full rounded"
                    register={register("lieuIntervention")}
                    error={
                      errors.lieuIntervention
                        ? errors.lieuIntervention.message
                        : ""
                    }
                  />
                </div>
              </>
            )}
            {/* Champs spécifiques en fonction du type de PV */}
            {pvType === "surveillance" && (
              <>
                {/* Nouvelle section: Identification du conteneur */}
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">
                    Identification du conteneur
                  </h3>
                  <div className="flex items-center gap-4">
                    <Textbox
                      placeholder="Numéro TC"
                      type="text"
                      name="numTC"
                      label="Numéro TC"
                      className="w-full rounded"
                      register={register("numTC", {
                        required: "Numéro TC est requis!",
                      })}
                      error={errors.numTC ? errors.numTC.message : ""}
                    />
                    <Textbox
                      placeholder="Numéro Scellé"
                      type="text"
                      name="numScelle"
                      label="Numéro Scellé"
                      className="w-full rounded"
                      register={register("numScelle", {
                        required: "Numéro Scellé est requis!",
                      })}
                      error={errors.numScelle ? errors.numScelle.message : ""}
                    />
                  </div>
                  <Textbox
                    placeholder="Nombre de Colis"
                    type="number"
                    name="nbColis"
                    label="Nombre de Colis"
                    className="w-full rounded"
                    register={register("nbColis", {
                      required: "Nombre de Colis est requis!",
                      valueAsNumber: true,
                    })}
                    error={errors.nbColis ? errors.nbColis.message : ""}
                  />
                </div>

                {/* Nouvelle section: Renseignements généraux */}
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">Renseignements généraux</h3>
                  <div className="flex items-center gap-4">
                    <Textbox
                      placeholder="Nature de la marchandise"
                      type="text"
                      name="natureMarchandise"
                      label="Nature de la marchandise"
                      className="w-full rounded"
                      register={register("natureMarchandise", {
                        required: "Nature de la marchandise est requise",
                      })}
                      error={
                        errors.natureMarchandise
                          ? errors.natureMarchandise.message
                          : ""
                      }
                    />
                    <Textbox
                      placeholder="État de la marchandise"
                      type="text"
                      name="etatMarchandise"
                      label="État de la marchandise"
                      className="w-full rounded"
                      register={register("etatMarchandise", {
                        value: "Neuve et sous emballage", // Valeur par défaut
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Textbox
                      placeholder="Navire"
                      type="text"
                      name="navire"
                      label="Navire"
                      className="w-full rounded"
                      register={register("navire")}
                    />
                    <Textbox
                      placeholder="Date d'arrivée"
                      type="date"
                      name="dateArrivee"
                      label="Date d'arrivée"
                      className="w-full rounded"
                      register={register("dateArrivee")}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Textbox
                      placeholder="Port de chargement"
                      type="text"
                      name="portChargement"
                      label="Port de chargement"
                      className="w-full rounded"
                      register={register("portChargement")}
                    />
                    <Textbox
                      placeholder="Port de déchargement"
                      type="text"
                      name="portDechargement"
                      label="Port de déchargement"
                      className="w-full rounded"
                      register={register("portDechargement", {
                        value: "Alger", // Valeur par défaut
                      })}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Textbox
                      placeholder="Gros/Article"
                      type="text"
                      name="grosArticle"
                      label="Gros/Article"
                      className="w-full rounded"
                      register={register("grosArticle")}
                    />
                    <Textbox
                      placeholder="Lieu d'intervention"
                      type="text"
                      name="lieuIntervention"
                      label="Lieu d'intervention"
                      className="w-full rounded"
                      register={register("lieuIntervention")}
                    />
                  </div>
                </div>

                {/* Nouvelle section: Constatations */}
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">Constatations</h3>
                  <div className="w-full">
                    <label
                      htmlFor="constatations"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Constatations
                    </label>
                    <textarea
                      id="constatations"
                      rows={5}
                      className="w-full rounded border border-gray-300 p-2"
                      placeholder="Entrez les constatations..."
                      {...register("constatations")}
                    ></textarea>
                  </div>
                </div>
              </>
            )}

            {pvType === "depotage" && (
              <>
                {/* Section: Informations générales dépotage */}
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">Informations générales</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Numéro BL et Numéro CDE */}
                    <Textbox
                      placeholder="Numéro BL"
                      type="text"
                      name="numBL"
                      label="Numéro BL"
                      className="w-full rounded"
                      register={register("numBL", {
                        required: "Numéro BL est requis!",
                      })}
                      error={errors.numBL ? errors.numBL.message : ""}
                    />
                    <Textbox
                      placeholder="Numéro de CDE"
                      type="number"
                      name="depotage.numCde"
                      label="Numéro de CDE"
                      className="w-full rounded"
                      register={register("depotage.numCde", {
                        required: "Numéro de commande est requis!",
                        valueAsNumber: true,
                      })}
                      error={
                        errors.depotage?.numCde
                          ? errors.depotage.numCde.message
                          : ""
                      }
                    />
                  </div>

                  {/* Navire et Lieu d'intervention */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Textbox
                      placeholder="Navire"
                      type="text"
                      name="navire"
                      label="Navire"
                      className="w-full rounded"
                      register={register("navire", {
                        required: "Navire est requis!",
                      })}
                      error={errors.navire ? errors.navire.message : ""}
                    />
                    <Textbox
                      placeholder="Lieu"
                      type="text"
                      name="lieuDepotage"
                      label="Lieu"
                      className="w-full rounded"
                      register={register("lieuDepotage", {
                        required: "Lieu est requis!",
                      })}
                      error={
                        errors.lieuDepotage
                          ? errors.lieuDepotage.message
                          : ""
                      }
                    />
                  </div>

                  {/* Importateur et Embarquement */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Textbox
                      placeholder="Receptionnaire"
                      type="text"
                      name="importateur"
                      label="Receptionnaire"
                      className="w-full rounded"
                      register={register("importateur", {
                        required: "Importateur est requis!",
                      })}
                      error={
                        errors.importateur ? errors.importateur.message : ""
                      }
                    />
                    <Textbox
                      placeholder="Embarquement (Port de chargement)"
                      type="text"
                      name="portChargement"
                      label="Embarquement"
                      className="w-full rounded"
                      register={register("portChargement", {
                        required: "Port de chargement est requis!",
                      })}
                      error={
                        errors.portChargement
                          ? errors.portChargement.message
                          : ""
                      }
                    />
                  </div>

                  {/* Débarquement et Gros/Article */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Textbox
                      placeholder="Débarquement"
                      type="text"
                      name="portDechargement"
                      label="Débarquement"
                      className="w-full rounded"
                      register={register("portDechargement", {
                        required: "Port de déchargement est requis!",
                      })}
                      error={
                        errors.portDechargement
                          ? errors.portDechargement.message
                          : ""
                      }
                    />
                    <Textbox
                      placeholder="Gros/Article"
                      type="text"
                      name="grosArticle"
                      label="Gros/Article"
                      className="w-full rounded"
                      register={register("grosArticle", {
                        required: "Gros/Article est requis!",
                      })}
                      error={
                        errors.grosArticle ? errors.grosArticle.message : ""
                      }
                    />
                  </div>

                  {/* Produit et Nombre de colis */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Textbox
                      placeholder="Produit"
                      type="text"
                      name="depotage.produit"
                      label="Produit"
                      className="w-full rounded"
                      register={register("depotage.produit", {
                        required: "Produit est requis!",
                      })}
                      error={
                        errors.depotage?.produit
                          ? errors.depotage.produit.message
                          : ""
                      }
                    />
                    <Textbox
                      placeholder="Nombre de Colis"
                      type="number"
                      name="nbColis"
                      label="Nombre de Colis"
                      className="w-full rounded"
                      register={register("nbColis", {
                        required: "Nombre de Colis est requis!",
                        valueAsNumber: true,
                      })}
                      error={errors.nbColis ? errors.nbColis.message : ""}
                    />
                  </div>
                </div>

                {/* Section: Infos Conteneur */}
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">Infos Conteneur</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Textbox
                      placeholder="N° Conteneur"
                      type="text"
                      name="numTC"
                      label="N° Conteneur"
                      className="w-full rounded"
                      register={register("numTC", {
                        required: "N° Conteneur est requis!",
                      })}
                      error={errors.numTC ? errors.numTC.message : ""}
                    />
                    <Textbox
                      placeholder="N° Scellé"
                      type="text"
                      name="numScelle"
                      label="N° Scellé"
                      className="w-full rounded"
                      register={register("numScelle", {
                        required: "N° Scellé est requis!",
                      })}
                      error={errors.numScelle ? errors.numScelle.message : ""}
                    />
                  </div>
                  <div className="w-full mt-4">
                    <label
                      htmlFor="observations"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Observations
                    </label>
                    <textarea
                      id="observations"
                      rows={3}
                      className="w-full rounded border border-gray-300 p-2"
                      placeholder="Entrez les observations..."
                      {...register("depotage.observations")}
                    ></textarea>
                  </div>
                </div>

                {/* Section: Constat des dommages */}
                <div className="border-t pt-4 mt-2">
                  <h3 className="font-medium mb-4">Constat des dommages</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Textbox
                      placeholder="Nuance"
                      type="text"
                      name="depotage.nuance"
                      label="Nuance"
                      className="w-full rounded"
                      register={register("depotage.nuance")}
                    />
                    <Textbox
                      placeholder="Quantité"
                      type="number"
                      name="depotage.quantite"
                      label="Quantité"
                      className="w-full rounded"
                      register={register("depotage.quantite", {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* Gestion des lots */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Détail des lots</h4>
                      <button
                        type="button"
                        onClick={() =>
                          append({
                            numLot: "",
                            bonEtat: 0,
                            manquant: 0,
                            avarie: 0,
                          })
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        + Ajouter lot
                      </button>
                    </div>

                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="mb-4 p-4 border border-gray-200 rounded bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium">Lot #{index + 1}</h4>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Supprimer
                            </button>
                          )}
                        </div>

                        <div className="mb-4">
                          <Textbox
                            placeholder="Numéro de lot"
                            type="text"
                            name={`depotage.lot.${index}.numLot`}
                            label="Numéro de lot"
                            className="w-full rounded"
                            register={register(`depotage.lot.${index}.numLot`)}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <Textbox
                            placeholder="Bon état"
                            type="number"
                            name={`depotage.lot.${index}.bonEtat`}
                            label="Bon état"
                            className="w-full rounded"
                            register={register(
                              `depotage.lot.${index}.bonEtat`,
                              {
                                valueAsNumber: true,
                              }
                            )}
                          />
                          <Textbox
                            placeholder="Manquant"
                            type="number"
                            name={`depotage.lot.${index}.manquant`}
                            label="Manquant"
                            className="w-full rounded"
                            register={register(
                              `depotage.lot.${index}.manquant`,
                              {
                                valueAsNumber: true,
                              }
                            )}
                          />
                          <Textbox
                            placeholder="Avarie"
                            type="number"
                            name={`depotage.lot.${index}.avarie`}
                            label="Avarie"
                            className="w-full rounded"
                            register={register(`depotage.lot.${index}.avarie`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>
                      </div>
                    ))}

                    {fields.length === 0 && (
                      <div className="text-center p-6 border border-dashed rounded">
                        Aucun lot n'a été ajouté. Cliquez sur "Ajouter lot" pour
                        commencer.
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {isLoading ? (
            <div className="mt-8">
              <Loading />
            </div>
          ) : (
            <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
              <Button
                type="submit"
                className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
                label={`Créer PV de ${
                  pvType === "surveillance" ? "Surveillance" : "Dépotage"
                }`}
              />

              <Button
                type="button"
                className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Annuler"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default CreerPv;
