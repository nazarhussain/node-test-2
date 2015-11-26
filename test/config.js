var conf = require('../config.js');

describe('The enviornment configuration', function(){

  it('should load enviornment as test', function(){
    expect(conf.get('env')).to.eql('test');
  });

  it('should have default ip 127.0.0.1', function(){
    expect(conf.get('ip')).to.eql('127.0.0.1');
  });

  it('should have default port 8080', function(){
    expect(conf.get('port')).to.eql(8181);
  });
});
