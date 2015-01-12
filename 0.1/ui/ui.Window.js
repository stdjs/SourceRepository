/**
 * window widget module
*/
Std.ui.module("Window",{
    /*[#module option:parent]*/
    parent:"Panel",
    /*[#module option:events]*/
    events:"minimize maximize restore close",
    /*[#module option:action]*/
    action:{
        content:"html"
    },
    /*[#module option:option]*/
    option:{
        className:"StdUI_Panel StdUI_Window",
        minWidth:180,
        minHeight:100,
        width:600,
        height:400,
        resizable:true,
        draggable:true,
        minimizable:true,
        maximizable:true,
        closable:true,
        center:true,
        modal:false,
        minimize:false,
        maximize:false,
        title:"Window",
        closeMethod:"hide",
        renderTo:"body"
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * locker
        */
        locker:null,
        /*
         * last rect
        */
        lastRect:null,
        /*
         * window resize event callback
        */
        windowResize:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            if(opts.center){
                that.move("center");
            }
            if(opts.modal){
                that.initLocker();
            }
            that.call_opts({
                maximize:false,
                resizable:false,
                draggable:false
            },true);

            that.focus(1);
        },
        /*
         * extend visible
        */
        visible:function(state){
            var that   = this;
            var locker = that._locker;

            locker && locker.visible(state);
        },
        /*
         * extend remove
        */
        remove:function(){
            var that = this;

            that._locker       && that._locker.remove();
            that._windowResize && Std.dom(window).off("resize",that._windowResize);
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * title button click
        */
        titleButtonClick:function(name){
            var that = this;
            var opts = that.opts;

            switch(name){
                case "min":
                    that.minimize(true);
                    break;
                case "max":
                    that.maximize(!opts.maximize);
                    break;
                case "close":
                    that.close();
                    break;
            }
            return that;
        },
        /*
         * init locker
        */
        initLocker:function(){
            var that = this;

            that._locker = Std.ui("locker",{
                renderTo:that[0].parent(),
                opacity:0.1,
                visible:true
            });
        },
        /*
         * init window event
        */
        initWindowEvent:function(){
            var that      = this;
            var windowObj = Std.dom(window);

            windowObj.on("resize",that._windowResize = function(){
                that.rect(0,0,windowObj.width(),windowObj.height());
                that._layout.update();
            });

            return that;
        },
        /*
         * init title buttons
        */
        initTitleButtons:function(){
            var that = this;
            var opts = that.opts;

            that._titleBar.append({
                min:"_min",
                max:"_max",
                close:"_close"
            }).on({
                dblclick:function(){
                    if(opts.maximizable){
                        that.maximize(!opts.maximize);
                    }
                },
                buttonClick:function(name){
                    that.titleButtonClick(name);
                }
            });
            return that;
        },
        /*
         * init title context menu
        */
        initTitleContextMenu:function(){
            var that      = this;
            var opts      = that.opts;
            var menuItems = [
                {
                    text:"Restore",
                    icon:"._restore",
                    click:function(){
                        that.restore();
                    }
                },{
                    text:"Minimize",
                    icon:"._min",
                    enable:opts.minimizable,
                    click:function(){
                        that.minimize(true);
                    }
                },{
                    ui:"MenuItem",
                    text:"Maximize",
                    icon:"._max",
                    enable:opts.maximizable,
                    click:function(){
                        that.maximize(true);
                    }
                },
                {ui:"sep"},
                {
                    text:"Hide Window",
                    click:function(){
                        that.hide();
                    }
                },{
                    ui:"MenuItem",
                    text:"Move To",
                    enable:false,
                    items:[{
                        text:"center"
                    }]
                },
                {ui:"sep"},
                {
                    text:"Close",
                    icon:"._close",
                    css:{
                        fontWeight:"bold"
                    },
                    click:function(){
                        that.close();
                    }
                }
            ];

            that._titleBar.plugin("contextMenu",{
                width:160,
                items:menuItems,
                on:{
                    show:function(){
                        var items = this.menu.items;
                        items[0].enable(that._lastRect);
                        items[2].enable(!that.maximize());
                    }
                }
            });
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * minimizable
        */
        minimizable:function(state){
            var that = this;

            return that.opt("minimizable",state,function(){
                that._titleBar.items.min.visible(state);
            });
        },
        /*
         *  maximizable
        */
        maximizable:function(state){
            var that = this;

            return that.opt("maximizable",state,function(){
                that._titleBar.items.max.visible(state);
            });
        },
        /*
         * closable
        */
        closable:function(state){
            var that = this;

            return that.opt("closable",state,function(){
                that._titleBar.items.close.visible(state);
            });
        },
        /*
         * panel resizable
        */
        resizable:function(state){
            var that = this;

            return that.opt("resizable",state,function(){
                if(!that.plugin("resize")){
                    that.plugin("resize",{
                        on:{
                            stop:function(){that._layout.update()}
                        }
                    });
                }
                that.plugin("resize").resizable(state);
            });
        },
        /*
         * panel draggable
        */
        draggable:function(state){
            var that = this;

            return that.opt("draggable",state,function(){
                if(!that.plugin("drag")){
                    that.plugin("drag",{
                        handle:that._titleBar
                    });
                }
                that.plugin("drag").draggable(state);
            });
        },
        /*
         * close window
        */
        close:function(){
            var that   = this;
            var method = that.opts.closeMethod;

            if(method in that){
                that[method]();
            }
            return that.emit("close");
        },
        /*
         * minimize
        */
        minimize:function(state){
            var that = this;

            return that.opt("minimize",state,function(){
                if(state === true){
                    that.hide();
                }else{
                    that.show().restore();
                }
                that.emit("minimize",state);
            });
        },
        /*
         * maximize
        */
        maximize:function(state){
            var that = this;

            return that.opt("maximize",state,function(){
                if(state === false){
                    that.restore();
                }else{
                    that._lastRect = that.rect();
                    that.titleButtons("max").addClass("_restore");

                    if(!that._windowResize){
                        that.initWindowEvent();
                    }
                    that._windowResize();
                }
                that.emit("maximize",state);
            });
        },
        /*
         * restore
        */
        restore:function(){
            var that     = this;
            var lastRect = that._lastRect;

            that.opts.maximize = false;
            that.titleButtons("max").removeClass("_restore");

            if(lastRect !== null){
                that.width(lastRect.width);
                that.height(lastRect.height);
                that[0].css({
                    top  : lastRect.top,
                    left : lastRect.left
                });
                that._layout.update()
            }
            if(that._windowResize){
                Std.dom(window).off("resize",that._windowResize);
            }
            return that.emit("restore");
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        dom.focussing(function(){
            that[0].css("zIndex",++Std.ui.status.zIndex);
        },null,false);

        that.initTitleContextMenu();
        that.initTitleButtons();
        that.call_opts({
            minimizable:true,
            maximizable:true,
            closable:true
        },true);
    }
});