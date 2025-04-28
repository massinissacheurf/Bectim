import clsx from "clsx";
import React, { useState, useMemo } from "react";
import { IoMdAdd, IoMdImages } from "react-icons/io";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import {
  BGS,
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDateSafe,
} from "../../utils/index.js";
import UserInfo from "../UserInfo.jsx";
import { CreerPv, TaskAssets, TaskColor, TaskDialog } from "./index";
import { useGetPVsByTaskQuery } from "../../redux/slices/api/pvApiSlice.js";
import AddPvImages from "../../components/AddPvImages";
import DialogSelectPV from "../../components/DialogSelectPV";

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [isAddImagesOpen, setIsAddImagesOpen] = useState(false);
  const [selectedPvId, setSelectedPvId] = useState(null);
  const [isSelectPvDialogOpen, setIsSelectPvDialogOpen] = useState(false);

  // Récupérer les PVs associés à cette tâche
  const { data: pvData } = useGetPVsByTaskQuery(task._id, {
    skip: !task._id, // Skip si pas d'ID de tâche
  });

  // Nombre de PVs pour cette tâche
  const pvCount = pvData?.pvs?.length || 0;

  // Récupérer le dernier PV créé (s'il existe)
  const latestPV = pvData?.pvs?.[0];

  // Vérifier si la tâche contient au moins un PV de type surveillance
  const hasSurveillancePv = useMemo(() => {
    return pvData?.pvs?.some((pv) => pv.type === "surveillance") || false;
  }, [pvData?.pvs]);

  const handleAddImages = () => {
    // Vérifier s'il y a des PVs de surveillance
    if (!hasSurveillancePv) {
      toast.error("Cette tâche ne contient aucun PV de surveillance");
      return;
    }

    // Compter le nombre de PVs de surveillance
    const surveillancePvs =
      pvData?.pvs?.filter((pv) => pv.type === "surveillance") || [];

    if (surveillancePvs.length === 0) {
      toast.error("Cette tâche ne contient aucun PV de surveillance");
      return;
    } else if (surveillancePvs.length === 1) {
      // S'il n'y a qu'un seul PV de surveillance, l'utiliser directement
      setSelectedPvId(surveillancePvs[0]._id);
      setIsAddImagesOpen(true);
    } else {
      // S'il y a plusieurs PVs de surveillance, ouvrir le sélecteur
      setIsSelectPvDialogOpen(true);
    }
  };

  const handleSelectPV = (pv) => {
    setSelectedPvId(pv._id);
    setIsAddImagesOpen(true);
  };

  return (
    <>
      <div className="w-full h-fit bg-white dark:bg-[#1f1f1f] shadow-md p-4 rounded">
        <div className="w-full flex justify-between">
          <div
            className={clsx(
              "flex flex-1 gap-1 items-center text-sm font-medium",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            <span className="text-lg">{ICONS[task?.priority]}</span>
            <span className="uppercase">{task?.priority} Priority</span>
          </div>
          <TaskDialog task={task} />
        </div>
        <>
          <Link to={`/task/${task._id}`}>
            <div className="flex items-center gap-2">
              <TaskColor className={TASK_TYPE[task.stage]} />
              <h4 className="text- line-clamp-1 text-black dark:text-white">
                {task?.title}
              </h4>
            </div>
          </Link>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatDateSafe(new Date(task?.date))}
          </span>
        </>

        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />
        <div className="flex items-center justify-between mb-2">
          <TaskAssets
            activities={task?.activities?.length}
            subTasks={task?.subTasks}
            assets={task?.assets?.length}
            pvCount={pvCount}
          />

          <div className="flex flex-row-reverse">
            {task?.team?.length > 0 &&
              task?.team?.map((m, index) => (
                <div
                  key={index}
                  className={clsx(
                    "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                    BGS[index % BGS?.length]
                  )}
                >
                  <UserInfo user={m} />
                </div>
              ))}
          </div>
        </div>

        {latestPV && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <Link to={`/pvs/${latestPV._id}`} className="hover:underline">
              <h5 className="text-base line-clamp-1 text-black dark:text-gray-400">
                PV {latestPV.type}: {latestPV.importateur}
              </h5>
            </Link>

            <div className="p-3 space-x-2">
              <span className="bg-blue-600/10 px-3 py-1 rounded-full text-blue-700 font-medium">
                {latestPV.type}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  latestPV.isCompleted
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {latestPV.isCompleted ? "Terminé" : "En cours"}
              </span>
            </div>
          </div>
        )}

        <div className="w-full pb-2 flex items-center justify-center">
          <button
            disabled={user.isAdmin ? true : false}
            onClick={() => setOpen(true)}
            className="flex-1 flex gap-2 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <IoMdAdd className="text-lg" />
            <span>Créer PV</span>
          </button>

          <button
            onClick={handleAddImages}
            disabled={!hasSurveillancePv}
            className="flex-1 flex justify-center gap-2 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <IoMdImages className="text-lg" />
            <span>Ajouter Images</span>
          </button>
        </div>
      </div>

      <CreerPv open={open} setOpen={setOpen} id={task._id} />

      {selectedPvId && (
        <AddPvImages
          open={isAddImagesOpen}
          setOpen={setIsAddImagesOpen}
          pvId={selectedPvId}
          onSuccess={() => {
            toast.success("Images ajoutées avec succès");
            window.location.reload();
          }}
        />
      )}

      <DialogSelectPV
        open={isSelectPvDialogOpen}
        setOpen={setIsSelectPvDialogOpen}
        pvs={pvData?.pvs || []}
        onSelectPV={handleSelectPV}
      />
    </>
  );
};

export default TaskCard;
