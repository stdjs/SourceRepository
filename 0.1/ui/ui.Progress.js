/**
 * progress model
*/
Std.model("ui.Progress",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Progress",
        level:3,
        min:0,
        max:100,
        value:0,
        text:"%.2f%%",
        color:"blue"  //blue,red,black,green,gray
    },
    /*[#module option:events]*/
    events:"finished change",
    /*[#module option:extend]*/
    extend:{
        /*
         * extend width
         */
        width:function(width){
            var that = this;
            var doms = that.D;

            if(!isNumber(width)){
                width = that.width();
            }
            doms.texts.width(width - that.boxSize.width);
            that.refresh();
        },
        /*
         * extend height
         */
        height:function(height){
            var that = this;
            var doms = this.D;

            if(!isNumber(height)){
                height = that.height();
            }

            doms.location.height(height -= that.boxSize.height);
            doms.texts.css({height:height,lineHeight:height});
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * update progress
         */
        updateProgress:function(){
            var that  = this;
            var opts  = that.opts;
            var width = opts.width;

            if(!isNumber(width)){
                width = that.clientWidth();
            }
            that.D.location.width(int((that.value() - opts.min) * (width / (opts.max - opts.min))));

            return that.text(opts.text);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * refresh
         */
        refresh:function(){
            return this.value(this.opts.value);
        },
        /*
         * min
         */
        min:function(min){
            return this.opt("min",min,function(){
                this.refresh();
            });
        },
        /*
         * max
         */
        max:function(max){
            return this.opt("max",max,function(){
                this.refresh();
            });
        },
        /*
         * range
         */
        range:function(min,max){
            var that = this;
            var opts = that.opts;

            if(min === undefined){
                return {min:opts.min, max:opts.max};
            }
            return that.refresh(opts.min = min,opts.max = max);
        },
        /*
         * get or set percent
        */
        percent:function(percent){
            var that = this;
            var opts = that.opts;

            if(percent == undefined){
                return Std.convert.percent(int(opts.value - opts.min),opts.max - opts.min);
            }
            return that.value(int((opts.max - opts.min) * percent / 100));
        },
        /*
         * color
        */
        color:function(color){
            var that = this;
            var opts = that.opts;

            if(color === undefined){
                return opts.color;
            }
            that[0].removeClass("-"+opts.color).addClass("-"+(opts.color = color));
            return that;
        },
        /*
         * progress text
         */
        text:function(text){
            var that = this;
            var doms = that.D;

            return that.opt("text",text,function(){
                doms.texts.html(sprintf(
                    text,
                    that.percent(),
                    that.value(),
                    that.range().max
                ));
            });
        },
        /*
         * get or set value
         */
        value:function(value){
            var that = this;
            var opts = that.opts;

            if(value === undefined){
                return opts.value;
            }

            if(value > opts.max){
                value = opts.max;
            }else if(value < opts.min){
                value = opts.min;
            }

            if(opts.max == value){
                that.addClass("-finished").emit("finished");
            }else if(opts.value == opts.max && opts.max != value){
                that.removeClass("-finished");
            }

            if(opts.value !== value){
                that.emit("change",opts.value = float(value))
            }

            return that.updateProgress();
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D = {};

        dom.addClass("-"+opts.color).append([
            doms.text      = newDiv("_text"),
            doms.location  = newDiv("_location").append(
                doms.text2 = newDiv("_text")
            )
        ]);
        doms.texts = Std.dom.united([doms.text,doms.text2]);
    }
});

/**
 * horizontal progress widget module
*/
Std.ui.module("HProgress",{
    /*[#module option:model]*/
    model:"ui.Progress",
    /*[#module option:option]*/
    option:{
        height:26,
        minWidth:35,
        minHeight:15
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * direction
        */
        direction:"horizontal"
    }
});

/**
 * vertical progress widget module
*/
Std.ui.module("VProgress",{
    /*[#module option:model]*/
    model:"ui.Progress",
    /*[#module option:option]*/
    option:{
        width:26,
        minHeight:35,
        minWidth:15
    },
    /*[#module option:private]*/
    protected:{
        /*
         * direction
        */
        direction:"vertical"
    }
});