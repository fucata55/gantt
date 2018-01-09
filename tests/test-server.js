const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const faker = require('faker');
const mongoose = require('mongoose');

const {
    app,
    runServer,
    closeServer
} = require('../server');
const express = require('express');

const {
    User,
    Note
} = require('../models');

const {
    DATABASE_URL,
    TEST_DATABASE_URL
} = require('../config');

chai.use(chaiHttp);

const username = 'demo'

//Define functions
function generateUser() {
    return {
        firstName: faker.random.first_name(),
        lastName: faker.random.last_name(),
        email: faker.internet.email(),
        username: username,
        password: faker.lorem.words()
    }
}

function generateNote() {
    return {
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
        type: 'public',
        username: username
    }
}

function seedNote() {
    console.info('Seeding notes');
    const notes = [];
    for (let i = 0; i < 10; i++) {
        notes.push(generateNote())
    }
    return Note.insertMany(notes);
    console.log(`notes are ${notes}`);
}

function tearDownDb() {
    console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}



describe('ataNote APIs', () => {
    before(() => {
        return runServer(TEST_DATABASE_URL)
            .then(console.log('running server'))
            .catch(err => console.log({
                err
            }));
    });
    beforeEach(() => {
        return seedNote();
    });
    describe('GET endpoints', () => {
        it('should return all users in db', () => {
            return chai.request(app)
                .get('/users')
                .then((res) => {
                    res.should.have.status(200);
                    //                    res.body.should.have.length.of.at.least(1);
                });
        });
        it('should return a note of a user', () => {
            Note
                .findOne()
                .then(note => {
                    return chai.request(app)
                        .get(`/user/notes/a/${note._id}`)
                })
                .then(res => {
                    res.should.have.status(200);
                    res.should.be.a.json;
                })
        });
        it('should return all notes of a user', () => {
            return chai.request(app)
                .get('/user/notes/all/' + 'demo2')
                .then((res) => {
                    res.should.have.status(200);
                    //                       res.body.should.have.length.of.at.least(1);
                });
        });
    });
    describe('POST notes endpoint', () => {
        it('should create a note', () => {
            return chai.request(app)
                .post('/user/notes')
                .send(generateNote())
                .then((res) => {
                    res.should.have.status(200);
                    //res.body.should.be.json;
                });
        });
    });
    describe('PUT note endpoint', () => {
        it('should update a field of a note', () => {
            const updateNoteObject = {
                type: 'public'
            };
            return Note
                .findOne()
                .then(note => {
                    updateNoteObject._id = note._id;
                    return chai.request(app)
                        .put(`/user/notes/b/${note._id}`)
                        .send(updateNoteObject);
                })
                .then((res) => {
                    res.should.have.status(204);
                    return Note.findById(updateNoteObject._id);
                })
                .then((note) => {
                    note.type.should.equal(updateNoteObject.type);
                })
        })
    });
    describe('note endpoint', () => {
        it('should delete a note', () => {
            let note;
            return Note
                .findOne()
                .then((_note) => {
                    note = _note;
                    return chai.request(app).delete(`/user/notes/c/${note._id}`);
                })
                .then((res) => {
                    res.should.have.status(204);
                    return Note.findById(note._id);
                })
                .then((_note) => {
                    should.not.exist(_note);
                });
        });
    });

    afterEach(() => {
        return tearDownDb();
    });
    after(() => {
        return closeServer();
    });
});
