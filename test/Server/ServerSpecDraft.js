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

  describe('Paths : ', function() {
    it('requesting ', function(done) {
      request(app)
        .post('/someRandomPlace')
        .send({
          'stuff': 'stuff'})
        .expect(404)
        .end(done);
    });

  describe('Inserting shelves into DB', function(){
    it('inserts into DB', function(done){
      var newShelf = {x: 0, y: 0, width: 1, height: 1};
      db.collection.insert(newShelf, function(err, shelves){
        if (err){console.log('error :', err)}
        console.log(shelves);
      });
      //no assertions yet.
    });
  });

}); // 'server tests'
