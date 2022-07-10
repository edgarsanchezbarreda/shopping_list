process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
let items = require('../fakeDB');

let apple = { name: 'apple', price: 1.99 };

beforeEach(function() {
	items.push(apple);
});

afterEach(function() {
	items.length = 0;
});

describe('GET /items', () => {
	test('Gets a list of items', async () => {
		const res = await request(app).get('/items');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			items: [ apple ]
		});
	});
});

describe('GET /items/:name', () => {
	test('Gets a specific item.', async () => {
		const res = await request(app).get(`/items/${apple.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			item: apple
		});
	});
	test('Responds with 404 for invalid item name.', async () => {
		const res = await request(app).get(`/items/notItem`);
		expect(res.statusCode).toBe(404);
	});
});

describe('POST /items', () => {
	test('Creating an item', async () => {
		const res = await request(app).post('/items').send({ name: 'mango', price: 4.99 });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ added: { name: 'mango', price: 4.99 } });
	});
	test('Responds with 400 if item name is missing', async () => {
		const res = await request(app).post('/items').send({});
		expect(res.statusCode).toBe(400);
	});
});

describe('Patch /items/:name', () => {
	test("Updating an item's name", async () => {
		const res = await request(app).patch(`/items/${apple.name}`).send({ name: 'orange' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ updated: { name: 'orange' } });
	});
	test('Responds with 404 for invalid name.', async () => {
		const res = await request(app).patch(`/items/watermelon`).send({ name: 'orange' });
		expect(res.statusCode).toBe(404);
	});
});

describe('Delete /items/:name', () => {
	test('Deleting an item.', async () => {
		const res = await request(app).delete(`/items/${apple.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Deleted' });
	});
	test('Responds with 404 for deleting invalid item.', async () => {
		const res = await request(app).delete(`/items/notanitem`);
		expect(res.statusCode).toBe(404);
	});
});
