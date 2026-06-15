import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
<<<<<<< HEAD
import prisma from './db.js';

=======
import { connectDB } from './config/db.js';
import sequelize from './config/db.js';

// Chargement des variables d'environnement
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

<<<<<<< HEAD
=======
// Middlewares globaux
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

<<<<<<< HEAD
=======
// Test de l'API
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Serveur ENTP opérationnel' });
});

<<<<<<< HEAD
app.use('/api', apiRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('[Database] Connexion à la base de données PostgreSQL (Prisma) réussie.');
=======
// Enregistrement des routes de l'API
app.use('/api', apiRoutes);

// Middleware de gestion d'erreurs global (doit être après les routes)
app.use(errorHandler);

// Démarrage du serveur avec connexion à la base de données
const startServer = async () => {
  try {
    // Connexion et vérification de la base de données
    await connectDB();

    // Synchronisation des modèles Sequelize (crée les tables si elles n'existent pas)
    await sequelize.sync({ alter: true });
    console.log('[Database] Modèles synchronisés avec la base de données.');
>>>>>>> ad7d4cbd2148b8052ee1f773fa6b9f92594dfe3d

    app.listen(PORT, () => {
      console.log(`[ENTP] Le serveur tourne sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[ENTP] Erreur fatale au démarrage :', error);
    process.exit(1);
  }
};

startServer();
