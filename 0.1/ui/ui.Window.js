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
        defaultClass:"StdUI_Panel StdUI_Window",
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
        renderTo:"body",
        closeAction:"remove"
    },
    /*[#module option:private]*/
    private:{
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
         * title button click
        */
        titleButtonClick:function(name){
            var that = this;

            switch(name){
                case "min":
                    that.minimize(true);
                    break;
                case "max":
                    that.maximize(!that.opts.maximize);
                    break;
                case "close":
                    that.close();
                    break;
            }
            return that;
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
    /*[#module option:protected]*/
    protected:{
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
            var that         = this;
            var offsetParent = that[0].offsetParent();

            if(offsetParent.contains("body")){
                offsetParent = Std.dom(window);
            }
            Std.dom(window).on("resize",that._windowResize = function(){
                that.move(0,0).size(offsetParent.outerWidth(),offsetParent.outerHeight());
            });

            return that;
        },
        /*
         * init title buttons
        */
        initTitleButtons:function(){
            var that = this;
            var opts = that.opts;

            that.appendTitleButton({
                min:"_min",
                max:"_max",
                close:"_close"
            });

            that.D.TitleBar.on({
                dblclick:function(){
                    if(opts.maximizable){
                        that.maximize(!opts.maximize);
                    }
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
                    iconClass:"_restore",
                    click:function(){
                        that.restore();
                    }
                },{
                    text:"Minimize",
                    iconClass:"_min",
                    enable:opts.minimizable,
                    click:function(){
                        that.minimize(true);
                    }
                },{
                    ui:"MenuItem",
                    text:"Maximize",
                    iconClass:"_max",
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
                    iconClass:"_close",
                    css:{
                        fontWeight:"bold"
                    },
                    click:function(){
                        that.close();
                    }
                }
            ];

            that.plugin("contextMenu",{
                width:160,
                items:menuItems,
                handle:that.D.TitleBar,
                on:{
                    show:function(){
                        var items = this.menu.items;
                        items[0].enable(that._lastRect);
                        items[2].enable(!that.maximize());
                    }
                }
            });
        },
        /*
         * save rect
        */
        saveRect:function(){
            var that = this;

            return that._lastRect = {
                top:that[0].css("top"),
                left:that[0].css("left"),
                width:that.width(),
                height:that.height()
            }
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
                that.titleButtons("min").visible(state);
            });
        },
        /*
         *  maximizable
        */
        maximizable:function(state){
            var that = this;

            return that.opt("maximizable",state,function(){
                that.titleButtons("max").visible(state);
            });
        },
        /*
         * closable
        */
        closable:function(state){
            var that = this;

            return that.opt("closable",state,function(){
                that.titleButtons("close").visible(state);
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
                            stop:function(){}
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
                        handle:that.D.TitleBar
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
            var method = that.opts.closeAction;

            if(method in that){
                that.animation("close",function(){
                    that[method]();
                },method);
            }
            return that.emit("close");
        },
        /*
         * minimize
        */
        minimize:function(state){
            var that = this;

            return that.opt("minimize",state,function(){
                that.emit("minimize",state);
                that.animation("minimize",function(){
                    that.visible(!state);
                },state);
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
                    that.titleButtons("max").addClass("_restore");

                    if(!that._windowResize){
                        that.initWindowEvent();
                    }
                    that.animation("maximize",function(){
                        that._windowResize();
                    },that.saveRect());
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
                that.animation("restore",function(){
                    that.width(lastRect.width);
                    that.height(lastRect.height);
                    that[0].css({
                        top  : lastRect.top,
                        left : lastRect.left
                    });
                },lastRect);
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
            that.toForeground();
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