import dotenv from 'dotenv';
import prisma from './db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connexion à la base de données via Prisma...');
    
    await prisma.transfer.deleteMany();
    await prisma.material.deleteMany();
    await prisma.user.deleteMany();
    await prisma.lieu.deleteMany();
    await prisma.centre.deleteMany();
    await prisma.direction.deleteMany();
    await prisma.category.deleteMany();
    console.log('[Seed] Tables réinitialisées avec succès.');

    // 1. Create Directions
    const directionsData = [
      { code: 'DG', nom: 'Direction Générale', branche: 'Direction Générale' },
      { code: 'DFO', nom: 'Direction Forage', branche: 'Opérations' },
      { code: 'DWO', nom: 'Direction Workover', branche: 'Opérations' },
      { code: 'DUET', nom: 'Unité Équipements Tubulaires', branche: 'Opérations' },
      { code: 'DTR', nom: 'Direction Transport', branche: 'Logistique' },
      { code: 'DMP', nom: 'Direction Maintenance Pétrolière', branche: 'Logistique' },
      { code: 'DAGS', nom: 'Direction Approvisionnements & Gestion Stocks', branche: 'Logistique' },
      { code: 'DHMC', nom: 'Direction Hôtellerie & Moyens Communs', branche: 'Logistique' },
      { code: 'DPE', nom: 'Direction Patrimoine & Équipements', branche: 'Logistique' },
      { code: 'DFC', nom: 'Direction Finances & Comptabilité', branche: 'Administration & Finances' },
      { code: 'DRH', nom: 'Direction Ressources Humaines', branche: 'Administration & Finances' },
      { code: 'DTIC', nom: 'Direction Technologies de l\'Information', branche: 'Administration & Finances' },
      { code: 'DAG', nom: 'Direction Affaires Générales', branche: 'Administration & Finances' },
      { code: 'CFE', nom: 'Centre de Formation et d\'Enseignement', branche: 'Administration & Finances' },
    ];
    
    for (const d of directionsData) {
      await prisma.direction.create({ data: d });
    }
    const directions = await prisma.direction.findMany();
    console.log(`[Seed] ${directions.length} directions créées.`);

    const getDirId = (code) => directions.find(d => d.code === code).id;

    // 2. Create Centres
    const centresData = [
      { code: 'HMD-DG', nom: 'Base Industrielle du 20 Août 1955', ville: 'Hassi Messaoud', wilaya: 'Ouargla', adresse: 'Zone Industrielle', directionId: getDirId('DG') },
      { code: 'ALG-LIA', nom: 'Bureau de Liaison Alger', ville: 'Alger', wilaya: 'Alger', adresse: 'Cité Boushaki, Lot 28, Bab Ezzouar', directionId: getDirId('DG') },
      { code: 'HMD-DFO', nom: 'Base Forage HMD', ville: 'Hassi Messaoud', wilaya: 'Ouargla', directionId: getDirId('DFO') },
      { code: 'TFT-DFO', nom: 'Base Forage Tin Fouyé', ville: 'Illizi', wilaya: 'Illizi', directionId: getDirId('DFO') },
      { code: 'HMD-DWO', nom: 'Base Workover HMD', ville: 'Hassi Messaoud', wilaya: 'Ouargla', directionId: getDirId('DWO') },
      { code: 'HRM-DWO', nom: 'Base Workover Hassi R\'Mel', ville: 'Laghouat', wilaya: 'Laghouat', directionId: getDirId('DWO') },
      { code: 'HMD-DUET', nom: 'Unité Tubulaires HMD', ville: 'Hassi Messaoud', wilaya: 'Ouargla', directionId: getDirId('DUET') },
      { code: 'HMD-DTR', nom: 'Parc Transport HMD', ville: 'Hassi Messaoud', wilaya: 'Ouargla', directionId: getDirId('DTR') },
      { code: 'ORG-DTR', nom: 'Parc Transport Ouargla', ville: 'Ouargla', wilaya: 'Ouargla', directionId: getDirId('DTR') },
      { code: 'HMD-DMP', nom: 'Base Maintenance HMD', ville: 'Hassi Messaoud', wilaya: 'Ouargla', directionId: getDirId('DMP') },
      { code: 'INA-DMP', nom: 'Base Maintenance In Amenas', ville: 'In Amenas', wilaya: 'Illizi', directionId: getDirId('DMP') },
      { code: 'INS-DMP', nom: 'Base Maintenance In Salah', ville: 'In Salah', wilaya: 'Tamanrasset', directionId: getDirId('DMP') },
      { code: 'HMD-DAGS', nom: 'Magasin Central HMD', ville: 'Hassi Messaoud', wilaya: 'Ouargla', directionId: getDirId('DAGS') },
      { code: 'ORG-DAGS', nom: 'Magasin Logistique Ouargla', ville: 'Ouargla', wilaya: 'Ouargla', directionId: getDirId('DAGS') },
    ];

    for (const c of centresData) {
      await prisma.centre.create({ data: c });
    }
    const centres = await prisma.centre.findMany();
    console.log(`[Seed] ${centres.length} centres créés.`);

    const getCentreId = (code) => centres.find(c => c.code === code).id;

    // 3. Create Lieux
    const lieuxData = [
      { nom: 'Atelier Central', type: 'Atelier', centreId: getCentreId('HMD-DG') },
      { nom: 'Bureau Direction', type: 'Bureau', centreId: getCentreId('ALG-LIA') },
      { nom: 'Atelier Forage', type: 'Atelier', centreId: getCentreId('HMD-DFO') },
      { nom: 'Magasin Pièces', type: 'Magasin', centreId: getCentreId('HMD-DFO') },
      { nom: 'Atelier Forage', type: 'Atelier', centreId: getCentreId('TFT-DFO') },
      { nom: 'Atelier Inspection', type: 'Atelier', centreId: getCentreId('HMD-DUET') },
      { nom: 'Garage Principal', type: 'Atelier', centreId: getCentreId('HMD-DTR') },
      { nom: 'Atelier Mécanique', type: 'Atelier', centreId: getCentreId('HMD-DMP') },
      { nom: 'Atelier Instrumentation', type: 'Atelier', centreId: getCentreId('HMD-DMP') },
      { nom: 'Zone Stockage A', type: 'Dépôt', centreId: getCentreId('HMD-DAGS') },
      { nom: 'Zone Stockage', type: 'Dépôt', centreId: getCentreId('ORG-DAGS') },
    ];

    for (const l of lieuxData) {
      await prisma.lieu.create({ data: l });
    }
    console.log(`[Seed] ${lieuxData.length} lieux créés.`);

    // 4. Create Categories
    const categories = await Promise.all([
      prisma.category.create({ data: { nom: 'Équipement de Forage' } }),
      prisma.category.create({ data: { nom: 'Outillage' } }),
      prisma.category.create({ data: { nom: 'Véhicules' } }),
      prisma.category.create({ data: { nom: 'Matériel Informatique' } }),
      prisma.category.create({ data: { nom: 'Pièces de Rechange' } }),
      prisma.category.create({ data: { nom: 'Sécurité & Protection' } }),
    ]);

    // 5. Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const respPass = await bcrypt.hash('resp123', salt);
    const agentPass = await bcrypt.hash('agent123', salt);
    const consultPass = await bcrypt.hash('cons123', salt);

    const users = await Promise.all([
      // Admin Global (DG)
      prisma.user.create({ data: { name: 'Admin ENTP', email: 'admin@entp.dz', password: adminPass, role: 'Admin', service: 'Direction Générale', directionId: getDirId('DG'), centreId: getCentreId('HMD-DG') } }),
      // Admin Centre (DFO)
      prisma.user.create({ data: { name: 'Admin Centre Forage', email: 'responsable@entp.dz', password: respPass, role: 'Admin Centre', service: 'Base Forage HMD', directionId: getDirId('DFO'), centreId: getCentreId('HMD-DFO') } }),
      // Utilisateur (DFO)
      prisma.user.create({ data: { name: 'Utilisateur Forage', email: 'agent@entp.dz', password: agentPass, role: 'Utilisateur', service: 'Base Forage HMD', directionId: getDirId('DFO'), centreId: getCentreId('HMD-DFO') } }),
      // Utilisateur (DAGS)
      prisma.user.create({ data: { name: 'Utilisateur Magasinier', email: 'consultant@entp.dz', password: consultPass, role: 'Utilisateur', service: 'Magasin Central', directionId: getDirId('DAGS'), centreId: getCentreId('HMD-DAGS') } }),
    ]);

    console.log(`[Seed] Comptes de test créés :`);
    console.log(`  Admin Global : admin@entp.dz       / admin123`);
    console.log(`  Admin Centre : responsable@entp.dz / resp123`);
    console.log(`  Utilisateur  : agent@entp.dz       / agent123`);
    console.log(`  Utilisateur 2: consultant@entp.dz  / cons123`);

    // 6. Create Materials
    const materialsData = [
      { name: 'Pompe à boue Triplex', barcode: 'MAT-DFO-001', categoryId: categories[0].id, centreId: getCentreId('HMD-DFO'), lieuId: null, status: 'Disponible', currentService: 'Forage' },
      { name: 'Moteur de fond', barcode: 'MAT-DFO-002', categoryId: categories[0].id, centreId: getCentreId('HMD-DFO'), lieuId: null, status: 'Disponible', currentService: 'Forage' },
      { name: 'Générateur Diesel 500kVA', barcode: 'MAT-DMP-001', categoryId: categories[0].id, centreId: getCentreId('HMD-DMP'), lieuId: null, status: 'Disponible', currentService: 'Maintenance' },
      { name: 'Tubes de Forage', barcode: 'MAT-DUET-001', categoryId: categories[4].id, centreId: getCentreId('HMD-DUET'), lieuId: null, status: 'Disponible', currentService: 'Tubulaires' },
      { name: 'Ordinateur Portable Dell', barcode: 'IT-001', categoryId: categories[3].id, centreId: getCentreId('HMD-DG'), lieuId: null, status: 'Disponible', currentService: 'IT' },
    ];

    for (const m of materialsData) {
      await prisma.material.create({ data: m });
    }
    const createdMaterials = await prisma.material.findMany();
    console.log(`[Seed] ${createdMaterials.length} matériels créés.`);

    console.log('\n[Seed] Terminé avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Erreur :', error);
    process.exit(1);
  }
};

seedDatabase();
