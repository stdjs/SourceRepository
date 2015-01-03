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
        className:"StdUI_CodeEdit",
        value:""
    },
    /*[#module option:private]*/
    private:{
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
        that.initEvents();
    }
});