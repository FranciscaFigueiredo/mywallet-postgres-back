import { connection } from '../database/database.js';

async function create({
    userId,
    value,
    description,
    date,
}) {
    try {
        const transactionCreated = await connection.query(
            `
            INSERT INTO statement
                ("userId", value, description, date)
            VALUES
                ($1, $2, $3, $4)
                RETURNING *;
        `,
            [userId, value, description, date],
        );
        return transactionCreated.rows[0];
    } catch (error) {
        return false;
    }
}

async function getEventsByUserId({ userId }) {
    try {
        const wallet = await connection.query(
            `
            SELECT 
                value, description, date 
            FROM statement 
            WHERE "userId" = $1;`,
            [userId],
        );
        return wallet.rows;
    } catch (error) {
        return false;
    }
}

async function getTotalFinancialEvents({ userId }) {
    try {
        const total = await connection.query(
            `
            SELECT SUM(value) AS total 
            FROM statement
            WHERE "userId" = $1;
        `,
            [userId],
        );

        return total.rows[0].total;
    } catch (error) {
        return false;
    }
}

export {
    create,
    getEventsByUserId,
    getTotalFinancialEvents,
};
