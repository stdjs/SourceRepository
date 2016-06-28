/**
 * upload plugin
*/
Std.plugin.module("upload",{
    /*[#module option:option]*/
    option:{
        action:"",
        width:null,
        height:null,
        callback:null
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * resize
        */
        resize:function(){
            var that     = this;
            var opts     = that.opts;
            var doms     = that.D;
            var ownerDom = Std.dom(that.owner);
            var width    = opts.width  || ownerDom.outerWidth();
            var height   = opts.height || ownerDom.outerHeight();

            doms.form.css({
                width   : width,
                height  : height,
                left    : 0,
                top     : 0
            });
            doms.file.css({
                width   : width,
                height  : height,
                left    : 0,
                top     : 0
            });
            return that;
        },
        /*
         * init elements
        */
        initElements:function(){
            var that       = this;
            var opts       = that.opts;
            var doms       = that.D = {};
            var ownerDom   = Std.dom(that.owner);
            var iframeName = "uploadIframe" + Date.time();

            doms.form = newDom("form").attr({
                method  : "post",
                enctype : "multipart/form-data",
                action  : opts.action,
                target  : iframeName
            }).css("position","absolute").append([
                doms.iframe = newDom("iframe").attr({
                    name : iframeName,
                    width:0,
                    height:0,
                    position:"absolute"
                }),
                doms.file   = new Std.dom("input[type='file'][name='file']").css({
                    position: "absolute",
                    opacity : 0,
                    zIndex:ownerDom.attr("zIndex")+1
                })
            ]).appendTo(ownerDom);

            ownerDom.css("position","static","relative");
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that   = this;
            var opts   = that.opts;
            var doms   = that.D;
            var status = 0;

            doms.file.on("change",function(){
                status = 1;
                doms.form.submit();
                that.emit("change");
            });
            doms.iframe.on("load",function(){
                if(status == 1){
                    var response = Std.dom(doms.iframe.dom.contentWindow.document.body).text();
                    if(response  = response.toObject()){
                        if(isFunction(opts.callback)){
                            opts.callback.call(that,response);
                        }
                    }
                    that.emit("load",response);
                }
                status = 0;
            }).hide();

            that.owner.on("resize",that._resize = function(){
                that.resize();
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * remove
        */
        remove:function(){
            this.owner.off("resize",this._resize);
        }
    },
    /*[#module option:main]*/
    main:function(that){
        that.initElements();
        that.initEvents();
        that.resize();
    }
});