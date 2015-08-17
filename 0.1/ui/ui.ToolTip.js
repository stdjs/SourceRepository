/**
 * tooltip widget module
*/
Std.ui.module("ToolTip",{
    /*#module option:parent]*/
    parent:"widget",
    /*#module option:option]*/
    option:{
        level:2,
        defaultClass:"StdUI_ToolTip",
        value:null,
        renderTo:"body",
        align:"center",
        position:"top",  //top,right,bottom,left
        x:0,
        y:0,
        iframe:null,
        html:null,
        url:null,
        selector:null,
        target:null,
        tabIndex:null,
        padding:12
    },
    /*#module option:extend]*/
    extend:{
        /*
         * visible
        */
        visible:function(visibled){
            if(visibled === true){
                this[0].css("zIndex",Std.ui.status.zIndex+1);
            }
        },
        /*
         * render
        */
        render:function(){
            this.initEvents();
            this.call_opts({selector:null},true);
            this[0].css("zIndex",Std.ui.status.zIndex+1);
        }
    },
    /*#module option:protected]*/
    protected:{
        /*
         * height
         */
        height:function(height){
            this[1].outerHeight(height);
        },
        /*
         * width
         */
        width:function(width){
            this[1].outerWidth(width);
        },
        /*
         * init events
         */
        initEvents:function(){
            var that = this;

            that.on("load",that.relocate);
            return that;
        },
        /*
         * computeXY
        */
        computeXY:function(clientWidth,clientHeight,pointerWidth,pointerHeight){
            var that     = this;
            var target   = Std.dom(that.target());
            var position = that.position();

            if(target == null){
                return {x:0,y:0};
            }
            var x=0,y=0;
            var targetHeight = target.offsetHeight();
            var targetWidth  = target.offsetWidth();
            var targetOffset = target.offset();

            if(position == "top"){
                x = targetOffset.x + (targetWidth - clientWidth) / 2;
                y = targetOffset.y - (clientHeight + pointerHeight);
            }else if(position == "bottom"){
                x = targetOffset.x + (targetWidth - clientWidth) / 2;
                y = targetOffset.y + targetHeight + pointerHeight;
            }else if(position == "right"){
                x = targetOffset.x + targetWidth + pointerWidth;
                y = targetOffset.y + (targetHeight - clientHeight) / 2;
            }else if(position == "left"){
                x = targetOffset.x - pointerWidth - clientWidth;
                y = targetOffset.y + (targetHeight - clientHeight) / 2;
            }
            return {x:x,y:y};
        },
        /*
         * relocate
        */
        relocate:function(){
            var that          = this;
            var position      = that.position();
            var clientWidth   = that[1].offsetWidth();
            var clientHeight  = that[1].offsetHeight();
            var pointerWidth  = that[2].offsetWidth();
            var pointerHeight = that[2].offsetHeight();

            switch(position){
                case "top":
                case "bottom":
                    that[2].css("left",(clientWidth - pointerWidth) / 2);
                    break;
                case "right":
                case "left":
                    that[2].css("top",(clientHeight - pointerHeight) / 2);
                    break;
            }
            if(that.target()){
                var xy = that.computeXY(clientWidth,clientHeight,pointerWidth,pointerHeight);
                that.move(xy.x,xy.y);
            }
            return that;
        }
    },
    /*#module option:public]*/
    public:{
        /*
         * target
        */
        target:function(target){
            return this.opt("target",target);
        },
        /*
         * x
        */
        x:function(x){
            return this.opt("x",x,function(){
                this[0].css("left",x);
            });
        },
        /*
         * y
        */
        y:function(y){
            return this.opt("y",y,function(){
                this[0].css("top",y);
            });
        },
        /*
         * align
        */
        align:function(align){
            return this.opt("align",align,function(){
                this.renderState && this.relocate();
            });
        },
        /*
         * position
        */
        position:function(position){
            return this.opt("position",position,function(){
                this[2].className("_pointer _" + position);
            });
        },
        /*
         * padding
        */
        padding:function(padding){
            var that = this;

            return this.opt("padding",padding,function(){
                that[1] && that[1].css("padding",padding);
                that.renderState && that.relocate();
            });
        },
        /*
         * selector
        */
        selector:function(selector){
            var that = this;

            return this.opt("selector",selector,function(){
                var dom = Std.dom(selector);
                if(dom !== null){
                    var html = dom.html();
                    that[1].html(html);
                    that.emit("load",html);
                }
            });
        },
        /*
         * iframe
        */
        iframe:function(iframe){
            var that = this;

            return that.opt("iframe",iframe,function(){
                that[1].clear().append(newDom("iframe").attr({
                    src:iframe,
                    frameBorder:0
                }).on("load",function(){
                    that.emit("load");
                }));
                that.relocate();
            });
        },
        /*
         * html
        */
        html:function(html){
            var that = this;

            return that.opt("html",html,function(){
                that[1].html(html);
                that.emit("load",html);
            });
        },
        /*
         * url
        */
        url:function(url){
            var that = this;

            return that.opt("url",url,function(){
                var loading = newDiv("_loading");
                that[1].append(loading);
                loading.css("marginTop",(that[1].height() - loading.height()) / 2);
                that.relocate();
                Std.ajax({
                    url:url,
                    cache:true,
                    success:function(responseText){
                        that.html(responseText);
                    }
                });
            });
        }
    },
    /*#module option:main]*/
    main:function(that){
        that[0].append([
            that[1] = newDiv("_client"),
            that[2] = newDiv("_pointer")
        ]);
        that.call_opts(["x","y","padding","position"]);
    }
});

/**
 * tooltip plugin module
*/
Std.plugin.module("ToolTip",{
    /*[#module option:option]*/
    option:{
        triggerMode:"mouseenter",
        timeout:200,
        delegate:null,
        width:"auto",
        height:"auto",
        position:"top"  //top,right,bottom,left,auto
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * create widget
        */
        createWidget:function(){
            var that   = this;
            var opts   = that.opts;
            var option = {
                on:{
                    load:function(data){
                        that.emit("load",data);
                    }
                }
            };
            Std.each("className position width height padding renderTo url html iframe selector",function(i,name){
                if(name in opts){
                    option[name] = opts[name];
                }
            });
            that._tooltip = Std.ui("ToolTip",option);
            return that;
        },
        /*
         * init tooltip
        */
        initToolTip:function(){
            var that = this;
            var opts = that.opts;

            if(!that._tooltip){
                that.createWidget().hide()._tooltip[0].mouse({
                    enter:function(){
                        that.clearTimer();
                        that._timer = setTimeout(function() {
                            that._tooltip.show();
                        },opts.timeout);
                    },
                    leave:function(){
                        that.removeToolTip();
                    }
                });
            }
            return that;
        },
        /*
         * remove tool tip
        */
        removeToolTip:function(){
            var that    = this;
            var tooltip = that._tooltip;

            tooltip && tooltip.remove();
            that._tooltip = null;

            return that;
        },
        /*
         * remove
        */
        remove:function(){
            var that = this;

            if(that._timer !== null){
                clearTimeout(that._timer);
                that._timer = null;
            }
            that.removeToolTip();

            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * iframe
        */
        iframe:function(iframe){
            return this.opt("iframe",iframe,function(){
                this._tooltip && this._tooltip.iframe(iframe);
            });
        },
        /*
         * html
        */
        html:function(html){
            return this.opt("html",html,function(){
                this._tooltip && this._tooltip.html(html);
            });
        },
        /*
         * url
        */
        url:function(url){
            return this.opt("url",url,function(){
                this._tooltip && this._tooltip.url(url);
            });
        },
        /*
         * selector
        */
        selector:function(selector){
            return this.opt("selector",selector,function(){
                this._tooltip && this._tooltip.selector(selector);
            });
        },
        /*
         * target
        */
        target:function(target){
            var that    = this;
            var tooltip = that._tooltip;

            if(target === undefined){
                return tooltip.target();
            }
            tooltip.target(target);
            return that;
        },
        /*
         * clear timer
        */
        clearTimer:function(){
            var that = this;

            if(that._timer !== null){
                clearTimeout(that._timer);
                that._timer = null;
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,owner){
        that._timer = null;

        var mouseevent = function(e){
            this.mouse({
                auto:false,
                enter:function(){
                    if(!that._tooltip){
                        that.initToolTip();
                    }
                    that.clearTimer();
                    that.target(this).emit("render",this);
                    that._tooltip.relocate();
                },
                leave:function(){
                    that._timer = setTimeout(function(){
                        that.removeToolTip();
                    },opts.timeout);
                }
            });
        };

        if(isString(opts.delegate)){
            Std.dom(owner).on(opts.triggerMode,opts.delegate,mouseevent);
        }else{
            Std.dom(owner).on(opts.triggerMode,mouseevent);
        }
    }
});