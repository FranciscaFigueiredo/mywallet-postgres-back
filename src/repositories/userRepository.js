import { connection } from '../database/database.js';

async function findEmail({ email }) {
    const existingUser = await connection.query(
        'SELECT * FROM users WHERE email = $1;',
        [email],
    );
    return existingUser.rows;
}

async function create({ name, email, password }) {
    try {
        const userCreated = await connection.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;',
            [name, email, password],
        );

        return userCreated;
    } catch (error) {
        return false;
    }
}

export {
    findEmail,
    create,
};
