import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Enregistrement des polices
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 10,
  },
  header: {
    height: 10,
    backgroundColor: '#c5dce3',
    marginHorizontal: -30,
    marginTop: -30,
    marginBottom: 10,
    borderBottomLeftRadius: '100%',
    borderBottomRightRadius: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3a4a7b',
    color: '#3a4a7b',
  },
  headerRight: {
    marginLeft: 10,
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3a4a7b',
    letterSpacing: 1,
  },
  expertise: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#3a4a7b',
    marginBottom: 5,
  },
  separator: {
    height: 1,
    width: 40,
    backgroundColor: '#3a4a7b',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 8,
    color: '#3a4a7b',
    marginTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3a4a7b',
    textDecoration: 'underline',
    marginBottom: 5,
  },
  pvNumber: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3a4a7b',
    textDecoration: 'underline',
    marginBottom: 15,
  },
  infoTable: {
    border: '1pt solid #777',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #777',
  },
  infoCell: {
    padding: 5,
    flex: 1,
    borderRight: '1pt solid #777',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#3a4a7b',
    textDecoration: 'underline',
    marginRight: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3a4a7b',
    textDecoration: 'underline',
    marginBottom: 5,
  },
  bulletList: {
    paddingLeft: 15,
    marginBottom: 10,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletItem: {
    marginLeft: 5,
    flex: 1,
  },
  imageContainer: {
    marginBottom: 15,
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: '48%',
    border: '1pt solid #ddd',
    marginBottom: 10,
    padding: 5,
  },
  image: {
    width: '100%',
    height: 120,
    objectFit: 'contain',
  },
  signature: {
    marginTop: 40,
    textAlign: 'right',
    marginBottom: 15,
  },
  footer: {
    borderTop: '1pt solid #ddd',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#777',
    position: 'absolute', 
    bottom: 30,
    left: 30,
    right: 30,
  },
});

const PvSurveillancePDF = ({ pv }) => {
  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return "Date invalide";
    }
  };

  // Numéro formaté du PV
  const formattedPvNumber = pv?.numPvSurveillance
    ? `${pv.numPvSurveillance.toString().padStart(3, "0")}/BCTM/${new Date().getFullYear()}`
    : `---/BCTM/${new Date().getFullYear()}`;

  // Fonction pour traiter correctement les URLs des images
  const getImageUrl = (img) => {
    if (!img) return "https://bectim.com/images/logo%20bectim.png";
    
    try {
      // Si l'URL commence par http, on la laisse telle quelle
      if (img.startsWith('http')) {
        return img;
      }
      
      // Si c'est un chemin relatif à partir de /uploads, construire une URL complète
      if (img.startsWith('/uploads/')) {
        // En développement
        return `http://localhost:3000${img}`;
      }
      
      // Construire une URL à partir du nom du fichier
      return `http://localhost:3000/uploads/images/${img.split('/').pop()}`;
    } catch (error) {
      console.error("Erreur lors du traitement de l'URL d'image:", error);
      return "https://bectim.com/images/logo%20bectim.png";
    }
  };

  return (
    <Document>
      {/* Page principale avec informations */}
      <Page size="A4" style={styles.page}>
        {/* En-tête avec fond bleu */}
        <View style={styles.header} />

        {/* En-tête avec logo */}
        <View style={styles.headerContainer}>
          <Image 
            src="https://bectim.com/images/logo%20bectim.png" 
            style={styles.logo}
            cache={false}
          />
          <View style={styles.headerRight}>
            <Text style={styles.companyName}>BECTIM</Text>
            <View style={styles.separator}/>
            <Text style={styles.expertise}>EXPERTISE</Text>
            <Text style={styles.companyDetails}>
              Société d'Expertise et de contrôle Technique Industriel & Maritime
            </Text>
            <Text style={styles.companyDetails}>
              Villa 05, Rue Ahmed Assas El Harrach – Alger
            </Text>
            <Text style={styles.companyDetails}>
              Email : bectim_expertise@yahoo.fr
            </Text>
            <Text style={styles.companyDetails}>
              Tel / Mobile : 021.83.24.85 / 0555.01.26.73
            </Text>
          </View>
        </View>

        {/* Titre du PV */}
        <View>
          <Text style={styles.title}>PV DE SURVEILLANCE</Text>
          <Text style={styles.pvNumber}>N° : {formattedPvNumber}</Text>
        </View>

        {/* Tableau d'informations */}
        <View style={styles.infoTable}>
          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text>
                <Text style={styles.infoLabel}>Importateur</Text> : {pv?.importateur || "N/A"}
              </Text>
            </View>
            <View style={[styles.infoCell, { borderRight: 0 }]}>
              <Text>
                <Text style={styles.infoLabel}>Transitaire</Text> : {pv?.transitaire || "N/A"}
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoCell}>
              <Text>
                <Text style={styles.infoLabel}>Intervention du</Text> : {formatDate(pv?.dateIntervention)}
              </Text>
            </View>
            <View style={[styles.infoCell, { borderRight: 0 }]}>
              <Text>
                <Text style={styles.infoLabel}>Facture N°</Text> : {pv?.numFacture || "N/A"}
              </Text>
            </View>
          </View>
          <View style={[styles.infoRow, { borderBottom: 0 }]}>
            <View style={styles.infoCell}>
              <Text>
                <Text style={styles.infoLabel}>Lieu d'intervention</Text> : {pv?.lieuIntervention || "N/A"}
              </Text>
            </View>
            <View style={[styles.infoCell, { borderRight: 0 }]}>
              <Text>
                <Text style={styles.infoLabel}>BL N°</Text> : {pv?.numBL || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Identification du conteneur */}
        <View>
          <Text style={styles.sectionTitle}>Identification du conteneur inspecté</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>
                <Text style={{ fontWeight: 'bold' }}>TC N°</Text> : {pv?.numTC || "N/A"}
                {"   "}
                <Text style={{ fontWeight: 'bold' }}>Scellé de fermeture</Text> : {pv?.numScelle || "N/A"}
              </Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>
                <Text style={{ fontWeight: 'bold' }}>Nombre de colis</Text> : {pv?.nbColis || "N/A"} (Selon connaissement)
              </Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>
                <Text style={{ fontWeight: 'bold' }}>Conditionnement</Text> : "Cartons - Palletisés"
              </Text>
            </View>
          </View>
        </View>

        {/* Renseignements généraux */}
        <View>
          <Text style={styles.sectionTitle}>Renseignements généraux</Text>
          <View style={styles.bulletList}>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>Nature de la marchandise : {pv?.natureMarchandise || "N/A"}</Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>État de la marchandise : Neuve et sous emballage</Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>Navire : {pv?.navire || "N/A"}</Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>Date d'arrivée : {formatDate(pv?.dateArrivee)}</Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>Port de chargement : {pv?.portChargement || "N/A"}</Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>Port de déchargement : {pv?.portDechargement || "N/A"}</Text>
            </View>
            <View style={styles.bullet}>
              <Text>• </Text>
              <Text style={styles.bulletItem}>Gros / Article : {pv?.grosArticle || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Constatations */}
        <View>
          <Text style={styles.sectionTitle}>Constatations</Text>
          {pv?.constatations ? (
            <View style={styles.bulletList}>
              {pv.constatations.split('\n').map((para, idx) => (
                <Text key={idx} style={{ marginBottom: 4 }}>{para}</Text>
              ))}
            </View>
          ) : (
            <View style={styles.bulletList}>
              <View style={styles.bullet}>
                <Text>• </Text>
                <Text style={styles.bulletItem}>Le conteneur est en bon état</Text>
              </View>
              <View style={styles.bullet}>
                <Text>• </Text>
                <Text style={styles.bulletItem}>Le scellé est intact</Text>
              </View>
              <View style={styles.bullet}>
                <Text>• </Text>
                <Text style={styles.bulletItem}>La marchandise est conforme à la facture</Text>
              </View>
              <View style={styles.bullet}>
                <Text>• </Text>
                <Text style={styles.bulletItem}>La marchandise est conforme au connaissement</Text>
              </View>
              <View style={styles.bullet}>
                <Text>• </Text>
                <Text style={styles.bulletItem}>La marchandise est conforme à l'avis de passage</Text>
              </View>
            </View>
          )}
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Alger le {formatDate(new Date())}</Text>
        </View>

        {/* Pied de page */}
        <View style={styles.footer} fixed>
          <Text>{formattedPvNumber}</Text>
          <Text>1</Text>
        </View>
      </Page>

      {/* Page séparée pour les photos */}
      {pv?.surveillance?.images && pv.surveillance.images.length > 0 && (
        <Page size="A4" style={styles.page}>
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Photos</Text>
          <View style={styles.imagesGrid}>
            {pv.surveillance.images.map((img, idx) => (
              <View style={styles.imageWrapper} key={idx}>
                <Image 
                  src={getImageUrl(img)} 
                  style={styles.image} 
                  cache={false}
                />
              </View>
            ))}
          </View>
          
          {/* Pied de page */}
          <View style={styles.footer} fixed>
            <Text>{formattedPvNumber}</Text>
            <Text>2</Text>
          </View>
        </Page>
      )}
    </Document>
  );
};

export default PvSurveillancePDF;