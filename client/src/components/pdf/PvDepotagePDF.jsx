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
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
  headerText: {
    marginLeft: 10,
    fontSize: 9,
    color: '#003366',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
  },
  expertise: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
    color: '#003366',
  },
  separator: {
    width: 100,
    height: 1,
    backgroundColor: '#003366',
    marginTop: 2,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 5,
    textDecoration: 'underline',
  },
  pvNumber: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    textDecoration: 'underline',
  },
  mainTable: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minHeight: 25,
    alignItems: 'center',
  },
  tableRowNoBorder: {
    flexDirection: 'row',
    minHeight: 25,
    alignItems: 'center',
  },
  tableColHeader: {
    width: '33%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    padding: 5,
    fontWeight: 'bold',
  },
  tableColHeaderLast: {
    width: '34%',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '33%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
    padding: 5,
  },
  tableColLast: {
    width: '34%',
    padding: 5,
  },
  sectionTitle: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  containerTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
  },
  containerTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  containerTableCol1: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerTableCol2: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerTableCol3: {
    width: '30%',
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  containerTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  containerTableDataCol1: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
  },
  containerTableDataCol2: {
    width: '30%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 5,
  },
  containerTableDataCol3: {
    width: '30%',
    padding: 5,
    textAlign: 'center',
  },
  damageTable: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
  },
  damageTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#a0c8e0', // Couleur bleu clair comme dans l'image
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center',
  },
  damageTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  damageTableCol1: {
    width: '35%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  damageTableCol2: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  damageTableCol3: {
    width: '15%',
    padding: 8,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  damageContentRow: {
    borderBottomWidth: 0,
    paddingVertical: 5,
  },
  damageDataCol1: {
    width: '35%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 8,
    textAlign: 'center',
  },
  damageDataCol2: {
    width: '50%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 8,
  },
  damageDataCol3: {
    width: '15%',
    padding: 8,
    textAlign: 'center',
  },
  lotSection: {
    marginTop: 10,
    marginLeft: 10,
  },
  lotTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    textDecoration: 'underline',
  },
  lotDetail: {
    marginLeft: 20,
    marginBottom: 3,
  },
  bulletPoint: {
    width: 10,
  },
  lotItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  signature: {
    marginTop: 30,
    marginRight: 30,
    textAlign: 'right',
  },
});

const PvDepotagePDF = ({ pv }) => {
  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (e) {
      return "";
    }
  };

  // Numéro formaté du PV
  const formattedPvNumber = pv?.numPvDepotage
    ? `N° ${pv.numPvDepotage.toString().padStart(3, "0")}/BCTM/${new Date().getFullYear()}`
    : `N° ---/BCTM/${new Date().getFullYear()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête avec logo */}
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

        {/* Titre et numéro du PV */}
        <Text style={styles.title}>PROCES VERBAL DE DEPOTAGE</Text>
        <Text style={styles.pvNumber}>{formattedPvNumber}</Text>

        {/* Informations principales en tableau - 3 colonnes x 3 lignes */}
        <View style={styles.mainTable}>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>Date : {formatDate(pv?.dateIntervention)}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>Lieu : {pv?.lieuDepotage || pv?.lieuIntervention || ""}</Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>Réceptionnaire : {pv?.importateur || ""}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text>N° BL : {pv?.numBL || ""}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>N° CDE : {pv?.depotage?.numCde || ""}</Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>Navire : {pv?.navire || ""}</Text>
            </View>
          </View>

          <View style={styles.tableRowNoBorder}>
            <View style={styles.tableCol}>
              <Text>Embarquement : {pv?.portChargement || ""}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>Débarquement : {pv?.portDechargement || ""}</Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>Gros/Article : {pv?.grosArticle || ""}</Text>
            </View>
          </View>

          <View style={styles.tableRowNoBorder}>
            <View style={styles.tableCol}>
              <Text>Produit : {pv?.depotage?.produit || ""}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>Conditionnement : {pv?.conditionnement || "Cartons / Palettes"}</Text>
            </View>
            <View style={styles.tableColLast}>
              <Text>Nombre de colis : {pv?.nbColis || ""}</Text>
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
            <Text style={styles.containerTableDataCol1}>TC N° : {pv?.numTC || ""}</Text>
            <Text style={styles.containerTableDataCol2}>{pv?.numScelle || ""}</Text>
            <Text style={styles.containerTableDataCol3}>Conforme</Text>
          </View>
        </View>

        {/* Section des dommages/constats */}
        <Text style={styles.sectionTitle}>Constat des dommages:</Text>

        <View style={styles.damageTable}>
          <View style={styles.damageTableHeader}>
            <Text style={styles.damageTableCol1}>Conteneur N°</Text>
            <Text style={styles.damageTableCol2}>Nuance</Text>
            <Text style={styles.damageTableCol3}>Quantité</Text>
          </View>
          <View style={styles.damageTableRow}>
            <Text style={styles.damageDataCol1}>TC N°: {pv?.numTC || ""}</Text>
            <Text style={styles.damageDataCol2}>{pv?.depotage?.nuance || ""}</Text>
            <Text style={styles.damageDataCol3}>{pv?.depotage?.quantite || pv?.nbColis || ""}</Text>
          </View>

          {/* Lots détaillés */}
          {pv?.depotage?.lot && pv.depotage.lot.map((lot, index) => (
            <View key={index} style={styles.lotSection}>
              <Text style={styles.lotTitle}>Lot N° : {lot.numLot}</Text>
              <View style={styles.lotDetail}>
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

        {/* Observations si présentes */}
        {pv?.depotage?.observations && (
          <View>
            <Text style={styles.sectionTitle}>Observations:</Text>
            <Text>{pv.depotage.observations}</Text>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Alger le {formatDate(new Date())}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PvDepotagePDF;