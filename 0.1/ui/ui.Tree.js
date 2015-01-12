/**
 * treeItem widget module
*/
Std.ui.module("TreeItem",{
    /*[#module option:parent]*/
    parent:"widget",
    /*#module option:action]*/
    action:{
        children:"append"
    },
    /*[#module option:option]*/
    option:{
        className:"StdUI_TreeItem",
        checked:false,
        editable:false,
        expanded:false,
        selected:false,
        checkable:false,
        link:false,
        target:"_blank",
        href:"",
        icon:null,
        text:"item",
        items:null,
        color:null,
        data:null,
        tabIndex:null
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * data url
        */
        dataUrl:null,
        /*
         * data url loaded
        */
        loaded:false,
        /*
         * status
        */
        status:"normal"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
         */
        render:function(){
            var that  = this;
            var opts  = that.opts;
            var items = opts.items;

            if(isString(items)){
                that._dataUrl = items;
                that.D.expander.removeClass("_none");
                that.D.childrenNode = newDiv("_childrenNode").appendTo(that[0]);
            }else if(items){
                that.append(items);
            }

            if(opts.expanded){
                that.expanded(true);
            }
            that.refreshIcon();
        },
        /*
         * remove tree item
         */
        remove:Std.func(function(item){
            var that  = this;
            var items = that.items;

            if(item === undefined){
                var parent = that.parent();
                var index  = parent.items.indexOf(that);

                if(index !== -1){
                    parent.items[index] = null;
                    parent.length--;
                }

                that.clear()[0].data("widget",null);
                return;
            }

            if(isNumber(item)){
                var itemWidget = items[item];
                if(itemWidget){
                    itemWidget.remove();
                    items.remove(item);
                    that.length--;
                }
            }else if(isWidget(item)){
                var index = items.indexOf(item);
                if(index !== -1){
                    that.removeItem(index);
                    that.length--;
                }
            }
            if(that.length === 0){
                that.D.expander.addClass("_none")
            }
        },{
            each:[isArray]
        })
    },
    /*[#module option:private]*/
    private:{
        /*
         * refresh icon
        */
        refreshIcon:function(){
            var that       = this;
            var treeWidget = that.treeWidget;

            if(treeWidget.opts.defaultIcon){
                if(that.length === 0 && !that._dataUrl){
                    that.icon(treeWidget.nodeIcon());
                }else{
                    that.icon(treeWidget.folderIcon());
                }
            }
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * items length
        */
        length:0,
        /*
         * editable
        */
        editable:function(status){
            return this.opt("editable",status);
        },
        /*
         * href
        */
        href:function(href){
            return this.opt("href",href,function(){
                this.D.itemFrame.attr("href",href);
            });
        },
        /*
         * link target
        */
        target:function(target){
            return this.opt("target",target,function(){
                this.D.itemFrame.attr("target",target);
            });
        },
        /*
         * link
        */
        link:function(state){
            var that = this;
            var opts = that.opts;

            return this.opt("link",state,function(){
                if(state === true){
                    that.target(opts.target);
                    that.href(opts.href);
                }else{
                    this.D.itemFrame.removeAttr("href");
                }
            });
        },
        /*
         * loadUrl
        */
        loadUrl:function(url){
            var that = this;

            that._status = "loading";
            Std.ajax.json(url,function(data){
                that._status = "normal";
                that.clear().append(data);
            });
            return that;
        },
        /*
         * refresh
        */
        refresh:function(){
            var that = this;

            if(that._dataUrl.length > 0){
                that.loadUrl(that._dataUrl);
            }
            return that;
        },
        /*
         * expandAll
        */
        expandAll:function(){
            for(var i=0,that=this.expanded(true),items=that.items,length=items.length;i<length;i++){
                items[i] && items[i].expandAll();
            }
            return that;
        },
        /*
         * text
        */
        text:function(text){
            var that     = this;
            var dom_text = that.D.text;

            if(text === undefined){
                return dom_text.html();
            }
            dom_text.html(text);

            return that;
        },
        /*
         * color
        */
        color:function(color){
            var that      = this;
            var itemFrame = that.D.itemFrame;

            if(color === undefined){
                return itemFrame.color();
            }
            itemFrame.color(color);

            return that;
        },
        /*
         * icon
        */
        icon:function(icon){
            var that = this;

            return that.opt("icon",icon,function(){
                var doms = that.D;

                if(!doms.icon){
                    doms.icon = newDom("span","_nodeIcon").insertBefore(doms.text);
                }
                if(icon.charAt(0) !== '.'){
                    if(!doms.iconImg){
                        doms.iconImg = newDom("img").appendTo(doms.icon);
                    }
                    doms.iconImg.attr("src",icon);
                }else{
                    doms.iconImg && doms.iconImg.remove();
                    doms.icon.className("_nodeIcon" + icon.replace(/\./g,' '));
                }
            });
        },
        /*
         * expanded
        */
        expanded:function(state){
            var that = this;
            var doms = that.D;

            return that.opt("expanded",state,function(){
                var itemNode     = doms.itemNode;
                var childrenNode = doms.childrenNode;

                if(!childrenNode){
                    return;
                }
                if(state === true){
                    itemNode.addClass("_expanded");
                    childrenNode.show();
                    if(!that._loaded){
                        that.refresh();
                        that._loaded = true;
                    }
                }else{
                    itemNode.removeClass("_expanded");
                    childrenNode.hide();
                }
            });
        },
        /*
         * checkable
         */
        checkable:function(state){
            var that = this;

            return that.opt("checkable",state,function(){
                var doms      = that.D;
                var checkIcon = doms.checkIcon;

                if(!checkIcon){
                    checkIcon = doms.checkIcon = newDiv("StdUI_CheckIcon").insertAfter(doms.expander);
                }
                if(state == true){
                    checkIcon.show();
                }else{
                    checkIcon.hide();
                }
            });
        },
        /*
         * status
         */
        edit:function(){
            var that         = this;
            var textElement  = that.D.text;
            var eventFunc    = function(e){
                if(e.keyCode == 13){
                    if(e.name == "keydown"){
                        return false;
                    }
                    if(e.name == "keyup"){
                        itemRename();
                    }
                }
            };
            var itemRename  = function(){
                that._status = "normal";
                that.treeWidget.emit("itemRename",[that,textElement.text()],true);
                textElement.off("keydown keyup",eventFunc);
                textElement.contentEditable(false).removeClass("_edit");
            };
            textElement.contentEditable(true).addClass("_edit");
            textElement.once("blur",itemRename).on("keydown keyup",eventFunc);

            that._status = "edit";

            return that;
        },
        /*
         * checked
         */
        checked:function(state){
            var that = this;

            return that.opt("checked",state,function(){
                var doms         = that.D;
                var treeWidget   = that.treeWidget;
                var checkedItems = treeWidget.checkedItems;
                var index        = checkedItems.indexOf(that);

                if(!doms.checkIcon){
                    that.checkable(true);
                }
                if(treeWidget.selectionMode() === "checkedItems"){
                    that.select(state);
                }
                if(state == true){
                    checkedItems.push(that);
                    doms.checkIcon.addClass("checked");
                }else{
                    if(index !== -1){
                        checkedItems.remove(index);
                    }
                    doms.checkIcon.removeClass("checked");
                }
                that.items.each(function(i,item){
                    if(item.checkable()){
                        item.checked(state);
                    }
                });
                treeWidget.emit("itemCheck",state);
            });
        },
        /*
         * select
         */
        select:function(state,remove){
            var that = this;

            return that.opt("select",state,function(){
                var itemNode      = that.D.itemNode;
                var selectedItems = that.treeWidget.selectedItems;
                var selectedIndex = selectedItems.indexOf(that);

                if(selectedIndex !== -1){
                    remove !== false && selectedItems.remove(selectedIndex);
                }
                if(state === true){
                    itemNode.addClass("selected");
                    selectedItems.push(that);
                }else{
                    itemNode.removeClass("selected");
                }
            });
        },
        /*
         * append items
         */
        append:Std.func(function(item){
            var that         = this;
            var opts         = that.opts;
            var treeWidget   = that.treeWidget;
            var childrenNode = that.D.childrenNode;

            if(!childrenNode){
                childrenNode = that.D.childrenNode = newDiv("_childrenNode").appendTo(that[0]);
            }
            if(!that.renderState){
                var items = opts.items;
                if(!isArray(items)){
                    items = [];
                }
                items.push(item);
                return that;
            }else if(isString(item) || isNumber(item)){
                return that.append({text:item});
            }else if(isWidget(item)){
                item.treeWidget = treeWidget;
                item.parent(that);
                item.renderTo(childrenNode);

                that.items.push(item);
            }else{
                item.parent     = that;
                item.renderTo   = childrenNode;
                item.treeWidget = treeWidget;

                if(treeWidget.checkable()){
                    item.checkable = true;
                }
                that.items.push(
                    Std.ui("TreeItem",item)
                );
            }
            if(++that.length === 1){
                that.D.expander.removeClass("_none");
            }
        },{
            each:[isArray]
        }),
        /*
         * clear items
         */
        clear:function(){
            var that  = this;
            var items = that.items;

            for(var i=0,length=items.length;i<length;i++){
                items[i] && items[i].remove();
            }
            that.length = 0;
            items.clear();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D = {};
        that.items = [];
        dom.data("widget",that);
        dom.append(doms.itemNode = newDiv("_itemNode").append([
                doms.expander  = newDom("span","_nodeExpander _none"),
                doms.itemFrame = newDom("a","_itemFrame").append(
                    doms.text  = newDom("span","_nodeText").html(opts.text)
                )
            ])
        );

        if(opts.treeWidget){
            dom.addClass("Std-UI-TreeItem-" + (that.treeWidget = opts.treeWidget).objectName);
        }

        that.call_opts({
            link:false,
            checkable:false,
            expanded:false,
            icon:null,
            color:null
        },true);

        that.call_opts({
            checked:false,
            select:false
        },true);

        if(opts.data){
            that.data = opts.data;
        }
    }
});

/**
 * tree widget module
*/
Std.ui.module("Tree",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        className:"StdUI_Tree",
        level:4,
        items:null,
        itemSize:16,
        itemHeight:"auto",
        itemWidgetName:"TreeItem",
        expanded:false,
        checkable:false,
        editable:false,
        defaultIcon:false,
        dataSource:null,
        nodeIcon:"._defaultIcon _file",
        folderIcon:"._defaultIcon _folder",
        selectionMode:"item" //item,items,checkedItems
    },
    /*[#module option:events]*/
    events:"selectionModeChange clear itemClick itemDblClick itemRename itemCheck contextmenu",
    /*[#module option:protected]*/
    protected:{
        /*
         * data url
        */
        dataUrl:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that  = this;
            var opts  = that.opts;
            var items = opts.items;

            if(isString(items)){
                that._dataUrl = items;
                that.refresh();
            }else if(items){
                that.append(items);
            }
        },
        /*
         * remove
        */
        remove:Std.func(function(item){
            var that  = this;
            var items = that.items;

            if(item === undefined){
                return that.clear();
            }

            if(isNumber(item)){
                var itemWidget = items[item];
                if(itemWidget){
                    itemWidget.remove();
                    items.remove(item);
                    that.length--;
                }
            }else if(isWidget(item)){
                var index = items.indexOf(item);
                if(index !== -1){
                    that.removeItem(index);
                    that.length--;
                }
            }
        },{
            each:[isArray]
        })
    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that          = this;
            var keyName       = ".Std-UI-TreeItem-"+that.objectName;
            var checkboxEvent = function(checkIcon,itemWidget){
                checkIcon && checkIcon.mouse({
                    click:function(){
                        itemWidget.checked(!itemWidget.checked());
                        return false;
                    },
                    dblclick:function(){
                        return false;
                    }
                });
            };

            that[0].delegate("mouseenter contextmenu",".StdUI_TreeItem"+keyName+">._itemNode",function(e){
                var itemNode      = Std.dom(this);
                var itemWidget    = itemNode.parent().data("widget");
                var checkIcon     = itemWidget.D.checkIcon;
                var expander      = itemWidget.D.expander;
                var expanderClick = function(){
                    itemWidget.expanded(!itemWidget.expanded());
                    return false;
                };
                if(!itemWidget.enable()){
                    return;
                }
                if(e.name === "contextmenu" && e.target.nodeName !== "INPUT"){
                    e.preventDefault();
                    that.emit("contextmenu",[itemWidget,e],true);
                }
                itemNode.mouse({
                    auto:false,
                    enter:function(){
                        expander.on("click",expanderClick);
                    },
                    leave:function(){
                        expander.off("click",expanderClick);
                        checkIcon && checkIcon.off();
                    },
                    down:function(e){
                        var selectionMode = that.selectionMode();

                        if(selectionMode === "item"){
                            that.clearSelect();
                            itemWidget.select(true);
                        }else if(selectionMode === "items" && e.which !== 1){
                            if(e.ctrlKey){
                                itemWidget.select(!itemWidget.select())
                            }else{
                                that.clearSelect();
                            }
                        }
                    },
                    click:function(e){
                        if((itemWidget.editable() || that.editable()) && itemWidget._status == "normal" && !e.ctrlKey){
                            itemWidget.edit();
                        }
                        that.emit("itemClick",[itemWidget,e],true);
                    },
                    dblclick:function(){
                        itemWidget.expanded(!itemWidget.expanded());
                        that.emit("itemDblClick",[itemWidget,e],true);
                    }
                },e);
                checkIcon && checkboxEvent(checkIcon,itemWidget);
            });
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * items length
         */
        length:0,
        /*
         * editable
        */
        editable:function(state){
            return this.opt("editable",state);
        },
        /*
         * folder Icon
        */
        folderIcon:function(value){
            return this.opt("folderIcon",value,function(){
                this.items.each(function(i,item){
                    item.folderIcon(value);
                });
            });
        },
        /*
         * node Icon
         */
        nodeIcon:function(value){
            return this.opt("nodeIcon",value,function(){
                this.items.each(function(i,item){
                    item.nodeIcon(value);
                });
            });
        },
        /*
         * selection mode
        */
        selectionMode:function(mode){
            return this.opt("selectionMode",mode,function(){
                this.emit("selectionModeChange",mode);
            });
        },
        /*
         * item checkable
         */
        checkable:function(state){
            var that = this;

            return that.opt("checkable",state,function(){
                for(var i=0,items=that.items,length=items.length;i<length;i++){
                    items[i] && items[i].checkable(state);
                }
            });
        },
        /*
         * loadUrl
         */
        loadUrl:function(url){
            var that = this;

            Std.ajax.json(url,function(data){
                that.clear().append(data);
            });
            return that;
        },
        /*
         * refresh
        */
        refresh:function(){
            var that = this;

            if(that._dataUrl.length > 0){
                that.loadUrl(that._dataUrl);
            }
            return that;
        },
        /*
         * expand all items
        */
        expandAll:function(){
            var that  = this;
            var items = that.items;

            for(var i=0,length=items.length;i<length;i++){
                var treeItem = items[i];
                treeItem && treeItem.expandAll();
            }
            return that;
        },
        /*
         * select item
        */
        select:Std.func(function(item){
            var that = this;

            if(isNumber(item)){
                var itemWidget = that.itemAt(item);
                if(itemWidget && !itemWidget.select()){
                    itemWidget.select(true);
                }
            }else if(isWidget(item)){
                item.select(item);
            }
        },{
            each:[isArray]
        }),
        /*
         * append tree item
        */
        append:Std.func(function(item){
            var that = this;
            var opts = that.opts;

            if(!that.renderState){
                var items = opts.items;
                if(!isArray(items)){
                    items = [];
                }
                items.push(item);
                return that;
            }else if(isString(item)){
                return that.append({
                    text:item
                });
            }else if(isWidget(item)){
                that.items.push(item);
                item.treeWidget = that;
                item.parent(that);
                item.renderTo(that.D.treeBody);
            }else{
                if(opts.expanded){
                    item.expanded = true;
                }
                if(opts.checkable){
                    item.checkable = true;
                }

                item.treeWidget = that;

                var itemWidget = Std.ui(opts.itemWidgetName,item);
                itemWidget.renderTo(that.D.treeBody);
                itemWidget.parent(that);
                that.items.push(itemWidget);
            }
            that.length++;
        },{
            each:[isArray]
        }),
        /*
         * clear selected
        */
        clearSelect:function(){
            var that          = this;
            var selectedItems = that.selectedItems;

            for(var i=0,length=selectedItems.length;i<length;i++){
                selectedItems[i] && selectedItems[i].select(false,false);
            }
            selectedItems.clear();

            return that;
        },
        /*
         * clear items
        */
        clear:function(){
            var that  = this;
            var items = that.items;

            for(var i=0,length=items.length;i<length;i++){
                items[i] && items[i].remove();
            }
            items.clear();

            that.length = 0;
            that.selectedItems.clear();
            that.checkedItems.clear();

            return that.emit("clear");
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D = {};

        that.items         = [];
        that.selectedItems = [];
        that.checkedItems  = [];
        that.addClass("Std-UI-"+that.objectName).initEvents();
        dom.append(doms.treeBody = newDiv("_treeBody")).unselect(true);
    }
});