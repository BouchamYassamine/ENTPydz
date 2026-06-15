import dotenv from 'dotenv';
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
