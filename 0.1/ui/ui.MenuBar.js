/**
 * MenuBar widget
*/
Std.ui.module("MenuBar",{
    /*[#module option:parent]*/
    parent:"widget",
    /*#module option:action]*/
    action:{
        children:"append"
    },
    /*[#module option:option]*/
    option:{
        className:"StdUI_MenuBar",
        level:3,
        height:24,
        minHeight:16,
        items:null
    },
    /*[#module option:private]*/
    private:{
        /*
         * state
        */
        state:0,
        /*
         * selected index
        */
        selectedIndex:-1
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

        },
        /*
         *  height
        */
        height:function(height){
            var that = this;

            that[1].lineHeight(that.height())
        },
        /*
         *  remove
        */
        remove:function(button){
            var that = this;

            if(button === undefined){
                Std.dom(document).off({
                    keydown:that._keydown,
                    keyup:that._keyup,
                    mousedown:that._mousedown
                });
                Std.each(that.items,function(i,item){
                    item.menu && item.menu.remove();
                });
            }else if(isNumber(button)){
                var item = that.items[button];

                item.menu && item.menu.remove();
                item.elem.remove();
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * key event
        */
        keyEvent:function(e){
            var that          = this;
            var itemsCount    = that.items.length;
            var selectedIndex = that._selectedIndex;

            switch(e.keyCode){
                case 37:
                    if(selectedIndex <= 0){
                        selectedIndex = itemsCount;
                    }
                    that.select(selectedIndex-1);
                    break;
                case 39:
                    if(selectedIndex >= itemsCount - 1){
                        selectedIndex = -1;
                    }
                    that.select(selectedIndex+1);
                    break;
                case 40:
                    var item = that.items[selectedIndex];
                    var menu = item.menu.focus();

                    if(menu._currentItem == null){
                        menu.select(0);
                    }
                    break;
            }
        },
        /*
         * init keyboard
        */
        initKeyboard:function(){
            var that    = this;
            var altDown = false;
            var docElem = Std.dom(document);

            docElem.on("mousedown",that._mousedown = function(e){
                var target = e.target;
                if(that[1].is(target) || !that[1].contains(target)){
                    that.clearStates();
                }
            });
            docElem.on("keyup",that._keyup = function(e){
                if(altDown === true){
                    that.updateLabels();
                    altDown = false;
                }
            });
            docElem.on("keydown",that._keydown = function(e){
                var target = Std.dom(e.target);
                var parent = that[0].offsetParent();

                if(!parent || !(target.is(parent) || parent.contains(target)) || !that[0].visible()){
                    return;
                }
                if(e.keyCode === 18){
                    that.updateLabels(altDown = true);
                    e.preventDefault();
                }else if(e.keyCode === 27){
                    that.clearStates();
                }else if(e.altKey){
                    Std.each(that.items,function(i,item){
                        if(item.text.toUpperCase().indexOf("&" + String.fromCharCode(e.keyCode)) !== -1){
                            if(i === that._selectedIndex){
                                that.clearStates();
                            }else{
                                that.select(i);
                            }
                            that.focus();
                            return true;
                        }
                    });
                    e.preventDefault();
                }
            });
            that[0].on("keydown",function(e){
                that.keyEvent(e);
            });
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].on("mouseenter","._item",function(e){
                var index = this.index();
                this.mouse({
                    auto:false,
                    click:function(){
                        if(index !== that._selectedIndex){
                            that.select(index);
                        }else{
                            that.clearStates();
                        }
                    }
                },e);

                if(that._state == 1){
                    that.select(index);
                }
            });

            return that.initKeyboard();
        },
        /*
         * show menu
        */
        showMenu:function(){
            var that        = this;
            var currentItem = that.currentSelected();

            if(currentItem){
                var offset      = currentItem.elem.offset();
                var currentMenu = currentItem.menu;

                currentMenu.show()[0].css({
                    left:offset.x,
                    top:offset.y + that.height()
                });
            }
            return that;
        },
        /*
         * create item
        */
        createItem:function(data){
            var that     = this;
            var element  = newDiv("_item").appendTo(that[1]);
            var iconElem = null;
            var textElem = null;

            if(isString(data.icon) || isString(data.iconClass)){
                iconElem = newDiv(data.iconClass || "").appendTo(element);
            }
            if(isString(data.icon)){
                iconElem.append(newDom("img").src(data.icon));
            }
            if(isString(data.text)){
                textElem = newDiv("_text").html(data.text.replace('&','')).appendTo(element);
            }
            return {
                elem:element,
                iconElem:iconElem,
                textElem:textElem,
                name:data.name,
                text:data.text,
                items:data.items
            };
        },
        /*
         * convert Text
        */
        formatLabel:function(text){
            var index = text.indexOf("&");
            var data  = "";

            if(index == -1){
                return text;
            }
            for(var i=0,length=text.length;i<length;i++){
                var c = text.charAt(i);
                if(c === "&" && i+1 < length){
                    data += "<span style='text-decoration: underline'>"+text.charAt(++i)+"</span>";
                }else{
                    data += c;
                }
            }
            return data;
        },
        /*
         * update labels
        */
        updateLabels:function(state){
            var that = this;

            Std.each(that.items,function(i,item){
                var text = "";
                if(state === true){
                    text = that.formatLabel(item.text);
                }else{
                    text = item.text.replace(/&/,'');
                }
                item.textElem.html(text);
            });
            return that;
        },
        /*
         * clear states
        */
        clearStates:function(){
            var that        = this;
            var currentItem = that.currentSelected();

            if(currentItem && currentItem.menu !== null){
                currentItem.elem.removeClass("selected");
                currentItem.menu.hide();
                that._selectedIndex = -1;
                that._state = 0;
            }
            return that;
        },
        /*
         * current
        */
        currentSelected:function(){
            var that = this;

            if(that._selectedIndex === -1){
                return null;
            }
            return that.items[that._selectedIndex];
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * select
        */
        select:function(index){
            var that = this;
            var item = that.items[index];

            if(item == null){
                return that;
            }
            if(!item.menu){
                item.menu = Std.ui("Menu",{
                    parent:that,
                    renderTo:"body",
                    items:item.items,
                    css:{
                        position:"absolute"
                    },
                    on:{
                        itemPress:function(){
                            that.clearStates();
                        }
                    }
                });
            }
            that.clearStates();
            item.elem.addClass("selected");
            that._state = 1;
            that._selectedIndex = index;

            return that.showMenu();
        },
        /*
         * append tool button
        */
        append:Std.func(function(data){
            var that = this;

            that.items.push(that.createItem(data));
        },{
            each:[isArray]
        })
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.items = [];
        that.initEvents();
        dom.append(
            that[1] = newDiv("_items")
        );
        if(opts.items){
            that.append(opts.items);
        }
    }
});