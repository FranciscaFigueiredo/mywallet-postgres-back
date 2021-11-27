import dayjs from 'dayjs';
import { connection } from '../database/database.js';
import { statementSchema } from '../validation/statement.js';

async function createStatement(req, res) {
    const { type } = req.query;

    const token = req.headers.authorization?.replace('Bearer ', '');

    const { value, description } = req.body;

    const validate = statementSchema.validate({
        value,
        description,
    });

    if (validate.error) {
        return res.status(400).send(validate.error.message);
    }

    let valueData = value;

    if (type === 'exit' && value > 0) {
        valueData *= -1;
    }

    if (type === 'entry' && value < 0) {
        valueData *= -1;
    }

    if (!token) {
        return res.sendStatus(401);
    }

    const dateToday = dayjs().locale('pt-Br').format('DD/MM/YYYY HH:mm:ss');

    try {
        const search = await connection.query(
            `
            SELECT 
                users.*,
                sessions.*
            FROM users
            JOIN sessions
                ON users.id = sessions."userId"
            WHERE sessions.token = $1;
        `,
            [token],
        );

        if (!search.rows.length) {
            return res.sendStatus(401);
        }

        const user = search.rows;

        await connection.query(
            `
            INSERT INTO statement
                ("userId", value, description, date)
            VALUES
                ($1, $2, $3, $4);
        `,
            [user[0].userId, valueData, description, dateToday],
        );

        return res.status(200).send('Informação adicionada à carteira');
    } catch (error) {
        return res
            .status(500)
            .send({ message: 'O banco de dados está offline' });
    }
}

async function getStatement(req, res) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const wallet = await connection.query(
            `
            SELECT 
                statement.value, statement.description, statement.date
            FROM 
                statement 
            JOIN sessions 
                ON sessions."userId" = statement."userId"
                    AND sessions.token = $1;
        `,
            [token],
        );
        const total = await connection.query(
            `
            SELECT SUM(value) AS total 
            FROM statement 
            JOIN sessions 
                ON sessions."userId" = statement."userId" 
            WHERE token = $1;
        `,
            [token],
        );

        const walletData = wallet.rows;
        const totalData = total.rows[0].total;

        return res.status(200).send({ walletData, totalData });
    } catch (error) {
        return res.status(500).send({ message: 'O banco de dados está offline' });
    }
}

export {
    createStatement,
    getStatement,
};
