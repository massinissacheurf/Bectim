import React, { useRef } from 'react';
import { FaPrint } from 'react-icons/fa';
import { toast } from 'sonner';
import PdfDownloadButton from './PdfDownloadButton';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PvDeSurveillance({ pv, showControls = false }) {
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

  const fixImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith('/uploads/')) {
      return url;
    }
    return url;
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
            .print-container img {
              max-width: 100%;
              height: auto;
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
            className="w-16 h-16 bg-blue-900 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-blue-900">BECTIM</h1>
            <div className="w-10 h-0.5 bg-blue-900 mb-1"></div>
            <p className="text-xs font-bold text-blue-900">EXPERTISE</p>
            <p className="text-xs text-blue-900">Société d'Expertise et de contrôle Technique Industriel & Maritime</p>
            <p className="text-xs text-blue-900">Villa 05, Rue Ahmed Assas El Harrach – Alger</p>
            <p className="text-xs text-blue-900">Email : bectim_expertise@yahoo.fr</p>
            <p className="text-xs text-blue-900">Tel / Mobile : 021.83.24.85 / 0555.01.26.73</p>
          </div>
        </div>

        {/* Titre du PV */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-blue-900 underline">PV DE SURVEILLANCE</h2>
          <p className="font-medium text-blue-900 underline">
            N° : {pv?.numPvSurveillance?.toString().padStart(3, '0') || "---"}/BCTM/{new Date().getFullYear()}
          </p>
        </div>

        {/* Tableau d'informations */}
        <table className="w-full border border-gray-400 mb-6">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Importateur</span> : {pv?.importateur || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Transitaire</span> : {pv?.transitaire || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Intervention du</span> : {formatDateSafe(pv?.dateIntervention)}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Facture N°</span> : {pv?.numFacture || "N/A"}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">Lieu d'intervention</span> : {pv?.lieuIntervention || "N/A"}
              </td>
              <td className="border border-gray-400 p-2">
                <span className="font-bold text-blue-900 underline">BL N°</span> : {pv?.numBL || "N/A"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Identification du conteneur */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-blue-900 underline mb-2">Identification du conteneur inspecté</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-bold">TC N°</span> : {pv?.numTC || "N/A"}
              {"   "}
              <span className="font-bold">Scellé de fermeture</span> : {pv?.numScelle || "N/A"}
            </li>
            <li>
              <span className="font-bold">Nombre de colis</span> : {pv?.nbColis || "N/A"} (Selon connaissement)
            </li>
            <li>
              <span className="font-bold">Conditionnement</span> : "Cartons - Palletisés"
            </li>
          </ul>
        </div>

        {/* Renseignements généraux */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-blue-900 underline mb-2">Renseignements généraux</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nature de la marchandise : {pv?.natureMarchandise || "N/A"}</li>
            <li>État de la marchandise : Neuve et sous emballage</li>
            <li>Navire : {pv?.navire || "N/A"}</li>
            <li>Date d'arrivée : {formatDateSafe(pv?.dateArrivee)}</li>
            <li>Port de chargement : {pv?.portChargement || "N/A"}</li>
            <li>Port de déchargement : {pv?.portDechargement || "N/A"}</li>
            <li>Gros / Article : {pv?.grosArticle || "N/A"}</li>
          </ul>
        </div>

        {/* Constatations */}
        <div className="mb-6">
          <h3 className="text-base font-bold text-blue-900 underline mb-2">Constatations</h3>
          {pv?.constatations ? (
            <div className="whitespace-pre-wrap">
              {pv.constatations}
            </div>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              <li>Le conteneur est en bon état</li>
              <li>Le scellé est intact</li>
              <li>La marchandise est conforme à la facture</li>
              <li>La marchandise est conforme au connaissement</li>
              <li>La marchandise est conforme à l'avis de passage</li>
            </ul>
          )}
        </div>

        {/* Photos */}
        {pv?.surveillance?.images && pv.surveillance.images.length > 0 && (
          <div className="mb-6">
            <h3 className="text-base font-bold text-blue-900 underline mb-2">Photos</h3>
            <div className="grid grid-cols-2 gap-4">
              {pv.surveillance.images.map((img, idx) => (
                <div key={idx} className="border border-gray-300 p-2">
                  <img
                    src={fixImageUrl(img)}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="text-right mb-6">
          <p>Alger le {formatDateSafe(new Date())}</p>
        </div>

        {/* Pied de page */}
        <div className="border-t border-gray-300 pt-2 text-xs text-gray-500 flex justify-between">
          <span>{pv?.numPvSurveillance?.toString().padStart(3, '0') || "---"}/BCTM/{new Date().getFullYear()}</span>
          <span>1</span>
        </div>
      </div>
    </>
  );
}
