require('dotenv').config();
const mongoose = require('mongoose');

async function dropOldIndices() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Get all indices
    const indices = await collection.indexes();
    console.log('📋 Current indices:', indices.map(i => i.name).join(', '));

    // Drop clerkId index if it exists
    try {
      await collection.dropIndex('clerkId_1');
      console.log('✅ Dropped clerkId_1 index');
    } catch (err) {
      if (err.codeName === 'IndexNotFound') {
        console.log('⚠️  clerkId_1 index not found (already dropped)');
      } else {
        throw err;
      }
    }

    // Show remaining indices
    const remainingIndices = await collection.indexes();
    console.log('📋 Remaining indices:', remainingIndices.map(i => i.name).join(', '));
    
    console.log('✅ Database cleanup complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropOldIndices();
