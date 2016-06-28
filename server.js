var module_fs          = require("fs");
var module_http        = require("http");
var module_url         = require("url");
var module_path        = require("path");
var module_queryString = require("querystring");

(function(){
    /*
     * passwords
    */
    var passwords = [];
    /*
     * save file
    */
    var saveFile  = function(data,callback){
        var directory = __dirname + module_path.sep + data.version + module_path.sep;

        if(!module_fs.existsSync(directory)){
            callback("directory ["+directory+"] doesn't exist!");
        }else{
            module_fs.writeFile(directory + "packages.json",data["packages"],function(error){
                if(error){
                   return callback(error + "");
                }
                module_fs.writeFile(directory + "index.js",data["index"],function(error){
                    if(error){
                        return callback(error + "");
                    }
                    callback("0");
                });
            });
        }
    };
    /*
     * create http server
    */
    var createServer = function(){
        module_http.createServer(function(request,response){
            var requestUrl = request.url;
            var postData   = "";

            response.writeHead(200,{
                "Access-Control-Allow-Origin":"*"
            });
            if(requestUrl === "/save"){
                request.on("data",function(chuck){
                    postData += chuck;
                });
                request.once("end",function(){
                    postData = module_queryString.parse(postData);
                    if(!("password" in postData) || !postData["version"] || !postData["packages"] || !postData["index"]){
                        response.end("data error");
                    }else if(passwords.length !== 0 && passwords.indexOf(postData["password"]) === -1){
                        response.end("Invalid password");
                    }else{
                        saveFile(postData,function(code){
                            response.end(code);
                        });
                    }
                });
            }else{
                response.end("Illegal request");
            }
        }).listen(12444);
    };

    /*
     * read password file
    */
    module_fs.readFile(__dirname + module_path.sep + "password.txt",function(error,data){
        if(error){
            return createServer();
        }
        for(var i=0,length=(data = (data + "").trim().split('\n')).length;i<length;i++){
            if((data[i] = data[i].trim()) !== ""){
                passwords.push(data[i]);
            }
        }
        createServer();
    });
})();
