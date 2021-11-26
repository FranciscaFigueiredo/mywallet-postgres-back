import express from 'express';
import cors from 'cors';
import {
    getUser, login, logout, signUp,
} from './controllers/userController.js';

import { getStatement, createStatement } from './controllers/statement.js';

const app = express();

app.use(cors());
app.use(express.json());

// ------SIGN-UP------
app.post('/sign-up', signUp);

// ------LOGIN------
app.post('/login', login);

// ------GET USER------
app.get('/user', getUser);

// ------LOGOUT------
app.post('/logout', logout);

// ------WALLET------
app.post('/new-transition', createStatement);
app.get('/', getStatement);

export {
    app,
};
