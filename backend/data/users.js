import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
        isMember: false,
    },
    {
        name: "Vukasin Petković",
        email: "vukasin.petkovic@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
        isMember: false,
    }
];

export default users;
