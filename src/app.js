import express from 'express';
import cors from 'cors';
import * as userController from './controllers/userController.js';

import { getStatement, createStatement } from './controllers/statement.js';

const app = express();

app.use(cors());
app.use(express.json());

// ------SIGN-UP------
app.post('/sign-up', userController.signUp);

// ------LOGIN------
app.post('/login', userController.login);

// ------GET USER------
app.get('/user', userController.getUser);

// ------LOGOUT------
app.post('/logout', userController.logout);

// ------WALLET------
app.post('/new-transition', createStatement);
app.get('/', getStatement);

export {
    app,
};
