/**
 * FieldSet Widget Module
*/
Std.ui.module("FieldSet",{
    /*[#module option:nodeName]*/
    nodeName:"fieldset",
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        level:1,
        defaultClass:"StdUI_FieldSet",
        boxSizing:"border-box",
        items:null,
        spacing:5,
        width:300,
        height:150,
        tabIndex:null,
        title:"FieldSet",
        layout:"VBoxLayout"
    },
    /*[#module option:action]*/
    action:{
        children:"append"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that._layout.render().update();
        },
        /*
         * remove
        */
        remove:function(index){
            var that = this;

            if(that._layout){
                that._layout.remove(index);
            }
        },
        /*
         * width
        */
        width:function(){
            var that = this;

            that.D.client.width(that.width() - that.boxSize.width);
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init layout
        */
        initLayout:function(){
            var that = this;

            that._layout = Std.ui(that.opts.layout,{
                parent:that.D.client,
                spacing:that.spacing()
            });

            return that;
        },
        /*
         * init elements
        */
        initElements:function(){
            var that = this;
            var doms = that.D = {
                legend : newDom("legend","_title"),
                client : newDiv("_client")
            };
            that[0].append([
                doms.legend.html(that.title()),
                doms.client
            ]);
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * refresh level
         */
        refreshLevel:function(){
            var that = this;

            that.level(that._layout);
            return that;
        },
        /*
         * title
        */
        title:function(title){
            return this.opt("title",title,function(){
                this.D.label.html(title);
            });
        },
        /*
         * spacing
        */
        spacing:function(spacing){
            return this.opt("spacing",spacing,function(){
                this[0].padding(spacing);
            });
        },
        /*
         * update
        */
        update:function(){
            var that = this;

            that._layout.update();

            return that;
        },
        /*
         * insert
        */
        insert:function(item,index){
            var that = this;

            that._layout.insert(item,index);

            return that;
        },
        /*
         * append
        */
        append:function(items){
            var that = this;

            that._layout.append(items);
            that.refreshLevel();

            return that;
        },
        /*
         * clear
        */
        clear:function(){
            var that = this;

            that._layout.clear();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that.initElements();
        that.initLayout();
        that.call_opts("spacing");

        if(opts.items){
            that.append(opts.items);
        }
    }
});