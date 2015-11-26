var http = require('http');
var Server = require('../../lib/main/server.js');
var conf = require('../../config.js');
var Browser = require('zombie');

describe('The Server module', function() {
  this.timeout(5000);

  before('create server and browser', function(done){
    this.server = new Server(done);
    this.server.start();
    this.browser = new Browser({site: 'http://127.0.0.1:8181'});
  });

  it('when initialized should have httpServer object', function() {
    expect(this.server.httpServer).to.be.an.instanceof(http.Server);
  });

  it('when started load on ip set in envoinrment', function(){
    expect(this.server.httpServer.address().address).be.equal('127.0.0.1');
  });

  it('when started load on port set in envoinrment', function(){
    expect(this.server.httpServer.address().port).be.equal(8181);
  });

  it('when opened right url should result 200 OK', function(done){
    var browser = this.browser;
    browser.visit('/I/want/title/?address=www.bbc.co.uk', function(){
      browser.assert.status(200);
      done();
    });
  });

  it('when opened with wrong url should result 400 Not Found', function(done){
    var browser = this.browser;
    browser.visit('/Some/Other/Url', function(){
      browser.assert.status(404);
      done();
    });
  });

  it('when opened with one url address page have one li elements', function(done){
    var browser = this.browser;
    browser.visit('/I/want/title/?address=google.com', function(){
      browser.assert.elements('ul li', 1);
      done();
    });
  });

  it('when opened with two addresses page have two li elements', function(done){
    var browser = this.browser;
    browser.visit('/I/want/title/?address=google.com&address=www.bbc.co.uk', function(){
      browser.assert.elements('ul li', 2);
      done();
    });
  });

  after(function(done){
    this.server.httpServer.close(done);
  });
});
