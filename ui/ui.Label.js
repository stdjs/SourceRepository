/**
 * init label module base css
*/
Std.css({
    ".StdUI_Label":{
        float:"left",
        fontSize:"12px",
        color:"#3B3B3B",
        overflow:"hidden",
        textOverflow:"ellipsis"
    }
});

/**
 * label widget module
*/
Std.ui.module("Label",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        className:"StdUI_Label",
        level:1,
        bold:false,
        underline:false,
        wordwrap:false,
        wordnowrap:false,
        textAlign:null,
        color:null,
        fontSize:12,
        lineHeight:null,
        indent:0,
        value:"label",
        background:"",
        textFormat:"html"    //html,text
    },
    /*[#module option:events]*/
    events:"change",
    /*[#module option:public]*/
    public:{
        /*
         * text format
        */
        textFormat:function(type){
            return this.opt("textFormat",type);
        },
        /*
         * get or set wordwrap
        */
        wordwrap:function(state){
            var that = this;

            return that.opt("wordwrap",state,function(){
                that.toggleClass("Std_wordwrap",state);
            });
        },
        /*
         * get or set wordnowrap
        */
        wordnowrap:function(state){
            var that = this;

            return that.opt("wordnowrap",state,function(){
                that.toggleClass("Std_wordnowrap",state);
            });
        },
        /*
         * get or set label text
        */
        value:function(value){
            var that = this;

            return that.opt("value",value,function(){
                that[0][that.opts.textFormat](value);
            });
        },
        /*
         * font color
        */
        color:function(color){
            var that = this;

            if(color === undefined){
                return that[0].color();
            }
            that[0].color(color);
            return that;
        },
        /*
         * font size
        */
        fontSize:function(size){
            return this.opt("fontSize",size,function(){
                this[0].css("font-size",size + "px");
            });
        },
        /*
         * get or set line height
        */
        lineHeight:function(size){
            var that = this;

            if(size === undefined){
                return that[0].css("lineHeight");
            }
            return that[0].css("lineHeight",size);
        },
        /*
         * get or set font bold
        */
        bold:function(state){
            var that = this;

            return that.opt("state",state,function(){
                that[0].css("font-weight",state ? "bold" : "");
            });
        },
        /*
         * get or set font underline
        */
        underline:function(state){
            var that = this;

            return that.opt("underline",state,function(){
                that[0].css("text-decoration",state ? "underline" : "");
            });
        },
        /*
         * indent
        */
        indent:function(value){
            return this.opt("indent",value,function(){
                this[0].css("text-indent",value + "px");
            });
        },
        /*
         * background
        */
        background:function(value){
            return this.opt("background",value,function(){
                this[0].css("background",value);
            });
        },
        /*
         * text align
        */
        textAlign:function(value){
            return this.opt("textAlign",value,function(){
                this[0].css("text-align",value);
            });
        }
    },
    /*[#module option:main]*/
    main:function(that){
        that.call_opts({
            bold:false,
            underline:false,
            indent:0,
            background:""
        },true);

        that.call_opts(["fontSize","color","wordwrap","wordnowrap","lineHeight","textAlign"],true);
        that.call_opts("value");
    }
});