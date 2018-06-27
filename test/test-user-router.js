const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const {TEST_DATABASE_URL} = require('../config');
const {JWT_SECRET} = require('../config');

const mongoose = require('mongoose');

const {Prompts} = require('../entry/prompts');
const {User} = require('../user/models');
const jwt = require("jsonwebtoken");

const expect = chai.expect;

chai.use(chaiHttp);

describe('User Router', function(){
	const username1 = "example";
	const password1 = "examplepassword";
	const username2 = "hello";
	const password2 = "sdfsdfsdfj";

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){ });

	afterEach(function(){
		return User.remove({});
	});

	after(function(){
		return closeServer();
	});

	describe('POST new user', function(){
		it('should fail if the username field is not filled out', function(){
			return chai.request(app)
				.post('/users')
				.send({
					username: null,
					password: 'sldfsdfsdfjoijd'
				})
				.then(function(res){
					expect(res).to.have.status(422);
				});
		});

		it('should fail if the password field is not filled out', function(){
			return chai.request(app)
				.post('/users')
				.send({
					username: 'sdifhosijd',
					password: null
				})
				.then(function(res){
					expect(res).to.have.status(422);
				});
		});

		it('should fail if the password is under ten characters', function(){
			return chai.request(app)
				.post('/users')
				.send({
					username: 'sdif',
					password: 'shdofi'
				})
				.then(function(res){
					expect(res).to.have.status(422);
				});
		});

		it('should fail if the username starts with a space', function(){
			return chai.request(app)
				.post('/users')
				.send({
					username: ' sdif',
					password: 'shdofi'
				})
				.then(function(res){
					expect(res).to.have.status(422);
				});
		});

		it('should fail if username is not a string', function(){
			return chai.request(app)
				.post('/users')
				.send({
					username: 234,
					password: 'shdofi'
				})
				.then(function(res){
					expect(res).to.have.status(422);
				});
		});

		it('should fail if username is already taken', function(){
			return User.create({
				username: username1,
				password: password1,
				monthCreated: 4,
				yearCreated: 2018
			})
			.then(() => {
				return chai.request(app)
					.post('/users')
					.send({
						username: username1,
						password: password1
					})
			})
			.then(res => {
				expect(res).to.have.status(500);
			});
		});

		it('should create a new user', function(){
			return chai.request(app)
				.post('/users')
				.send({
					username: username1,
					password: password1
				})
				.then(function(res){
					expect(res).to.have.status(201);

					return User.findOne({username: username1});
				})
				.then(function(user){
					expect(user.username).to.equal(username1);

					return user.passwordValidate(password1);
				})
				.then(password =>{
					expect(password).to.be.true;
				});
		});
	});

	describe('DELETE User', function(){
		it('should delete a previous user', function(){
			const token = jwt.sign(
				{
					user: {
						username: username1
					}
				},
				JWT_SECRET,
				{
					algorithm: 'HS256',
					subject: username1,
			  		expiresIn: '7d'
				}
			);

			let id;

			return User.create({
				username: username1,
				password: password1,
				monthCreated: 4,
				yearCreated: 2018
			})
			.then(() => {
				return User.findOne({username: username1});
			})
			.then(user => {
				id = user._id;
				
				return chai.request(app)
					.delete('/users/' + user._id)
					.set('Authorization', `Bearer ${token}`);
			})
			.then(res => {
				expect(res).to.have.status(204);

				return User.findById(id);
			})
			.then(function(user){
				expect(user).to.be.null;
			});
		})
	});
});