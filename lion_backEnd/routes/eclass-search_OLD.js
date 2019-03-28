
var express = require('express');
var router = express.Router();
var url = require('url');
var http = require('http');
var htmlToJson = require('html-to-json');




/* GET properties list by name */
router.get('/list', function(req, res, next) {
    var jsonArr = {};
    //var q is for the query string that was sent to the server
    var q = url.parse(req.url, true).query;
    
    // options for http request to eclass search, "prop" is the required input variable for the service
    var getOptions = {
        host: 'www.eclasscontent.com',
        path: `/index.php?action=search&language=de&version=10.1&options=prop&searchtxt=${q.prop}`
      };
      
      
    
      //actual get request to eclass search
      var getReq = http.get(getOptions, function(getRes) {
        console.log('STATUS: ' + getRes.statusCode);
        console.log('HEADERS: ' + JSON.stringify(getRes.headers));
      
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        getRes.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var body = Buffer.concat(bodyChunks).toString();
            

          htmlToJson.parse(body, function () {
            return this.map('td', function ($item) {
              return $item.text();
            });
          }).done(function (properties) {
            // Items should be: ['1','2']
            console.log(properties)
            for (let i = 0; i < properties.length; i++) {
                
                properties[i] = properties[i].trim();

                if(properties[i].includes("0173")){
                    jsonArr[i] = {
                        id: "",
                        name: ""
                    }
                    jsonArr[i].id = properties[i]
                }else{
                    jsonArr[i-1].name = properties[i]
                }
                
                
                
            }
            console.log(JSON.stringify(jsonArr));
            res.end(JSON.stringify(jsonArr));
          }, function (err) {
            // Handle error
          });

        
        })
        
      });
        
});

/* GET properties list by name */
router.get('/detail', function(req, res, next) {
    var jsonArr = {};
    //var q is for the query string that was sent to the server
    var q = url.parse(req.url, true).query;
    
    console.log(q.prop)
    
    var urlstring = encodeURIComponent(q.prop)
    console.log(q.prop)
    // options for http request to eclass search, "prop" is the required input variable for the service
    var getOptions = {
        host: 'www.eclasscontent.com',
        path: `/index.php?action=cc2prdet&language=de&version=10.1&id=&pridatt=${urlstring}`
      };
      
      //actual get request to eclass search
      var getReq = http.get(getOptions, function(getRes) {
        console.log('STATUS: ' + getRes.statusCode);
        console.log('HEADERS: ' + JSON.stringify(getRes.headers));
      
        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        getRes.on('data', function(chunk) {
          // You can process streamed parts here...
          bodyChunks.push(chunk);
        }).on('end', function() {
          var planBody = Buffer.concat(bodyChunks)
            var body = Buffer.concat(bodyChunks).toString();
        //   console.log(body) 

          htmlToJson.parse(body, function () {
            return this.map('th', function ($item) {
              return $item.text();
            });
          }).done(function (properties) {
              
            // Items should be: ['1','2']
            console.log(properties)

            htmlToJson.parse(body, function () {
                return this.map('td', function ($item) {
                  return $item.text();
                });
              }).done(function (properties) {
                  
                // Items should be: ['1','2']
                console.log(properties)
                // for (let i = 0; i < properties.length; i++) {
                    
                //     properties[i] = properties[i].trim();
    
                //     if(properties[i].includes("0173")){
                //         jsonArr[i] = {
                //             id: "",
                //             name: ""
                //         }
                //         jsonArr[i].id = properties[i]
                //     }else{
                //         jsonArr[i-1].name = properties[i]
                //     }
                    
                    
                    
                // }
              }, function (err) {
                // Handle error
              });


            // for (let i = 0; i < properties.length; i++) {
                
            //     properties[i] = properties[i].trim();

            //     if(properties[i].includes("0173")){
            //         jsonArr[i] = {
            //             id: "",
            //             name: ""
            //         }
            //         jsonArr[i].id = properties[i]
            //     }else{
            //         jsonArr[i-1].name = properties[i]
            //     }
                
                
                
            // }
            console.log(JSON.stringify(jsonArr));
            res.end(planBody);
          }, function (err) {
            // Handle error
          });

        
        })
        
      });
        
});

module.exports = router;



