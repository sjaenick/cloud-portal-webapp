/**
 * Class for generation of random names.
 */
export class RandomNameGenerator {
  ADJECTIVES: string[] = ['quick', 'powerful', 'ambitious', 'accurate', 'clever', 'timeless', 'fast', 'rapid', 'agile',
  'precise', 'capable', 'dynamic', 'moving'];
  SCIENTISTS: string[] = ['Einstein', 'Hertz', 'Newton', 'Hawking', 'Galilei', 'Kepler', 'Gauss', 'Darwin',
    'Schroedinger', 'Wilkins', 'Turing', 'Knuth', 'Zuse', 'Backus', 'Euler', 'Hopper', 'Curie', 'Rutherford', 'Faraday'];
  MORE_SCIENTISTS: string[] = ['Adanson', 'Alaga', 'Ampere', 'Arkwright', 'Arrhenius', 'Attenborough', 'Audubon', 'Avogadro', 'Babbage',
    'Bacaloglu', 'Baird', 'Ball', 'Ballot', 'Barut', 'Becquerel', 'Bell', 'Benz', 'Bernard', 'Berners', 'Bernoulli', 'Berzelius', 'Blaauw',
    'Blanchard', 'Bleriot', 'Boas', 'Bohr', 'Boltzmann', 'Born', 'Boyle', 'Boys', 'Brahe', 'Braille', 'Braun', 'Browning', 'Buick', 'Bush',
    'Buys', 'Cacciatore', 'Cai', 'Callendar', 'Cannon', 'Carey', 'Carrier', 'Carson', 'Cassini', 'Cavendish', 'Celsius', 'Chance', 'Colt',
    'Copernicus', 'Corliss', 'Crick', 'Cugnot', 'Curie', 'Cuvier', 'Daguerre', 'Daimler', 'Dalton', 'Darwin', 'Das', 'DaVinci', 'Davy',
    'Dawkins', 'DeBroglie', 'DeCoulomb', 'DelMonte', 'Diesel', 'Dirac', 'Dumont', 'Eastman', 'Eddington', 'Edison', 'Einstein',
    'Fahrenheit', 'Faraday', 'Fender', 'Fermi', 'Feynman', 'Fischer', 'Flammarion', 'Fleming', 'Ford', 'Fulton', 'Galilei', 'Galvani',
    'Gaposchkin', 'Gauss', 'Gay', 'Goodall', 'Goodenough', 'Goodyear', 'Gregory', 'Guliyev', 'Gutenberg', 'Haeckel', 'Hahn', 'Halley',
    'Hawking', 'Heezen', 'Heisenberg', 'Helmholtz', 'Herschel', 'Hertzsprung', 'Hill', 'Hollerith', 'Hooke', 'Hubble', 'Huggins', 'Huxley',
    'Huygens', 'IbnAl-Haitham', 'Jacquard', 'Jenner', 'Joule', 'Jump', 'Kapteyn', 'Keeling', 'Kepler', 'Kirchhoff', 'Kitzinger', 'Kohn',
    'Kudirka', 'Kuiper', 'Lamarck', 'Laplace', 'Lavoisier', 'Leavitt', 'Lee', 'Levi', 'Liebig', 'Linnaeus', 'Lippmann', 'Lomonosov',
    'Lorentz', 'Lorenz', 'Lussac', 'Mach', 'Marconi', 'Maury', 'Maxwell', 'Maybach', 'Mayor', 'Meitner', 'Mendel', 'Mendeleev', 'Messier',
    'Meucci', 'Michelson', 'Minnaert', 'Morse', 'Mouchot', 'Mueller', 'Newcomen', 'Newton', 'Nicolescu', 'Niepce', 'Nobel', 'Ohm', 'Oort',
    'Oppenheimer', 'Oriani', 'Orsted', 'Ostwald', 'Otto', 'Pannekoek', 'Papin', 'Pasteur', 'Patterson', 'Pauli', 'Pauling', 'Pavlov',
    'Payne', 'Peebles', 'Penkala', 'Pickering', 'Planck', 'Porsche', 'Pouillet', 'Queloz', 'Reichs', 'Remington', 'Rittenhouse', 'Romer',
    'Roentgen', 'Rowlinson', 'Rubik', 'Rubin', 'Runge', 'Russell', 'Rutherford', 'Sagan', 'Sakharov', 'Salk', 'Santos', 'Sax',
    'Schliemann', 'Schroedinger', 'Senefelder', 'Sharps', 'Shuman', 'Siemens', 'Sikorsky', 'Slipher', 'Smith', 'Stephenson',
    'Stojanovic', 'Stroemgren', 'Strowger', 'Supek', 'Talbot', 'Teller', 'Tesla', 'Tharp', 'Thompson', 'Thomson', 'Torricelli',
    'Torvalds', 'VanDerWaals', 'VanLeeuwenhoek', 'Vesalius', 'Virchow', 'Volta', 'VonFraunhofer', 'Wallace', 'Watson', 'Watt', 'Wegener',
    'Wesson', 'Westinghouse', 'Whiting', 'Wien', 'Wollaston', 'Wright', 'Young', 'Zeeman', 'Zuse', 'Zwicky'];

  randomAdj(): string {
    const index: number = Math.floor(Math.random() * this.ADJECTIVES.length);

    return this.ADJECTIVES[index];
  }

  randomSct(): string {
    const index: number = Math.floor(Math.random() * this.SCIENTISTS.length);

    return this.SCIENTISTS[index];
  }

  randomMoreSct(): string {
    const index: number = Math.floor(Math.random() * this.MORE_SCIENTISTS.length);

    return this.MORE_SCIENTISTS[index];
  }

  randomName(): string {
    const randomName: string = this.randomAdj() + this.randomSct();

    return randomName;
  }
}
