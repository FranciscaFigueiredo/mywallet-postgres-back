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

        return userCreated.rows[0];
    } catch (error) {
        return false;
    }
}

async function drop({ userId }) {
    try {
        await connection.query('DELETE FROM sessions WHERE "userId" = $1;', [
            userId,
        ]);

        return true;
    } catch (error) {
        return false;
    }
}

async function createSession({ token, userId }) {
    try {
        const user = await connection.query(
            `
            INSERT INTO sessions
                (token, "userId")
            VALUES ($1, $2)
            RETURNING *;
        `,
            [token, userId],
        );

        return user.rows[0];
    } catch (error) {
        return false;
    }
}

async function dropSession({ userId }) {
    try {
        await connection.query(
            'DELETE FROM sessions WHERE token = $1;',
            [userId],
        );

        return true;
    } catch (error) {
        return false;
    }
}

async function findById({ userId }) {
    try {
        const user = await connection.query(
            'SELECT * FROM sessions JOIN users ON users.id = sessions."userId" WHERE userId = $1;',
            [userId],
        );

        return user.rows[0];
    } catch (error) {
        return false;
    }
}

async function getUser({ userId }) {
    try {
        const user = await connection.query(
            'SELECT name FROM users WHERE id = $1;',
            [userId],
        );
        return user.rows[0];
    } catch (error) {
        return false;
    }
}

export {
    findEmail,
    create,
    drop,
    createSession,
    dropSession,
    getUser,
    findById,
};
