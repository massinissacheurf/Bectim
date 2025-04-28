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
    backgroundColor: '#ffffff',
    paddingBottom: 60, // Espace pour le pied de page
  },
  headerContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
  },
  headerCurve: {
    height: 10,
    backgroundColor: '#dbeafe', // bg-blue-100
    borderBottomLeftRadius: '100%',
    borderBottomRightRadius: '100%',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1e3a8a',
  },
  headerText: {
    marginLeft: 10,
    fontSize: 9,
    color: '#1e3a8a',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  expertise: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
    color: '#1e3a8a',
  },
  separator: {
    width: 30,
    height: 1,
    backgroundColor: '#1e3a8a',
    marginTop: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 5,
    textDecoration: 'underline',
    color: '#000000',
  },
  pvNumber: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
    color: '#000000',
  },
  mainTable: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#9ca3af',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
  },
  tableCol: {
    width: '33.33%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 5,
  },
  tableColLast: {
    width: '33.33%',
    padding: 5,
  },
  labelText: {
    fontWeight: 'bold',
    color: '#000000',
    textDecoration: 'underline',
    marginRight: 5,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    textDecoration: 'underline',
  },
  containerTable: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#9ca3af',
    marginBottom: 15,
  },
  containerTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
  },
  containerTableCol1: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerTableCol2: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerTableCol3: {
    width: '30%',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerTableRow: {
    flexDirection: 'row',
  },
  containerTableDataCol1: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
    textAlign: 'center',
  },
  containerTableDataCol2: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
    textAlign: 'center',
  },
  containerTableDataCol3: {
    width: '30%',
    padding: 6,
    textAlign: 'center',
  },
  damageTable: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#9ca3af',
  },
  damageTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#dbeafe',
  },
  damageTableCol1: {
    width: '33.33%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  damageTableCol2: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  damageTableCol3: {
    width: '16.67%',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  damageTableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#9ca3af',
  },
  damageTableDataCol1: {
    width: '33.33%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
    textAlign: 'center',
  },
  damageTableDataCol2: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#9ca3af',
    padding: 6,
  },
  damageTableDataCol3: {
    width: '16.67%',
    padding: 6,
    textAlign: 'center',
  },
  // Style modifié pour les lots
  lotSection: {
    padding: 8,
    // Suppression de la bordure supérieure
    // borderTopWidth: 1,
    // borderTopColor: '#9ca3af',
    // Suppression du fond de couleur
    // backgroundColor: '#f9fafb',
  },
  lotTitle: {
    fontWeight: 'bold',
    color: '#1e3a8a', // Couleur bleue pour le titre du lot (comme dans l'image)
    marginBottom: 5,
  },
  lotList: {
    paddingLeft: 15,
  },
  lotItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bulletPoint: {
    width: 10,
  },
  signature: {
    marginTop: 30,
    marginRight: 30,
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderTopColor: '#d1d5db',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#6b7280',
  },
});

const PvDepotagePDF = ({ pv }) => {
  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return "N/A";
    }
  };

  // Numéro formaté du PV
  const formattedPvNumber = pv?.numPvDepotage
    ? `N° ${pv.numPvDepotage.toString().padStart(3, "0")}/BCTM/${new Date().getFullYear()}`
    : `N° ---/BCTM/${new Date().getFullYear()}`;
  
  // Composant d'en-tête réutilisable
  const Header = () => (
    <View style={styles.headerContainer} fixed>
      <View style={styles.headerCurve} />
      <View style={styles.header}>
        <Image 
          src="https://bectim.com/images/logo%20bectim.png" 
          style={styles.logo} 
          cache={false}
        />
        <View style={styles.headerText}>
          <Text style={styles.companyName}>BECTIM</Text>
          <View style={styles.separator} />
          <Text style={styles.expertise}>EXPERTISE</Text>
          <Text>Société d'Expertise et de contrôle Technique Industriel & Maritime</Text>
          <Text>Villa 05, Rue Ahmed Assas El Harrach – Alger</Text>
          <Text>Email : bectim_expertise@yahoo.fr</Text>
          <Text>Tel / Mobile : 021.83.24.85 / 0555.01.26.73</Text>
        </View>
      </View>
    </View>
  );
  
  // Composant de pied de page réutilisable
  const Footer = ({ pageNumber }) => (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        {pv?.numPvDepotage ? `${pv.numPvDepotage.toString().padStart(3, '0')}/BCTM/${new Date().getFullYear()}` : "---/BCTM/----"}
      </Text>
      <Text style={styles.footerText}>{pageNumber}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête fixe sur toutes les pages */}
        <Header />

        {/* Titre et numéro du PV */}
        <Text style={styles.title}>PROCES VERBAL DE DEPOTAGE</Text>
        <Text style={styles.pvNumber}>{formattedPvNumber}</Text>

        {/* Tableau d'informations principales */}
        <View style={styles.mainTable}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>Date</Text> : {formatDate(pv?.dateIntervention || new Date())}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>Lieu</Text> : {pv?.lieuDepotage || pv?.lieuIntervention || "N/A"}
              </Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>
                <Text style={styles.labelText}>Réceptionnaire</Text> : {pv?.importateur || "N/A"}
              </Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>N° BL</Text> : {pv?.numBL || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>N° CDE</Text> : {pv?.depotage?.numCde || "N/A"}
              </Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>
                <Text style={styles.labelText}>Navire</Text> : {pv?.navire || "N/A"}
              </Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>Embarquement</Text> : {pv?.portChargement || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>Débarquement</Text> : {pv?.portDechargement || "N/A"}
              </Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>
                <Text style={styles.labelText}>Gros/Article</Text> : {pv?.grosArticle || "N/A"}
              </Text>
            </View>
          </View>
          
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>Produit</Text> : {pv?.depotage?.produit || "N/A"}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text>
                <Text style={styles.labelText}>Conditionnement</Text> : {pv?.conditionnement || "Cartons / Palettes"}
              </Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>
                <Text style={styles.labelText}>Nombre de colis</Text> : {pv?.nbColis || "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Section des conteneurs */}
        <Text style={styles.sectionTitle}>Conteneur(s) au nombre de (01):</Text>

        <View style={styles.containerTable}>
          <View style={styles.containerTableHeader}>
            <Text style={styles.containerTableCol1}>Numéro de conteneur</Text>
            <Text style={styles.containerTableCol2}>N° de scellé</Text>
            <Text style={styles.containerTableCol3}>Observation</Text>
          </View>
          <View style={styles.containerTableRow}>
            <Text style={styles.containerTableDataCol1}>TC N° : {pv?.numTC || "N/A"}</Text>
            <Text style={styles.containerTableDataCol2}>{pv?.numScelle || "N/A"}</Text>
            <Text style={styles.containerTableDataCol3}>Conforme</Text>
          </View>
        </View>

        {/* Constat des dommages */}
        <Text style={styles.sectionTitle}>Constat des dommages:</Text>
        
        <View style={styles.damageTable}>
          <View style={styles.damageTableHeader}>
            <Text style={styles.damageTableCol1}>Conteneur N°</Text>
            <Text style={styles.damageTableCol2}>Nuance</Text>
            <Text style={styles.damageTableCol3}>Quantité</Text>
          </View>
          
          <View style={styles.damageTableRow}>
            <Text style={styles.damageTableDataCol1}>TC N° : {pv?.numTC || "N/A"}</Text>
            <Text style={styles.damageTableDataCol2}>{pv?.depotage?.nuance || "N/A"}</Text>
            <Text style={styles.damageTableDataCol3}>{pv?.depotage?.quantite || pv?.nbColis || "N/A"}</Text>
          </View>
        </View>
        
        {/* Lots détaillés - maintenant sans séparation */}
        <View style={{ padding: 5, borderWidth:1 }}>
          {pv?.depotage?.lot && pv.depotage.lot.map((lot, index) => (
            <View key={index} style={styles.lotSection}>
              <Text style={styles.lotTitle}>Lot N° : {lot.numLot || `Lot ${index + 1}`}</Text>
              <View style={styles.lotList}>
                <View style={styles.lotItem}>
                  <Text style={styles.bulletPoint}>• </Text>
                  <Text>En bon état : {lot.bonEtat || "0"} caisses</Text>
                </View>
                <View style={styles.lotItem}>
                  <Text style={styles.bulletPoint}>• </Text>
                  <Text>Manquant : {lot.manquant || "0"} caisses</Text>
                </View>
                <View style={styles.lotItem}>
                  <Text style={styles.bulletPoint}>• </Text>
                  <Text>Avarié : {lot.avarie || "0"}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Alger le {formatDate(new Date())}</Text>
        </View>
        
        {/* Pied de page fixe sur toutes les pages */}
        <Footer pageNumber={1} />
      </Page>
    </Document>
  );
};

export default PvDepotagePDF;