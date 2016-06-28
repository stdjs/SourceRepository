/**
 * init label module base css
*/
Std.css({
    ".StdUI_Label":{
        float:"left",
        fontSize:"12px",
        color:"#3B3B3B",
        overflow:"hidden",
        textOverflow:"ellipsis",
        textDecoration: "none"
    }
});

/**
 * label widget module
*/
Std.ui.module("Label",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:nodeName]*/
    nodeName:"a",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Label",
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
        href:null,
        target:null,
        value:"label",
        background:"",
        textFormat:"html"    //html,text
    },
    /*[#module option:public]*/
    public:{
        /*
         * text format
        */
        textFormat:function(type){
            return this.opt("textFormat",type);
        },
        /*
         * href
        */
        href:function(href){
            return this.opt("href",href,function(){
                this[0].attr("href",href);
            });
        },
        /*
         * target
        */
        target:function(href){
            return this.opt("target",href,function(){
                this[0].attr("target",href);
            });
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
            indent:0,
            underline:false,
            background:""
        },true);

        that.call_opts(["fontSize","color","wordwrap","wordnowrap","lineHeight","textAlign","href","target"],true);
        that.call_opts("value");
    }
});