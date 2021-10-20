import express from 'express';
import cors from 'cors';
import { signUp } from './controllers/users.js';

const server = express();

server.use(cors());
server.use(express.json());

// ------SIGN-UP------
server.post('/sign-up', signUp);

server.listen(4000);