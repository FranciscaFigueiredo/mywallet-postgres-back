import express from 'express';
import cors from 'cors';
import { getUser, login, logout, signUp } from './controllers/users.js';
import { getStatement, postStatement } from './controllers/statement.js';

const server = express();

server.use(cors());
server.use(express.json());

// ------SIGN-UP------
server.post('/sign-up', signUp);

// ------LOGIN------
server.post('/login', login);

// ------GET USER------
server.get('/user', getUser)

// ------LOGOUT------
server.post('/logout', logout);

// ------WALLET------
server.post('/new-transition', postStatement);
server.get('/', getStatement);

export default server;