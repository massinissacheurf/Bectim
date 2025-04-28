import React, { useState, useEffect } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "sonner";
import PvSurveillancePDF from "./pdf/PvSurveillancePDF";
import PvDepotagePDF from "./pdf/PvDepotagePDF";

const PdfDownloadButton = ({ pv }) => {
  const [isClicked, setIsClicked] = useState(false);
  const [key, setKey] = useState(Date.now()); // Clé de force-rafraîchissement

  // Réinitialiser l'état lors des modifications de pv
  useEffect(() => {
    setKey(Date.now());
    setIsClicked(false); // Réinitialiser également l'état isClicked
  }, [pv]);

  // Définir le nom du fichier en fonction du type de PV
  const getFileName = () => {
    const year = new Date().getFullYear();
    if (pv.type === "surveillance") {
      const pvNumber = pv?.numPvSurveillance
        ? `${pv.numPvSurveillance.toString().padStart(3, "0")}`
        : "xxx";
      return `PV_Surveillance_${pvNumber}_BCTM_${year}.pdf`;
    } else if (pv.type === "depotage") {
      const pvNumber = pv?.numPvDepotage
        ? `${pv.numPvDepotage.toString().padStart(3, "0")}`
        : "xxx";
      return `PV_Depotage_${pvNumber}_BCTM_${year}.pdf`;
    }
    return `PV_BCTM_${year}.pdf`;
  };

  // Rendre le document PDF en fonction du type
  const renderDocument = () => {
    if (pv.type === "surveillance") {
      return <PvSurveillancePDF pv={pv} />;
    } else if (pv.type === "depotage") {
      return <PvDepotagePDF pv={pv} />;
    }
    return null;
  };

  useEffect(() => {
    let timer;
    if (isClicked) {
      timer = setTimeout(() => {
        setIsClicked(false);
      }, 3000); // Réinitialiser après 3 secondes
    }
    return () => clearTimeout(timer);
  }, [isClicked]);

  return (
    <div key={key}>
      <PDFDownloadLink
        document={renderDocument()}
        fileName={getFileName()}
        className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        onClick={() => {
          setIsClicked(true);
          toast.success("PDF prêt à être téléchargé !");
        }}
      >
        {({ loading, error }) => {
          if (error) {
            console.error("Erreur PDF:", error);
            toast.error("Une erreur est survenue lors de la génération du PDF");
            setIsClicked(false);
            return (
              <>
                <FaDownload />
                Réessayer
              </>
            );
          }

          if (loading || isClicked) {
            return (
              <>
                <FaSpinner className="animate-spin" />
                Préparation...
              </>
            );
          }

          return (
            <>
              <FaDownload />
              Télécharger PDF
            </>
          );
        }}
      </PDFDownloadLink>
    </div>
  );
};

export default PdfDownloadButton;
