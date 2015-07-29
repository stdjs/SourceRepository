/**
 * web socket client module
*/
Std.websocket = Std_module({
    /*[#module option:model]*/
    model:"events",
    /*[#module option:option]*/
    option:{
        host:top.location.hostname || "localhost",
        port:3000,
        path:"",
        url:""
    },
    /*[#module option:protected]*/
    protected:{
        initEvents:function(){
            var that   = this;
            var socket = that.socket;

            Std_extend(socket,{
                onopen:function(event){
                    that.emit("open",event);
                    if(socket.readyState === 1 && that.sendQueue.length !== 0){
                        that.sendQueue.each(function(i,data){
                            socket.send(data);
                        });
                        that.sendQueue.clear();
                    }
                },
                onmessage:function(message){
                    that.emit("message",message);
                },
                onerror:function(event){
                    that.emit("error",event);
                },
                onclose:function(event){
                    that.emit("close",event);
                    that.socket = NULL;
                }
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * connect to server
        */
        connect:function(options){
            var that    = this;
            var opts    = that.opts;
            var socket  = NULL;

            if(isObject(options)){
                that.opts = opts = that.init_opts(options);
                that.url  = "ws://" + opts.host + ":" + opts.port + "/" + opts.path;
            }else if(isString(options)){
                var url = that.url = Std_url(options);
                that.init_opts({
                    host:url.domain,
                    port:url.port,
                    path:url.path
                });
            }else{
                return that;
            }

            if(isFunction(WebSocket)){
                socket = new WebSocket(that.url);
            }else if(isFunction(MozWebSocket)){
                socket = new MozWebSocket(that.url);
            }

            that.socket = socket;

            return that.initEvents().emit("connect");
        },
        /*
         * send message
        */
        send:function(data){
            var that   = this;
            var socket = that.socket;

            if(socket !== NULL){
                var readyState = socket.readyState;
                if(readyState === 0){
                    that.sendQueue.push(data);
                }else if(readyState === 1){
                    socket.send(data);
                }
            }
            return that;
        },
        /*
         * close connection
        */
        close:function(code,reason){
            var that   = this;
            var socket = that.socket;

            if(socket !== NULL){
                socket.close(code,reason);
                that.socket = NULL;
            }
            return that;
        },
        /*
         * websocket ready state
        */
        readyState:function(){
            var that   = this;
            var socket = that.socket;

            if(socket === NULL){
                return 3;
            }
            return socket.readyState;
        }
    },
    /*[#module option:main]*/
    main:function(options){
        var that       = this;
        that.sendQueue = [];

        if(isObject(options)){
            if(isString(options.url)){
                that.connect(options.url);
            }else{
                if(options.on){
                    that.on(options.on);
                }
                that.connect(options);
            }
        }else if(isString(options)){
            that.connect(options);
        }
    }
});
