var cheerio = require('cheerio');
var http = require('http');
var url = require('url');
var RSVP = require('RSVP');

function Scrapper(uri){
  if(! /^http:/.test(uri)){ uri = "http://" + uri; }
  return new RSVP.Promise(function(fullfill, reject){
    http.get(uri, function(response){
      var body = '';
      response.on('data', function(d) {
        body += d;
      });
      response.on('end', function() {
        fullfill({url: uri, dom: cheerio.load(body)});
      });
    }).on('error', function(e){
      console.log("Error occured - Scrapper - http.get ", e);
      reject({url: uri, error: e.message});
    });
  });
}

module.exports = Scrapper;
