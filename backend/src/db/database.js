/**
 * SiteFlash AI - Database Connection Pool
 * Gerencia conexões com PostgreSQL
 *
 * Usa config object (não connectionString) para suportar
 * senhas com caracteres especiais: !@# × etc.
 */
const { Pool } = require('pg');
require('dotenv').config();

/**
 * Parseia DATABASE_URL manualmente via regex,
 * evitando problema do URL parser com senhas especiais.
 * Ex: postgres://user:!@#senha×@host:5432/db
 */
const parseDbUrl = (url) => {
  if (!url) throw new Error('DATABASE_URL não definida no .env');

  // Regex: pega user, tudo entre :// e @host como senha (mais robusto)
  // postgres://USER:SENHA@HOST:PORT/DB?params
  const m = url.match(/^postgres(?:ql)?:\/\/([^:]+):(.+)@([^:/]+):?(\d*)\/([^?#]+)/);
  if (!m) throw new Error(`DATABASE_URL inválida: ${url.substring(0, 30)}...`);

  const [, user, password, host, port, database] = m;
  const ssl = url.includes('sslmode=disable') ? false : undefined;

  return { user, password, host, port: parseInt(port) || 5432, database, ssl };
};

const dbConfig = parseDbUrl(process.env.DATABASE_URL);

console.log(`🔌 DB: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

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
