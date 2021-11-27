import '../src/setup.js';
import faker from 'faker';
import supertest from 'supertest';
import { app } from '../src/app.js';

import { connection } from '../src/database/database.js';
import { createToken } from './factories/userFactory.js';

afterAll(async () => {
    await connection.query('DELETE FROM sessions;');
    await connection.query('DELETE FROM statement;');
    connection.end();
});

function createBody() {
    return {
        value: faker.datatype.float({ min: 10, max: 100, precision: 0.22 }),
        description: faker.lorem.words(),
    };
}

const transactionCreated = createBody();

describe('POST /new-transaction', () => {
    const {
        value,
        description,
    } = transactionCreated;

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
            id,
        } = await createUser();

        const result = await supertest(app).post('/new-transition?type=exit')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: id,
                value,
                description,
            });

        expect(result.status).toEqual(200);
    });

    test('returns 400 for invalid body', async () => {
        const {
            token,
            id,
        } = await createUser();

        const result = await supertest(app).post('/new-transition?type=exit')
            .set('Authorization', `Bearer ${token}`)
            .send({
                userId: id,
                value,
            });

        expect(result.status).toEqual(400);
    });

    test('returns 401 when no token is given', async () => {
        const {
            id,
        } = await createUser();

        const result = await supertest(app).post('/new-transition?type=exit')
            .send({
                userId: id,
                value,
                description,
            });

        expect(result.status).toEqual(401);
    });

    test('returns 401 for invalid token', async () => {
        const {
            token,
            id,
        } = await createUser();

        const result = await supertest(app).post('/new-transition?type=exit')
            .set('Authorization', `Bearer ${token}2`)
            .send({
                userId: id,
                value,
                description,
            });

        expect(result.status).toEqual(401);
    });
});
