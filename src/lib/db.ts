import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Conexión a PostgreSQL establecida');
  }
});

pool.on('error', (err: Error) => {
  console.error('❌ Error en PostgreSQL pool:', err);
});

export async function query(text: string, params?: (string | number)[]): Promise<QueryResult> {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export default pool;

