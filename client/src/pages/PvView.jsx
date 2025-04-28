import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loading } from '../components';
import PvDeSurveillance from '../components/PvDeSurveillance';
import PvDeDepotage from '../components/PvDeDepotage';
import { FaArrowLeft } from 'react-icons/fa';

const PvView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pv, setPv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPv = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pv/${id}`);
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || "Erreur lors du chargement du PV");
        }
        
        setPv(data.pv);
      } catch (err) {
        console.error("Erreur lors du chargement du PV:", err);
        setError(err.message || "Une erreur est survenue");
        toast.error(err.message || "Impossible de charger le PV");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPv();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow">
        <div className="text-center text-red-600 p-4">
          <p className="text-xl font-bold">Erreur</p>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!pv) {
    return (
      <div className="w-full p-6 bg-white rounded-lg shadow">
        <div className="text-center text-gray-600 p-4">
          <p className="text-xl font-bold">PV non trouvé</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-300"
        >
          <FaArrowLeft />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-center text-gray-700">
          {pv.type === 'surveillance' ? 'PV de Surveillance' : 'PV de Dépotage'}{' '}
          N° {pv.type === 'surveillance' ? pv.numPvSurveillance : pv.numPvDepotage}
        </h1>
        <div className="w-32">
          {/* Espace pour équilibrer le header */}
        </div>
      </div>

      {pv.type === 'surveillance' ? (
        <PvDeSurveillance pv={pv} showControls={true} />
      ) : (
        <PvDeDepotage pv={pv} showControls={true} />
      )}
    </div>
  );
};

export default PvView;