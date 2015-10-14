/**
 * panel widget module
*/
Std.ui.module("Panel",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"titleButtonClick",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Panel",
        level:4,
        width:300,
        height:200,
        minWidth:70,
        minHeight:50,
        title:"panel",
        menuBar:null,
        toolBar:null,
        titleIcon:null,
        titleIconClass:null,
        titleHeight:22,
        titleButtons:null,
	    clientPadding:8,
        collapsible:false,
        collapsed:false
    },
    /*[#module option:action]*/
    action:{
        /*
         * content
         */
        content:"html",
        /*
         * children
         */
        children:"append"
    },
    /*[#module option:private]*/
    private:{
        titleBar:null,
        menuBar:null,
        toolBar:null,
        client:null,
        central:null,
        titleButtons:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;

            if(that._menuBar){
                that._menuBar.render();
            }
            if(that._toolBar){
                that._toolBar.render();
            }
            that._central.render();
            that.initEvents();
            that.call_opts("collapsed",true);
        },
        /*
         * extend height
        */
        height:function(height){
            var that = this;
            that.updateHeight(height);
            that._central.emit("resize");
        },
        /*
         * extend remove
        */
        remove:function(){
            var that = this;

            that._central.remove();
            that._menuBar && that._menuBar.remove();
            that._toolBar && that._toolBar.remove();
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * title button click
         */
        titleButtonClick:function(name){
            var that = this;
            var opts = that.opts;

            if(name === "collapse"){
                that.collapsed(!opts.collapsed,true);
            }
            return that.emit("titleButtonClick",[name,that],true);
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var doms  = that.D;
            var state = false;

            that[0].on({
                focusin:function(){
                    that.addClass("focused");
                },
                focusout:function(){
                    that.removeClass("focused");
                },
                mousedown:function(e){
                    that.focus();
                },
                mouseenter:function(){
                    if(state == false){
                        doms.TitleBar.unselect(state = true);
                        that._toolBar && that._toolBar[0].unselect(true);
                    }
                }
            });
            return that;
        },
        /*
         * init events
        */
        initTitleEvents:function(){
            var that = this;
            var doms = that.D;

            doms.TitleBar.on("mouseenter","._buttons > ._button",function(e){
                this.mouse({
                    auto:false,
                    down:function(e){
                        e.stopPropagation();
                    },
                    click:function(){
                        var titleButtons = that._titleButtons;
                        for(var name in titleButtons){
                            if(titleButtons[name].contains(this)){
                                that.titleButtonClick(name);
                            }
                        }
                    }
                },e);
            });
            return that;
        },
        /*
         * init title
        */
        initTitle:function(){
            var that = this;
            var opts = that.opts;
            var doms = that.D;

            doms.TitleBar = newDiv("_title").outerHeight(opts.titleHeight).append([
                doms.TitleIcon    = newDiv("_icon"),
                doms.TitleText    = newDiv("_text").html(opts.title),
                doms.TitleButtons = newDiv("_buttons")
            ]).appendTo(that[0]);

            return that;
        },
        /*
         * init body
        */
        initBody:function(){
            var that = this;

            that[0].append(
                that.D.body = newDiv("_body")
            );

            return that;
        },
        /*
         * init client
        */
        initClient:function(){
            var that = this;
            var opts = that.opts;

            that.D.Client = newDiv("_client").append(
                that._central = Std.ui("widget",{
                    defaultClass:"_central",
                    appendTo:that[0],
                    tabIndex:null
                })
            ).appendTo(that.D.body);

            if(opts.clientPadding){
                that.D.Client.padding(opts.clientPadding);
            }

            return that;
        },
        /*
         * update height
        */
        updateHeight:function(height){
            var that         = this;
            var opts         = that.opts;
            var clientHeight = (isNumber(height) ? height : that.height()) - that.boxSize.height - opts.titleHeight;

            if(opts.clientPadding){
                clientHeight -= opts.clientPadding * 2;
            }
            if(that._toolBar){
                clientHeight -= that._toolBar.height();
            }
            if(that._menuBar){
                clientHeight -= that._menuBar.height();
            }
            that.D.Client.height(clientHeight);
            return that;
        },
        /*
         * create title button
        */
        createTitleButton:function(name,data){
            var item = this._titleButtons[name] = newDiv("_button").data(name,data);

            if(isObject(data)){
                item.set(data);
            }else if(isString(data)){
                item.addClass(data);
            }
            return item;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * title text
        */
        title:function(text){
            return this.opt("title",text,function(){
                this.titleText(text);
            });
        },
        /*
         * collapsible
        */
        collapsible:function(collapsible){
            var that = this;

            return that.opt("collapsible",collapsible,function(){
                if(collapsible === true){
                    that.appendTitleButton("collapse","_collapse");
                }
            });
        },
        /*
         * client padding
        */
        clientPadding:function(padding){
            return this.opt("clientPadding",padding,function(){
                this.D.Client && this.D.Client.padding(padding);
            });
        },
        /*
         * get or set title text
         */
        titleText:function(text){
            var that = this;

            return that.opt("text",text,function(){
                that.D.TitleText.html(text);
            });
        },
        /*
         * get or set title icon
        */
        titleIcon:function(icon){
            var that = this;
            var doms = that.D;

            return that.opt("titleIcon",icon,function(){
                if(!doms.TitleIconImg){
                    doms.TitleIconImg = newDom("img").appendTo(doms.TitleIcon);
                }
                doms.TitleIconImg.attr("src",icon);
            });
        },
        /*
         * get or set title icon class
         */
        titleIconClass:function(className){
            var that = this;
            var doms = that.D;

            return that.opt("titleIcon",className,function(){
                doms.TitleIcon.className("_icon " + className);
            });
        },
        /*
         * load by url
        */
        url:function(url,callback){
            var that = this;

            if(url === undefined){
                return that._central.url();
            }
            that._central.url(url,callback);

            return that;
        },
        /*
         * html(rewrite)
        */
        html:function(html){
            var that = this;

            if(html === undefined){
                return that._central.html();
            }
            that._central.html(html);

            return that;
        },
        /*
         * iframe(rewrite)
        */
        iframe:function(url){
            var that = this;

            if(url === undefined){
                return that._central.iframe();
            }
            that._central.iframe(url);

            return that;
        },
        /*
         * layout(rewrite)
        */
        layout:function(layout){
            var that = this;

            if(layout === undefined){
                return that._central.layout();
            }
            that._central.layout(layout);

            return that;
        },
        /*
         * menu bar
         */
        menuBar:function(data){
            var that = this;

            if(data === undefined){
                return that._menuBar || null;
            }
            if(isWidget(data)){
                that._menuBar = data;
            }else if(isObject(data)){
                that._menuBar = Std.ui("MenuBar",data);
            }
            that.D.body.prepend(that._menuBar);

            if(that.renderState){
                that._menuBar.render();
                that.updateHeight();
            }
            return that;
        },
        /*
         * tool bar
        */
        toolBar:function(data){
            var that = this;

            if(data === undefined){
                return that._toolBar || null;
            }
            if(isWidget(data)){
                that._toolBar = data;
            }else if(isObject(data)){
                that._toolBar = Std.ui("ToolBar",data);
            }
            that.D.body.insertBefore(that._toolBar,that.D.Client);
            if(that.renderState){
                that._toolBar.render();
                that.updateHeight();
            }

            return that;
        },
        /*
         * collapse
        */
        collapsed:function(state,animate){
            var that      = this;
            var showBody  = function(){
                that.height(that.opts.height);
                that.D.body.removeStyle("height");
            };
            var hideBody  = function(){
                that.D.body.css({zIndex:-1, position:"absolute", visibility:"hidden"});
            };
            var animateTo = function(height,callback){
                that.D.body.animate("end").animate({
                    to:{
                        height:height
                    }
                },150,callback)
            };
            return that.opt("collapsed",state,function(){
                if(state === true){
                    that[0].removeStyle("height");
                    animate === true ? animateTo(0,hideBody) : hideBody();
                }else{
                    that.D.body.height(0).removeStyle(["visibility","position","zIndex"]);
                    animate === true ? animateTo(that.height() - that.boxSize.height - that.opts.titleHeight,showBody) : showBody();
                }
                that.titleButtons("collapse").toggleClass("_open",state);
            });
        },
        /*
         * title buttons
        */
        titleButtons:function(name,data){
            var that  = this;
            var items = that._titleButtons;

            if(name === undefined){
                return items;
            }
            if(isString(name) && data === undefined){
                return items[name];
            }
            that.appendTitleButton(name,data);

            return that;
        },
        /*
         * insert title button before
        */
        insertTitleButtonBefore:Std.func(function(name,data,targetName){
            var that  = this;
            var item  = that.createTitleButton(name,data);
            var items = that._titleButtons;

            if(item !== null && targetName in items){
                this.D.TitleButtons.insertBefore(items[targetName]);
            }
        },{
            each:[isArray]
        }),
        /*
         * insert title button after
         */
        insertTitleButtonAfter:Std.func(function(name,data,targetName){
            var that  = this;
            var item  = that.createTitleButton(name,data);
            var items = that._titleButtons;

            if(item !== null && targetName in items){
                this.D.TitleButtons.insertAfter(items[targetName]);
            }
        },{
            each:[isArray]
        }),
        /*
         * append title button
        */
        appendTitleButton:Std.func(function(name,data){
            var that = this;
            var item = that.createTitleButton(name,data);

            if(item !== null){
                this.D.TitleButtons.append(item);
            }
        },{
            each:[isObject]
        })
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D             = {};
        that._titleButtons = {};

        that.initTitle();
        that.initBody();
        that.initClient();
        that.initTitleEvents();
        that.call_opts({
            menuBar:null,
            toolBar:null,
            titleIcon:null,
            titleIconClass:null,
            titleButtons:null,
            collapsible:false
        },true);
    }
});