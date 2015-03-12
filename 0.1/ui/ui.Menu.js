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
        items:null
    },
    /*[#module option:protected]*/
    protected:{
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
         * append
        */
        append:function(data){
            var that = this;
            var doms = that.D;

            if(that.menu){
                that.menu.append(data);
            }else{
                !that.items && (that.items = []);
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
                    renderTo:"body"
                });
            }

            //------show menu and set style
            that.menu.visible(that._childVisible = true);
            that.menu[0].css({
                position:"absolute",
                zIndex:++Std.ui.status.zindex,
                left:offset.x + that.width(),
                top:offset.y,
                opacity:0,
                margin:0
            }).animate({
                to:{
                    opacity:1
                }
            },100);

            return that;
        },
        /*
         * hide child menu
        */
        hideChild:function(){
            var that = this;

            if(!that.menu){
                return that;
            }
            that.menu[0].animate({
                to:{
                    opacity:0
                }
            },100,function(){
                that.menu.visible(that._childVisible = false)
            });
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

            //------
            if(state === that._childVisible){
                return that;
            }

            //------
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
        //------
        if(!doms.icon){
            that.initIcon();
        }
        //------
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
        items:null
    },
    /*[#module option:protected]*/
    protected:{
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
            }
            //------data is number
            else if(isNumber(data)){
                items[data] && items[data].remove() && items.remove(data);
            }
            //------data is widget
            else if(isWidget(data)){
                var index = items.indexOf(data);
                if(index !== -1){
                    items[index] && items[index].remove() && items.remove(index);
                }
            }
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * key event
        */
        keyEvent:function(keyCode,currentItem,index){
            var that   = this;
            var jump   = 0;
            var items  = that.items;
            var check  = function(item){
                return !item.enable() || item.ui !== "MenuItem";
            };

            //-----enter key
            if(keyCode === 13){
                that.emit("itemPress",currentItem.emit("press"));
            }
            //-----esc key
            else if(keyCode === 27){
                //currentItem.hideChild();
            }
            //-----left key
            else if(keyCode === 37){
                var parent = that.parent();
                currentItem.hideChild();
                if(parent && parent.ui === "MenuItem"){
                    parent.focus().hideChild();
                }
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
            }
            //-----right key
            else if(keyCode === 39){
                if(currentItem.menu){
                    currentItem.showChild();
                    currentItem.menu.focus().select(0);
                }
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
            }
        },
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that = this;

            that[0].on("keydown",function(e){
                var currentItem  = that._currentItem;
                var index        = that.items.indexOf(currentItem);
                if(index == -1){
                    return;
                }
                that.keyEvent(e.keyCode,currentItem,index);
            });

            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;

            that[0].delegate("mouseenter mouseleave click",".StdUI_MenuItem",function(e){
                var item      = that.items[this.index()];
                var eventName = e.name;

                //------- menu first mouse enter
                if(state === false){
                    that[0].unselect(state = true);
                }
                //------- disabled or sep
                if(!item.enable() || item.ui === "sep"){
                    return;
                }
                //-------item click
                if(eventName === "click"){
                    that.emit("itemPress",item.emit("press"));
                }
                //-------item mouseenter
                else if(eventName == "mouseenter"){
                    that.select(item);
                }
                //-------item mouseleave
                else if(eventName == "mouseleave"){
                    if(!item.childVisible()){
                        that.select(false);
                    }
                }
            });

            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * select
        */
        select:function(item){
            var that = this;

            //------item is current item
            if(item === that._currentItem){
                return that;
            }
            //------if current item is not undefined
            if(that._currentItem){
                that._currentItem.removeClass("selected").hideChild();
                that._currentItem = null;
            }
            //------if item is false
            if(item === false){
                return that;
            }
            //------if item is number
            if(isNumber(item)){
                item = that.items[item];
            }
            //------if item is not widget,MenuItem,or disabled
            if(!isWidget(item) || item.ui !== "MenuItem" || !item.enable()){
                return that;
            }
            //------
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

            //------if data is string
            if(isString(data)){
                item = Std.ui("MenuItem",{text:data});
            }
            //------if data is widget
            else if(isWidget(data)){
                item = data;
            }
            //------if data is object
            else if(isObject(data)){
                item = Std.ui(data.ui || "MenuItem",data);
            }

            //------menu has been render
            if(that.renderState){
                item.renderTo(that[0]);
            }else{
                item.appendTo(that[0])
            }

            that.items.push(item);
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