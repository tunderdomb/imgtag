var http = require('http')
var imagesize = require('imagesize')
var async = require("async")
var imgtag = require("../imgtag")

module.exports = function ( grunt ){

  grunt.registerMultiTask("imgtag", "", function (){
    var done = this.async()
    var images = []
    var files = this.filesSrc.map(function ( src ){
      try {
        return {
          src: src,
          content: grunt.file.read(src)
        }
      }
      catch ( e ) {
        return null
      }
    }).filter(function ( file ){
      return file !== null
    }).map(function( file ){
      file.content.replace(/<img\s+([^>]+)>/g, function ( match, attributes ){
        var src = attributes.match(/src="([^>]+)"/)
        if ( src && !~images.indexOf(src) ) images.push(src)
      })
    })

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

    imgtag(images, function ( sizes ){
      done()
    })

  })
}