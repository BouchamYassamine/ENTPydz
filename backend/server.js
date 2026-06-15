import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import prisma from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Serveur ENTP opérationnel' });
});

app.use('/api', apiRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('[Database] Connexion à la base de données PostgreSQL (Prisma) réussie.');

    app.listen(PORT, () => {
      console.log(`[ENTP] Le serveur tourne sur le port ${PORT} en mode ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[ENTP] Erreur fatale au démarrage :', error);
    process.exit(1);
  }
};

startServer();
