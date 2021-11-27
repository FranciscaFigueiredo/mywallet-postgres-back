import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import { connection } from '../src/database/database.js';
import { app } from '../src/app.js';
import * as userRepository from '../src/repositories/userRepository.js';

afterAll(async () => {
    await connection.query('DELETE FROM users;');
});

describe('POST /sign-up', () => {
    function createBody() {
        return {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password: '123123123',
        };
    }

    const {
        name,
        email,
        password,
    } = createBody();

    test('returns 400 for invalid body', async () => {
        const result = await supertest(app).post('/sign-up').send({
            email,
            password,
        });

        expect(result.status).toEqual(400);
    });

    test('returns 409 when there already is an user with given email', async () => {
        await userRepository.create({
            name,
            email,
            password,
        });
        const result = await supertest(app).post('/sign-up').send({
            name,
            email,
            password,
        });

        expect(result.status).toEqual(409);
    });

    test('returns 201 for valid body', async () => {
        const result = await supertest(app).post('/sign-up').send(createBody());

        expect(result.status).toEqual(201);
    });
});
