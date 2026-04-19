/**
 * SiteFlash AI - Script de criação do banco de dados
 * Executa o init.sql diretamente via pg
 */
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const run = async () => {
  console.log('\n🔌 Conectando ao PostgreSQL...');
  console.log(`   URL: ${process.env.DATABASE_URL?.replace(/:\/\/.*@/, '://<credentials>@')}\n`);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Testa conexão
    const test = await pool.query('SELECT version()');
    console.log('✅ Conectado!');
    console.log(`   ${test.rows[0].version.split(',')[0]}\n`);

    // Lê o init.sql
    const sqlFile = path.join(__dirname, '../db/init.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    console.log('📦 Executando schema (init.sql)...\n');

    // Executa o SQL completo
    await pool.query(sql);

    console.log('✅ Tabelas criadas com sucesso!');

    // Verifica o que foi criado
    const tables = await pool.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log('\n📋 Tabelas no banco:');
    tables.rows.forEach(r => console.log(`   ✓ ${r.tablename}`));

    // Verifica templates inseridos
    const templates = await pool.query('SELECT COUNT(*) FROM templates');
    console.log(`\n🎨 Templates de nicho: ${templates.rows[0].count} registros`);

    console.log('\n🚀 Banco de dados configurado! Agora rode:');
    console.log('   node src/server.js\n');

  } catch (err) {
    console.error('\n❌ Erro:', err.message);

    if (err.message.includes('does not exist') && err.message.includes('database')) {
      console.log('\n💡 O banco "pixelize" não existe ainda. Tentando criar...');
      
      // Conecta no banco padrão 'postgres' para criar
      const adminUrl = process.env.DATABASE_URL.replace('/pixelize', '/postgres');
      const adminPool = new Pool({ connectionString: adminUrl });
      
      try {
        await adminPool.query('CREATE DATABASE pixelize');
        console.log('✅ Banco "pixelize" criado! Rode o script novamente.');
        await adminPool.end();
      } catch (createErr) {
        console.error('❌ Erro ao criar banco:', createErr.message);
      }
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
};

run();
