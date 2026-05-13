import bcrypt from "bcryptjs";

const users = [
    {
        name: "Admin User",
        email: "admin@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: true,
    },
    {
        name: "Masa Saranovic",
        email: "masa@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
    },
    {
        name: "Sofija Djordjevic",
        email: "sofija@email.com",
        password: bcrypt.hashSync("123456", 10),
        isAdmin: false,
    }
];

export default users;