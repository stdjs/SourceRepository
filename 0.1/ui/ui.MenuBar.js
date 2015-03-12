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
        height:30,
        minHeight:28,
        level:3,
        items:null
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

        },
        /*
         *  remove
        */
        remove:function(button){
            var that  = this;
            var items = that.items;

        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * append tool button
        */
        append:Std.func(function(data){
            var that  = this;
            var opts  = that.opts;
            var item  = null;


        },{
            each:[isArray]
        })
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.items = [];

        if(opts.items){
            that.append(opts.items);
        }
    }
});