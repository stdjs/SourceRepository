/**
 * panel widget module
*/
Std.ui.module("Panel",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        content:"html"
    },
    /*[#module option:events]*/
    events:"titleButtonClick",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Panel",
        minWidth:70,
        minHeight:50,
        height:200,
        width:300,
        level:4,
        title:"panel",
        menuBar:null,
        toolBar:null,
        titleHeight:22,
        titleButtons:null,
	    clientPadding:8
    },
    /*[#module option:protected]*/
    protected:{
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

            if(that._toolBar){
                that._toolBar.render();
            }
            that._central.render();
            that.initEvents();
        },
        /*
         * extend remove
        */
        remove:function(){
            var that = this;

            that._central.remove();
            that._toolBar && that._toolBar.remove();
        },
        /*
         * extend height
        */
        height:function(height){
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
            that._central.emit("resize");
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var doms  = that.D;
            var state = false;

            that[0].on({
                focusin:function(){
                    that.addClass("focus");
                },
                mousedown:function(){
                    that.focus();
                },
                mouseenter:function(){
                    if(state == false){
                        that[0].on("focusout",function(){
                            that.removeClass("focus");
                        });
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
                                that.emit("titleButtonClick",[name,this],true);
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
            ).appendTo(that[0]);

            if(opts.clientPadding){
                that.D.Client.padding(opts.clientPadding);
            }

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

            return that.opt("icon",icon,function(){
                if(icon.charAt(0) !== '.'){
                    if(!doms.TitleIconImg){
                        doms.TitleIconImg = newDom("img").appendTo(doms.TitleIcon);
                    }
                    doms.TitleIconImg.attr("src",icon);
                }else{
                    doms.TitleIconImg && doms.TitleIconImg.remove();
                    doms.TitleIcon.className("_icon" + icon.replace(/\./g,' '));
                }
            });
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
                that._toolBar = Std.ui.create("ToolBar",data);
            }
            that[0].insertBefore(that._toolBar,that.D.Client);

            return that;
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
        that.initClient();
        that.initTitleEvents();

        that.call_opts({
            menuBar:null,
            toolBar:null,
            titleButtons:null
        },true);
    }
});