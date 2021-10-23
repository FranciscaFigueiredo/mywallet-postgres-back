import express from 'express';
import cors from 'cors';
import { login, signUp } from './controllers/users.js';
import { postStatement } from './controllers/statement.js';

const server = express();

server.use(cors());
server.use(express.json());

// ------SIGN-UP------
server.post('/sign-up', signUp);
// ------LOGIN------
server.post('/', login);

// ------SIGN-UP------
server.post('/new-transition', postStatement)

server.listen(4000);