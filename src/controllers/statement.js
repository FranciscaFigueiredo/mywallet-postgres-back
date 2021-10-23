import connection from "../database/database.js";
import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid'
import dayjs from "dayjs";

async function postStatement(req, res) {
    const { type } = req.query;
    
    const token = req.headers.authorization?.replace('Bearer ', '');

    const {
        value,
        description,
        date
    } = req.body;

    let valueData = value

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
        const search = await connection.query(`
            SELECT 
                users.*,
                sessions.*
            FROM users
            JOIN sessions
                ON users.id = sessions."userId";
        `)

        if (!search.rows.length) {
            return res.sendStatus(401);
        }

        const user = search.rows;

        await connection.query(`
            INSERT INTO statement
                ("userId", value, description, date)
            VALUES
                ($1, $2, $3, $4);
        `, [user[0].id, valueData, description, dateToday]);

        res.status(200).send('Informação adicionada à carteira');

    } catch (error) {
        return res.status(500).send({message: "O banco de dados está offline"});
    }
}

export { postStatement };