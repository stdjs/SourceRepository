/**
 * tray item
*/
Std.ui.module("TrayItem",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        tabIndex:null,
        defaultClass:"StdUI_TrayItem",
        icon:"",
        name:"",
        text:"",
        popup:null,
        contextMenu:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * remove
        */
        remove:function(){
            var that = this;
            var opts = that.opts;

            if(isWidget(opts.contextMenu)){
                opts.contextMenu.remove();
            }
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * name
        */
        name:function(title){
            return this.opt("title",title,function(){
                if(this._tooltipTitle){
                    this._tooltipTitle.html(title);
                }
            });
        },
        /*
         * text
        */
        text:function(text){
            return this.opt("text",text,function(){
                if(this._tooltipText){
                    this._tooltipText.html(text);
                }
            });
        },
        /*
         * icon
        */
        icon:function(icon){
            var that = this;

            return that.opt("icon",icon,function(){
                that[1].attr("src",icon);
                if(that._tooltipIcon){
                    that._tooltipIcon.attr("img",icon);
                }
            });
        },
        /*
         * popup
        */
        popup:function(data){
            var that = this;
            var opts = that.opts;

            if(data === undefined){
                return opts.popup;
            }
            if(!isWidget(data) && isObject(data)){
                opts.popup = Std.ui(data.ui || "widget",data);
            }else{
                opts.popup = data;
            }
            return that;
        },
        /*
         * context menu
        */
        contextMenu:function(data){
            var that = this;
            var opts = that.opts;

            if(data === undefined){
                return opts.contextMenu;
            }
            if(!isWidget(data) && isObject(data)){
                data = Std.ui(data.ui || "Menu",data);
            }
            if(isWidget(data)){
                data.on("itemPress",function(){
                    data.hide();
                });
            }
            opts.contextMenu = data;
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that[0].append(
            that[1] = newDom("img")
        );

        that.call_opts({
            icon:"",
            name:"",
            text:"",
            popup:null,
            contextMenu:null
        },true);
    }
});

/**
 * tray
*/
Std.ui.module("Tray",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"itemClick",
    /*[#module option:option]*/
    option:{
        level:3,
        height:35,
        spacing:4,
        iconSize:22,
        defaultClass:"StdUI_Tray",
        value:null,
        tabIndex:null
    },
    /*[#module option:private]*/
    private:{
        /*
         * timer
        */
        timer:null,
        /*
         * state
        */
        state:false,
        /*
         * icon view initialized
        */
        iconViewInitialized:false,
        /*
         * icon view visibled
        */
        iconViewVisibled:false,
        /*
         * context menu
        */
        contextMenu:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * before render
        */
        beforeRender:function(){
            var that = this;

        },
        /*
         * height
        */
        height:function(){
            this.updateHeight();
        },
        /*
         * render
        */
        render:function(){
            var that = this;

            that.update();
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
                if(that._popup){
                    that._popup.remove();
                }
                if(that._tooltip){
                    that._tooltip.remove();
                }
                if(that._docEvent){
                    Std.dom(document).off("mousedown",that._docEvent);
                }
                if(that[3]){
                    that[3].remove();
                }
                Std.each(items,function(i,item){
                    item.remove();
                });
            }else if(isNumber(item)){
                if(item < items.length){
                    items[item].remove();
                    items.remove(item);
                    that.update();
                }
            }else if(isWidget(item)){
                var index = items.indexOf(item);
                if(index !== -1){
                    items[index].remove();
                    items.remove(index);
                    that.update();
                }
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init document events
        */
        initDocEvents:function(){
            var that = this;

            Std.dom(document).on("mousedown",that._docEvent = function(e){
                var target = e.target;

                if(that._contextMenu && that._contextMenu[0].contains(e.target)){
                    return;
                }else{
                    that.hideContextMenu();
                }
                if(that[0].contains(target) || (that[3] && that[3].contains(target))){
                    return;
                }
                if(that._popup){
                    if(that._popup.contains(target)){
                        return;
                    }
                    that.hidePopup();
                }
                if(that._tooltip){
                    if(that._tooltip.contains(target)){
                        return;
                    }
                    that.hideToolTip();
                }
            });
        },
        /*
         * create popup
        */
        createPopup:function(){
            var that = this;

            if(that._popup){
                that._popup.remove();
            }
            that._popup = newDiv("Tray_Popup").append([
                that._popupTitle = newDiv("_title"),
                that._popupMain  = newDiv("_main")
            ]).appendTo("body");

            return that;
        },
        /*
         * create tooltip
        */
        createToolTip:function(){
            var that     = this;
            var opts     = that.opts;
            var iconSize = opts.iconSize * 1.5;

            if(that._tooltip){
                that._tooltip.remove();
            }
            that._tooltip = newDiv("Tray_ToolTip").append([
                that._tooltipIcon = newDom("img","_icon").height(iconSize).width(iconSize),
                newDiv("_main").append([
                    that._tooltipTitle = newDiv("_title"),
                    that._tooltipText  = newDiv("_text")
                ])
            ]).appendTo("body");

            return that;
        },
        /*
         * tray item events
        */
        trayItemEvents:function(item,e){
            var that = this;

            clearTimeout(that._timer);
            if(that._state === false){
                that._state = true;
                that._timer = setTimeout(function(){
                    that.showToolTip(item);
                },800);
            }else{
                that.showToolTip(item);
            }

            item[0].mouse({
                auto:false,
                leave:function(){
                    clearTimeout(that._timer);
                    that._timer = setTimeout(function(){
                        that.hideToolTip();
                    },100);
                },
                down:function(){
                    that._state = false;
                    clearTimeout(that._timer);
                },
                click:function(e){
                    if(item.opts.popup){
                        that.showPopup(item);
                    }else if(that._popup && that._popup.visible()){
                        that.hidePopup();
                    }
                    that.emit("itemClick",[e,item],true);
                }
            },e);
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].on("mouseleave",function(){
                that._state = false;
            }).on("contextmenu",function(e){
                e.preventDefault();
            }).on("mouseenter",">.StdUI_TrayItem",function(e){
                return that.trayItemEvents(this.ui(),e);
            }).on("contextmenu",".StdUI_TrayItem",function(e){
                that.showContextMenu(this.ui(),e);
            });

            that[2].on("click",function(e){
                if(!that._iconViewVisibled){
                    that.showIconView();
                }else{
                    that.hideIconView();
                }
            });
            return that;
        },
        /*
         * initIconView
        */
        initIconView:function(){
            var that = this;

            if(!that._iconViewInitialized){
                that[3] = newDiv("StdUI_Tray-iconView").appendTo("body");
                that._iconViewInitialized = true;
            }

            that[3].on("mouseleave",function(){
                that._state = false;
            }).on("contextmenu",function(e){
                e.preventDefault();
            }).on("mouseenter",">.StdUI_TrayItem",function(e){
                return that.trayItemEvents(this.ui(),e);
            }).on("contextmenu",".StdUI_TrayItem",function(e){
                that.showContextMenu(this.ui(),e);
            });

            return that;
        },
        /*
         * update height
        */
        updateHeight:function(){
            var that   = this;
            var height = that.height() - that.boxSize.height;

            that[2].marginTop((height - that[2].height()) / 2);

            return that;
        },
        /*
         * update
        */
        update:function(){
            var that       = this;
            var opts       = that.opts;
            var width      = that.width()  - that.boxSize.width;
            var height     = that.height() - that.boxSize.height;
            var iconSize   = that.iconSize();
            var rows       = Math.floor(height / (iconSize + 4));
            var columns    = Math.floor(width  / (iconSize + 4));
            var currentRow = 0;

            if(that._items.length <= columns * rows){
                that[2].hide();
                that[1].removeStyle("width");
            }else{
                that[2].show();
                columns = Math.floor((width -= that[2].width()) / (iconSize + 4));
                that[1].width(width);
            }

            Std.each(that._items,function(i,item){
                if(i >= columns * rows){
                    if(!that._iconViewInitialized){
                        that.initIconView();
                    }
                    item[0].css("marginRight",opts.spacing).appendTo(that[3]);
                    return;
                }
                if(i + 1 % columns === 0){
                    currentRow++;
                }
                if(currentRow > 0 && currentRow < rows){
                    item[0].css("marginBottom",opts.spacing);
                }
                item[0].show().css("marginRight",opts.spacing);
                item.appendTo(that[1]);

                if(!item.renderState){
                    item.render();
                }
            });

            that[1].css("marginTop",(height - that[1].height()) / 2);

            return that.updateIconViewHeight();
        },
        /*
         * update icon view height
        */
        updateIconViewHeight:function(){
            var that = this;

            if(that[3] && that[3].visible()){
                var offset      = that[0].offset();
                var outerHeight = that[3].removeStyle("height").outerHeight();

                if(that[3].height() == 0){
                    that.hideIconView();
                }else{
                    that[3].animate({
                        to:{
                            top:offset.y - outerHeight,
                            outerHeight:outerHeight
                        }
                    },100);
                }
            }
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * show popup
        */
        showPopup:function(item){
            var that   = this;
            var offset = that[0].offset();
            var popup  = item.popup();

            if(!that._popup){
                that.createPopup();
                //that._popup.css("left",0);
            }
            if(isWidget(popup)){
                that._popupMain.clear();
                that._popupMain.append(popup);

                if(!popup.renderState){
                    popup.render();
                }
            }else if(isString(popup) || isNumber(popup)){
                that._popupMain.html(popup)
            }

            that._popupTitle.html(item.name());
            that._popup.show();

            var x = offset.x + (that.width() - that._popup.outerWidth()) / 2;
            var y = offset.y - that._popup.offsetHeight() - 5;

            if(x < 0){
                x = 0;
            }else if(x + that._popup.offsetWidth() > Std.dom(window).width()){
                x = Std.dom(window).width() - that._popup.offsetWidth();
            }

            that._popup.css({
                top:y,
                left:x,
                zIndex:++Std.ui.status.zIndex
            });

            return that.hideToolTip().hideIconView();
        },
        /*
         * hide popup
        */
        hidePopup:function(){
            var that = this;

            if(that._popup){
                that._popup.hide();
            }
            return that;
        },
        /*
         * update tool tip
        */
        updateToolTip:function(icon,name,text){
            var that = this;

            that._tooltipIcon.attr("src",icon);
            that._tooltipTitle.html(name);
            that._tooltipText.html(text);

            return that;
        },
        /*
         * show tooltip
        */
        showToolTip:function(item){
            var that   = this;
            var offset = item[0].offset();
            var icon   = item.icon();
            var name   = item.name();
            var text   = item.text();

            if(!that._tooltip){
                that.createToolTip();
                that.updateToolTip(icon,name,text);
                that._tooltip.css({
                    top:offset.y - that._tooltip.offsetHeight() - 5,
                    left:0,
                    visibility:"hidden"
                });
            }else{
                that.updateToolTip(icon,name,text);
                that._tooltip.show();
            }
            var x = offset.x - (that._tooltip.offsetWidth() - item.width()) / 2;
            var y = offset.y - that._tooltip.offsetHeight() - 5;

            if(x < 0){
                x = 0;
            }else if(x + that._tooltip.offsetWidth() > Std.dom(window).width()){
                x = Std.dom(window).width() - that._tooltip.offsetWidth();
            }
            if(y < 0){
                y = offset.y + that.height();
            }
            if(that._tooltip.css("visibility") === "hidden"){
                that._tooltip.removeStyle("visibility").css("left",x);
            }
            that._tooltip.css("zIndex",++Std.ui.status.zIndex).animate({
                to:{
                    top:y,
                    left:x
                }
            },100);

            return that;
        },
        /*
         * hide tooltip
        */
        hideToolTip:function(){
            var that = this;

            if(that._tooltip){
                that._tooltip.hide();
            }
            return that;
        },
        /*
         * show icon view
        */
        showIconView:function(){
            var that   = this;
            var offset = that[0].offset();

            if(!that._iconViewInitialized){
                that.initIconView();
            }
            Std.each(that._items,function(i,item){
                !item.renderState && item.render();
            });
            that[3].removeStyle("height").show().css({
                outerWidth:that.width(),
                top:offset.y - that[3].boxSize().height,
                left:offset.x
            });
            var outerHeight = that[3].outerHeight();

            that[2].addClass("_visibled");
            that[3].height(0).animate({
                to:{
                    top:offset.y - outerHeight,
                    outerHeight:outerHeight
                }
            },100);
            that._iconViewVisibled = true;

            return that.hidePopup();
        },
        /*
         * hide icon view
        */
        hideIconView:function(){
            var that = this;

            if(that[2] && that[3]){
                that[2].removeClass("_visibled");
                that[3].animate({
                    to:{
                        top:that[0].offset().y - that[3].boxSize().height,
                        height:0
                    }
                },100,function(){
                    that[3].hide();
                });
                that._iconViewVisibled = false;
            }
            return that;
        },
        /*
         * show context menu
        */
        showContextMenu:function(item,e){
            var that        = this;
            var contextMenu = item.contextMenu();

            if(!contextMenu){
                return;
            }
            if(!contextMenu.renderState){
                contextMenu[0].css("position","absolute");
                contextMenu.renderTo("body");
            }

            contextMenu.show();

            var x = e.pageX;
            var y = e.pageY - contextMenu.height();

            if(x + contextMenu.width() > Std.dom(window).width()){
                x = Std.dom(window).width() - contextMenu.width();
            }
            if(y < 0){
                y = e.pageY;
            }
            that._contextMenu = contextMenu.move(x,y);
            that.hideToolTip();
        },
        /*
         * hide context menu
        */
        hideContextMenu:function(){
            var that = this;

            if(that._contextMenu){
                that._contextMenu.hide();
            }
            return that;
        },
        /*
         * iconSize
        */
        iconSize:function(size){
            var that = this;

            return that.opt("iconSize",size,function(){
                Std.each(that._items,function(i,item){
                    that[2].height(size).width(size);
                    item.width(size).height(size);
                });
                that.updateHeight();
            });
        },
        /*
         * add
        */
        add:function(data){
            var that     = this;
            var item     = Std.ui("TrayItem",data);
            var iconSize = that.iconSize();

            item.parent(that).width(iconSize).height(iconSize);
            that._items.push(item);

            if(that.renderState){
                item.render();
            }
            return item;
        },
        /*
         * append
        */
        append:Std.func(function(data){
            var that = this;
            var item = that.add(data);

            if(that.renderState){
                that.update();
            }
        },{
            each:[isArray]
        })
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that._items = [];
        dom.append([
            that[2] = newDiv("_handle").css({
                width:opts.iconSize,
                height:opts.iconSize
            }),
            that[1] = newDiv("_icons")
        ]);

        if(opts.items){
            that.append(opts.items);
        }
    }
});
