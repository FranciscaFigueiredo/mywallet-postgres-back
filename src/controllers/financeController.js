import { connection } from '../database/database.js';
import { statementSchema } from '../validation/statement.js';
import * as financeService from '../services/financeService.js';

async function createStatement(req, res) {
    const userId = res.locals.user;

    const { value, description } = req.body;
    const {
        type,
    } = req.query;

    const validate = statementSchema.validate({
        value,
        description,
    });

    if (validate.error) {
        return res.status(400).send(validate.error.message);
    }

    try {
        await financeService.verifyType({
            userId,
            value,
            description,
            type,
        });

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500);
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
