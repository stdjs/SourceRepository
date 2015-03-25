/**
 *  slider model
*/
Std.model("ui.Slider",{
    /*[#module option:widget]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"dragStart dragStop change",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        max:100,
        min:0,
        value:0,
        color:"#5FA8DB",
        defaultClass:"StdUI_Slider",
        handleWidth:18,
        handleHeight:18
    },
    /*[#module option:extend]*/
    extend:{
        /*
         *  load handle box size
         */
        init_boxSize:function(){
            var that = this;
            that.handleBoxSize = that.D.handle.boxSize();
        },
        /*
         * render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.D.handle.css({
                width  : opts.handleWidth  - that.handleBoxSize.width,
                height : opts.handleHeight - that.handleBoxSize.height
            });

            that.call_opts("color");
            that.on("resize",that.refresh.bind(that));
            that.refresh();
            that.initDrag();
            that.initEvents();
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * update progress
        */
        updateProgress:function(size){
            var that = this;

            switch(that._direction){
                case "horizontal":
                    that.D.progress.width(size);
                    break;
                case "vertical":
                    that.D.progress.height(size);
                    break;
            }
            return that;
        },
        /*
         * update value
        */
        updateValue:function(value){
            var that        = this;
            var opts        = that.opts;
            var size        = 0;
            var boxSize     = 0;
            var handleSize  = 0;
            var cssName     = "";
            var position    = null;
            var valueRange  = opts.max - opts.min;
            var direction   = that._direction;

            if(direction === "horizontal"){
                size       = that.width();
                cssName    = "left";
                boxSize    = that.boxSize.width;
                handleSize = opts.handleWidth;
                position   = Math.round((size - boxSize - handleSize) / valueRange * (value - opts.min));
                that.D.handle.css(cssName,position);
            }else if(direction === "vertical"){
                size       = that.height();
                cssName    = "top";
                boxSize    = that.boxSize.height;
                handleSize = opts.handleHeight;
                position   = Math.round((size - boxSize - handleSize) / valueRange * (value - opts.min));
                that.D.handle.css(cssName,(size - boxSize - handleSize) / valueRange * (valueRange - value - opts.min));
            }
            that.updateProgress(position + handleSize / 2);

            return that.emit("change",opts.value = value);
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var state = false;

            that[0].focussing(function(){
                this.addClass("focus");
                if(state === false){
                    state = true;
                    that.initKeyboard();
                }
            },function(){
                this.removeClass("focus");
            });

            return that;
        },
        /*
         * init key board
        */
        initKeyboard:function(){
            var that = this;

            return that.on("keydown",function(e){
                switch(e.keyCode){
                    case 37:
                    case 38:
                        that.value(that.value() - 1);
                        break;
                    case 39:
                    case 40:
                        that.value(that.value() + 1);
                        break;
                }
            });
        },
        /*
         * init drag
        */
        initDrag:function(){
            var that       = this;
            var opts       = that.opts;
            var clientSize = 0;
            var handleSize = 0;
            var offset,page,direction;

            var loadSize = function(){
                offset = that[0].offset();
                if(that._direction === "horizontal"){
                    page       = "pageX";
                    direction  = "x";
                    handleSize = opts.handleWidth;
                    clientSize = that.width() - that.boxSize.width;
                }else if(that._direction === "vertical"){
                    page       = "pageY";
                    direction  = "y";
                    handleSize = opts.handleHeight;
                    clientSize = that.height() - that.boxSize.height;
                }
            };
            var mousemove = function(e){
                var pos   = e[page] - offset[direction];
                var value = 0;

                if(page === "pageX"){
                    value = opts.min + Math.round((pos - handleSize / 2) / (clientSize - handleSize) * (opts.max - opts.min));
                }else if(page === "pageY"){
                    value = opts.min + Math.round((clientSize - pos - handleSize / 2) / (clientSize - handleSize) * (opts.max - opts.min));
                }
                that.value(value);
            };

            that[0].mouse({
                down:function(e){
                    if(e.which !== 1){
                        return;
                    }
                    loadSize();
                    Std.dom(document).on("mousemove",mousemove(e) || mousemove);
                    e.preventDefault();
                    that.emit("dragStart");
                },
                up:function(){
                    Std.dom(document).off("mousemove",mousemove);
                    that.emit("dragStop");
                }
            });

            return that;
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
        min:function(n){
            return this.opt("min",n,function(){
                this.refresh();
            });
        },
        /*
         * max
         */
        max:function(n){
            return this.opt("max",n,function(){
                this.refresh();
            });
        },
        /*
         * color
        */
        color:function(color){
            return this.opt("color",color,function(){
                this.D.progress.css("background",color);
            });
        },
        /*
         * slider range
        */
        range:function(min,max){
            var that = this;
            var opts = that.opts;

            if(min === undefined){
                return {
                    min:opts.min,
                    max:opts.max
                };
            }
            opts.min = min;
            opts.max = max;

            return that;
        },
        /*
         * value
        */
        value:function(value){
            var that = this;
            var opts = that.opts;

            if(value === undefined){
                return opts.value;
            }

            if((value = int(value)) < opts.min){
                value = opts.min;
            }else if(value > opts.max){
                value = opts.max;
            }

            that.updateValue(value);

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D = {};

        dom.addClass("_" + that._direction).append([
            doms.client = newDiv("_client").append(
                doms.progress = newDiv("_progress")
            ),
            doms.handle = newDiv("_handle").attr("tabindex",1)
        ]);
    }
});

/**
 *  horizontal slider widget module
*/
Std.ui.module("HSlider",{
    /*[#module option:model]*/
    model:"ui.Slider",
    /*[#module option:option]*/
    option:{
        level:3,
        height:22
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * direction
        */
        direction:"horizontal"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * height
        */
        height:function(n){
            var that         = this;
            var opts         = that.opts;
            var doms         = that.D;
            var sliderHeight = that.height();

            if(that.handleBoxSize){
                var handleHeight = opts.handleHeight - that.handleBoxSize.height;
                doms.handle.css({
                    top:(sliderHeight - handleHeight) / 2
                });
            }
            doms.client.css("top",Math.round((sliderHeight - doms.client.height()) / 2));
        }
    }
});

/**
 *  vertical slider widget module
*/
Std.ui.module("VSlider",{
    /*[#module option:model]*/
    model:"ui.Slider",
    /*[#module option:option]*/
    option:{
        level:3,
        width:22,
        height:200
    },
    /*[#module option:private]*/
    protected:{
        /*
         * direction
        */
        direction:"vertical"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * width
        */
        width:function(n){
            var that        = this;
            var opts        = that.opts;
            var doms        = that.D;
            var sliderWidth = that.width();

            if(that.handleBoxSize){
                var handleWidth = opts.handleWidth - that.handleBoxSize.width;

                doms.handle.css({
                    left:(sliderWidth - handleWidth) / 2
                });
            }
            doms.client.css("left",Math.round((sliderWidth - doms.client.width()) / 2));
        }
    }
});