import faker from 'faker';
import bcrypt from 'bcrypt';
import * as userRepository from '../../src/repositories/userRepository.js';

async function createUser() {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = '123123123';
    const hashedPassword = bcrypt.hashSync('123123123', 10);

    const user = await userRepository.create({ name, email, hashedPassword });

    const data = {
        ...user.rows[0],
        password,
    };

    // data.id = user.rows[0].id;

    return data;
}

// async function logUser({ name, email, password } = {}) {
//     const data = {
//         name: name || faker.name.findName(),
//         email: email || faker.internet.email(),
//         password: password || "123456",
//         hashedPassword: bcrypt.hashSync(password || "123456", 10)
//     };

//     const user = await connection.query(
//         'INSERT INTO "users" ("name", "email", "password") VALUES ($1, $2, $3) RETURNING *',
//         [data.name, data.email, data.hashedPassword]
//     );

//     data.id = user.rows[0].id;

//     return data;
// }

export {
    createUser,
};
