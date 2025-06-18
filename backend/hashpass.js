const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'architectpass'; // Replace with your desired password

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log('Hashed Password:', hash);
});