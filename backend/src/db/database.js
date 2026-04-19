/**
 * SiteFlash AI - Database Connection Pool
 * Gerencia conexões com PostgreSQL
 */
const { Pool } = require('pg');
require('dotenv').config();

const getDbConfig = () => {
  // Prioridade 1: Variáveis separadas (mais seguro no EasyPanel)
  if (process.env.DB_PASSWORD || process.env.DB_PASS) {
    return {
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.DB_PASS,
      host: process.env.DB_HOST || 'pixelize_pixelize_db',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'pixelize',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    };
  }

  // Prioridade 2: DATABASE_URL (Fallback)
  if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    try {
      // Regex para extrair dados sem quebrar com caracteres especiais na senha
      const m = url.match(/^postgres(?:ql)?:\/\/([^:]+):(.+)@([^:/]+):?(\d*)\/([^?#]+)/);
      if (m) {
        return {
          user: m[1],
          password: m[2],
          host: m[3],
          port: parseInt(m[4]) || 5432,
          database: m[5].split('?')[0],
          ssl: url.includes('sslmode=disable') ? false : undefined
        };
      }
    } catch (e) {
      console.error('⚠️ Erro ao parsear DATABASE_URL, tentando config padrão...');
    }
  }

  throw new Error('Configuração de banco de dados não encontrada (DATABASE_URL ou DB_PASSWORD)');
};

const dbConfig = getDbConfig();

const pool = new Pool({
  ...dbConfig,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  console.error('❌ Database error:', err.message);
});

/**
 * Executa query com parâmetros
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Query [${duration}ms]: ${text.substring(0, 60)}...`);
    }
    return res;
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
};

/**
 * Testa conexão com banco
 */
const testConnection = async () => {
  try {
    await query('SELECT NOW()');
    console.log('✅ Database connection verified');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

module.exports = { query, pool, testConnection };
