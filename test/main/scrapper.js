var Scrapper = require('../../lib/main/scrapper.js');
var cheerio = require('cheerio');

describe('The Scrapper module', function(){
  this.timeout(5000);

  before('scrap a url', function(done){
    var self = this;
    new Scrapper('www.bbc.co.uk', function(result){
      self.scrapped_data = result;
      done();
    }, function(error){
      // TODO: Test the error scenario as well
      done();
    });
  });

  it('should set http if not supplied in url', function(){
    expect(this.scrapped_data.url).to.equal('http://www.bbc.co.uk');
  });

  it('should have a dom object', function(){
    expect(this.scrapped_data.dom).to.exists;
  });

  it('should scrape the title correctly', function(){
    expect(this.scrapped_data.dom('title').text()).to.equal('BBC - Home');
  });
});
