import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sequelize;

// En mode développement sans MySQL disponible, utilise SQLite pour le prototypage
if (process.env.DB_DIALECT === 'sqlite' || process.env.USE_SQLITE === 'true') {
  const dbPath = path.join(__dirname, '..', 'entp_dev.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
  console.log(`[Database] Mode SQLite activé (fichier : ${dbPath})`);
} else {
  // Configuration MySQL pour la production (spécifié par ENTP)
  sequelize = new Sequelize(
    process.env.DB_NAME || 'entp_transfert_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test de la connexion
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('[Database] Connexion à la base de données réussie.');
  } catch (error) {
    console.error('[Database] Impossible de se connecter à la base de données :', error);
    process.exit(1);
  }
};

export default sequelize;
