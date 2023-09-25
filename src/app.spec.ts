import app from './app';
import { calculateDiscount } from './utils';
import request from 'supertest';
describe('App', () => {
    it.skip('should calculate discount', () => {
        const result = calculateDiscount(100, 10);
        expect(result).toBe(100);
    });

    it.skip('should return 200 status', async () => {
        const response = await request(app).get('/').send();

        expect(response.statusCode).toBe(200);
    });
});
