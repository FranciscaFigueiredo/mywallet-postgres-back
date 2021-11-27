import faker from 'faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as userRepository from '../../src/repositories/userRepository.js';

async function createUser() {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = '123123123';
    const hashedPassword = bcrypt.hashSync('123123123', 10);

    const user = await userRepository.create({ name, email, password: hashedPassword });

    const data = {
        ...user,
        password,
    };

    return data;
}

async function createToken() {
    const user = await createUser();

    const token = jwt.sign({
        userId: user.id,
    }, process.env.JWT_SECRET);

    return {
        user,
        token,
    };
}

export {
    createUser,
    createToken,
};
