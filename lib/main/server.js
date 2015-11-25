var http = require('http');
var url = require('url');
var Scrapper = require('./scrapper.js');

function Server() {

  this.start = function() {
    http.createServer(function(request, response) {
      var urlParams = url.parse(request.url, true);
      if (request.method === 'GET' && urlParams.pathname === '/I/want/title/') {
        var addresses = (typeof(urlParams.query.address) == 'string') ? [urlParams.query.address] : urlParams.query.address;
        var titles = [];
        var body = [];

        function scrapTitle(index, callback) {
          new Scrapper(addresses[index], function(result){
            callback(result.url + " - " + result.dom('title').text(), index);
          }, function(error){
            callback(error.url + " - NO RESPONSE", index);
          });
        }

        function processTitle(title, index){
          titles.push(title);
          if(index < addresses.length - 1){
              scrapTitle(index + 1, processTitle);
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
        scrapTitle(0, processTitle);

      } else {
        response.statusCode = 404;
        response.end();
      }
    }).listen(8080);
  }
}

module.exports = Server;
