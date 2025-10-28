// Test file to verify events import
import * as supabaseLib from './lib/supabase.js';

console.log('Testing events import...');
console.log('Supabase lib:', supabaseLib);
console.log('Events object:', supabaseLib.events);
console.log('Events.getAll:', supabaseLib.events?.getAll);
console.log('Type of getAll:', typeof supabaseLib.events?.getAll);

// Test if we can call the function
if (supabaseLib.events && typeof supabaseLib.events.getAll === 'function') {
  console.log('✅ Events import is working correctly');
} else {
  console.log('❌ Events import is not working');
}

