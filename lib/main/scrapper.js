var cheerio = require('cheerio');
var http = require('http');
var url = require('url');

function Scrapper(uri, success_callback, error_callback){
  if(! /^http:/.test(uri) ){
    uri = "http://" + uri;
  }
  http.get(uri, function(response){
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      success_callback({url: uri, dom: cheerio.load(body)});
    });
  }).on('error', function(e){
    console.log("Error occured - Scrapper - http.get ", e);
    error_callback({url: uri, error: e.message});
  });
}

module.exports = Scrapper;
