/**
 * Moroccan Names and Demo Identity Utilities
 */

const MOROCCAN_NAMES = [
  { name: 'Mohammed', gender: 'H' },
  { name: 'Ahmed', gender: 'H' },
  { name: 'Yassine', gender: 'H' },
  { name: 'Amine', gender: 'H' },
  { name: 'Omar', gender: 'H' },
  { name: 'Mehdi', gender: 'H' },
  { name: 'Hamza', gender: 'H' },
  { name: 'Karim', gender: 'H' },
  { name: 'Ali', gender: 'H' },
  { name: 'Driss', gender: 'H' },
  { name: 'Anas', gender: 'H' },
  { name: 'Khalid', gender: 'H' },
  { name: 'Hassan', gender: 'H' },
  { name: 'Brahim', gender: 'H' },
  { name: 'Adil', gender: 'H' },
  { name: 'Fatine', gender: 'F' },
  { name: 'Salma', gender: 'F' },
  { name: 'Imane', gender: 'F' },
  { name: 'Sanae', gender: 'F' },
  { name: 'Khadija', gender: 'F' },
  { name: 'Meriem', gender: 'F' },
  { name: 'Laila', gender: 'F' },
  { name: 'Zineb', gender: 'F' },
  { name: 'Kenza', gender: 'F' },
  { name: 'Sara', gender: 'F' },
  { name: 'Houda', gender: 'F' },
  { name: 'Ghita', gender: 'F' },
  { name: 'Yousra', gender: 'F' },
  { name: 'Malak', gender: 'F' },
  { name: 'Nour', gender: 'F' },
];

const MOROCCAN_SURNAMES = [
  'Berrada', 'El Fassi', 'Bennani', 'Chraibi', 'Alaoui', 'Idrissi', 'Mansouri', 'Tazi', 'Guessous', 'Zouiten',
  'Amrani', 'Filali', 'Zahraoui', 'Belkhayat', 'Azoulay', 'Benjelloun', 'Lahlou', 'Bouanani', 'Radi', 'Seghir'
];

export function generateDemoIdentity() {
  const randomEntry = MOROCCAN_NAMES[Math.floor(Math.random() * MOROCCAN_NAMES.length)];
  const randomSurname = MOROCCAN_SURNAMES[Math.floor(Math.random() * MOROCCAN_SURNAMES.length)];
  const randomId = Math.floor(1000 + Math.random() * 9000);
  const currentYear = new Date().getFullYear();
  
  const firstName = randomEntry.name;
  // Use 'Ben Ali' 20% of the time, otherwise random Moroccan surname
  const lastName = Math.random() > 0.8 ? 'Ben Ali' : randomSurname;
  const username = `${firstName.toLowerCase()}.${randomId}`;
  const password = `${firstName}2026`;
  const email = `${username}@demo.voyage.ma`;
  
  return {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    username,
    password,
    email,
    gender: randomEntry.gender as 'H' | 'F',
    year: currentYear
  };
}
