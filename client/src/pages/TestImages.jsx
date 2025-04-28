import React, { useEffect, useState } from 'react';

const TestImages = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/test-uploads')
      .then(res => res.json())
      .then(data => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Test d'accès aux images</h1>
      
      {loading ? <p>Chargement...</p> : (
        files.length === 0 ? (
          <p>Aucun fichier trouvé</p>
        ) : (
          <div>
            <p>Fichiers trouvés: {files.length}</p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {files.map((file, index) => {
                const url = `/uploads/images/${file}`;
                return (
                  <div key={index} className="border p-2">
                    <p className="text-sm mb-2">{file}</p>
                    <img 
                      src={url} 
                      alt={`Image ${index + 1}`} 
                      className="w-full h-auto"
                      onError={(e) => {
                        console.error(`Erreur de chargement pour ${url}`);
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='20' text-anchor='middle' dominant-baseline='middle' fill='%23999'%3EImage non disponible%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TestImages;