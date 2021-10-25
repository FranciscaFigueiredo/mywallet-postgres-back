import supertest from "supertest";
import app from '../src/app.js'


describe('GET /', () => {
    it ('return 401 for invalid token', async () => {
        const result = await supertest(app).post('/memes')
        .set('Authorization', 'Bearer 898aee10-fbc0-4624-9d7b-ef985f836e70')
        .send({
            value: 27
        })
        expect(result.status).toEqual(400)
    })
})
