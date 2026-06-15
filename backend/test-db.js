import prisma from './db.js';

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connexion réussie à la base de données !');
    console.log('Maintien de la connexion pendant 5 secondes pour vérification...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('Erreur de connexion :', error);
  } finally {
    await prisma.$disconnect();
    console.log('Déconnexion.');
  }
}

testConnection();
