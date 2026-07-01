import { supabase } from './database/supabase.js';

async function seed() {
  const roomsData = [
    { name: 'Beverly Hills', num: '801' },
    { name: 'Belrose', num: '802' },
  ];

  for (const r of roomsData) {
    const { data: type } = await supabase.from('room_types').select().eq('name', r.name).single();
    
    if (type) {
      const { error: roomErr } = await supabase.from('rooms').insert([{
        room_number: r.num,
        room_type_id: type.id,
        floor: 2,
        status: 'available',
        active: true
      }]);
      if (roomErr) console.error('Error inserting room:', r.name, roomErr);
      else console.log('Successfully inserted:', r.name);
    }
  }
  process.exit(0);
}
seed();
