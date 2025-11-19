import { testConnection, syncDatabase } from '@/lib/infrastructure/orm/sequelize/config';

/**
 * Initialize Database Connection
 * Tests connection and syncs models with database
 */
export async function initDatabase(options?: { force?: boolean; alter?: boolean }) {
  console.log('🔄 Initializing database connection...');

  // Test connection
  const connected = await testConnection();
  if (!connected) {
    throw new Error('Failed to connect to database');
  }

  // Sync database (create tables if they don't exist)
  if (options?.force !== undefined) {
    console.log('⚠️  Syncing database with force option...');
    await syncDatabase(options.force);
  } else {
    console.log('🔄 Syncing database...');
    await syncDatabase(false);
  }

  console.log('✅ Database initialized successfully');
}


