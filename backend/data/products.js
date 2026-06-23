const products = [
  // --- KATEGORIJA: SUPLEMENTI ---
  {
    name: 'Whey Gold Standard',
    image: 'https://images.unsplash.com/photo-1693996045300-521e9d08cabc?q=80&w=1170&auto=format&fit=crop',
    description: 'Najprodavaniji protein na svetu. 24g proteina po dozi za maksimalan oporavak mišića nakon treninga.',
    brand: 'Optimum Nutrition',
    category: 'Suplementi',
    price: 9500,
    countInStock: 15,
    rating: 4.7,
    numReviews: 3,
    reviews: [ { rating: 5 }, { rating: 4 }, { rating: 5 } ]
  },
  {
    name: 'Creatine Monohydrate',
    image: 'https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop',
    description: 'Čist, mikronizovani kreatin monohidrat za povećanje eksplozivne snage i mišićne mase.',
    brand: 'Creapure',
    category: 'Suplementi',
    price: 2500,
    countInStock: 20,
    rating: 4.5,
    numReviews: 2,
    reviews: [ { rating: 5 }, { rating: 4 } ]
  },
  {
    name: 'BCAA Xtend Energy',
    image: 'https://images.unsplash.com/photo-1709976142774-ce1ef41a8378?q=80&w=1170&auto=format&fit=crop',
    description: 'Aminokiseline razgranatog lanca sa dodatkom elektrolita za hidrataciju tokom najtežih treninga.',
    brand: 'Xtend',
    category: 'Suplementi',
    price: 3200,
    countInStock: 8,
    rating: 5.0,
    numReviews: 2,
    reviews: [ { rating: 5 }, { rating: 5 } ]
  },
  {
    name: 'C4 Pre-Workout',
    image: 'https://images.unsplash.com/photo-1693996047008-1b6210099be1?q=80&w=1170&auto=format&fit=crop',
    description: 'Eksplozivna energija, fokus i izdržljivost. Idealan za podizanje intenziteta treninga na viši nivo.',
    brand: 'Cellucor',
    category: 'Suplementi',
    price: 3800,
    countInStock: 12,
    rating: 4.3,
    numReviews: 3,
    reviews: [ { rating: 4 }, { rating: 4 }, { rating: 5 } ]
  },
  {
    name: 'Casein Protein',
    image: 'https://images.unsplash.com/photo-1622484211148-716598e04141?q=80&w=1170&auto=format&fit=crop',
    description: 'Spororazgradivi protein idealan za konzumaciju pre spavanja kako bi se sprečio katabolizam mišića.',
    brand: 'Optimum Nutrition',
    category: 'Suplementi',
    price: 8900,
    countInStock: 7,
    rating: 4.6,
    numReviews: 2,
    reviews: [ { rating: 5 }, { rating: 4 } ]
  },

  // --- KATEGORIJA: ZDRAVLJE ---
  {
    name: 'Multivitamin Sport',
    image: 'https://images.unsplash.com/photo-1627467959547-8e44da7aa00a?q=80&w=1074&auto=format&fit=crop',
    description: 'Kompleksna formula vitamina i minerala prilagođena potrebama sportista i aktivnih osoba.',
    brand: 'Animal Pak',
    category: 'Zdravlje',
    price: 4800,
    countInStock: 5,
    rating: 5.0,
    numReviews: 1,
    reviews: [ { rating: 5 } ]
  },
  {
    name: 'Omega-3 Riblje Ulje',
    image: 'https://images.unsplash.com/photo-1693996047034-311ab7656691?q=80&w=1170&auto=format&fit=crop',
    description: 'Visoko koncentrovane esencijalne masne kiseline za zdravlje srca, zglobova i smanjenje upala.',
    brand: 'Now Foods',
    category: 'Zdravlje',
    price: 2400,
    countInStock: 18,
    rating: 4.4,
    numReviews: 2,
    reviews: [ { rating: 4 }, { rating: 5 } ]
  },
  {
    name: 'ZMA (Cink, Magnezijum, B6)',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=1170&auto=format&fit=crop',
    description: 'Prirodna formula koja poboljšava kvalitet sna, ubrzava oporavak i podržava nivo testosterona.',
    brand: 'MyProtein',
    category: 'Zdravlje',
    price: 1900,
    countInStock: 22,
    rating: 4.8,
    numReviews: 4,
    reviews: [ { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 } ]
  },
  {
    name: 'Vitamin D3 + K2',
    image: 'https://images.unsplash.com/photo-1545050004-16bca9d98c97?q=80&w=1170&auto=format&fit=crop',
    description: 'Vitamin D3 uz K2 za podršku kostiju i imuniteta, naročito tokom zimske sezone.',
    brand: "Nature's Way",
    category: 'Zdravlje',
    price: 2200,
    countInStock: 16,
    rating: 4.6,
    numReviews: 3,
    reviews: [ { rating: 5 }, { rating: 5 }, { rating: 4 } ]
  },

  // --- KATEGORIJA: OPREMA ---
  {
    name: 'Premium Šejker 700ml',
    image: 'https://images.unsplash.com/photo-1590506231970-b268a0fde7b6?q=80&w=687&auto=format&fit=crop',
    description: 'BPA-free šejker od 700ml sa mrežicom za savršeno mešanje bez grudvica.',
    brand: 'GymGear',
    category: 'Oprema',
    price: 900,
    countInStock: 50,
    rating: 4.0,
    numReviews: 1,
    reviews: [ { rating: 4 } ]
  },
  {
    name: 'Kožne Rukavice za Trening',
    image: 'https://images.unsplash.com/photo-1557127972-1c446ea89ea5?q=80&w=687&auto=format&fit=crop',
    description: 'Kvalitetne kožne rukavice sa ojačanjem za zglobove, štite dlanove tokom teških liftova.',
    brand: 'Nike',
    category: 'Oprema',
    price: 2900,
    countInStock: 14,
    rating: 4.5,
    numReviews: 2,
    reviews: [ { rating: 5 }, { rating: 4 } ]
  },
  {
    name: 'Elastične Trake (Set)',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1170&auto=format&fit=crop',
    description: 'Set od 5 elastičnih traka različitog otpora za trening celog tela kod kuće ili u teretani.',
    brand: 'PowerFit',
    category: 'Oprema',
    price: 1500,
    countInStock: 30,
    rating: 4.7,
    numReviews: 3,
    reviews: [ { rating: 5 }, { rating: 4 }, { rating: 5 } ]
  },
  {
    name: 'Premium Sports Towel',
    image: 'https://images.unsplash.com/photo-1541544180110-5c7b0b9ba752?q=80&w=1170&auto=format&fit=crop',
    description: 'Meka i upijajuća sportska peškira sa anti-bakterijskom zaštitom, idealna za teretanu.',
    brand: 'GymSoft',
    category: 'Oprema',
    price: 2300,
    countInStock: 24,
    rating: 4.9,
    numReviews: 6,
    reviews: [ { rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 } ]
  },

  // --- KATEGORIJA: ČLANARINE ---
  {
    name: 'Mesečna - Pun Pristup',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1170&auto=format&fit=crop',
    description: 'Mesečna članarina sa neograničenim pristupom. Uključuje teretanu, kardio zonu i sve termine (06:00 - 00:00) tokom 30 dana.',
    brand: 'PowerFit',
    category: 'Članarine',
    price: 3500,
    countInStock: 30,
    rating: 4.9,
    numReviews: 4,
    reviews: [ { rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 } ]
  },
  {
    name: 'Mesečna - Jutarnji Termin',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1170&auto=format&fit=crop',
    description: 'Mesečna članarina za jutarnje tipove. Pristup teretani i kardio programu u terminu od 06:00 do 12:00 časova.',
    brand: 'PowerFit',
    category: 'Članarine',
    price: 2500,
    countInStock: 30,
    rating: 5.0,
    numReviews: 1,
    reviews: [ { rating: 5 } ]
  },
  {
    name: 'Mesečna - Popodnevni Termin',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1169&auto=format&fit=crop',
    description: 'Mesečna članarina prilagođena poslepodnevnim treninzima. Pristup kompletnom objektu u terminu od 12:00 do 17:00 časova.',
    brand: 'PowerFit',
    category: 'Članarine',
    price: 2900,
    countInStock: 30,
    rating: 4.6,
    numReviews: 2,
    reviews: [ { rating: 4 }, { rating: 5 } ]
  }
];

export default products;
