import clsx from "clsx";
import moment from "moment";
import React, { useState } from "react";
import {
  FaBug,
  FaSpinner,
  FaTasks,
  FaThumbsUp,
  FaTrash,
  FaEdit,
  FaUser,
  FaFileAlt,
  FaImages,
} from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
  MdTaskAlt,
} from "react-icons/md";
import { RxActivityLog } from "react-icons/rx";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button, Loading, Tabs, UserInfo } from "../components";
import { TaskColor } from "../components/tasks";
import ConfirmatioDialog from "../components/ConfirmationDialog";
import {
  useChangeSubTaskStatusMutation,
  useGetSingleTaskQuery,
  usePostTaskActivityMutation,
} from "../redux/slices/api/taskApiSlice";
import { PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
import { useDeletePVMutation } from "../redux/slices/api/pvApiSlice";
import { useSelector } from "react-redux";
import EditPV from "../components/EditPv";
import ImageGallery from "../components/ImageGallery";
import PvDeSurveillance from "../components/PvDeSurveillance";
import PvDeDepotage from "../components/PvDeDepotage";

const assets = [
  "https://images.pexels.com/photos/2418664/pexels-photo-2418664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/8797307/pexels-photo-8797307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/2534523/pexels-photo-2534523.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/804049/pexels-photo-804049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TASKTYPEICON = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const Activities = ({ activity, id, refetch }) => {
  const [selected, setSelected] = useState("Started");
  const [text, setText] = useState("");

  const [postActivity, { isLoading }] = usePostTaskActivityMutation();

  const handleSubmit = async () => {
    try {
      const data = {
        type: selected?.toLowerCase(),
        activity: text,
      };
      const res = await postActivity({
        data,
        id,
      }).unwrap();
      setText("");
      toast.success(res?.message);
      refetch();
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const Card = ({ item }) => {
    return (
      <div className={`flex space-x-4`}>
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center">
            {TASKTYPEICON[item?.type]}
          </div>
          <div className="h-full flex items-center">
            <div className="w-0.5 bg-gray-300 h-full"></div>
          </div>
        </div>

        <div className="flex flex-col gap-y-1 mb-8">
          <p className="font-semibold">{item?.by?.name}</p>
          <div className="text-gray-500 space-x-2">
            <span className="capitalize">{item?.type}</span>
            <span className="text-sm">{moment(item?.date).fromNow()}</span>
          </div>
          <div className="text-gray-700">{item?.activity}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex gap-10 2xl:gap-20 min-h-screen px-10 py-8 bg-white shadow rounded-md justify-between overflow-y-auto">
      <div className="w-full md:w-1/2">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">Activities</h4>
        <div className="w-full space-y-0">
          {activity?.map((item, index) => (
            <Card
              key={item.id}
              item={item}
              isConnected={index < activity?.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/3">
        <h4 className="text-gray-600 font-semibold text-lg mb-5">
          Add Activity
        </h4>
        <div className="w-full flex flex-wrap gap-5">
          {act_types.map((item, index) => (
            <div key={item} className="flex gap-2 items-center">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selected === item ? true : false}
                onChange={(e) => setSelected(item)}
              />
              <p>{item}</p>
            </div>
          ))}
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type ......"
            className="bg-white w-full mt-10 border border-gray-300 outline-none p-4 rounded-md focus:ring-2 ring-blue-500"
          ></textarea>
          {isLoading ? (
            <Loading />
          ) : (
            <Button
              type="button"
              label="Submit"
              onClick={handleSubmit}
              className="bg-blue-600 text-white rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPvImagesData, setSelectedPvImagesData] = useState(null);

  const handleViewImages = async (pv) => {
    try {
      const response = await fetch(`/api/pv/${pv._id}`);
      if (!response.ok) throw new Error("Erreur lors du chargement du PV");
      
      const data = await response.json();
      const updatedPv = data.pv;
      
      console.log("PV rechargé:", updatedPv);
      console.log("Images dans le PV:", updatedPv?.surveillance?.images);
      
      if (!updatedPv?.surveillance?.images || updatedPv.surveillance.images.length === 0) {
        toast.info("Aucune image disponible pour ce PV");
        return;
      }
      
      setSelectedPvImagesData({
        pvId: updatedPv._id,
        images: updatedPv.surveillance.images
      });
      setIsGalleryOpen(true);
    } catch (error) {
      console.error("Erreur lors du chargement des images:", error);
      toast.error("Impossible de charger les images");
    }
  };

  const handleImageGallerySuccess = async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Erreur lors du rechargement des données du PV:", error);
    }
  };

  const { id } = useParams();
  const { data, isLoading, refetch } = useGetSingleTaskQuery(id);

  const [selected, setSelected] = useState(0);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pvToDelete, setPvToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const task = data?.task || [];

  const { userInfo } = useSelector((state) => state.auth);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [pvToEdit, setPvToEdit] = useState(null);

  const [deletePV] = useDeletePVMutation();

  const handleDeletePV = (pv) => {
    setPvToDelete(pv._id);
    setDeleteMessage(
      `Êtes-vous sûr de vouloir supprimer le PV N° ${
        pv?.type === "surveillance"
          ? pv?.numPvSurveillance || "N/A"
          : pv?.numPvDepotage || "N/A"
      } ?`
    );
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePV = async () => {
    try {
      await deletePV(pvToDelete).unwrap();
      toast.success("PV supprimé avec succès");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Erreur lors de la suppression");
    } finally {
      setIsDeleteDialogOpen(false);
      setPvToDelete(null);
    }
  };

  const handleEditPV = (pvId) => {
    setPvToEdit(pvId);
    setIsEditModalOpen(true);
  };
  if (isLoading) {
    return (
      <div className="py-10">
        <Loading />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      {/* task detail */}
      <h1 className="text-2xl text-gray-600 font-bold">{task?.title}</h1>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <>
            <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow rounded-md px-8 py-8 overflow-y-auto">
              <div className="w-full md:w-1/2 space-y-8">
                <div className="flex items-center gap-5">
                  <div
                    className={clsx(
                      "flex gap-1 items-center text-base font-semibold px-3 py-1 rounded-full",
                      PRIOTITYSTYELS[task?.priority],
                      bgColor[task?.priority]
                    )}
                  >
                    <span className="text-lg">{ICONS[task?.priority]}</span>
                    <span className="uppercase">{task?.priority} Priority</span>
                  </div>

                  <div className={clsx("flex items-center gap-2")}>
                    <TaskColor className={TASK_TYPE[task?.stage]} />
                    <span className="text-black uppercase">{task?.stage}</span>
                  </div>
                </div>

                <p className="text-gray-500">
                  Created At: {new Date(task?.date).toDateString()}
                </p>

                <div className="flex items-center gap-8 p-4 border-y border-gray-200">
                  <div className="space-x-2">
                    <span className="font-semibold">Assets :</span>
                    <span>{task?.assets?.length}</span>
                  </div>
                  <span className="text-gray-400">|</span>
                </div>

                <div className="space-y-4 py-6">
                  <p className="text-gray-500 font-semibold text-sm">
                    TASK TEAM
                  </p>
                  <div className="space-y-3">
                    {task?.team?.map((m, index) => (
                      <div
                        key={index + m?._id}
                        className="flex gap-4 py-2 items-center border-t border-gray-200"
                      >
                        <div
                          className={
                            "w-10 h-10 rounded-full text-white flex items-center justify-center text-sm -mr-1 bg-blue-600"
                          }
                        >
                          <span className="text-center">
                            {getInitials(m?.name)}
                          </span>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{m?.name}</p>
                          <span className="text-gray-500">{m?.title}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {task?.pvs?.length > 0 && (
                  <div className="space-y-4 py-6">
                    <div className="flex items-center gap-5">
                      <p className="text-gray-500 font-semibold text-sm">
                        PROCÈS-VERBAUX
                      </p>
                      <div className="w-fit h-8 px-2 rounded-full flex items-center justify-center text-white bg-blue-600">
                        <p>{task?.pvs?.length}</p>
                      </div>
                    </div>
                    <div className="space-y-8">
                      {task?.pvs?.map((pv, index) => (
                        <div key={index + pv?._id} className="flex gap-3">
                          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-200">
                            <FaFileAlt className="text-blue-600" size={22} />
                          </div>

                          <div className="space-y-1 w-full">
                            <div className="flex gap-2 items-center">
                              <span className="text-sm text-gray-500">
                                {pv?.createdAt
                                  ? new Date(pv?.createdAt).toLocaleDateString(
                                      "fr-FR"
                                    )
                                  : "Date inconnue"}
                              </span>

                              <span className="px-2 py-0.5 text-center text-sm rounded-full bg-blue-100 text-blue-700 font-semibold lowercase">
                                {pv?.type}
                              </span>
                            </div>

                            <p className="text-gray-700 pb-2">
                              PV N° {/* Espace ajouté */}
                              {pv?.type === "surveillance"
                                ? pv?.numPvSurveillance || "N/A"
                                : pv?.numPvDepotage || "N/A"}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-2 mb-4">
                              <Link
                                to={`/pvs/${pv?._id}`}
                                className="text-sm outline-none bg-blue-100 text-blue-800 p-2 px-4 rounded hover:bg-blue-200 flex items-center"
                              >
                                <FaFileAlt className="mr-2" />
                                Voir le PV
                              </Link>

                              <button
                                onClick={() => handleEditPV(pv?._id)}
                                className="text-sm outline-none bg-green-100 text-green-800 p-2 px-4 rounded hover:bg-green-200 flex items-center"
                              >
                                <FaEdit className="mr-2" />
                                Modifier
                              </button>
                              {pv?.type === "surveillance" && (
                                <button
                                  onClick={() => handleViewImages(pv)}
                                  className="text-sm outline-none bg-indigo-100 text-indigo-800 p-2 px-4 rounded hover:bg-indigo-200 flex items-center"
                                >
                                  <FaImages className="mr-2" />
                                  Voir les images{" "}
                                  {pv?.surveillance?.images?.length > 0
                                    ? `(${pv.surveillance.images.length})`
                                    : ""}
                                </button>
                              )}
                              <button
                                onClick={() => handleDeletePV(pv)}
                                className="text-sm outline-none bg-red-100 text-red-800 p-2 px-4 rounded hover:bg-red-200 flex items-center"
                              >
                                <FaTrash className="mr-2" />
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 space-y-3">
                {task?.description && (
                  <div className="mb-10">
                    <p className="text-lg font-semibold">TASK DESCRIPTION</p>
                    <div className="w-full">{task?.description}</div>
                  </div>
                )}

                {task?.assets?.length > 0 && (
                  <div className="pb-10">
                    <p className="text-lg font-semibold">ASSETS</p>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                      {task?.assets?.map((el, index) => (
                        <img
                          key={index}
                          src={el}
                          alt={index}
                          className="w-full rounded h-auto md:h-44 2xl:h-52 cursor-pointer transition-all duration-700 md:hover:scale-125 hover:z-50"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {task?.links?.length > 0 && (
                  <div className="">
                    <p className="text-lg font-semibold">SUPPORT LINKS</p>
                    <div className="w-full flex flex-col gap-4">
                      {task?.links?.map((el, index) => (
                        <a
                          key={index}
                          href={el}
                          target="_blank"
                          className="text-blue-600 hover:underline"
                        >
                          {el}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Activities activity={task?.activities} refetch={refetch} id={id} />
          </>
        )}
      </Tabs>

      <ConfirmatioDialog
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        msg={deleteMessage}
        onClick={confirmDeletePV}
        type="delete"
        setMsg={setDeleteMessage}
        setType={() => {}}
      />

      <EditPV
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        pvId={pvToEdit}
        onSuccess={() => {
          refetch(); // Rafraîchir les données après modification
          toast.success("PV mis à jour avec succès");
        }}
      />

      <ImageGallery
        open={isGalleryOpen}
        setOpen={setIsGalleryOpen}
        images={selectedPvImagesData?.images || []}
        pvId={selectedPvImagesData?.pvId}
        onSuccess={handleImageGallerySuccess}
      />
    </div>
  );
};

export default TaskDetail;
