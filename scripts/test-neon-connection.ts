/**
 * Quick Neon Connection Test
 * Run with: npx ts-node scripts/test-neon-connection.ts
 */

import { testConnection } from '../lib/infrastructure/orm/sequelize/config';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function testNeonConnection() {
  console.log('🔍 Testing Neon Database Connection...\n');
  
  // Check if DATABASE_URL is defined
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERROR: DATABASE_URL is not defined');
    console.error('📝 Please create a .env or .env.local file with your Neon DATABASE_URL');
    console.error('\nExample:');
    console.error('DATABASE_URL=postgresql://username:password@project-ref.neon.tech/neondb?sslmode=require');
    process.exit(1);
  }

  // Mask password in URL for logging
  const maskedUrl = process.env.DATABASE_URL.replace(
    /:[^:@]+@/,
    ':****@'
  );
  console.log('📊 Database URL (masked):', maskedUrl);
  console.log('');

  // Test connection
  try {
    const connected = await testConnection();
    
    if (connected) {
      console.log('\n✅ SUCCESS! Your Neon database is connected and ready to use.');
      console.log('\n📝 Next steps:');
      console.log('   1. Run: npm run db:sync');
      console.log('   2. Run: npm run dev');
      console.log('   3. Open: http://localhost:3000');
      process.exit(0);
    } else {
      console.error('\n❌ FAILED: Could not connect to Neon database');
      console.error('\n🔧 Troubleshooting:');
      console.error('   1. Verify your Neon project is active at https://console.neon.tech');
      console.error('   2. Check that your DATABASE_URL credentials are correct');
      console.error('   3. Ensure sslmode=require is in your connection string');
      console.error('   4. Check your internet connection');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ ERROR:', error);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Verify DATABASE_URL format is correct');
    console.error('   2. Check Neon console for connection string');
    console.error('   3. Ensure SSL is enabled (sslmode=require)');
    process.exit(1);
  }
}

testNeonConnection();


