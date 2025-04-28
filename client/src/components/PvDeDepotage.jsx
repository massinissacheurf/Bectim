import React, { useRef } from "react";
import { FaPrint } from "react-icons/fa";
import { toast } from "sonner";
import PdfDownloadButton from "./PdfDownloadButton";

export default function PvDeDepotage({ pv, showControls = false }) {
  const pvRef = useRef(null);

  const formatDateSafe = (dateValue) => {
    if (!dateValue) return "N/A";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  const handlePrint = () => {
    if (!pvRef.current) return;

    const printWindow = window.open("", "_blank", "height=600,width=800");
    if (!printWindow) {
      toast.error("Impossible d'ouvrir la fenêtre d'impression");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Impression PV</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
            }
            .print-container {
              max-width: 100%;
              margin: 0 auto;
            }
            @media print {
              body { width: 210mm; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${pvRef.current.outerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <>
      {showControls && (
        <div className="mb-4 flex justify-end gap-2">
          <button
            onClick={handlePrint}
            className="bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-700"
          >
            <FaPrint />
            Imprimer
          </button>

          <PdfDownloadButton pv={pv} />
        </div>
      )}

      <div
        ref={pvRef}
        className="max-w-3xl mx-auto p-6 shadow-md bg-white print:shadow-none"
      >
        {/* En-tête avec courbe bleue */}
        <div className="h-10 bg-blue-100 rounded-b-full mb-6"></div>

        {/* En-tête avec logo */}
        <div className="flex mb-6">
          <img
            src="https://bectim.com/images/logo%20bectim.png"
            alt="Logo BECTIM"
            className="w-16 h-16 rounded-full bg-blue-900"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-blue-900">BECTIM</h1>
            <div className="w-10 h-0.5 bg-blue-900 mb-1"></div>
            <p className="text-xs font-bold text-blue-900">EXPERTISE</p>
            <p className="text-xs text-blue-900">
              Société d'Expertise et de contrôle Technique Industriel & Maritime
            </p>
            <p className="text-xs text-blue-900">
              Villa 05, Rue Ahmed Assas El Harrach – Alger
            </p>
            <p className="text-xs text-blue-900">
              Email : bectim_expertise@yahoo.fr
            </p>
            <p className="text-xs text-blue-900">
              Tel / Mobile : 021.83.24.85 / 0555.01.26.73
            </p>
          </div>
        </div>

        {/* Titre du PV */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-blue-900 underline">
            PROCES VERBAL DE DEPOTAGE
          </h2>
          <p className="font-medium text-blue-900 underline">
            N° {pv?.numPvDepotage?.toString().padStart(3, "0") || "---"}/BCTM/
            {new Date().getFullYear()}
          </p>
        </div>

        {/* Tableau d'informations */}
        <table className="w-full border border-gray-400 mb-6">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Date</span> :{" "}
                {formatDateSafe(new Date())}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Lieu</span> :{" "}
                {pv?.lieuDepotage || pv?.lieuIntervention || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Réceptionnaire</span>{" "}
                : {pv?.importateur || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">N° BL</span> :{" "}
                {pv?.numBL || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">N° CDE</span> :{" "}
                {pv?.depotage?.numCde || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Navire</span> :{" "}
                {pv?.navire || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Embarquement</span> :{" "}
                {pv?.portChargement || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Débarquement</span> :{" "}
                {pv?.portDechargement || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Gros/Article</span> :{" "}
                {pv?.grosArticle || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Produit</span> :{" "}
                {pv?.depotage?.produit || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Conditionnement</span>{" "}
                : {pv?.conditionnement || "Cartons / Palettes"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Nombre de colis</span>{" "}
                : {pv?.nbColis || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Section des conteneurs */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-blue-900 underline mb-2">
            Conteneur(s) au nombre de (01):
          </h3>

          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-2 w-2/5">
                  Numéro de conteneur
                </th>
                <th className="border border-gray-400 p-2 w-1/3">
                  N° de scellé
                </th>
                <th className="border border-gray-400 p-2">Observation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2 text-center">
                  TC N° : {pv?.numTC || "N/A"}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  {pv?.numScelle || "N/A"}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  Conforme
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Constat des dommages */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-blue-900 underline mb-2">
            Constat des dommages:
          </h3>

          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-400 p-2 w-1/3 text-center">
                  Conteneur N°
                </th>
                <th className="border border-gray-400 p-2 w-1/2 text-center">
                  Nuance
                </th>
                <th className="border border-gray-400 p-2 text-center">
                  Quantité
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2 text-center">
                  TC N° : {pv?.numTC || "N/A"}
                </td>
                <td className="border border-gray-400 p-2">
                  {pv?.depotage?.nuance || "N/A"}
                </td>
                <td className="border border-gray-400 p-2 text-center">
                  {pv?.depotage?.quantite || pv?.nbColis || "N/A"}
                </td>
              </tr>

              {/* Affichage des lots à l'intérieur du même tableau */}
              {pv?.depotage?.lot &&
                pv.depotage.lot.map((lot, index) => (
                  <tr key={index}>
                    <td
                      colSpan="3"
                      className={`border border-gray-400 p-3 ${
                        index % 2 === 0 ? "bg-gray-50" : ""
                      }`}
                    >
                      <p className="font-bold text-blue-900 mb-2">
                        Lot N° : {lot.numLot}
                      </p>
                      <ul className="list-disc pl-6">
                        <li>En bon état : {lot.bonEtat || 0} caisses</li>
                        <li>Manquant : {lot.manquant || 0} caisses</li>
                        <li>Avarié : {lot.avarie || 0}</li>
                      </ul>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Signature */}
        <div className="text-right mb-6">
          <p className="font-medium">Alger le {formatDateSafe(new Date())}</p>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mt-16 pt-4 border-t border-gray-300">
          <div>
            {pv?.numPvDepotage
              ? `${pv.numPvDepotage
                  .toString()
                  .padStart(3, "0")}/BCTM/${new Date().getFullYear()}`
              : "---/BCTM/----"}
          </div>
          <div>{pv?.page || 1}</div>
        </div>
      </div>
    </>
  );
}
