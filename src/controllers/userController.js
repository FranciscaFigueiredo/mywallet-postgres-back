import { connection } from '../database/database.js';
import * as userService from '../services/userService.js';
import { loginSchema } from '../validation/login.js';
import { userSchema } from '../validation/users.js';

// eslint-disable-next-line consistent-return
async function signUp(req, res) {
    const { name, email, password } = req.body;

    const validate = userSchema.validate({
        name,
        email,
        password,
    });

    if (validate.error) {
        return res.status(400).send(validate.error.message);
    }

    try {
        const registration = await userService.authenticateRegistration({ name, email, password });

        if (registration === null) {
            return res.status(409).send('Email já cadastrado na plataforma');
        }

        // if (registration) {
        return res.status(201).send('Usuário cadastrado com sucesso');
        // }
    } catch (error) {
        return res.status(500).send({ message: 'O banco de dados está offline' });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    const validate = loginSchema.validate({
        email,
        password,
    });

    if (validate.error) {
        return res.status(400).send(validate.error.message);
    }

    try {
        const userLogin = await userService.authenticateLogin({ email, password });

        if (userLogin.user === null) {
            return res.status(401).send('Usuário não cadastrado');
        }

        return res.status(200).send(userLogin.user.token);
    } catch (error) {
        return res
            .status(500)
            .send({ message: 'O banco de dados está offline' });
    }
}

async function getUser(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const user = await connection.query(
            'SELECT name FROM sessions JOIN users ON users.id = "userId" WHERE token = $1;',
            [token],
        );
        return res.send(user.rows[0]);
    } catch (error) {
        return res
            .status(500)
            .send({ message: 'O banco de dados está offline' });
    }
}

async function logout(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const deleted = await connection.query(
            'DELETE FROM sessions WHERE token = $1;',
            [token],
        );
        return res.send(deleted.rows);
    } catch (error) {
        return res
            .status(500)
            .send({ message: 'O banco de dados está offline' });
    }
}

export {
    signUp,
    login,
    logout,
    getUser,
};
