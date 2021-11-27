import express from 'express';
import cors from 'cors';
import * as userController from './controllers/userController.js';

import * as financeController from './controllers/financeController.js';
import { auth } from './middlewares/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

// ------SIGN-UP------
app.post('/sign-up', userController.signUp);

// ------LOGIN------
app.post('/login', userController.login);

// ------GET USER------
app.get('/user', auth, userController.getUser);

// ------LOGOUT------
app.post('/logout', auth, userController.logout);

// ------WALLET------
app.post('/new-transition', auth, financeController.createStatement);
app.get('/', financeController.getStatement);

export {
    app,
};
