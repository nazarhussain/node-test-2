var Scrapper = require('../../lib/main/scrapper.js');
var cheerio = require('cheerio');

describe('The Scrapper module', function(){

  it('should set http if not supplied in url', function(done){
    new Scrapper('www.bbc.co.uk', function(result){
      expect(result.url).to.equal('http://www.bbc.co.uk');
      done();
    });
  });

  it('should have a dom object', function(done){
    new Scrapper('http://www.bbc.co.uk', function(result){
      expect(result.dom).to.exists;
      done();
    });
  });

  it('should scrape the title correctly', function(done){
    new Scrapper('http://www.bbc.co.uk', function(result){
      expect(result.dom('title').text()).to.equal('BBC - Home');
      done();
    });
  });
});
