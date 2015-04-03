/**
 * accordion widget
*/
Std.ui.module("Accordion",{
    /*#module option:parent]*/
    parent:"widget",
    /*#module option:events]*/
    events:"change",
    /*#module option:option]*/
    option:{
        level:4,
        defaultClass:"StdUI_Accordion",
        switchType:"click",
        items:null,
        height:400,
        template:null,
        titleHeight:30,
        collapsible:false,
        clientPadding:5
    },
    /*#module option:protected]*/
    protected:{
        /*
         * current
        */
        current:null
    },
    /*#module option:action]*/
    action:{
        /*
         * children
         */
        children:"append",
        /*
         * childNodes
        */
        childNodes:function(element,childNodes){
            this.append(Std.each(childNodes,function(i,child){
                return {
                    icon:child.attr("icon"),
                    text:child.attr("title"),
                    content:child.html()
                };
            },true));
        }
    },
    /*#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            if(that.items.length > 0 && (that._current = that.items[0])){
                that.repaint();
                that._current.client.main.show();
            }
        },
        /*
         * height
        */
        height:function(){
            var that = this;

            if(that._current != null){
                that.repaint();
            }
        },
        /*
         * remove
        */
        remove:function(index){
            var that = this;

            if(index === undefined){
                return that.clear();
            }else if(isNumber(index)){
                that.removeItem(index);
            }else if(isArray(index)){
                for(var i=index.length-1;i>=0;i--){
                    that.removeItem(index[i]);
                }
            }
            if(that.renderState){
                that.repaint();
            }
        }
    },
    /*#module option:private]*/
    private:{
        /*
         * compute client height
        */
        computeClientHeight:function(){
            var that = this;
            var opts = that.opts;

            return Math.floor(that.height() - that.boxSize.height - that.length * (opts.titleHeight + 2)) + 1;
        },
        /*
         * append item
        */
        appendItem:function(data){
            var that = this;
            var item = that.createItem(data);

            that[0].append(item[0]);
            that.items.push(item);
            that.length++;

            return that;
        },
        /*
         * remove item
        */
        removeItem:function(i){
            var that = this;
            var item = that.items[i];

            if(isWidget(item.client.widget)){
                item.client.widget.remove();
            }
            item[0].remove();
            that.length--;
            that.items.remove(i);

            return that;
        },
        /*
         * paintWidget
        */
        refreshClient:function(client,height){
            var widget = client.widget;
            if(isWidget(widget)){
                if(!widget.renderState){
                    widget.render();
                }
                widget.height(height);
            }
        },
        /*
         * create item
        */
        createItem:function(data){
            var that   = this;
            var header = that.createItemHeader(data.text,data.icon,data.iconClass);
            var client = that.createItemClient(data.content);

            return {
                0:newDiv("_item").append([
                    header.main,client.main
                ]),
                header:header,
                client:client
            }
        },
        /*
         * create item header
        */
        createItemHeader:function(text,icon,iconClass){
            var elements = {
                main:newDiv("_title").height(this.opts.titleHeight)
            };

            if(isString(icon) || isString(iconClass)){
                elements.main.append(
                    elements.icon = newDiv("_icon")
                );
                if(iconClass){
                    elements.icon.addClass(iconClass);
                }
                if(icon){
                    newDom("img").appendTo(elements.icon).attr("src",icon);
                }
            }
            elements.main.append([
                elements.text  = newDiv("_text").html(text),
                elements.arrow = newDiv("_arrow")
            ]);

            return elements;
        },
        /*
         * create item client
        */
        createItemClient:function(data){
            var that   = this;
            var opts   = that.opts;
            var client = newDiv("_client");
            var widget = null;

            if(isString(data)){
                widget = Std.ui("widget",{
                    html:data,
                    tabIndex:null
                });
            }else if(isObject(data)){
                if(isWidget(data)){
                    widget = client;
                }else if(opts.template !== null){
                    widget = Std.ui("TemplateItem",{
                        data:data,
                        template:opts.template
                    });
                }else{
                    widget = Std.ui(data.ui || "widget",Std.extend({
                        tabIndex:null
                    },data));
                }
            }

            if(widget !== null){
                widget[0].padding(widget.opts.padding = opts.clientPadding);
                widget.appendTo(client);
            }
            return {main:client, widget:widget};
        },
        /*
         * init events
        */
        initEvents:function(){
            var that = this;
            var opts = that.opts;

            that[0].delegate("mouseenter","._item > ._title",function(e){
                var itemIndex  = this.parent().index();
                var switchType = opts.switchType;

                if(switchType === "mouseenter" && that.items[itemIndex] !== that._current){
                    that.select(itemIndex);
                }
                this.mouse({
                    auto:false,
                    unselect:true,
                    click:function(){
                        that.select(itemIndex);
                    }
                },e);
            });

            return that;
        }
    },
    /*#module option:public]*/
    public:{
        /*
         * length
        */
        length:0,
        /*
         * template
        */
        template:function(template){
            var that = this;
            var opts = that.opts;

            if(template === undefined){
                return opts.template;
            }
            if(isString(template)){
                template = Std.template(template);
            }
            if(template instanceof Std.template){
                opts.template = template;
            }
            return that;
        },
        /*
         * repaint
        */
        repaint:function(){
            var that    = this;
            var current = that._current;

            if(current != null){
                var height = that.computeClientHeight();

                current.client.main.height(height);
                current[0].addClass("selected");
                that.refreshClient(current.client,height);
            }
            return that;
        },
        /*
         * insert
        */
        insert:function(data,i){
            var that = this;
            var item = that.createItem(data);

            that[0].insertBefore(item[0],that.items[i][0]);
            that.items.insert(item,i);
            that.length++;

            if(that.renderState){
                that.repaint();
            }
            return that;
        },
        /*
         * append
        */
        append:function(data){
            var that = this;

            if(isArray(data)){
                for(var i=0,length=data.length;i<length;i++){
                    that.appendItem(data[i]);
                }
            }else{
                that.appendItem(data);
            }

            if(that.renderState){
                that.repaint();
            }
            return that;
        },
        /*
         * index
        */
        select:function(index){
            var that    = this;
            var opts    = that.opts;
            var items   = that.items;
            var height  = that.computeClientHeight();
            var current = that._current;

            if(current != null){
                current[0].removeClass("selected");
                current.client.main.css("overflow","hidden").animate({
                    100:{height:0}
                },150);
            }
            if(opts.collapsible && current === that.items[index]){
                that._current = null;
                return that;
            }
            if(that._current !== items[index]){
                that.emit("change",index);
            }
            items[index].client.main.removeClass("overflow").animate({
                100:{
                    height:height
                }
            },150,function(){
                that.refreshClient(items[index].client,height);
            });

            that._current = items[index];
            that._current[0].addClass("selected");

            return that;
        },
        /*
         * clear
        */
        clear:function(){
            var that = this;

            for(var i=that.items.length-1;i>=0;i--){
                that.removeItem(i);
            }
            return that;
        }
    },
    /*#module option:main]*/
    main:function(that,opts,dom){
        that.items = [];

        if(opts.template !== null){
            that.template(opts.template);
        }
        if(opts.items !== null){
            that.append(opts.items);
        }
        that.initEvents();
    }
});
