import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetPVByIdQuery } from "../redux/slices/api/pvApiSlice";
import PvDeSurveillance from "../components/PvDeSurveillance";
import Loading from "../components/Loading";
import PvDeDepotage from "../components/PvDeDepotage";
import { FaArrowLeft, FaEye } from "react-icons/fa";

const PvPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetPVByIdQuery(id);

  if (isLoading) return <Loading />;
  if (error) return <div className="p-4">Erreur: Impossible de charger les données du PV</div>;
  if (!data || !data.pv) return <div className="p-4">Aucune donnée trouvée pour ce PV</div>;

  const renderPvComponent = () => {
    switch (data.pv.type) {
      case "surveillance":
        return <PvDeSurveillance pv={data.pv} showControls={true} />;
      case "depotage":
        return <PvDeDepotage pv={data.pv} showControls={true} />;
      default:
        return <div>Type de PV non pris en charge</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Barre d'actions en haut de la page */}
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-300"
        >
          <FaArrowLeft />
          Retour
        </button>
        
        <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
          {data.pv.type === 'surveillance' ? 'PV de Surveillance' : 'PV de Dépotage'}{' '}
          N° {data.pv.type === 'surveillance' ? data.pv.numPvSurveillance : data.pv.numPvDepotage}
        </h1>
      </div>

      {/* Contenu du PV */}
      {renderPvComponent()}
    </div>
  );
};

export default PvPage;