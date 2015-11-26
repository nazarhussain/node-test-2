var http = require('http');
var url = require('url');
var Scrapper = require('./scrapper.js');
var Promise = require('bluebird');
var conf = require('../../config.js');

function Server() {
  this.httpServer = http.createServer(this.processRequest.bind(this));
}

Server.prototype.start = function() {
  var self = this;
  self.httpServer.listen(conf.get('port'), conf.get('ip'), function(x){
    console.log('running on http://' + self.httpServer.address().address + ":" + self.httpServer.address().port);
  });
}

Server.prototype.processRequest = function(request, response) {
  var self = this;
  var urlParams = url.parse(request.url, true);
  if (request.method === 'GET' && urlParams.pathname === '/I/want/title/') {
    var addresses = (typeof(urlParams.query.address) === 'string') ? [urlParams.query.address] : urlParams.query.address;
    var body = [];

    var promises = addresses.map(function(address){
      return self.fetchTitle(address);
    });

    Promise.all(promises).then(function(titles){
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
    }).catch(function(error){
      response.statusCode = 500;
      response.end();
      console.log("Something went wrong..." + error)
    });

  } else {
    response.statusCode = 404;
    response.end();
  }
}

Server.prototype.fetchTitle = function(address) {
  return new Promise(function(fullfill, reject){
    Scrapper(address).then(function(result){
      fullfill(result.url + " - " + result.dom('title').text());
    }, function(error){
      reject(error.url + " - NO RESPONSE");
    })
  });
}

module.exports = Server;
