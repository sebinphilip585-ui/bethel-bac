import { supabase } from './supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function seed() {
  console.log('Seeding demo users...');
  
  const password = 'password';
  const password_hash = await bcrypt.hash(password, 10);
  
  const users = [
    {
      id: crypto.randomUUID(),
      name: 'Admin User',
      email: 'admin@bethelmeadows.com',
      role: 'admin',
      password_hash
    },
    {
      id: crypto.randomUUID(),
      name: 'Manager User',
      email: 'manager@bethelmeadows.com',
      role: 'manager',
      password_hash
    },
    {
      id: crypto.randomUUID(),
      name: 'Receptionist User',
      email: 'reception@bethelmeadows.com',
      role: 'receptionist',
      password_hash
    }
  ];

  for (const user of users) {
    // Check if user exists
    const { data: existing } = await supabase.from('profiles').select('id').eq('email', user.email).single();
    if (existing) {
      console.log(`User ${user.email} already exists.`);
      continue;
    }

    const { error } = await supabase.from('profiles').insert([user]);
    if (error) {
      console.error(`Failed to create ${user.email}:`, error);
    } else {
      console.log(`Successfully created ${user.email}`);
    }
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed();
