/*
* Modified from https://github.com/elliotf/mocha-mongoose
*/
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;

var app = require('../server.js');
var mongoose = require('mongoose');
var db = require('../app/config');


//Require all schemas in server/retailers.
var CoordinatesSchema = require('../server/retailers/coordinates/model.js');
// var ItemSchema = require('../server/retailers/items/model.js');
var ShelvesSchema = require('../server/retailers/shelves/model.js');
process.env.NODE_ENV = 'test';

describe('server tests :', function() {

  beforeEach(function(done) {
    done();
  });


  it('Only shortens valid urls, returning a 404 - Not found for invalid urls', function(done) {
    request(app)
      .post('/links')
      .send({
        'url': 'definitely not a valid url'})
      .expect(404)
      .end(done);
  });

//ONE:

  describe('Paths : ', function() {

    it('Responds with the short code', function(done) {
      request(app)
        .post('/links')
        .send({
          'url': 'http://www.roflzoo.com/'})
        .expect(200)
        .expect(function(res) {
          expect(res.body.url).to.equal('http://www.roflzoo.com/');
          expect(res.body.code).to.be.ok;
        })
        .end(done);
    });

    it('New links create a database entry', function(done) {
      request(app)
        .post('/links')
        .send({
          'url': 'http://www.roflzoo.com/'})
        .expect(200)
        .expect(function(res) {
          Link.findOne({'url' : 'http://www.roflzoo.com/'})
            .exec(function(err,link){
              if(err) console.log(err);
              expect(link.url).to.equal('http://www.roflzoo.com/');
            });
        })
        .end(done);
    });
  }); // 'Shortening Links'

//TWO

  describe('Inserting shelves into DB', function(){
    var stuff = 'stuff happens here';
    it('inserts into DB', function(done){

    });
  });

}); // 'server tests'
