import React from "react";
import { Dialog } from "@headlessui/react";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";
import { formatDateSafe } from "../utils";

const DialogSelectPV = ({ open, setOpen, pvs, onSelectPV }) => {
  // Filtrer uniquement les PVs de type surveillance
  const surveillancePvs = pvs?.filter(pv => pv.type === "surveillance") || [];
  
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
        Sélectionner un PV de surveillance
      </Dialog.Title>
      
      {surveillancePvs.length === 0 ? (
        <div className="text-center p-6">
          <p className="text-red-500">Aucun PV de surveillance disponible pour cette tâche.</p>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-4 bg-gray-500 text-white"
            label="Fermer"
          />
        </div>
      ) : (
        <>
          <div className="mt-2 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
            {surveillancePvs.map(pv => (
              <button
                key={pv._id}
                onClick={() => {
                  onSelectPV(pv);
                  setOpen(false);
                }}
                className="border border-gray-200 p-3 rounded hover:bg-blue-50 text-left flex flex-col gap-1 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    PV N° {pv.numPvSurveillance?.toString().padStart(3, "0") || "N/A"} ({pv?.importateur})
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    pv.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {pv.isCompleted ? "Terminé" : "En cours"}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Importateur: {pv.importateur}
                </div>
                <div className="text-sm text-gray-500">
                  Créé le {formatDateSafe(new Date(pv.createdAt))}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="bg-gray-200 text-gray-700"
              label="Annuler"
            />
          </div>
        </>
      )}
    </ModalWrapper>
  );
};

export default DialogSelectPV;