var http = require('http')
var imagesize = require('imagesize')
var async = require("async")

module.exports = function( images, done ){
  async.map(images, function ( src, done ){
    var request = http.get(src, function ( response ){
      imagesize(response, function ( err, result ){
        // we don't need more data
        request.abort()
        // do something with result
        done({
          src: src,
          width: result.width,
          height: result.height
        })
      })
    })
  }, done)
}