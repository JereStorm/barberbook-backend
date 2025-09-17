// generate-hash.js -> lo utilice para generar el hash inicial de superadmin
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'SuperAdmin123!'; // escribir el texto a hashear, y correr el script
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash válido:', isValid);
}

generateHash();