const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Database is ready for real user registrations.');
    console.log('No demo accounts created. All accounts must be registered through the application.');
    console.log('');
    console.log('To create an admin account, use the following command in MongoDB shell:');
    console.log('  use smart_fyp');
    console.log('  db.users.insertOne({');
    console.log('    name: "Admin Name",');
    console.log('    email: "admin@university.edu",');
    console.log('    password: "<bcrypt-hashed-password>",');
    console.log('    role: "admin",');
    console.log('    department: "Computer Science",');
    console.log('    isActive: true');
    console.log('  })');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
