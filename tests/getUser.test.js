import '../src/setup.js';
import faker from 'faker';
import supertest from 'supertest';
import { app } from '../src/app.js';

import * as userRepository from '../src/repositories/userRepository.js';
import * as userService from '../src/services/userService.js';
import { connection } from '../src/database/database.js';

afterAll(async () => {
    await connection.query('DELETE FROM sessions;');
    connection.end();
});

function createBody() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: '123123123',
    };
}

const userCreated = createBody();

describe('GET /user', () => {
    async function createUser() {
        const user = await userRepository.create(userCreated);
        return user;
    }
    // const email
    test('returns 200 for valid header', async () => {
        const user = await createUser();

        const {
            id,
        } = user;

        const token = userService.generateToken({ userId: id });

        const result = await supertest(app).get('/user')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id,
            });

        expect(result.status).toEqual(200);
    });

    test('returns 401 when no token is given', async () => {
        const user = await createUser();

        const {
            id,
        } = user;

        const result = await supertest(app).get('/user')
            .send({
                id,
            });

        expect(result.status).toEqual(401);
    });

    test('returns 401 for invalid token', async () => {
        const user = await createUser();

        const {
            id,
        } = user;

        const token = userService.generateToken({ userId: id });

        const result = await supertest(app).get('/user')
            .set('Authorization', `Bearer ${token}2`)
            .send({
                id: id + 2,
            });

        expect(result.status).toEqual(401);
    });
});
