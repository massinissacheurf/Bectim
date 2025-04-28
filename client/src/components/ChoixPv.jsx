import React from "react";
import { Dialog } from "@headlessui/react";
import { RiFileList3Line, RiFileSearchLine } from "react-icons/ri";
import ModalWrapper from "./ModalWrapper";
import Button from "./Button";

const PvTypeCard = ({ title, icon, onClick, description }) => (
  <div 
    onClick={onClick}
    className="cursor-pointer bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-blue-300 transition-all"
  >
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="text-lg font-medium ml-2">{title}</h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const ChoixPV = ({ open, setOpen, onSelectType }) => {
  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <Dialog.Title
        as='h2'
        className='text-base font-bold leading-6 text-gray-900 mb-4'
      >
        CHOISIR TYPE DE PV
      </Dialog.Title>

      <p className="text-sm text-gray-500 mb-6">
        Sélectionnez le type de procès-verbal que vous souhaitez créer.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PvTypeCard
          title="PV de Surveillance"
          icon={<RiFileSearchLine className="text-blue-600 text-xl" />}
          description="Surveillance des opérations de chargement/déchargement"
          onClick={() => onSelectType('surveillance')}
        />
        
        <PvTypeCard
          title="PV de Dépotage"
          icon={<RiFileList3Line className="text-orange-600 text-xl" />}
          description="Suivi du dépotage des conteneurs"
          onClick={() => onSelectType('depotage')}
        />
      </div>
      
      <div className='py-3 mt-4 flex justify-end'>
        <Button
          type='button'
          className='bg-white border text-sm font-semibold text-gray-900'
          onClick={() => setOpen(false)}
          label='Annuler'
        />
      </div>
    </ModalWrapper>
  );
};

export default ChoixPV;