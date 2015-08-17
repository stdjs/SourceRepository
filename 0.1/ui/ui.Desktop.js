/**
 * desktop item
*/
Std.ui.module("Desktop_Item",{
    /*[#module option:parent]*/
    parent:"Item",
    /*[#module option:option]*/
    option:{
        type:"file",//application,file,shortcut
        defaultClass:"StdUI_Desktop_Item",
        boxSizing:"border-box",
        desktop:null,
        tabIndex:null,
        contextMenu:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that.parent().plugin("drag",{});
            that.call_opts({
                contextMenu:null
            },true);
        },
        /*
         * height
        */
        height:function(){
            var that     = this;
            var doms     = that.D;
            var height   = that.height() - that.boxSize.height;
            var iconSize = height - that.D.text.height() - 10 - 3;

            doms.icon.css({
                width:iconSize,
                height:iconSize
            });
        },
        /*
         * remove
        */
        remove:function(){
            var that        = this;
            var contextMenu = that.contextMenu();

            if(isWidget(contextMenu)){
                contextMenu.remove();
            }
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * type
        */
        type:function(type){
            return this.opt("type",type);
        },
        /*
         * desktop
        */
        desktop:function(desktop){
            return this.opt("desktop",desktop);
        },
        /*
         * contextMenu
        */
        contextMenu:function(menu){
            var that = this;
            var opts = that.opts;

            if(menu === undefined){
                return opts.contextMenu;
            }
            if(isWidget(menu)){
                opts.contextMenu = menu;
            }else if(isObject(menu)){
                opts.contextMenu = Std.ui(menu.ui || "Menu",menu);
            }
            if(isWidget(opts.contextMenu)){
                if(!opts.contextMenu.renderState){
                    opts.contextMenu.renderTo(that.desktop())
                }
                opts.contextMenu.hide().on("itemPress",function(){
                    this.hide();
                });
            }
            return that;
        }
    }
});

/**
 * desktop applications
*/
Std.ui.module("Desktop_Applications",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        defaultClass:"Desktop_Applications",
        boxSizing:"border-box",
        master:null,
        groups:null,
        visible:false
    },
    /*[#module option:private]*/
    private:{
        currentGroup:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * visible
        */
        visible:function(state){
            var that = this;

            if(state === true){
                if(that._currentGroup === null){
                    that.showGroup("*");
                }
                that.toForeground().focus();
                that.update();
            }
        },
        /*
         * render
        */
        render:function(){
            var that = this;

            that.initEvents();
            that.toForeground();
        },
        /*
         * height
        */
        height:function(){
            var that = this;

            that.update();
        },
        /*
         * width
        */
        width:function(){
            var that = this;

            that.update();
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].on("keydown",function(e){
                switch(e.keyCode){
                    case 27:
                        that.hide();
                        break;
                }
            }).on("contextmenu",function(e){
                e.preventDefault();
            });

            that[5].on("mouseenter","._group",function(e){
                this.mouse({
                    auto:false,
                    click:function(){
                        that.showGroup(this.data("groupName"));
                    }
                },e)
            });
        },
        /*
         * init elements
        */
        initElements:function(){
            var that = this;

            that[0].append(that[1] = newDiv("_main").append([
                that[2] = newDiv("_header").append([
                    that[2.1] = newDiv("_search").append([
                        that[2.2] = newDom("input").attr("placeholder","search..")
                    ])
                ]),
                that[3] = newDiv("_body").append([
                    that[4] = newDiv("_items"),
                    that[5] = newDiv("_groups")
                ])
            ]));
        },
        /*
         * create item
        */
        createItem:function(option){
            var that = this;
            var item = newDiv("_item").append([
                newDiv("_icon").append(
                    newDom("img").attr("src",option.icon)
                ),
                newDiv("_text").html(option.text || "")
            ]);

            that[4].append(item.data("option",option));

            return item;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * master
        */
        master:function(master){
            return this.opt("master",master);
        },
        /*
         * update
        */
        update:function(){
            var that       = this;
            var main       = that[1];
            var mainWidth  = main.width();
            var mainHeight = main.height();

            main.css({
                top: (that.height() - mainHeight) / 2,
                left: (that.width() - mainWidth) / 2
            });
            that[3].css({
                height: mainHeight - that[2].height()
            });
            that[4].css({
                width: mainWidth - that[5].width()
            });

            return that;
        },
        /*
         * append group
        */
        appendGroup:Std.func(function(groupName,groupText){
            var that  = this;
            var group = newDiv("_group").html(groupText).appendTo(that[5]).data("groupName",groupName);

            if(groupName in that._groups){
                that.removeGroup(groupName);
            }
            that._items[groupName]  = [];
            that._groups[groupName] = group;
        },{
            each:[isObject]
        }),
        /*
         * insert group
        */
        insertGroup:function(){

        },
        /*
         * remove group
        */
        removeGroup:function(groupName){
            var that = this;

            that._groups[groupName].remove();
            delete that._items[groupName];
            delete that._groups[groupName];

            return that;
        },
        /*
         * show group
        */
        showGroup:function(groupName){
            var that = this.clearItems();

            if(groupName === "*"){
                Std.each(that._items,function(groupName,items){
                    Std.each(items,function(i,item){
                        that.createItem(item);
                    });
                });
            }else if(groupName in that._groups){
                Std.each(that._items[groupName],function(i,item){
                    that.createItem(item);
                });
            }else{
                return that;
            }
            if(that._currentGroup){
                var group = that._groups[that._currentGroup];
                group.removeClass("selected");
            }
            that._groups[that._currentGroup = groupName].addClass("selected");

            return that;
        },
        /*
         * append
        */
        append:Std.func(function(groupName,data){
            var that  = this;
            var items = that._items;

            if(isArray(data)){
                Std.each(data,function(i,option){
                    items[groupName].push(option);
                });
            }else if(isObject(data)){
                items[groupName].push(data);
            }

            return that;
        },{
            each:[isObject]
        }),
        /*
         * insert
        */
        insert:function(){

        },
        /*
         * clear items
        */
        clearItems:function(){
            var that = this;

            that[4].clear();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that._items  = {};
        that._groups = {};

        that.initElements();
        that.appendGroup("*","All");
        if(opts.group){
            that.appendGroup(opts.group);
        }
    }
});

/**
 * desktop control bar
*/
Std.ui.module("Desktop_ControlBar",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        level:2,
        master:null,
        height:40,
        defaultClass:"StdUI_Desktop_ControlBar",
        boxSizing:"border-box"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
         */
        render:function(){
            var that = this;

            that.initLayout();
        },
        /*
         * height
        */
        height:function(height){
            var that = this;
            var size = height - that.boxSize.height;

            that.components["applicationsBtn"].size(size,size);
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init layout
         */
        initLayout:function(){
            var that       = this;
            var components = that.components;

            that.layout({
                ui:"HBoxLayout",
                items:[
                    components["applicationsBtn"],
                    {ui:"spacing",width:5},
                    components["taskBar"],
                    components["tray"],
                    components["dateTimeView"]
                ]
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * master
        */
        master:function(master){
            return this.opt("master",master);
        },
        /*
         * append
        */
        append:function(name,option){

        },
        /*
         * insert
        */
        insert:function(){

        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        var master = opts.master;

        that.components = {
            tray:Std.ui("Tray",{
                level:4,
                width:200,
                fixedLayoutWidth:true
            }),
            taskBar:Std.ui("Desktop_TaskBar",{
                master:master
            }),
            dateTimeView:Std.ui("DateTimeView",{
                type:"time",
                fontSize:21
            }),
            applicationsBtn:Std.ui("Image",{
                className:"Std_Desktop_TaskButton",
                value:"images/startButton.png"
            })
        };

        that.components["applicationsBtn"][0].mouse({
            click:function(){
                var applications = master.applications;
                if(!applications.visible()){
                    if(!applications.renderState){
                        applications.render();
                    }
                    applications.show();
                }else{
                    applications.hide();
                }
            }
        });
    }
});

/**
 * desktop main
*/
Std.ui.module("Desktop_Main",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        level:5,
        defaultClass:"StdUI_Desktop_Main",
        boxSizing:"border-box",
        itemWidth:96,
        itemHeight:96,
        width:800,
        height:600,
        items:null,
        master:null,
        wallpaper:null
    },
    /*[#module option:private]*/
    private:{
        cursor:null,
        selected:null,
        cursorTimer:null,
        currentMenu:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that[0].unselect(true).append(
                that[1] = newDiv("_background")
            );
            that.initDesktopMenu();
            that.initContextMenu();
            that.initDesktopItemMenu();
            that.initEvents();
            that.initDocEvents();
            that.initKeyboard();
            that.initSelection();
        },
        /*
         * remove
        */
        remove:function(item){
            var that = this;

            if(item === undefined){
                if(that._docEvents){
                    Std.dom(document).off("mousedown",that._docEvents);
                }
            }else if(isWidget(item)){
                that.layout().removeChild(item);
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init selection
        */
        initSelection:function(){
            var that    = this;
            var state   = false;
            var timer   = null;
            var top     = 0;
            var left    = 0;
            var width   = 0;
            var height  = 0;
            var startX  = 0;
            var startY  = 0;
            var element = newDiv("_selection").appendTo(that[0]);
            var select  = function(){
                that.layout().each(function(i,item){
                    if(left < item.left() + item.width() && top < item.top() + item.height() &&
                       left + width > item.left() && top + height >  item.top()
                    ){
                        that.select(item.item());
                    }else{
                        that.clearSelected(item.item());
                    }
                });
            };
            var mousemove = function(e){
                if(state == false){
                    element.show().css({
                        width:0,
                        height:0,
                        zIndex:Std.ui.status.zIndex+1
                    });
                    state = true;
                    timer = setInterval(select,100);
                    return;
                }
                element.css({
                    top: top = ((height = e.pageY - startY) < 0 ? e.pageY : startY),
                    left: left = ((width = e.pageX - startX) < 0 ? e.pageX : startX),
                    width: width = (width < 0 ? Math.abs(width) : width),
                    height: height = (height < 0 ? Math.abs(height) : height)
                });
            };

            that[1].mouse({
                down:function(e){
                    if(e.which === 1){
                        startX = e.pageX;
                        startY = e.pageY;
                        that[0].on("mousemove",mousemove);
                    }
                },
                up:function(){
                    state = false;
                    element.hide();
                    clearInterval(timer);
                    that[0].off("mousemove",mousemove);
                }
            });

            return that;
        },
        /*
         * init key board
        */
        initKeyboard:function(){
            var that = this;

            that[0].on("keydown",function(e){
                switch(e.keyCode){
                    case 9:

                        break;
                    case 13:
                        that.executionSelected();
                        break;
                    case 27:
                        that.clearSelected();
                        break;
                    case 46:
                        that.deleteSelected();
                        break;
                    case 113:
                        if(!isEmpty(that._selected)){
                            that.rename(that._selected[0]);
                            that.clearSelected();
                        }
                        break;
                    default:
                        return;
                }
                //e.preventDefault();
            });
            return that;
        },
        /*
         * init document events
        */
        initDocEvents:function(){
            var that = this;

            Std.dom(document).on("mousedown",that._docEvents = function(e){
                var target      = e.target;
                var currentMenu = that._currentMenu;

                if(currentMenu && !currentMenu[0].contains(target)){
                    currentMenu.hide();
                    that._currentMenu = null;
                }
            });
            return that;
        },
        /*
         * delete selected
        */
        deleteSelected:function(){
            var that     = this;
            var names    = [];
            var selected = that._selected;

            if(isEmpty(selected)){
                return that;
            }
            Std.each(that._selected,function(i,item){
                names.push(item.text());
            });
            Std.ui("MessageBox",{
                type:"question",
                title:"delete",
                renderTo:that.master(),
                text:"are sure you want to do this? this file will be removed!",
                buttons:"yes no",
                className:"",
                defaultButton:"yes",
                detailedText:names.join(" , "),
                on:{
                    yes:function(){
                        Std.each(selected,function(i,item){
                            that.remove(item);
                        });
                        selected.clear();
                    }
                }
            });
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that   = this;
            var master = that.master();

            master.on("mousedown",function(e){
                var target = Std.dom(e.target);
                if(!target.is(".StdUI_Desktop_Item") && !target.parent(".StdUI_Desktop_Item")){
                    that.clearSelected();
                }
            });
            that[0].on("mouseenter",".StdUI_Desktop_Item",function(e){
                var item = this.ui();
                this.mouse({
                    auto:false,
                    unselect:true,
                    down:function(e){
                        that.focus();
                        if(!e.ctrlKey){
                            that.clearSelected();
                        }
                        if(that._contextMenu.visible()){
                            that._contextMenu.hide();
                        }
                        if(that._selected.has(item)){
                            if(e.which === 1){
                                that.clearSelected(item);
                            }
                        }else{
                            that.select(item);
                        }
                        e.preventDefault();
                    },
                    dblclick:function(){
                        that.executionSelected();
                    }
                }).unselect(true);
            });
        },
        /*
         * init desktop item menu
        */
        initDesktopItemMenu:function(){
            var that = this;

            that._itemMenu = Std.ui("Menu",{
                renderTo:that,
                visible:false,
                width:200,
                css:{
                    position:"absolute"
                },
                animation:{
                    visible:"StdUI_Desktop_Menu"
                },
                items:[{
                    text:"Open",
                    css:{fontWeight:"bold"},
                    click:function(){
                        that.executionSelected();
                    }
                },{
                    text:"Open With ... ",
                    click:function(){

                    }
                },{
                    ui:"sep"
                },{
                    text:"Cut (Ctrl+X)"
                },{
                    text:"Copy (Ctrl+C)"
                },{
                    text:"Paste (Ctrl+V)"
                },{
                    ui:"sep"
                },{
                    text:"Move To..."
                },{
                    text:"Copy To..."
                },{
                    text:"Rename...",
                    click:function(){
                        if(!isEmpty(that._selected)){
                            that.rename(that._selected[0]);
                            that.clearSelected();
                        }
                    }
                },{
                    text:"Delete (Delete)"
                },{
                    ui:"sep"
                },{
                    text:"Properties"
                }],
                on:{
                    itemPress:function(){
                        that._itemMenu.hide();
                    }
                }
            });
        },
        /*
         * init desktop menu
        */
        initDesktopMenu:function(){
            var that = this;

            that._contextMenu = Std.ui("Menu",{
                renderTo:that,
                visible:false,
                width:200,
                css:{
                    position:"absolute"
                },
                animation:{
                    visible:"StdUI_Desktop_Menu"
                },
                items:[
                    {
                        text:"Lock component",
                        iconClass:"StdUI_Desktop_Icon _lock"
                    },{
                        ui:"sep"
                    },{
                        text:"Sort by",
                        items:[
                            {
                                text:"Type"
                            },{
                                text:"Name (Asc)"
                            },{
                                text:"Name (Desc)"
                            }
                        ]
                    },{
                        text:"Create",
                        items:[

                        ]
                    },{
                        text:"Refresh",
                        iconClass:"StdUI_Desktop_Icon _refresh",
                        click:function(){
                            that.layout().update();
                        }
                    },{
                        text:"Lock",
                        iconClass:"StdUI_Desktop_Icon _lock2"
                    },{
                        ui:"sep"
                    },{
                        text:"Show full screen (F11)",
                        value:"fullScreen",
                        iconClass:"StdUI_Desktop_Icon _fullScreen",
                        click:function(){
                            that.master().fullScreen();
                        }
                    }
                ],
                on:{
                    visible:function(){
                        that.updateContextMenu();
                    },
                    itemPress:function(){
                        that._contextMenu.hide();
                    }
                }
            });
        },
        /*
         * init desktop main menu
        */
        initContextMenu:function(){
            var that            = this;
            var showContextMenu = function(contextMenu,e){
                if(!contextMenu.visible() || that._currentMenu !== contextMenu){
                    contextMenu[0].css("position","absolute");
                    contextMenu.show();
                    var x      = e.pageX;
                    var y      = e.pageY;
                    var width  = contextMenu.width();
                    var height = contextMenu.height();

                    if(x + width > that.width()){
                        x = that.width() - width;
                    }
                    if(y + height > that.height()){
                        y -= height;
                    }
                    contextMenu.toForeground().move(x,y).focus();
                }else{
                    contextMenu.hide();
                }
                that._currentMenu = contextMenu;
                e.preventDefault();
            };

            that[1].on("contextmenu",function(e){
                showContextMenu(that._contextMenu,e);
            });
            that[0].on("contextmenu",".StdUI_Desktop_Item",function(e){
                var itemWidget = this.ui();

                if(!itemWidget.contextMenu()){
                    showContextMenu(that._itemMenu,e)
                }else{
                    showContextMenu(itemWidget.contextMenu(),e)
                }
            });
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * master
        */
        master:function(master){
            return this.opt("master",master);
        },
        /*
         * execution selected
        */
        executionSelected:function(){
            var that = this;

            Std.each(that._selected,function(i,item){
                that.execution(item);
            });
            return that;
        },
        /*
         * select
        */
        select:function(item){
            var that = this;

            if(isWidget(item)){
                if(!that._selected.has(item)){
                    item[0].parent().css("zIndex",1);
                    item.addClass("selected");
                    that._selected.push(item);
                }
            }
            return that;
        },
        /*
         * wallpaper
        */
        wallpaper:function(src){
            var that = this;

            that[1].backgroundImage(src);

            return that;
        },
        /*
         * rename
        */
        rename:function(item){
            var that   = this;
            var text   = item.text();
            var timer  = null;
            var clone  = newDom("span","_temp").appendTo(item[0]).css({
                visibility:"hidden",
                fontFamily:item.D.text.css("fontFamily")
            });
            var resize = function(){
                timer = setTimeout(function(){
                    clone.html(input.value());
                    var width  = clone.width();
                    var height = clone.height();
                    input.css({
                        width:width < 10 ? 10 : width,
                        height:height < 18 ? 18 : height
                    })
                },5);
            };
            var input  = newDom("textarea").appendTo(item).on({
                mousedown:function(e){
                    e.stopPropagation();
                },
                keydown:function(e){
                    if(e.keyCode == 13){
                        input.blur();
                    }
                    resize();
                    e.stopPropagation();
                },
                blur:function(){
                    item.D.text.show();
                    clone.remove();
                    input.remove();
                    item.text(input.value());
                    that.select(item).focus();
                }
            }).value(text).focus().select().css("fontFamily",item.D.text.css("fontFamily"));


            item.D.text.hide();

            return that;
        },
        /*
         * clear selected
        */
        clearSelected:function(item){
            var that     = this;
            var selected = that._selected;

            if(item === undefined){
                Std.each(selected,function(i,item){
                    item[0].parent().removeStyle("z-index");
                    item.removeClass("selected");
                });
                selected.clear();
            }else if(selected.has(item)){
                var index = selected.indexOf(item);
                selected.remove(index);
                item[0].parent().removeStyle("z-index");
                item.removeClass("selected");
            }
            return that;
        },
        /*
         * append
        */
        append:function(data){
            var that   = this;
            var layout = that.layout();

            if(isArray(data)){
                Std.each(data,function(i,item){
                    layout.append(Std.extend({
                        ui:"Desktop_Item",
                        desktop:that
                    },item));
                });
            }else if(isObject(data)){
                layout.append(Std.extend({
                    ui:"Desktop_Item",
                    desktop:that
                },data));
            }
            layout.update();

            return that;
        },
        /*
         * update context menu
        */
        updateContextMenu:function(){
            var that = this;

            that._contextMenu && that._contextMenu.each(function(i,item){
                var value = item.value();

                if(value == "fullScreen"){
                    if(Std.dom("body").fullScreen()){
                        item.text("Exit full screen (F11)")
                    }else{
                        item.text("Show full screen (F11)")
                    }
                    return true;
                }
            });

            return that;
        },
        /*
         * execution
        */
        execution:function(item){
            var that   = this;
            var master = that.master();

            clearTimeout(that._cursorTimer);
            that._cursorTimer = setTimeout(function(){
                master.cursor(null);
            },10 * 1000);
            master.cursor("wait");

            Std.dom("img",item).clone().css({
                position:"absolute",
                zIndex:2,
                left:item[0].offset().x,
                top:item[0].offset().y,
                width:item.width(),
                height:item.width()
            }).appendTo(that).animate({
                0:{
                    filter: "blur(0px)",
                    opacity:0.9,
                    transform:"scale(0.9)"
                },
                to:{
                    filter: "blur(8px)",
                    opacity:0,
                    transform:"scale(1.5)"
                }
            },{
                duration:600,
                timingFunction:"ease-out"
            },function(){
                this.remove();
            });

            master.execution(item,function(){
                master.cursor(null);
            });

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that._selected = [];
        that.layout({
            ui:"GridLayout",
            spacing:10,
            rows:"auto",
            columns:"auto",
            autoFlow:"column",
            cellWidth:opts.itemWidth,
            cellHeight:opts.itemHeight,
            items:opts.items
        });
    }
});

/**
 * desktop taskbar widget
*/
Std.ui.module("Desktop_TaskBar",{
    /*[#module option:parent]*/
    parent:"TaskBar",
    /*[#module option:option]*/
    option:{
        level:4,
        master:null,
        boxSizing:"border-box"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            this.initTaskMenu();
        },
        /*
         * initTaskMenu
        */
        initTaskMenu:function(){
            var that = this;

            that.on("itemContextMenu",function(e,task){
                that._current = task;
            });
        }
    },
    /*[#module option:private]*/
    private:{
        current:null
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init process events
        */
        initProcessEvents:function(){
            var that   = this;
            var master = that.master();

            master.on("createProcess",function(process){
                process.on("createWindow",function(processWindow){
                    that.bindProcessWindow(process,processWindow);
                });
            });
            return that;
        },
        /*
         * init task menu
        */
        initTaskMenuData:function(){
            var that = this;

            return that.taskMenu({
                width:200,
                items:[{
                    text:"Restore",
                    iconClass:"_restore",
                    click:function(){
                        that._current.value().restore();
                    }
                },{
                    text:"Minimize",
                    iconClass:"_min",
                    click:function(){
                        that._current.value().minimize(true);
                    }
                },{
                    text:"Maximize",
                    iconClass:"_max",
                    click:function(){
                        that._current.value().maximize(true);
                    }
                },{ui:"sep"},{
                    text:"More Action",
                    items:[],
                    enable:false
                },{
                    text:"New instance",
                    enable:false
                },{ui:"sep"},{
                    text:"Close",
                    iconClass:"_close",
                    css:{
                        fontWeight:"bold"
                    },
                    click:function(){
                        that._current.value().close();
                    }
                }],
                animation:{
                    visible:"StdUI_Desktop_Menu"
                }
            });
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * master
        */
        master:function(){
            return this.opts.master;
        },
        /*
         * bind process
        */
        bindProcessWindow:function(process,processWindow){
            var that = this;
            var task = that.add({
                icon:processWindow.titleIcon() || process.icon(),
                text:processWindow.title() || process.name(),
                value:processWindow
            });
            task.on({
                select:function(state){
                    //console.log(state)
                    if(state === true){
                        processWindow.focus();
                    }
                },
                active:function(state){
                    processWindow.emit(false);
                    processWindow.minimize(!state);
                    processWindow.emit(true);
                }
            });

            processWindow.on({
                focusin:function(){
                    that.select(task,true);
                },
                minimize:function(state){
                    task.actived(!state);
                },
                remove:function(){
                    that.remove(task);
                    that.update();
                }
            });
            process.task = task;
            return that.update();
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that.initTaskMenuData();
        that.initProcessEvents();
    }
});

/**
 * desktop widget
*/
Std.ui.module("Desktop",function(){
    var processModule = Std.module({
        /*[#module option:model]*/
        model:"events",
        /*[#module option:events]*/
        events:"create error message exit",
        /*[#module option:option]*/
        option:{
            pid:0,
            url:null,
            name:"null",
            icon:"",
            address:"",
            argv:null,
            worker:null,
            master:null,
            fileExts:null
        },
        /*[#module option:protected]*/
        protected:{
            /*
             * init worker
            */
            initWorker:function(data){
                var that       = this;
                var main       = data.main;
                var mainWindow = null;

                if(isString(main)){
                    main = (new Function("return " + main))();
                }
                if(isObject(data.mainWindow)){
                    mainWindow = that.createWindow(data.mainWindow,true);
                }
                if(isFunction(main)){
                    main(that,that.opts.argv,that.master(),mainWindow);
                }
                return that.emit("create",that.worker);
            },
            /*
             * init application
            */
            initApplication:function(){
                var that   = this;
                var inited = false;
                var worker = that.worker = new Worker(that.address() + "/index.js");

                worker.onerror = function(e){
                    console.log(e);
                    that.emit("error",e);
                };
                worker.onmessage = function(e){
                    var data = e.data;

                    if(isString(data)){
                        data == "exit" && that.exit();
                    }else if(isObject(data) && data.type === "init" && inited == false){
                        inited = true;
                        if(data.packages){
                            Std.use(data.packages,function(){
                                that.initWorker(data);
                            })
                        }else{
                            that.initWorker(data);
                        }
                    }else{
                        that.emit("message",e);
                    }
                };
            }
        },
        /*[#module option:public]*/
        public:{
            /*
             * postMessage
            */
            postMessage:function(message){
                var that = this;

                that.worker.postMessage(message);

                return that;
            },
            /*
             * create tray
            */
            createTray:function(option){
                var that = this;
                var tray = that.master().controlBar().components["tray"];
                var item = tray.add(Std.extend({
                    icon:that.icon(),
                    name:that.name()
                },option));

                tray.update();
                that.on("exit",function(){
                    tray.remove(item);
                });
                return item;
            },
            /*
             * create main window
            */
            createMainWindow:function(option){
                return this.createWindow(option || {},true);
            },
            /*
             * create window
            */
            createWindow:function(option,mainWindow){
                var that          = this;
                var master        = that.master();
                var windows       = that._windows;
                var processWindow = Std.ui("Window",Std.extend({
                    value:that,
                    title:mainWindow ? that.name() : "window - " + that.name(),
                    titleIcon:that.icon(),
                    className:"StdUI_Desktop_Window",
                    renderTo:master.desktop(),
                    animation:{
                        minimize:"StdUI_Desktop_Window_Minimize",
                        maximize:"StdUI_Desktop_Window_Maximize"
                    }
                },option || {}));

                processWindow.on({
                    remove:function(){
                        windows.remove(windows.indexOf(processWindow));
                        if(mainWindow === true){
                            that.exit();
                        }
                    }
                });
                windows.push(processWindow);

                that.emit("createWindow",processWindow);
                return processWindow;
            },
            /*
             * exit
            */
            exit:function(){
                var that    = this;
                var worker  = that.worker;
                var windows = that._windows;

                Std.each(windows,function(i,win){
                    win.remove();
                });
                if(worker){
                    worker.terminate();
                }
                windows.clear();

                return that.emit("exit");
            }
        },
        /*[#module option:main]*/
        main:function(option){
            var that = this;
            var opts = that.init_opts(option);

            that._windows = [];

            if(opts.on){
                that.on(opts.on);
            }
            if(opts.address){
                that.initApplication();
            }
        },
        /*[#module option:entrance]*/
        entrance:function(module,prototype){
            Std.each("pid address name icon path master",function(i,name){
                prototype[name] = function(){
                    return this.opts[name];
                }
            });
        }
    });

    return {
        /*[#module option:parent]*/
        parent:"widget",
        /*[#module option:events]*/
        events:"update createProcess",
        /*[#module option:option]*/
        option:{
            level:4,
            width:1024,
            height:768,
            minWidth:600,
            minHeight:400,
            desktopItemWidth:100,
            desktopItemHeight:100,
            defaultClass:"StdUI_Desktop",
            boxSizing:"border-box",
            wallpaper:null
        },
        /*[#module option:private]*/
        private:{
            /*
             * process id
            */
            processID:0,
            /*
             * processes
            */
            processes:null,
            /*
             * component locked
            */
            componentLocked:true,
            /*
             * current desktop id
            */
            currentDesktopID:0
        },
        /*[#module option:extend]*/
        extend:{
            /*
             * render
            */
            render:function(){
                var that = this;

                that.initLayout();
                that.factorySetting();
                that.initApplicationsView();
                that.call_opts({
                    wallpaper:null
                },true);
            },
            /*
             * remove
            */
            remove:function(){
                var that      = this;
                var processes = that._processes;

                Std.each(processes,function(pid){
                    that.terminateProcess(pid);
                    delete processes[pid];
                });
            }
        },
        /*[#module option:protected]*/
        protected:{
            /*
             * init layout
            */
            initLayout:function(){
                var that = this;

                that.layout(Std.ui("VBoxLayout",{
                    spacing:0
                }));

                return that;
            },
            /*
             * init applications view
            */
            initApplicationsView:function(){
                var that = this;

                that.applications = Std.ui("Desktop_Applications",{
                    master:that,
                    renderTo:that.desktop(),
                    animation:{
                        visible:"Desktop_Applications_Visible"
                    }
                });
            },
            /*
             * create main desktop
            */
            createMainDesktop:function(){
                var that        = this;
                var opts        = that.opts;
                var desktopMain = Std.ui("Desktop_Main",{
                    master:that,
                    itemWidth:opts.desktopItemWidth,
                    itemHeight:opts.desktopItemHeight
                });
                that._desktops.push(desktopMain);

                return desktopMain;
            },
            /*
             * create control bar
            */
            createControlBar:function(){
                var that       = this;
                var controlBar = Std.ui("Desktop_ControlBar",{
                    master:that
                });

                that._controlBars.push(controlBar);
                return controlBar;
            },
            /*
             * create process
            */
            createProcess:function(name,icon,path,address,callback){
                var that    = this;
                var PID     = ++that._processID;
                var argv    = address.split(" ");
                var process = that._processes[PID] = new processModule({
                    PID:PID,
                    name:name,
                    icon:icon,
                    path:path,
                    argv:argv,
                    master:that,
                    address:argv[0]
                });
                process.on({
                    exit:function(){
                        delete that._processes[PID];
                    },
                    create:function(){
                        Std.func(callback).call(that,process);
                    }
                });

                that.emit("createProcess",process);

                return process;
            },
            /*
             * terminate
            */
            terminateProcess:function(pid){
                var that      = this;
                var processes = that._processes;

                if(isNumber(pid) && pid in processes){
                    processes[pid].exit();
                    delete processes[pid];
                }
                return that;
            }
        },
        /*[#module option:public]*/
        public:{
            /*
             * process
            */
            process:function(pid){
                return this._processes[pid] || null;
            },
            /*
             * desktop
            */
            desktop:function(id){
                return this._desktops[id === undefined ? 0 : id];
            },
            /*
             * control bar
            */
            controlBar:function(id){
                return this._controlBars[id === undefined ? 0 : id];
            },
            /*
             * full screen
            */
            fullScreen:function(){
                var body = Std.dom("body");

                return body.fullScreen(!body.fullScreen());
            },
            /*
             * wallpaper
            */
            wallpaper:function(src){
                var that = this;

                Std.each(that._desktops,function(i,desktop){
                    desktop.wallpaper(src);
                });
                return that;
            },
            /*
             * cursor
            */
            cursor:function(cursor){
                var that      = this;
                var className = "";

                switch(cursor){
                    case "wait":
                        className = "_waiting";
                        break;
                }

                if(!isEmpty(className)){
                    that.addClass(that._cursor = className);
                }else if(className == "" && that._cursor){
                    that.removeClass(that._cursor);
                }
                return that;
            },
            /*
             * execution
            */
            execution:function(data,callback){
                var that    = this;
                var type    = null;
                var name    = null;
                var icon    = null;
                var path    = null;
                var process = null;
                var address = null;

                if(isWidget(data)){
                    type    = data.type();
                    name    = data.text();
                    icon    = data.icon();
                    address = data.value();
                }else if(isObject(data)){
                    type    = data.type || "file";
                    name    = data.name;
                    icon    = data.icon;
                    path    = data.path;
                    address = data.address;
                }

                if(type === "application"){
                    if(isString(address)){
                        process = that.createProcess(name,icon,path,address,callback);
                    }
                }else if(type === "file"){
                    var suffix = Std.url.suffix(name);

                    if(suffix in that._fileExts){
                        var data = that._fileExts[suffix];

                        process = that.createProcess(name,icon,path,data.application + " " + address,callback);
                    }
                }

                return process;
            },
            /*
             * create file ext
            */
            createFileExt:Std.func(function(ext,config){
                var that = this;

                return that._fileExts[ext] = {
                    icon:config.icon,
                    application:config.application,
                    description:config.description
                };
            },{
                each:[isObject]
            }),
            /*
             * remove file ext
            */
            removeFileExt:function(name){
                delete this._fileExts[name];

                return this;
            },
            /*
             * append desktop item
            */
            appendDesktopItem:function(data,desktopID){
                var that = this;

                if(!data.type || data.type == "file"){
                    if(!data.icon && !data.iconClass && data.text){
                        var suffix = Std.url.suffix(data.text);

                        if(suffix in that._fileExts){
                            data.icon = that._fileExts[suffix].icon;
                        }
                    }
                }
                that.desktop(desktopID).append(data);

                return that;
            },
            /*
             * factory setting
            */
            factorySetting:function(){
                var that        = this;
                var desktopMain = that.createMainDesktop();
                var controlBar  = that.createControlBar();

                that.layout().append([desktopMain,controlBar]);
                that.updateLayout();

                return that;
            }
        },
        /*[#module option:main]*/
        main:function(that,opts,dom){
            that._desktops    = [];
            that._controlBars = [];
            that._fileExts    = {};
            that._processes   = {};
            that._components  = {};

            if(isObject(opts.fileExts)){
                that.createFileExt(opts.fileExts);
            }
        }
    };
});