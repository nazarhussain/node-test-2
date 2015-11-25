var http = require('http');
var Server = require('../../lib/main/server.js');
var conf = require('../../config.js');

describe('The Server module', function() {
  it('when initialized should have httpServer object', function() {
    var s = new Server();
    expect(s.httpServer).to.be.an.instanceof(http.Server);
  });

  it('when started load on ip set in envoinrment', function(done){
    var s = new Server(function(){
      expect(s.httpServer.address().address).be.equal('127.0.0.1');
      s.stop();
      done();
    });
    s.start();
  });

  it('when started load on port set in envoinrment', function(done){
    var s = new Server(function(){
      expect(s.httpServer.address().port).be.equal(8080);
      s.stop();
      done();
    });
    s.start();
  });
});
