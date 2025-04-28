import React, { useRef } from 'react';
import { FaPrint } from 'react-icons/fa';
import { toast } from 'sonner';
import PdfDownloadButton from './PdfDownloadButton';

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
    
    const printWindow = window.open('', '_blank', 'height=600,width=800');
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
        <div className="flex mb-6 items-center">
          <img
            src="https://bectim.com/images/logo%20bectim.png"
            alt="Logo BECTIM"
            className="w-12 h-12"
          />
          <div className="ml-3">
            <h1 className="text-xl font-bold text-blue-900">BECTIM</h1>
            <div className="w-24 h-0.5 bg-blue-900 mb-1"></div>
            <p className="text-xs font-bold text-blue-900">EXPERTISE</p>
            <p className="text-xs text-blue-900">Société d'Expertise et de contrôle Technique Industriel & Maritime</p>
            <p className="text-xs text-blue-900">Villa 05, Rue Ahmed Assas El Harrach – Alger</p>
            <p className="text-xs text-blue-900">Email : bectim_expertise@yahoo.fr</p>
            <p className="text-xs text-blue-900">Tel / Mobile : 021.83.24.85 / 0555.01.26.73</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-black underline">PROCES VERBAL DE DEPOTAGE</h2>
          <p className="font-medium text-black underline">
            N° {pv?.numPvDepotage?.toString().padStart(3, '0') || "---"}/BCTM/{new Date().getFullYear()}
          </p>
        </div>

        <div className="mb-6 border border-gray-500">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="border-r border-b border-gray-500 p-2 w-1/3">
                  Date : {formatDateSafe(pv?.dateIntervention)}
                </td>
                <td className="border-r border-b border-gray-500 p-2 w-1/3">
                  Lieu : {pv?.lieuDepotage || pv?.lieuIntervention || "N/A"}
                </td>
                <td className="border-b border-gray-500 p-2 w-1/3">
                  Réceptionnaire : {pv?.importateur || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b border-gray-500 p-2">
                  N° BL : {pv?.numBL || "N/A"}
                </td>
                <td className="border-r border-b border-gray-500 p-2">
                  N° CDE : {pv?.depotage?.numCde || "N/A"}
                </td>
                <td className="border-b border-gray-500 p-2">
                  Navire : {pv?.navire || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b border-gray-500 p-2">
                  Embarquement : {pv?.portChargement || "N/A"}
                </td>
                <td className="border-r border-b border-gray-500 p-2">
                  Débarquement : {pv?.portDechargement || "N/A"}
                </td>
                <td className="border-b border-gray-500 p-2">
                  Gros/Article : {pv?.grosArticle || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="border-r border-gray-500 p-2">
                  Produit : {pv?.depotage?.produit || "N/A"}
                </td>
                <td className="border-r border-gray-500 p-2">
                  Conditionnement : {pv?.conditionnement || "Cartons / Palettes"}
                </td>
                <td className="p-2">
                  Nombre de colis : {pv?.nbColis || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-black underline mb-2">Conteneur(s) au nombre de (01):</h3>
          
          <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-500 p-2 w-2/5 text-center">Numéro de conteneur</th>
                <th className="border border-gray-500 p-2 w-1/3 text-center">N° de scellé</th>
                <th className="border border-gray-500 p-2 text-center">Observation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-500 p-2 text-center">
                  TC N° : {pv?.numTC || "N/A"}
                </td>
                <td className="border border-gray-500 p-2 text-center">
                  {pv?.numScelle || "N/A"}
                </td>
                <td className="border border-gray-500 p-2 text-center">
                  Conforme
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-black underline mb-2">Constat des dommages:</h3>
          
          <table className="w-full border border-gray-500">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-gray-500 p-2 w-1/3 text-center">Conteneur N°</th>
                <th className="border border-gray-500 p-2 w-1/2 text-center">Nuance</th>
                <th className="border border-gray-500 p-2 text-center">Quantité</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-500 p-2 text-center">
                  TC N° : {pv?.numTC || "N/A"}
                </td>
                <td className="border border-gray-500 p-2">
                  {pv?.depotage?.nuance || "N/A"}
                </td>
                <td className="border border-gray-500 p-2 text-center">
                  {pv?.depotage?.quantite || pv?.nbColis || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>

          {pv?.depotage?.lot && pv.depotage.lot.length > 0 && (
            <div className="mt-4">
              {pv.depotage.lot.map((lot, index) => (
                <div key={index} className={`p-2 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}>
                  <p className="font-bold underline">Lot N° : {lot.numLot || `Lot ${index + 1}`}</p>
                  <ul className="list-disc pl-6 pt-2">
                    <li>En bon état : {lot.bonEtat || 0} caisses</li>
                    <li>Manquant : {lot.manquant || 0} caisses</li>
                    <li>Avarié : {lot.avarie || 0}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {pv?.depotage?.observations && (
          <div className="mb-6">
            <h3 className="font-bold text-black underline mb-2">Observations:</h3>
            <p>{pv.depotage.observations}</p>
          </div>
        )}

        <div className="text-right mb-6 mt-12">
          <p>Alger le {formatDateSafe(new Date())}</p>
        </div>
      </div>
    </>
  );
}