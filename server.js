var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}


var PORT = 8009;

var http = require('http');
var url=require('url');
var fs=require('fs');
var path=require('path');

var server = http.createServer(function (request, response) {
    var pathname = request.url;
    var realPath;
    if(pathname === '/'){
        realPath = 'index.html'
    }else{
        realPath = "./" + url.parse(request.url).pathname;
    }
    console.log(realPath);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            if(request.url.indexOf('findAttr') != -1){
                var params = url.parse(request.url, true).query;
                require('./findAttr')(params.tagName,function(attrList){
                    response.writeHead(200, {
                        'Content-Type': 'text/html;charset=utf-8'
                    });
                    response.write(typeof attrList == 'string'?attrList:JSON.stringify(attrList),'UTF-8',function(){
                        response.end();
                    });
                });

            }else{
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });

                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            }
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end();
                } else {
                    var contentType = mine[ext]+";charset=utf-8" || "text/html;charset=utf-8";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
            // var contentType = mine[ext] || "text/plain";
            // response.writeHead(200, {
            //     'Content-Type': contentType
            // });
            // response.end();
        }
    });
});
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");