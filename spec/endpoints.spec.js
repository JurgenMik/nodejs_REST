const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

const should = chai.should();
chai.use(chaiHttp);
chai.use(require('chai-things'));
chai.use(require('chai-like'));

let id;
let token;
describe('API endpoint testing', () => {

    describe('/api/jwt', () => {
        it('should get a jwt', () => {
            chai.request(server)
                .get('/api/jwt')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.a('string');
                    token = res.text;
                });
        })
    })

    describe('/api/users', () => {
        it ('should successfully create a new user', (done) => {
            chai.request(server)
                .post('/api/users')
                .send({email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'Uumpa', avatar: 'img/src/profile/uumpa.png', token: token})
                .set({ "Authorization": `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('createdAt');
                    id = res.body.user.id;
                    res.body.user.should.deep.include({id, email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'Uumpa', avatar: 'img/src/profile/uumpa.png', token: token });
                    done()
                });
        })
        it ('should return an unauthorized message', () => {
            chai.request(server)
                .post('/api/users')
                .send({email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'Uumpa', avatar: 'img/src/profile/uumpa.png', token: token})
                .set({ "Authorization": `Bearer ${null}`})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('error');
                });
        })
        it ('should not create a new user due to missing fields', () => {
            chai.request(server)
                .post('/api/users')
                .send({email: 'jurgen@gmail.com', last_name: 'Uumpa', avatar: 'img/src/profile/uumpa.png', token: token})
                .set({ "Authorization": `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                    res.body.message.should.be.a('string');
                });
        })

        it('should get all the users', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object');
                    res.body.users.should.be.an('array');
                    res.body.users.should.not.deep.include({email: 'jurgen@gmail.com', last_name: 'Uumpa', avatar: 'img/src/profile/uumpa.png', token: token});
                    res.body.users.should.deep.include({id: id, email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'Uumpa', avatar: 'img/src/profile/uumpa.png', token: token});
                    res.body.users.should.all.have.property('id');
                    res.body.users.should.all.have.property('token');
                    done();
                });
        })

        it('should successfully edit user information', (done) => {
            chai.request(server)
                .put(`/api/users/${id}`)
                .send({email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'UumpaLumpa', avatar: 'img/src/profile/uumpa.png'})
                .set({ "Authorization": `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.user.should.be.an('object');
                    res.body.user.should.deep.include({id, email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'UumpaLumpa', avatar: 'img/src/profile/uumpa.png', token: token });
                    res.body.should.have.property('updatedAt');
                    done();
            });
        })
        it('should return a bad request response', () => {
            chai.request(server)
                .put('/api/users/63976488')
                .send({email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'UumpaLumpa', avatar: 'img/src/profile/uumpa.png'})
                .set({ "Authorization": `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.an('object');
                    res.body.should.have.a.property('message');
                });
        })
        it('should return an unauthorized message', () => {
            chai.request(server)
                .put(`/api/users/${id}`)
                .send({email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'UumpaLumpa', avatar: 'img/src/profile/uumpa.png'})
                .set({ "Authorization": `Bearer ${null}`})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('error');
                });
        })
        it('should prohibit user from being edited', () => {
            chai.request(server)
                .put(`/api/users/${id}`)
                .send({email: 'jurgen@gmail.com', first_name: 'Deimpz', last_name: 'UumpaLumpa', avatar: 'img/src/profile/uumpa.png'})
                .set({ "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib2R5Ijoic2VjcmV0IiwiaWF0IjoxNjcwODY0MTQxfQ.DLzux47bTO0EBrJawmtJ51JMTUh827UEVMWoyyT2wHs`})
                .end((err, res) => {
                    res.should.have.status(403);
                });
        })

        it ('should successfully delete a user', () => {
            chai.request(server)
                .delete(`/api/users/${id}`)
                .set({ "Authorization": `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(204);
                });
        })
        it ('should return a bad request response', () => {
            chai.request(server)
                .delete(`/api/users/612BC5123`)
                .set({ "Authorization": `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(400);
                });
        })
        it ('should return an unauthorized message', () => {
            chai.request(server)
                .delete(`/api/users/${id}`)
                .set({ "Authorization": `Bearer ${null}`})
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.an('object');
                    res.body.should.have.property('error');
                });
        })
        it ('should prohibit user from being deleted', () => {
            chai.request(server)
                .delete(`/api/users/639764889215a11948c07422`)
                .set({ "Authorization": `Bearer ${token}`})
                .end((err, res) => {
                    res.should.have.status(403);
                });
        })
    })

    describe('/api/logs', () => {
        let object1;
        let object2;
        let object3;
        it('should get all server logs', (done) => {
            chai.request(server)
                .get('/api/logs')
                .end((err, res) => {
                    let [header, payload, signature] = token.split(".");
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    object1 = res.body.find(obj => obj.clientId === signature && obj.method === 'PUT');
                    object2 = res.body.find(obj => obj.clientId === signature && obj.method === 'DELETE');
                    object3 = res.body.find(obj => obj.clientId === signature && obj.method === 'POST');
                    object1.should.have.property('originalUrl', `/api/users/${id}`);
                    object1.should.have.property('dataDiff','[ last_name : Uumpa last_name : UumpaLumpa ]');
                    object2.should.have.property('originalUrl', `/api/users/${id}`);
                    object3.data.should.include(` email : jurgen@gmail.com first_name : Deimpz last_name : Uumpa avatar : img/src/profile/uumpa.png token : ${token}`);
                    done();
                });
        })
    })

})

