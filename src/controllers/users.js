import connection from "../database/database.js";
import bcrypt from 'bcrypt';
import { v4 as uuid} from 'uuid'
import { userSchema } from "../validation/users.js";

async function signUp(req, res) {
    const {
        name,
        email,
        password
    } = req.body;

    const validate = userSchema.validate({
        name,
        email,
        password
    })

    if (validate.error) {
        return res.status(400).send(validate.error.message);
    }

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
        return res.status(500).send({message: "O banco de dados está offline"});
    }
}

async function login(req, res) {
    const {
        email,
        password
    } = req.body;

    try {
        const result = await connection.query(`
            SELECT * FROM users WHERE email = $1;
        `, [email]);

        const user = result.rows[0];

        const hashPassword = bcrypt.compareSync(password, user.password);

        if (!user) {
            return res.status(401).send('Usuário não cadastrado');
        }

        if (!hashPassword){
            return res.status(401).send('Email ou senha inválidos');
        }

        const token = uuid();

        await connection.query(`DELETE FROM sessions WHERE "userId" = $1;`, [user.id])
        console.log(token)
        await connection.query(`
            INSERT INTO sessions
                (token, "userId")
            VALUES ($1, $2);
        `, [token, user.id]);

        res.status(200).send(token);

    } catch (error) {
        return res.status(500).send({message: "O banco de dados está offline"});
    }
}

async function getUser(req, res) {

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const user = await connection.query(`SELECT name FROM sessions JOIN users ON users.id = "userId" WHERE token = $1;`, [token]);
        res.send(user.rows[0])
    } catch (error) {
        return res.status(500).send({message: "O banco de dados está offline"});
    }
}

async function logout(req, res) {

    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.sendStatus(401)
    }

    try {
        const deleted = await connection.query(`DELETE FROM sessions WHERE token = $1;`, [token]);
        res.send(deleted.rows)
    } catch (error) {
        return res.status(500).send({message: "O banco de dados está offline"});
    }
}

export { signUp, login, logout, getUser };