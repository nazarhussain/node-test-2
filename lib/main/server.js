var http = require('http');
var url = require('url');
var Scrapper = require('./scrapper.js');
var conf = require('../../config.js');

function Server(ready) {
  this.httpServer = http.createServer(this.processRequest.bind(this));
  this.ready = ready;
}

Server.prototype.start = function() {
  var self = this;
  self.httpServer.listen(conf.get('port'), conf.get('ip'), function(x){
    console.log('running on http://' + self.httpServer.address().address + ":" + self.httpServer.address().port);
    if(self.ready !== undefined){
      self.ready();
    }
  });
};

Server.prototype.stop = function(){
  this.httpServer.close();
};

Server.prototype.processRequest = function(request, response) {
  var self = this;
  var urlParams = url.parse(request.url, true);
  if (request.method === 'GET' && urlParams.pathname === '/I/want/title/') {
    var addresses = (typeof(urlParams.query.address) === 'string') ? [urlParams.query.address] : urlParams.query.address;
    var titles = [];
    var body = [];

    function processTitle(title, index){
      titles.push(title);
      if(index < addresses.length - 1){
          self.fetchTitle(addresses[index + 1], index + 1, processTitle);
      } else {
        response.statusCode = 200;
        response.write("<html>");
        response.write("<head></head>");
        response.write("<body>");
        response.write("<ul>");
        response.write(titles.map(function(title){ return "<li>" + title + "</li>"; }).join(' '));
        response.write("</ul>");
        response.write("</body>");
        response.write("</html>");
        response.end();
      }
    }
    self.fetchTitle(addresses[0], 0, processTitle);
  } else {
    response.statusCode = 404;
    response.end();
  }
};

Server.prototype.fetchTitle = function(address, index, callback) {
  new Scrapper(address, function(result){
    callback(result.url + " - " + result.dom('title').text(), index);
  }, function(error){
    callback(error.url + " - NO RESPONSE", index);
  });
};

module.exports = Server;
