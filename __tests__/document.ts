/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/file-extension-in-import */
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import request from "supertest";
import app from '../src/app';
import {client} from '../src/lib/utils/db';

const basePath = '/documents';
const json = 'application/json';

const testData = {
    details: 'Supplies',
    documentType: 'DV',
    personsConcerned: ['teto ekeng'],
    remarks: 'urgent please'
}

describe('Document endpoint tests', () => {
    it('should create a new document', async () => {
        const response = await request(app).post(basePath).type(json).send(testData);
        expect(response.status).toEqual(201);
    });

    it('should return a json response', async () => {
        const response = await request(app).get(basePath);
        expect(response.status).toEqual(200);
        expect(response.type).toEqual(json);
        expect(response.body).toContain('6085289319ee1c00498d0c93');
    });
});

afterAll(async () => {
    if (client.isConnected()) await client.close();
});
