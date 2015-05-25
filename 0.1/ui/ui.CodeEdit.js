/**
 * CodeEdit widget module
*/
Std.ui.module("CodeEdit",{
    nodeName:"pre",
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        level:4,
        minWidth:12,
        minHeight:12,
        defaultClass:"StdUI_CodeEdit",
        value:""
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            this.initEvents();
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].mouse({
                down:function(){

                }
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * value
        */
        value:function(value){
            var that = this;

            if(value === undefined){
                return that[0].html();
            }
            that[0].html(value);
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        if(opts.value){
            that.value(opts.value);
        }
        dom.contentEditable(true);
    }
});