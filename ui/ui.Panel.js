/**
 * panel title module
*/
Std.ui.module("PanelTitle",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"buttonClick",
    /*[#module option:action]*/
    action:{
        content:"text"
    },
    /*[#module option:option]*/
    option:{
        tabIndex:null,
        className:"StdUI_PanelTitle",
        minHeight:20,
        height:22,
        level:2,
        icon:null,
        text:"title",
        items:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend height
        */
        height:function(height){
            this.D.text.lineHeight(this.height());
        },
        /*
         * remove button
        */
        remove:function(button){
            var items = this.items;

            if(isString(button) && button in items){
                items[button].remove();
                delete items[button];
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * create button
        */
        createButton:function(name,data){
            var item = this.items[name] = newDiv("_button").data(name,data);

            if(isObject(data)){
                item.set(data);
            }else if(isString(data)){
                item.addClass(data);
            }
            return item;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].on("mouseenter","._button",function(e){
                this.mouse({
                    auto:false,
                    down:function(e){
                        e.stopPropagation();
                    },
                    click:function(){
                        for(var name in that.items){
                            if(that.items[name].contains(this)){
                                that.emit("buttonClick",[name,this],true);
                            }
                        }
                    }
                },e);
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * get or set title text
        */
        text:function(text){
            var that = this;

            return that.opt("text",text,function(){
                that.D.text.html(text);
            });
        },
        /*
         * get or set title icon
        */
        icon:function(icon){
            var that = this;
            var doms = that.D;

            return that.opt("icon",icon,function(){
                if(icon.charAt(0) !== '.'){
                    if(!doms.iconImg){
                        doms.iconImg = newDom("img").appendTo(doms.icon);
                    }
                    doms.iconImg.attr("src",icon);
                }else{
                    doms.iconImg && doms.iconImg.remove();
                    doms.icon.className("_icon" + icon.replace(/\./g,' '));
                }
            });
        },
        /*
         * insert button
        */
        insertBefore:Std.func(function(name,data,targetName){
            var that  = this;
            var item  = that.createButton(name,data);
            var items = that.items;

            if(item !== null && targetName in items){
                this.D.buttons.insertBefore(items[targetName]);
            }
        },{
            each:[isArray]
        }),
        /*
         * insert button
        */
        insertAfter:Std.func(function(name,data,targetName){
            var that  = this;
            var item  = that.createButton(name,data);
            var items = that.items;

            if(item !== null && targetName in items){
                this.D.buttons.insertAfter(items[targetName]);
            }
        },{
            each:[isArray]
        }),
        /*
         * append button
        */
        append:Std.func(function(name,data){
            var that = this;
            var item = that.createButton(name,data);

            if(item !== null){
                this.D.buttons.append(item);
            }
        },{
            each:[isObject]
        })
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms   = that.D = {};
        that.items = {};

        dom.append([
            doms.icon    = newDiv("_icon"),
            doms.text    = newDiv("_text"),
            doms.buttons = newDiv("_buttons")
        ]);

        that.initEvents().call_opts({
            text:"",
            icon:null
        },true);
    }
});

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
    /*[#module option:option]*/
    option:{
        className:"StdUI_Panel",
        minWidth:70,
        minHeight:50,
        height:200,
        width:300,
        level:4,
        title:"panel",
        menuBar:null,
        toolBar:null,
        titleButtons:null,
	    padding:null
    },
    /*[#module option:protected]*/
    protected:{
        layout:null,
        titleBar:null,
        menuBar:null,
        toolBar:null,
        client:null,
        clientLayout:null,
        central:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that._layout.render().update();
        },
        /*
         * extend remove
        */
        remove:function(){
            var that = this;

            if(that._layout){
                that._layout.remove();
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;

            that[0].on({
                mousedown:function(){
                    that.focus();
                },
                mouseenter:function(){
                    if(state == true){
                        return;
                    }
                    that[0].on("focusout",function(){
                        that.removeClass("focus");
                    });
                    that._titleBar[0].unselect(state = true);
                    that._toolBar && that._toolBar[0].unselect(true);
                },
                focusin:function(){
                    that.addClass("focus");
                }
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * title text
        */
        title:function(text){
            return this.opt("title",text,function(){
                this._titleBar.text(text);
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
                return that._toolBar;
            }
            if(isWidget(data)){
                that._toolBar = data;
            }else if(isObject(data)){
                that._toolBar = Std.ui.create("ToolBar",data);
            }
            that._clientLayout.insert(that._toolBar,that._menuBar ? 1 : 0);

            if(that.renderState){
                that._layout.update();
            }

            return that;
        },
        /*
         * title buttons
        */
        titleButtons:function(name,data){
            var that  = this;
            var items = that._titleBar.items;

            if(name === undefined){
                return items;
            }
            if(isString(name) && data === undefined){
                return items[name];
            }
            that._titleBar.append(name,data);

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that._layout = Std.ui("VBoxLayout",{
            parent:that,
            spacing:0,
            items:[
                that._titleBar = Std.ui("PanelTitle",{
                    text:opts.title
                }),
                that._client   = Std.ui("widget",{
                    level:4,
                    className:"StdUI_PanelClient"
                })
            ]
        });

        that._clientLayout = Std.ui("VBoxLayout",{
            spacing:0,
            items:[
                that._central = Std.ui("widget",{
                    level:4,
                    className:"StdUI_PanelCentral",
                    on:{
                        load:function(e){
                            that.emit("load",e);
                        }
                    }
                })
            ]
        });

	if(opts.padding !== null){
	  that._central[0].css("padding",opts.padding);
	}
        that._client.layout(that._clientLayout);
        that.call_opts({
            menuBar:null,
            toolBar:null,
            titleButtons:null
        },true);

        that.initEvents();
    }
});