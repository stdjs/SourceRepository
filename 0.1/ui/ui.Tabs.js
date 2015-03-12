/**
 *  TabButton widget
*/
Std.ui.module("TabButton",{
    /*[#module option:parent]*/
    parent:"Button",
    /*[#module option:option]*/
    option:{
        height:30,
        defaultClass:"StdUI_TabButton",
        closable:false,
        styleType:"text"    //text,icon,textBesideIcon
    },
    /*[#module option:protected]*/
    protected:{
        selected:false
    },
    /*[#module option:public]*/
    public:{
        /*
         * closable
         */
        closable:function(state){
            return this.opt("closable",state,function(){

            });
        },
        /*
         * select
        */
        select:function(state){
            var that = this;

            if(state === undefined){
                return that._selected;
            }

            that.height(state === true ? that.opts.height + 1 : that.opts.height - 1);
            that.toggleClass("selected",that._selected = state);

            return that;
        }
    }
});

/**
 *  TabContent widget
*/
Std.ui.module("TabContent",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_TabContent"
    }
});

/**
 *  Tabs widget
*/
Std.ui.module("Tabs",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Tabs",
        level:4,
        current:0,
        height:300,
        tabBarHeight:32,
        contentPadding:5,
        items:null,
        tabAlign:"left",
        tabPosition:"top"
    },
    /*[#module option:events]*/
    events:"tabChange tabRemove",
    /*[#module option:protected]*/
    protected:{
        currentItem:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.items.each(function(i,item){
                item.button.render();
            });
            that.current(opts.current);
        },
        /*
         * extend height
        */
        height:function(height){
            var that          = this;
            var opts          = that.opts;
            var doms          = that.D;
            var contentHeight = that.height() - opts.tabBarHeight - opts.contentPadding * 2 - 1;

            that.items.each(function(i,item){
                item.content.height(contentHeight);
            });
            doms.line.css("top",opts.tabBarHeight - 1);
            doms.contents.height(contentHeight);
        },
        /*
         * extend remove
        */
        remove:function(data){
            var that  = this;
            var items = that.items;

            if(data === undefined){
                return;
            }
            if(isObject(data)){
                data = items.indexOf(data);
            }
            if(data === -1 || !items[data]){
                return;
            }

            items[data].button.remove();
            items[data].content.remove();
            delete items[data];

        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that = this;


            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that.D.buttons.delegate("mousedown",".StdUI_TabButton",function(e){
                if(e.which === 1){
                    that.current(this.index());
                }
            });

            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * tabBar height
        */
        tabBarHeight:function(height){
            return this.opt("tabBarHeight",height,function(){
                this.D.tabBar.height(height);
            });
        },
        /*
         * content padding
        */
        contentPadding:function(padding){
            var that = this;
            that.D.contents.css("padding",padding + "px");

            return that;
        },
        /*
         * current tab
        */
        current:function(index){
            var that = this;

            if(isWidget(index)){
                index = Std.each(that.items,function(i,item){
                    if(item.button === index){
                        return i;
                    }
                });
                if(index === null){
                    return that;
                }
            }

            return that.opt("current",index,function(){
                var item        = that.items[index];
                var currentItem = that._currentItem;

                if(currentItem){
                    currentItem.button.select(false);
                    currentItem.content.hide();
                }
                item.button.select(true);
                item.content.show();
                that._currentItem = item;

                if(!item.content.renderState){
                    item.content.render();
                }
            });
        },
        /*
         * append tab
        */
        append:Std.func(function(data){
            var that = this;
            var doms = that.D;
            var item = {};

            if(!isObject(data)){
                return;
            }

            //------button
            if(isString(data.button)){
                item.button = Std.ui("TabButton",{
                    text:data.button
                });
            }else if(isObject(data.button)){
                item.button = Std.ui("TabButton",data.button);
            }

            //------content
            if(isString(data.content)){
                item.content = Std.ui("TabContent",{
                    html:data.content
                });
            }else if(isObject(data.content)){
                item.content = Std.ui("TabContent",data.content);
            }

            //------append to
            doms.buttons.append(item.button.parent(that)[0]);
            doms.contents.append(item.content[0]);

            that.items.push(item);
        },{
            each:[isArray]
        }),
        /*
         * clear
        */
        clear:function(){
            var that = this;

            that.items.each(function(i,item){
                item.button.remove();
                item.content.remove();
            });
            that.items.clear();
            that._currentItem = null;
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D = {};

        that.items = [];

        dom.append([
            doms.tabBar = newDiv("_tabBar").height(opts.tabBarHeight).append([
                doms.line    = newDiv("_line"),
                doms.buttons = newDiv("_buttons")
            ]),
            doms.contents = newDiv("_contents")
        ]);

        if(opts.items !==  null){
            that.append(opts.items);
        }
        that.initEvents();
        that.call_opts({
            contentPadding:0
        },true);
    }
});