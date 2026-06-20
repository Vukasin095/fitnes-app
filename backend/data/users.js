import bcrypt from "bcryptjs";

const users = [
    // --- ADMINISTRATORI ---
    {
        name: "Admin User",
        email: "admin@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
        isMember: false,
    },
    // --- AKTIVNI ČLANOVI TERETANE (Admin im je ručno u profilu stavio isMember: true) ---
    {
        name: "Vukašin Petković",
        email: "vukasin@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
        isMember: true, // Otključane su mu online članarine
    },
    {
        name: "Masa Saranovic",
        email: "masa@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
        isMember: true,
    },
    {
        name: "Sofija Djordjevic",
        email: "sofija@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
        isMember: true,
    },
    // --- STANDARDNI REGISTROVANI KORISNICI (Mogu samo da kupuju u šopu) ---
    {
        name: "Nikola Nikić",
        email: "nikola@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
        isMember: false, // Sekcija za članarine mu je zaključana dok ne plati uživo
    },
    {
        name: "Jovan Jovanović",
        email: "jovan@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
        isMember: false,
    }
];

export default users;