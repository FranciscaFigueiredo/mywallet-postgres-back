import connection from "../database/database.js";
import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid'

async function signUp(req, res) {
    const {
        name,
        email,
        password
    } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    const search = await connection.query(`SELECT * FROM users WHERE email = $1;`, [email]);
    
    if(search.rowCount) {
        return res.status(409).send("Email já cadastrado na plataforma");
    }

    try {
        await connection.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`, [name, email, hash])
        console.log(hash)
        res.status(201).send("Usuário cadastrado com sucesso");
    } catch (error) {
        res.sendStatus(500);
    }
}

async function login(req, res) {
    const {
        email,
        password
    } = req.body;

    const result = await connection.query(`
        SELECT * FROM users WHERE email = $1;
    `, [email]);

    const user = result.rows[0];

    const hashPassword = bcrypt.compareSync(password, user.password);

    if (user && hashPassword) {
        const token = uuid();

        await connection.query(`
            INSERT INTO sessions
                (token, "userId")
            VALUES ($1, $2);
        `, [token, user.id]);

        res.status(200).send(token);
    } else  {
        res.sendStatus(401);
    }
}

export { signUp, login };