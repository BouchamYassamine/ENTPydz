import dotenv from 'dotenv';
<<<<<<< HEAD
import prisma from './db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedUsers = async () => {
  try {
    console.log('[Seed] Connexion à la base de données via Prisma...');
    
    await prisma.transfer.deleteMany();
    await prisma.material.deleteMany();
    await prisma.user.deleteMany();
    console.log('[Seed] Tables réinitialisées avec succès.');

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const respPassword = await bcrypt.hash('resp123', salt);
    const agentPassword = await bcrypt.hash('agent123', salt);
    const consultPassword = await bcrypt.hash('consult123', salt);

    const users = await prisma.user.createMany({
      data: [
        { name: 'Amine Khelifi', email: 'admin@entp.dz', password: adminPassword, role: 'Admin', service: 'Direction Générale', isActive: true },
        { name: 'Sofiane Touati', email: 'responsable.forage@entp.dz', password: respPassword, role: 'Responsable Service', service: 'Maintenance et Forage', isActive: true },
        { name: 'Karim Benali', email: 'agent.logistique@entp.dz', password: agentPassword, role: 'Agent Logistique', service: 'Logistique et Transport', isActive: true },
        { name: 'Nadia Rahmani', email: 'consultant@entp.dz', password: consultPassword, role: 'Consultant', service: "Bureau d'Études", isActive: true }
      ]
    });

    console.log(`[Seed] ${users.count} utilisateurs créés avec succès.`);
    
=======
import sequelize from './config/db.js';
import User from './models/user.model.js';

dotenv.config();

/**
 * Script de création des utilisateurs de test pour la démonstration ENTP
 * Exécuter avec : node seed.js
 */
const seedUsers = async () => {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('[Seed] Connexion à la base de données réussie.');

    // Synchronisation des tables (force: true recrée les tables)
    await sequelize.sync({ force: true });
    console.log('[Seed] Tables recréées avec succès.');

    // Création des utilisateurs de test
    const users = await User.bulkCreate([
      {
        name: 'Amine Khelifi',
        email: 'admin@entp.dz',
        password: 'admin123',
        role: 'Admin',
        service: 'Direction Générale',
        isActive: true
      },
      {
        name: 'Sofiane Touati',
        email: 'responsable.forage@entp.dz',
        password: 'resp123',
        role: 'Responsable Service',
        service: 'Maintenance et Forage',
        isActive: true
      },
      {
        name: 'Karim Benali',
        email: 'agent.logistique@entp.dz',
        password: 'agent123',
        role: 'Agent Logistique',
        service: 'Logistique et Transport',
        isActive: true
      },
      {
        name: 'Nadia Rahmani',
        email: 'consultant@entp.dz',
        password: 'consult123',
        role: 'Consultant',
        service: 'Bureau d\'Études',
        isActive: true
      }
    ], { individualHooks: true }); // individualHooks: true pour déclencher le hashage bcrypt

    console.log(`[Seed] ${users.length} utilisateurs créés avec succès :`);
    users.forEach(u => {
      console.log(`  → ${u.name} (${u.email}) - Rôle: ${u.role} - Service: ${u.service}`);
    });

>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
    console.log('\n[Seed] Comptes de test disponibles :');
    console.log('  Admin     : admin@entp.dz / admin123');
    console.log('  Responsable: responsable.forage@entp.dz / resp123');
    console.log('  Agent     : agent.logistique@entp.dz / agent123');
    console.log('  Consultant: consultant@entp.dz / consult123');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Erreur lors du seeding :', error);
    process.exit(1);
  }
};

seedUsers();
