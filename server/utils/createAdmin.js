const mongoose = require('mongoose');
const dotenv = require('dotenv');
const readline = require('readline');
const User = require('../models/User');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const existing = await User.findOne({ role: 'admin' });
    if (existing) {
      console.log(`Admin account already exists: ${existing.name} (${existing.email})`);
      const answer = await ask('Create another admin? (y/n): ');
      if (answer.toLowerCase() !== 'y') {
        console.log('Aborted.');
        process.exit(0);
      }
    }

    console.log('--- Create Admin Account ---\n');
    const name = await ask('Full Name: ');
    const email = await ask('Email: ');
    const password = await ask('Password (min 6 chars): ');
    const department = await ask('Department: ');

    if (!name || !email || !password || password.length < 6) {
      console.log('\nError: Name, email, and password (6+ chars) are required.');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`\nError: User with email ${email} already exists.`);
      process.exit(1);
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
      department: department || 'Administration',
      isActive: true,
    });

    console.log(`\n✓ Admin account created successfully!`);
    console.log(`  Name:  ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Role:  ${admin.role}`);
    console.log(`\nYou can now log in at /login with the Admin role.`);

    process.exit(0);
  } catch (error) {
    console.error('\nError:', error.message);
    process.exit(1);
  }
};

createAdmin();
