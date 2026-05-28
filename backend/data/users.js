import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin Korisnik',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    isGymMember: true,
    gymCode: 'FITNES2026',
    membershipExpires: null,
  },
  {
    name: 'Vukašin Član',
    email: 'clan@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isGymMember: true,
    gymCode: 'FITNES2026',
    membershipExpires: null, // reset for testing purchases
  },
  {
    name: 'Petar Običan',
    email: 'petar@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    isGymMember: false, // Običan registrovan korisnik, nema kod
    gymCode: '',
    membershipExpires: null,
  }
];

export default users;