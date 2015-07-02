/**
 *  TabButton widget
*/
Std.ui.module("TabButton",{
    /*[#module option:parent]*/
    parent:"Button",
    /*[#module option:option]*/
    option:{
        height:30,
        level:4,
        closable:false,
        styleType:"text",    //text,icon,textBesideIcon
        defaultClass:"StdUI_TabButton"
    },
    /*[#module option:private]*/
    private:{
        /*
         * selected states
        */
        selected:false
    },
    /*[#module option:public]*/
    public:{
        /*
         * closable
         */
        closable:function(state){
            return this.opt("closable",state);
        },
        /*
         * select
        */
        select:function(state){
            var that = this;

            if(state === undefined){
                return that._selected;
            }
            that.toggleClass("selected",that._selected = state);

            return that;
        }
    }
});

/**
 *  TabPanel widget
*/
Std.ui.module("TabPanel",function(){
    var itemModule = Std.module({
        /*[#module option:option]*/
        option:{
            button:null,
            content:null
        },
        /*[#module option:public]*/
        public:{
            /*
             * index
            */
            index:function(){
                return this.parent.items.indexOf(this);
            },
            /*
             * remove
            */
            remove:function(){
                this.parent.removeTab(this.index());
            }
        },
        /*[#module option:main]*/
        main:function(option,parent){
            var that    = this;
            var opts    = that.init_opts(option);
            var button  = null;
            var content = null;

            if(isString(opts.button)){
                button = Std.ui("TabButton",{
                    parent:that,
                    text:opts.button,
                    height:parent.opts.tabButtonHeight
                });
            }else if(isObject(opts.button)){
                opts.button.parent = that;
                opts.button.height = parent.opts.tabButtonHeight;

                button = Std.ui("TabButton",opts.button);
            }

            if(isString(opts.content)){
                content = Std.ui("widget",{
                    tabIndex:null,
                    defaultClass:"StdUI_TabContent",
                    html:opts.content
                });
            }else if(isWidget(opts.content)){
                content = Std.ui("widget",{
                    tabIndex:null,
                    defaultClass:"StdUI_TabContent",
                    layout:{
                        ui:"VBoxLayout",
                        items:[opts.content]
                    }
                });
            }else if(isLayout(opts.content)){
                content = Std.ui("widget",{
                    tabIndex:null,
                    defaultClass:"StdUI_TabContent",
                    layout:opts.content
                });
            }else if(isObject(opts.content)){
                content = Std.ui(opts.content.ui || "widget",Std.extend({
                    tabIndex:null,
                    defaultClass:"StdUI_TabContent"
                },opts.content));
            }

            that.parent  = parent;
            that.button  = button;
            that.content = content;
        }
    });

    return {
        /*[#module option:parent]*/
        parent:"widget",
        /*[#module option:option]*/
        option:{
            defaultClass:"StdUI_TabPanel",
            level:4,
            height:300,
            tabButtonHeight:32,
            tabButtonSpacing:2,
            tabClosable:false,
            tabDroppable:false,
            maxTabButtonWidth:"50%",
            contentPadding:5,
            deferRender:true,
            activeItem:0,
            items:null,
            tabAlign:"left",
            tabPosition:"top"
        },
        /*[#module option:events]*/
        events:"tabSelect tabRemove",
        /*[#module option:private]*/
        private:{
            /*
             * active item
            */
            activeItem:null,
            /*
             * tab bar overflowed
            */
            tabBarOverflowed:false,
            /*
             * last width
            */
            lastWidth:null,
            /*
             * last height
            */
            lastHeight:null,
            /*
             * direction
            */
            direction:null,
            /*
             * timer1
            */
            timer1:null
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
                    if(!opts.deferRender){
                        item.content.render();
                    }
                });
                that.initEvents();
                that.initKeyboard();
                that.select(opts.activeItem);
                that.tabBarOverflowCheck();
            },
            /*
             * width
             */
            width:function(){
                this.updateLayout();
            },
            /*
             * extend height
             */
            height:function(){
                var that          = this;
                var opts          = that.opts;
                var doms          = that.D;
                var height        = that.height();
                var contentHeight = height - opts.contentPadding * 2 - 2;

                switch(opts.tabPosition){
                    case "left":
                    case "right":
                        doms.tabBar.height(height - that.boxSize.height);
                        if(that._tabBarOverflowed){
                            that.updateTabsHeight();
                        }
                        break;
                    case "top":
                        doms.line.css("top",opts.tabButtonHeight - 1);
                    case "bottom":
                        contentHeight -= opts.tabButtonHeight;
                        break;
                }
                that.items.each(function(i,item){
                    item.content.height(contentHeight);
                });
                doms.contents.height(contentHeight);
            },
            /*
             * extend remove
             */
            remove:function(data){
                var that  = this;
                var items = that.items;

                if(data === undefined){
                    items.each(function(i,item){
                        item.button.remove();
                        item.content.remove();
                    });
                    items.clear();
                    return;
                }
                if(isObject(data)){
                    data = items.indexOf(data);
                }
                if(data !== -1 && items[data]){
                    that.removeTab(~~data);
                }
            }
        },
        /*[#module option:protected]*/
        protected:{
            /*
             * init keyboard
             */
            initKeyboard:function(){
                var that = this;


                return that;
            },
            /*
             * init data
             */
            initData:function(){
                var that = this;
                var opts = that.opts;

                that.items = [];

                if(opts.items !== null){
                    that.append(opts.items);
                }
                return that.call_opts({contentPadding:0},true);
            },
            /*
             * init DOMTree
             */
            initElements:function(){
                var that = this;
                var doms = that.D = {};

                that[0].append([
                    doms.contents = newDiv("_contents")
                ]);
                return that;
            },
            /*
             * init events
             */
            initEvents:function(){
                var that = this;

                that.D.buttons.delegate("mousedown",".StdUI_TabButton",function(e){
                    var index  = this.index();
                    var button = that.items[index].button;

                    if(e.which === 1){
                        that.select(index);

                        if(that._direction === "vertical"){
                            that.verticalTabButtonClick(index,button);
                        }else{
                            that.horizontalTabButtonClick(index,button);
                        }
                    }
                });
                return that;
            },
            /*
             * init tabBar
             */
            initTabBar:function(){
                var that = this;
                var doms = that.D;

                that[0].append(
                    doms.tabBar = newDiv("_tabBar").height(that.opts.tabButtonHeight).append([
                        doms.leftTools   = newDiv("_tools _left"),
                        doms.line        = newDiv("_line"),
                        doms.tabs        = newDiv("_tabs").append(
                            doms.buttons = newDiv("_buttons")
                        ),
                        doms.rightTools  = newDiv("_tools _right")
                    ])
                );
                return that;
            },
            /*
             * init client
             */
            initClient:function(){
                var that = this;
                var doms = that.D;

                doms.contents = newDiv("_contents");

                switch(that.opts.tabPosition){
                    case "right":
                    case "bottom":
                        that[0].prepend(doms.contents);
                        break;
                    case "left":
                    case "top":
                        that[0].append(doms.contents);
                        break;
                }
                that.addClass("_"+that.opts.tabPosition);

                return doms;
            },
            /*
             * init scroll buttons
             */
            initScrollButtons:function(loadSize,longpress1,longpress2){
                var that      = this;
                var opts      = that.opts;
                var doms      = that.D;
                var mouseOpts = {
                    down:loadSize,
                    delay:10,
                    interval:3
                };
                doms.leftTools.append(
                    doms.prevBtn = newDiv("_scrollButton _backward").height(opts.tabButtonHeight - 1).mouse(Std.extend(mouseOpts,{
                        longpress:longpress1
                    })).append(newDiv("_icon"))
                );
                doms.rightTools.append(
                    doms.nextButton = newDiv("_scrollButton _forward").height(opts.tabButtonHeight - 1).mouse(Std.extend(mouseOpts,{
                        longpress:longpress2
                    })).append(newDiv("_icon"))
                );
                that._tabBarOverflowed = true;

                return that;
            },
            /*
             * init horizontal scroll buttons
             */
            initHScrollButtons:function(){
                if(this._tabBarOverflowed){
                    return this;
                }
                var that             = this;
                var opts             = that.opts;
                var doms             = that.D;
                var height           = 0;
                var tabsHeight       = 0;
                var marginTop        = 0;
                var tabButtonSpacing = opts.tabButtonSpacing;
                var tabBarWidth      = doms.tabBar.width() - tabButtonSpacing;

                that.initScrollButtons(function(){
                    height     = 0;
                    marginTop  = doms.buttons.css("margin-top");
                    tabsHeight = doms.tabs.height();

                    Std.each(that.items,function(i,item){
                        height += item.button.height() + tabButtonSpacing;
                    });
                },function(){
                    if(marginTop < tabButtonSpacing){
                        doms.buttons.css("margin-top",marginTop+=3);
                    }
                },function(){
                    if(tabsHeight < height + marginTop){
                        doms.buttons.css("margin-top",marginTop-=3);
                    }
                });

                var styles = {
                    height:25,
                    width:tabBarWidth
                };
                doms.prevBtn.css(styles);
                doms.nextButton.css(styles);
                doms.buttons.css("margin-top",tabButtonSpacing);

                return that.updateTabsHeight();
            },
            /*
             * init vertical scroll buttons
             */
            initVScrollButtons:function(){
                if(this._tabBarOverflowed){
                    return this;
                }
                var that             = this;
                var opts             = that.opts;
                var doms             = that.D;
                var width            = 0;
                var tabsWidth        = 0;
                var marginLeft       = 0;
                var tabButtonHeight  = opts.tabButtonHeight - 1;
                var tabButtonSpacing = opts.tabButtonSpacing;

                that.initScrollButtons(function(){
                    width      = 0;
                    marginLeft = doms.buttons.css("margin-left");
                    tabsWidth  = doms.tabs.width();

                    Std.each(that.items,function(i,item){
                        width += item.button.width() + tabButtonSpacing;
                    });

                },function(){
                    if(marginLeft < tabButtonSpacing){
                        doms.buttons.css("margin-left",marginLeft+=3);
                    }
                },function(){
                    if(tabsWidth < width + marginLeft){
                        doms.buttons.css("margin-left",marginLeft-=3);
                    }
                });
                doms.prevBtn.height(tabButtonHeight);
                doms.nextButton.height(tabButtonHeight);
                doms.buttons.css("margin-left",tabButtonSpacing);

                return that.updateTabsWidth();
            },
            /*
             * vertical tab button click
             */
            verticalTabButtonClick:function(index,button){
                var that             = this;
                var width            = button.width();
                var tabWidth         = that.D.tabs.width();
                var positionX        = button[0].position().x;
                var tabButtonSpacing = that.opts.tabButtonSpacing;

                if(positionX + width > tabWidth){
                    that.D.buttons.animate({
                        to:{
                            "margin-left[+]": tabWidth - (positionX + width) - tabButtonSpacing
                        }
                    },100);
                }else if(positionX < 0){
                    that.D.buttons.animate({
                        to:{
                            "margin-left[-]": positionX - tabButtonSpacing
                        }
                    },100);
                }
                return that;
            },
            /*
             * horizontal tab button click
             */
            horizontalTabButtonClick:function(index,button){
                var that             = this;
                var height           = button.height();
                var tabHeight        = that.D.tabs.height();
                var positionY        = button[0].position().y;
                var tabButtonSpacing = that.opts.tabButtonSpacing;

                if(positionY + height > tabHeight){
                    that.D.buttons.animate({
                        to:{
                            "margin-top[+]":tabHeight - (positionY + height) - tabButtonSpacing
                        }
                    },100);
                }else if(positionY < 0){
                    that.D.buttons.animate({
                        to:{
                            "margin-top[-]": positionY - tabButtonSpacing
                        }
                    },100);
                }
                return that;
            },
            /*
             * tab bar overflow check
             */
            tabBarOverflowCheck:function(){
                var that             = this;
                var size             = 0;
                var tabButtonSpacing = that.opts.tabButtonSpacing;

                switch(that._direction){
                    case "horizontal":
                        Std.each(that.items,function(i,item){
                            size += item.button.height() + tabButtonSpacing;
                        });
                        if(size > that.height()){
                            that.initHScrollButtons();

                        }else if(that._tabBarOverflowed){
                            that.removeScrollButtons();
                        }
                        break;
                    case "vertical":
                        Std.each(that.items,function(i,item){
                            size += item.button.width() + tabButtonSpacing;
                        });
                        if(size > that.width()){
                            that.initVScrollButtons();
                        }else if(that._tabBarOverflowed){
                            that.removeScrollButtons();
                        }
                        break;
                }
                return that;
            },
            /*
             * remove scroll buttons
             */
            removeScrollButtons:function(){
                var that = this;
                var doms = that.D;

                that._tabBarOverflowed = false;
                doms.prevBtn.remove();
                doms.nextButton.remove();
                doms.buttons.css({
                    marginTop:0,
                    marginLeft:0
                });
                return that.updateTabsWidth();
            },
            /*
             * update tabs width
             */
            updateTabsWidth:function(){
                var that = this;
                var doms = that.D;

                doms.tabs.width(
                    that.width() - doms.leftTools.width() - doms.rightTools.width()
                );
                return that;
            },
            /*
             * reset tabs height
             */
            updateTabsHeight:function(){
                var that = this;
                var doms = that.D;

                doms.tabs.height(
                    that.height() - doms.leftTools.height() - doms.rightTools.height()
                );
                return that;
            },
            /*
             * update Horizontal layout
             */
            updateHorizontalLayout:function(){
                var that        = this;
                var doms        = that.D;
                var width       = that.width();
                var tabBarWidth = doms.tabBar.width();

                switch(that.opts.tabPosition){
                    case "left":
                        doms.line.css("left",tabBarWidth-1);
                    case "right":
                        doms.contents.width(width - that.opts.contentPadding * 2  - tabBarWidth - 2);
                        break;
                }
                that.items.each(function(i,item){
                    item.content.width(width - that.opts.contentPadding * 2  - tabBarWidth - 2);
                });
                return that;
            },
            /*
             * update vertical layout
             */
            updateVerticalLayout:function(){
                var that         = this;
                var opts         = that.opts;
                var contentWidth = that.width() - opts.contentPadding * 2 - that.boxSize.width - 2;

                that.tabBarOverflowCheck();

                if(that._tabBarOverflowed){
                    that.updateTabsWidth();
                }
                that.items.each(function(i,item){
                    item.content.width(contentWidth);
                });
                return that;
            },
            /*
             * update layout
             */
            updateLayout:function(){
                var that = this;

                if(that._timer1 !== null){
                    clearTimeout(that._timer1);
                }
                that._timer1 = setTimeout(function(){
                    if(that._direction === "horizontal"){
                        that.updateHorizontalLayout();
                    }else{
                        that.updateVerticalLayout();
                    }
                },0);

                return that;
            },
            /*
             * query index
             */
            convertIndex:function(type,reference){
                var that  = this;
                var index = -1;
                var items = that.items;

                if(type === "first"){
                    index = 0;
                }else if(type === "last"){
                    index = items.length - 1;
                }else if(type === "beside"){
                    var length = items.length;

                    if(reference < length - 1){
                        index = reference;
                    }else if(length > 1){
                        index = reference - 1;
                    }else if(length === 1){
                        index = 0;
                    }
                }

                return index;
            }
        },
        /*[#module option:public]*/
        public:{
            /*
             * append tab
             */
            appendTab:function(data,checksum){
                return this.insertTab(data,-1,checksum);
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
             * select
             */
            select:function(index,reference){
                var that = this;

                if(isString(index)){
                    index = that.convertIndex(index,reference);
                }
                if(index !== -1 && index < that.items.length){
                    that.activeItem(index);
                    that.emit("tabSelect",index);
                }
                return that;
            },
            /*
             * active Item
             */
            activeItem:function(index){
                var that = this;

                if(index === undefined){
                    return that.items.indexOf(that._activeItem);
                }
                var item       = that.items[index];
                var activeItem = that._activeItem;

                if(activeItem){
                    activeItem.button.select(false);
                    activeItem.content.removeClass("_visible");
                }
                item.button.select(true);
                that.items[that.opts.activeItem = index].content.addClass("_visible");
                that._activeItem = item;
                that.updateLayout();

                if(!item.content.renderState){
                    item.content.render();
                }
                return that;
            },
            /*
             * append
             */
            append:function(data){
                var that = this;

                if(isArray(data)){
                    Std.each(data,function(i,tab){
                        that.appendTab(tab,false);
                    });
                }else if(isObject(data)){
                    that.appendTab(data,false);
                }

                if(that.renderState){
                    that.tabBarOverflowCheck();
                    that.updateLayout();
                }
                return that;
            },
            /*
             * insert
             */
            insertTab:function(data,index,checksum){
                var that = this;
                var opts = that.opts;
                var doms = that.D;
                var item = new itemModule(data,this);

                if(index === -1){
                    doms.buttons.append(item.button[0]);
                    doms.contents.append(item.content[0]);
                    that.items.push(item);
                }else{
                    doms.buttons.insert(item.button[0],index);
                    doms.contents.insert(item.content[0],index);
                    that.items.insert(item,index);
                }

                if(that.renderState){
                    item.button.render();
                    if(checksum !== false){
                        that.tabBarOverflowCheck();
                        that.updateLayout();
                    }
                    if(!opts.deferRender){
                        item.content.height(that.height() - opts.contentPadding * 2 - 2);
                        item.content.render();
                    }
                }
                return item;
            },
            /*
             * remove tab
            */
            removeTab:function(index){
                var that       = this;
                var items      = that.items;
                var activeItem = that.activeItem();

                items[index].button.remove();
                items[index].content.remove();
                that.items.remove(index);

                if(index === activeItem){
                    that.select("beside",index);
                }
                return that.tabBarOverflowCheck().emit("tabRemove",index);
            },
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
                that._activeItem = null;
                return that;
            }
        },
        /*[#module option:main]*/
        main:function(that,opts){
            switch(opts.tabPosition){
                case "left":
                case "right":
                    that._direction = "horizontal";
                    break;
                case "top":
                case "bottom":
                    that._direction = "vertical";
                    break;
            }

            that.D = {};
            that.initTabBar();
            that.initClient();
            that.initData();
        }
    }
});