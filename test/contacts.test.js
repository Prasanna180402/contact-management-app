const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, server } = require('../index'); // Import app and server
const Contact = require('../models/Contact');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Contacts API', () => {
    let testContactId; // Store ID for later tests

    beforeEach(async () => {
        await Contact.deleteMany({}); // Clear DB before each test
    });

    after(() => {
        server.close(); // Close server after all tests
    });


    it('should create a new contact', async () => {
        const newContact = { /* ... */ };

        const res = await chai.request(app).post('/contacts').send(newContact);

        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id');
        testContactId = res.body._id; // Store ID for other tests
        // ... more assertions
    });

    it('should get all contacts', async () => {
        // First, create a contact (or use the one from the previous test)
        const res = await chai.request(app).get('/contacts');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        // ... other assertions
    });

    it('should get a single contact', async () => {
      const res = await chai.request(app).get(`/contacts/${testContactId}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body._id).to.equal(testContactId);
      // ... more assertions
    });

    it('should update a contact', async () => {
        const updatedContact = { name: 'Updated Name' };

        const res = await chai.request(app)
            .put(`/contacts/${testContactId}`)
            .send(updatedContact);

        expect(res).to.have.status(200);
        expect(res.body.name).to.equal(updatedContact.name);
    });

    it('should delete a contact', async () => {

        const res = await chai.request(app).delete(`/contacts/${testContactId}`);

        expect(res).to.have.status(204); // No Content
        const getRes = await chai.request(app).get(`/contacts/${testContactId}`);
        expect(getRes).to.have.status(404); // Not Found
    });

    // ... More tests for error handling (invalid input, not found, etc.)
});