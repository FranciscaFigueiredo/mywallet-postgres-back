import '../src/setup.js';
import faker from 'faker';
import supertest from 'supertest';
import { connection } from '../src/database/database.js';
import { app } from '../src/app.js';
import * as userService from '../src/services/userService.js';

function createBody() {
    return {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: '123123123',
    };
}

const userCreated = createBody();
beforeAll(async () => {
    await userService.authenticateRegistration(userCreated);
});

afterAll(async () => {
    await connection.query('DELETE FROM users;');
    connection.end();
});

describe('POST /login', () => {
    const {
        email,
        password,
    } = userCreated;

    test('returns 200 for valid body', async () => {
        await connection.query('SELECT * FROM users;');

        const result = await supertest(app).post('/login').send({
            email,
            password,
        });

        expect(result.status).toEqual(200);
    });

    test('returns 400 for invalid body', async () => {
        const result = await supertest(app).post('/login').send({
            email,
            password: '',
        });

        expect(result.status).toEqual(400);
    });

    test('returns 401 for invalid user data', async () => {
        const result = await supertest(app).post('/login').send({
            email,
            password: `${password}123`,
        });

        expect(result.status).toEqual(401);
    });
});
