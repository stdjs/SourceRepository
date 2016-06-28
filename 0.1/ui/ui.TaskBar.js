/**
 * task bar item widget
*/
Std.ui.module("TaskBarItem",{
    /*[#module option:parent]*/
    parent:"Item",
    /*[#module option:events]*/
    events:"active select",
    /*[#module option:option]*/
    option:{
        activated:false,
        selected:false,
        defaultClass:"StdUI_Item StdUI_TaskBarItem"
    },
    /*[#module option:public]*/
    public:{
        /*
         * selected
        */
        selected:function(selected){
            var that = this;

            return that.opt("selected",selected,function(){
                that[0].toggleClass("selected",selected);
                that.emit("select",selected);
                that.parent().emit("itemSelect",[selected,that],true);
            });
        },
        /*
         * activated
        */
        activated:function(activated){
            var that = this;

            return that.opt("activated",activated,function(){
                var parent = that.parent();

                that[0].toggleClass("activated",activated);
                that.emit("active",activated);
                parent.emit("itemActive",[activated,that],true);

                if(activated === false){
                    if(that.selected()){
                        parent.reselect(that);
                    }
                    that[0].removeClass("hover");
                    that.selected(false);
                }
            });
        },
        /*
         * update style
        */
        updateStyle:function(spacing,height,width){
            var that = this;

            if(!that.iconHeight() !== height / 2){
                that.iconHeight(height / 2).iconWidth(height / 2);
            }
            if(spacing !== that._spacing){
                that[0].marginRight(that._spacing = spacing);
            }
            that.height(height).width(width);
        }
    },
    /*[#module option:main]*/
    main:function(that){
        that.call_opts({
            activated:false,
            selected:false
        },true);
    }
});

/**
 * task bar widget
*/
Std.ui.module("TaskBar",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"itemClick itemActive itemSelect itemContextMenu",
    /*[#module option:option]*/
    option:{
        level:3,
        defaultClass:"StdUI_TaskBar",
        items:null,
        height:35,
        spacing:8,
        minItemHeight:26,
        tabIndex:null,
        multiRow:true,
        taskMenu:null
    },
    /*[#module option:private]*/
    private:{
        /*
         * selectedItem
        */
        selectedItem:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            if(!isEmpty(that._items)){
                Std.each(that._items,function(i,item){
                    item.render();
                });
                that.update();
            }
            that.initEvents();
            that.initDocEvents();
        },
        /*
         * remove
        */
        remove:function(item){
            var that  = this;
            var items = that._items;

            if(item === undefined){
                if(isWidget(that._taskMenu)){
                    that._taskMenu.remove();
                }
                if(that._docEvents){
                    Std.dom(document).off("mousedown",that._docEvents);
                }
            }else if(isNumber(item)){
                that.reselect(items[item]);
                items[item].remove();
                items.remove(item);
            }else if(isWidget(item)){
                var index = items.indexOf(item);
                if(index !== -1){
                    that.reselect(item);
                    items[index].remove();
                    items.remove(index);
                }
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * reselect
        */
        reselect:function(currentItem){
            var that     = this;
            var items    = that._items;
            var index    = items.indexOf(currentItem);
            var length   = items.length;
            var newIndex = -1;

            for(var i=index+1;i<length;i++){
                if(items[i].activated()){
                    newIndex = i;
                    break;
                }
            }
            if(newIndex == -1){
                for(var i=index-1;i>=0;i--){
                    if(items[i].activated()){
                        newIndex = i;
                        break;
                    }
                }
            }
            if(newIndex !== -1){
                that._selectedItem = items[newIndex].selected(true);
            }
            return that;
        },
        /*
         * itemClick
        */
        itemClick:function(e,itemElem){
            var that  = this;
            var index = itemElem.index();
            var item  = that._items[index];

            that.select(item,!item.selected());
            that.emit("itemClick",[e,index,item],true);
        },
        /*
         * init document events
        */
        initDocEvents:function(){
            var that = this;

            Std.dom(document).on("mousedown",that._docEvents = function(e){
                if(that._taskMenu && !that._taskMenu[0].contains(e.target)){
                    that._taskMenu.hide();
                }
            });
        },
        /*
         * init task menu
        */
        initTaskMenu:function(){
            var that = this;
            var opts = that.opts;

            if(isWidget(opts.taskMenu)){
                that._taskMenu = opts.taskMenu;
            }else{
                that._taskMenu = Std.ui("Menu",opts.taskMenu);
            }

            if(isWidget(that._taskMenu)){
                that._taskMenu[0].css("position","absolute");
                that._taskMenu.on({
                    itemPress:function(){
                        that._taskMenu.hide();
                    }
                }).renderTo("body");
            }
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;
            var opts = that.opts;

            that[0].on("contextmenu",function(e){
                e.preventDefault();
            });
            that[0].on("mouseenter",">.StdUI_Item",function(e){
                this.mouse({
                    auto:false,
                    unselect:true,
                    click:function(e){
                        return that.itemClick(e,this);
                    }
                });
            }).on("contextmenu",">.StdUI_Item",function(e){
                if(!that._taskMenu && isObject(opts.taskMenu)){
                    that.initTaskMenu();
                }
                if(isWidget(that._taskMenu)){
                    var taskMenu = that._taskMenu.show();
                    var x        = e.pageX;
                    var y        = e.pageY;
                    var width    = taskMenu.width();
                    var height   = taskMenu.height();

                    if(x + width > Std.dom(window).width()){
                        x = Std.dom(window).width() - width;
                    }
                    taskMenu.toForeground()[0].css({
                        top:y - height,
                        left:x
                    });
                }
                that.emit("itemContextMenu",[e,this.ui()],true);
                e.preventDefault();
            });

            return that;
        },
        /*
         * create item
        */
        createItem:function(data){
            var that = this;
            var item = null;

            if(isWidget(data)){
                item = data;
            }else if(isObject(data)){
                item = Std.ui(data.ui || "TaskBarItem",data || {});
            }else if(isString(data) || isNumber(data)){
                item = Std.ui("TaskBarItem",{
                    text:data
                });
            }
            if(isWidget(item)){
                item.parent(that);
                item.verticalAlign("middle");
                item.appendTo(that[0]);
                that.renderState && item.render();
            }
            return item;
        },
        /*
         * update
        */
        update:function(){
            var that      = this;
            var opts      = that.opts;
            var length    = that._items.length;
            var width     = that.width()  - that.boxSize.width;
            var height    = that.height() - that.boxSize.height;
            var spacing   = opts.spacing;
            var rowNumber = 5;
            var itemWidth = width / rowNumber < 200 ? width / (rowNumber = Math.floor(width / 200)) : width / rowNumber;

            if(itemWidth * length > width){
                if(!(height / opts.minItemHeight >= 2) || !opts.multiRow){
                    itemWidth = Math.floor((width - spacing) / length);
                }else if(itemWidth * (height /= 2) >= width && length >= rowNumber * 2){
                    if(length % 2 == 0){
                        itemWidth = Math.floor(width * 2 / length);
                    }else{
                        itemWidth = Math.floor(width * 2 / (length + 1))
                    }
                }
            }
            Std.each(that._items,function(i,itemWidget){
                itemWidget.updateStyle(
                    spacing,height,
                    itemWidth - spacing < height / 2 + itemWidget.boxSize.width ? height / 2 + itemWidget.boxSize.width : itemWidth - spacing
                );
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * add
        */
        add:function(data){
            var that = this;
            var item = that.createItem(data);

            if(item !== null){
                that._items.push(item);
            }
            return item;
        },
        /*
         * task menu
        */
        taskMenu:function(taskMenu){
            var that = this;

            return that.opt("taskMenu",taskMenu,function(){
                if(that._taskMenu){
                    that._taskMenu.remove();
                    that._taskMenu = null;
                }
            });
        },
        /*
         * select
        */
        select:function(data,selected){
            var that = this;

            if(isNumber(data)){
                data = that._items[data];
            }
            if(selected === true){
                if(that._selectedItem === data && data.selected()){
                    return that;
                }
                if(!data.activated()){
                    data.activated(true);
                }
                if(that._selectedItem){
                    that._selectedItem.selected(false);
                }
                that._selectedItem = data.selected(true);
            }else{
                if(data.activated()){
                    data.activated(false);
                }
                data.selected(false);
                that.reselect(data);
            }
            return that;
        },
        /*
         * append
        */
        append:function(data){
            var that = this;

            if(isArray(data)){
                Std.each(data,function(i,itemData){
                    that.add(itemData);
                });
            }else{
                that.add(data);
            }

            if(that.renderState){
                that.update();
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that._items = [];

        if(opts.items){
            that.append(opts.items);
        }
    }
});