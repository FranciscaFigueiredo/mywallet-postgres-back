import bcrypt from 'bcrypt';
import * as userRepository from '../repositories/userRepository.js';

async function authenticateRegistration({ name, email, password }) {
    const hash = bcrypt.hashSync(password, 10);

    const search = await userRepository.findEmail({ email });

    if (search.length) {
        return null;
    }

    const createUser = userRepository.create({ name, email, password: hash });

    return createUser;
}

export {
    authenticateRegistration,
};
