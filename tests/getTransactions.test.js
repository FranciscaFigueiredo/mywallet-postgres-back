import '../src/setup.js';
import supertest from 'supertest';
import { app } from '../src/app.js';

import { connection } from '../src/database/database.js';
import { createToken } from './factories/userFactory.js';

afterAll(async () => {
    connection.end();
});

describe('GET /', () => {
    async function createUser() {
        const userData = await createToken();

        const {
            user,
            token,
        } = userData;
        const {
            id,
        } = user;

        return { id, token };
    }

    test('returns 200 for valid header', async () => {
        const {
            token,
        } = await createUser();

        const result = await supertest(app).get('/')
            .set('Authorization', `Bearer ${token}`);

        expect(result.status).toEqual(200);
    });

    test('returns 401 when no token is given', async () => {
        const result = await supertest(app).get('/');

        expect(result.status).toEqual(401);
    });

    test('returns 401 for invalid token', async () => {
        const {
            token,
        } = await createUser();

        const result = await supertest(app).get('/')
            .set('Authorization', `Bearer ${token}2`);

        expect(result.status).toEqual(401);
    });
});
