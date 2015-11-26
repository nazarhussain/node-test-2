var cheerio = require('cheerio');
var http = require('http');
var url = require('url');
var Promise = require('bluebird');

function Scrapper(uri){
  if(! /^http:/.test(uri)){ uri = "http://" + uri; }
  return new Promise(function(resolve, reject){
    http.get(uri, function(response){
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        resolve({url: uri, dom: cheerio.load(body)});
      });
    }).on('error', function(e){
      console.log("Error occured - Scrapper - http.get ", e);
      reject({url: uri, error: e.message});
    });
  });
}

module.exports = Scrapper;
