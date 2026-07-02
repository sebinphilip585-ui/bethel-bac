import { supabase } from './database/supabase.js';

async function seed() {
  console.log('Seeding new luxury rooms...');

  // 1. Deactivate old rooms (safer than delete due to foreign keys)
  const { error: errDeactivate } = await supabase.from('rooms').update({ active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
  if (errDeactivate) console.log('Notice: Could not deactivate old rooms:', errDeactivate);

  const roomsData = [
    { name: 'Beckingham', bhk: '2BHK', base_price: 4500, max_guests: 4 },
    { name: 'Beverly Hills', bhk: '2BHK', base_price: 4500, max_guests: 4 },
    { name: 'Belrose', bhk: '1BHK', base_price: 2500, max_guests: 2 },
    { name: 'Blooms Bay', bhk: '2BHK', base_price: 4500, max_guests: 4 },
    { name: 'Blue Bell', bhk: '1BHK', base_price: 2500, max_guests: 2 },
    { name: 'Beehive', bhk: '1BHK', base_price: 2500, max_guests: 2 },
    { name: 'Belarus', bhk: '3BHK', base_price: 6500, max_guests: 6 },
    { name: 'Breeze Garden', bhk: '1BHK', base_price: 2500, max_guests: 2 },
    { name: 'Brook Hills', bhk: '1BHK', base_price: 2500, max_guests: 2 },
    { name: 'Bliss Heaven', bhk: '1BHK', base_price: 2500, max_guests: 2 },
  ];

  for (let i = 0; i < roomsData.length; i++) {
    const r = roomsData[i];
    
    // Create Room Type
    let type;
    const { data: insertedType, error: typeErr } = await supabase.from('room_types').insert([{
      name: r.name,
      slug: r.name.toLowerCase().replace(/ /g, '-'),
      description: `Premium ${r.bhk} Serviced Apartment`,
      base_price: r.base_price,
      max_guests: r.max_guests,
      size_sqft: r.bhk === '1BHK' ? 600 : (r.bhk === '2BHK' ? 900 : 1200),
      bed_type: r.bhk === '1BHK' ? '1 King Bed' : '2 King Beds'
    }]).select().single();

    if (typeErr && typeErr.code === '23505') {
      const { data: existingType } = await supabase.from('room_types').select().eq('name', r.name).single();
      type = existingType;
    } else if (typeErr) {
      console.error('Failed to insert type:', r.name, typeErr);
      continue;
    } else {
      type = insertedType;
    }

    // Create Room
    const { error: roomErr } = await supabase.from('rooms').insert([{
      room_number: `10${i}`,
      room_type_id: type.id,
      floor: 1,
      status: 'available',
      active: true
    }]);

    if (roomErr) {
      console.error('Failed to insert room:', r.name, roomErr);
    } else {
      console.log('Successfully inserted:', r.name);
    }
  }

  console.log('Finished seeding.');
  process.exit(0);
}

seed();
