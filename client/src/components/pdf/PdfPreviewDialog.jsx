import React from 'react';
import { Dialog } from '@headlessui/react';
import { PDFViewer } from '@react-pdf/renderer';
import SimplePvPreview from './SimplePvPreview';
import { FaTimes } from 'react-icons/fa';

const PdfPreviewDialog = ({ isOpen, onClose, pv }) => {
  if (!pv) return null;
  
  const renderPdfDocument = () => {
    return <SimplePvPreview pv={pv} />;
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        
        <div className="relative bg-white rounded max-w-6xl w-full h-[90vh] mx-4 p-4 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              Aperçu du PDF
            </Dialog.Title>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="h-[calc(100%-4rem)]">
            <PDFViewer 
              width="100%" 
              height="100%" 
              showToolbar={true}
              style={{ border: '1px solid #ddd' }}
            >
              {renderPdfDocument()}
            </PDFViewer>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PdfPreviewDialog;