/**
 *  MenuItem widget module
*/
Std.ui.module("MenuItem",{
    /*[#module option:parent]*/
    parent:"Item",
    /*[#module option:action]*/
    action:{
        content:"text",
        children:"append"
    },
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_MenuItem",
        text:"menu item",
        items:null,
        root:null
    },
    /*[#module option:private]*/
    private:{
        /*
         * child visible state
        */
        childVisible:false
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            if(opts.items !== null){
                that.D.open = newDiv("_open").appendTo(that[0]);
            }
        },
        /*
         * extend remove
        */
        remove:function(data){
            var that = this;

            that.menu  && that.menu.remove(data);
            that.items && that.items.clear();
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * root
         */
        root:function(root){
            var that = this;
            var opts = that.opts;

            if(root === undefined){
                return opts.root || that;
            }
            opts.root = root;
            return that;
        },
        /*
         * append
        */
        append:function(data){
            var that = this;
            var doms = that.D;

            if(that.menu){
                that.menu.append(data);
            }else{
                if(!that.items){
                    that.items = [];
                }
                that.items.push(data);
            }
            if(!doms.open){
                doms.open = newDiv("_open").appendTo(that[0]);
            }
            return that;
        },
        /*
         * show child menu
        */
        showChild:function(){
            var that   = this;
            var offset = that[0].offset();

            if(that._childVisible){
                return that;
            }
            if(!that.menu){
                that.menu = Std.ui("Menu",{
                    parent:that,
                    items:that.items,
                    root:that.root(),
                    renderTo:"body"
                });
            }

            //------show menu and set style
            that.menu.visible(that._childVisible = true).toForeground();
            that.menu[0].css({
                position:"absolute",
                left:offset.x + that.width(),
                top:offset.y,
                margin:0
            });

            return that;
        },
        /*
         * hide child menu
        */
        hideChild:function(useAnimate){
            var that = this;

            if(!that.menu){
                return that;
            }
            if(useAnimate === false){
                that.menu.visible(that._childVisible = false);
            }else{
                that.menu[0].animate({
                    to:{
                        opacity:0
                    }
                },100,function(){
                    that.menu.visible(that._childVisible = false);
                });
            }
            return that;
        },
        /*
         * children visible
        */
        childVisible:function(state){
            var that = this;

            //------
            if(state === undefined){
                return that._childVisible;
            }
            if(state === that._childVisible){
                return that;
            }
            if(that._childVisible === true){
                that.showChild();
            }else{
                that.hideChild();
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D;

        //------
        if(opts.items){
            that.items = opts.items;
        }
        if(!doms.icon){
            that.initIcon();
        }
        if(!doms.text){
            dom.append(doms.text = newDiv("_text"));
        }
    }
});

/**
 * menu widget module
*/
Std.ui.module("Menu",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"itemPress",
    /*[#module option:option]*/
    option:{
        className:"StdUI_Menu",
        level:1,
        width:"auto",
        height:"auto",
        items:null,
        root:null
    },
    /*[#module option:private]*/
    private:{
        currentItem:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that.items.each(function(i,item){
                item.render();
            });
        },
        /*
         * extend visible
        */
        visible:function(status){
            var that = this;

            if(status === true){
                that[0].css("zIndex",++Std.ui.status.zIndex);
            }else{
                that.select(false);
                that.items.each(function(i,item){
                    if(item._childVisible){
                        item.hideChild();
                    }
                });
            }
        },
        /*
         * extend remove
        */
        remove:function(data){
            var that  = this;
            var items = that.items;

            //------data is undefined
            if(data === undefined){
                items.each(function(i,item){
                    item.remove();
                });
            }else if(isNumber(data)){
                items[data] && items[data].remove() && items.remove(data);
            }else if(isWidget(data)){
                var index = items.indexOf(data);
                if(index !== -1){
                    items[index] && items[index].remove() && items.remove(index);
                }
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * key event
        */
        keyEvent:function(keyCode,currentItem,index){
            var that   = this;
            var jump   = 0;
            var items  = that.items;
            var parent = that.parent();
            var check  = function(item){
                return !item.enable() || item.ui !== "MenuItem";
            };

            //-----enter key
            if(keyCode === 13){
                that.root().emit("itemPress",currentItem.emit("press"));
            }
            //-----esc key
            else if(keyCode === 27){
                if(isWidget(parent)){
                    that.hide();
                    if(parent.ui === "MenuItem"){
                        parent.parent().focus();
                    }else{
                        parent.focus();
                    }
                }
            }
            //-----left key
            else if(keyCode === 37){
                currentItem.hideChild();
                if(parent && parent.ui === "MenuItem"){
                    parent.focus().hideChild();
                    parent.parent().focus();
                }
                return false;
            }
            //-----up key
            else if(keyCode === 38){
                (function(i){
                    if(++jump > items.length){
                        return;
                    }
                    i = --i < 0 ? items.length - 1 : i;
                    check(items[i]) ? arguments.callee(i) : that.select(i);
                })(index);
                return false;
            }
            //-----right key
            else if(keyCode === 39){
                if(currentItem.menu){
                    currentItem.showChild();
                    currentItem.menu.focus().select(0);
                }
                return false;
            }
            //-----right key
            else if(keyCode === 40){
                (function(i){
                    if(++jump > items.length){
                        return;
                    }
                    i = ++i >= items.length ? 0 : i;
                    check(items[i]) ? arguments.callee(i) : that.select(i);
                })(index);
                return false;
            }
        },
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that = this;

            that[0].on({
                contextmenu:Std.func(false),
                keydown:function(e){
                    var currentItem = that._currentItem;
                    var index       = that.items.indexOf(currentItem);

                    if(index == -1){
                        return;
                    }
                    return that.keyEvent(e.keyCode,currentItem,index);
                }
            });
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;

            that[0].delegate("mouseenter mouseleave mousedown click",".StdUI_MenuItem",function(e){
                var item      = that.items[this.index()];
                var eventName = e.name;

                if(state === false){
                    that[0].unselect(state = true);
                }
                if(!item.enable() || item.ui === "sep"){
                    return;
                }

                //-------events
                if(eventName === "click"){
                    that.root().emit("itemPress",item.emit("press"));
                }else if(eventName === "mousedown"){
                    e.stopPropagation();
                }else if(eventName == "mouseenter"){
                    that.select(item);
                }else if(eventName == "mouseleave" && !item.childVisible()){
                    that.select(false);
                }
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * each
        */
        each:function(callback){
            return Std.each(this.items,callback)
        },
        /*
         * root
        */
        root:function(root){
            var that = this;
            var opts = that.opts;

            if(root === undefined){
                return opts.root || that;
            }
            opts.root = root;
            return that;
        },
        /*
         * select
        */
        select:function(item){
            var that = this;

            if(item === that._currentItem){
                return that;
            }
            if(that._currentItem){
                that._currentItem.removeClass("selected").hideChild(false);
                that._currentItem = null;
            }
            if(item === false){
                return that;
            }
            if(isNumber(item)){
                item = that.items[item];
            }
            if(!isWidget(item) || item.ui !== "MenuItem" || !item.enable()){
                return that;
            }
            if((that._currentItem = item.addClass("selected")).D.open){
                item.showChild();
            }
            return that;
        },
        /*
         * append item
        */
        append:Std.func(function(data){
            var that = this;
            var item = null;
            var root = that.root();

            //------if data is string
            if(isString(data)){
                item = Std.ui("MenuItem",{
                    text:data,
                    root:root
                });
            }else if(isWidget(data)){
                item = data;
            }else if(isObject(data)){
                data.root = root;
                item = Std.ui(data.ui || "MenuItem",data);
            }
            if(!isWidget(item)){
                return;
            }
            //------menu has been rendered
            if(that.renderState){
                item.renderTo(that[0]);
            }else{
                item.appendTo(that[0]);
            }
            that.items.push(item.parent(that));
        },{
            each:[isArray]
        })
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.items = [];

        if(opts.items != null){
            that.append(opts.items);
        }

        that.initEvents();
        that.initKeyboard();
    }
});