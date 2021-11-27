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

export {
    create,
};
