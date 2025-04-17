import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateSubTaskMutation } from "../../redux/slices/api/taskApiSlice";
import Button from "../Button";
import Loading from "../Loading";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";

const AddSubTask = ({ open, setOpen, id }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSbTask, { isLoading }] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      const res = await addSbTask({ data, id }).unwrap();

      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            CRÉER PV
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='Numéro BL'
                type='text'
                name='numBL'
                label='Numéro BL'
                className='w-full rounded'
                register={register("numBL", {
                  required: "Numéro BL est requis!",
                })}
                error={errors.numBL ? errors.numBL.message : ""}
              />
              <Textbox
                placeholder='Numéro Facture'
                type='text'
                name='numFacture'
                label='Numéro Facture'
                className='w-full rounded'
                register={register("numFacture", {
                  required: "Numéro Facture est requis!",
                })}
                error={errors.numFacture ? errors.numFacture.message : ""}
              />
            </div>

            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='Numéro Intervention'
                type='text'
                name='numIntervention'
                label='Numéro Intervention'
                className='w-full rounded'
                register={register("numIntervention", {
                  required: "Numéro Intervention est requis!",
                })}
                error={errors.numIntervention ? errors.numIntervention.message : ""}
              />
              <Textbox
                placeholder='Importateur'
                type='text'
                name='importateur'
                label='Importateur'
                className='w-full rounded'
                register={register("importateur", {
                  required: "Importateur est requis!",
                })}
                error={errors.importateur ? errors.importateur.message : ""}
              />
            </div>

            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='Transitaire'
                type='text'
                name='transitaire'
                label='Transitaire'
                className='w-full rounded'
                register={register("transitaire", {
                  required: "Transitaire est requis!",
                })}
                error={errors.transitaire ? errors.transitaire.message : ""}
              />
              <Textbox
                placeholder='Lien Intervention'
                type='text'
                name='lienIntervention'
                label='Lien Intervention'
                className='w-full rounded'
                register={register("lienIntervention")}
                error={errors.lienIntervention ? errors.lienIntervention.message : ""}
              />
            </div>

            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='Numéro TC'
                type='text'
                name='numTC'
                label='Numéro TC'
                className='w-full rounded'
                register={register("numTC", {
                  required: "Numéro TC est requis!",
                })}
                error={errors.numTC ? errors.numTC.message : ""}
              />
              <Textbox
                placeholder='Numéro Scellé'
                type='text'
                name='numScelle'
                label='Numéro Scellé'
                className='w-full rounded'
                register={register("numScelle", {
                  required: "Numéro Scellé est requis!",
                })}
                error={errors.numScelle ? errors.numScelle.message : ""}
              />
            </div>

            <div className='flex items-center gap-4'>
              <Textbox
                placeholder='Nombre de Colis'
                type='number'
                name='nbColis'
                label='Nombre de Colis'
                className='w-full rounded'
                register={register("nbColis", {
                  required: "Nombre de Colis est requis!",
                  valueAsNumber: true,
                })}
                error={errors.nbColis ? errors.nbColis.message : ""}
              />
              <Textbox
                placeholder='Date'
                type='date'
                name='date'
                label='Date'
                className='w-full rounded'
                register={register("date", {
                  required: "Date est requise!",
                })}
                error={errors.date ? errors.date.message : ""}
              />
            </div>
          </div>
          {isLoading ? (
            <div className='mt-8'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 flex sm:flex-row-reverse gap-4'>
              <Button
                type='submit'
                className='bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto'
                label='Créer PV'
              />

              <Button
                type='button'
                className='bg-white border text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={() => setOpen(false)}
                label='Annuler'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSubTask;