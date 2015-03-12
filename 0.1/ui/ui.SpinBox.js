/**
 *  Spin box
*/
Std.ui.module("SpinBox",{
    /*[#module option:parent]*/
    parent:"LineEdit",
    /*[#module option:option]*/
    option:{
        min:"infinite",
        max:"infinite",
        minWidth:32,
        minHeight:12,
        defaultClass:"StdUI_SpinBox"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;
            var opts = that.opts;

            that.D.input.on({
                keydown:function(e){
                    var which   = e.which;
                    var keyCode = e.keyCode;
                    var value   = this.value();

                    switch(true){
                        case keyCode === 190 && !value.has("."):
                            if(isEmpty(value)){
                                this.value("0");
                            }
                            break;
                        case keyCode >36 && keyCode < 41:
                        case which === 173 && value.length === 0:
                        case keyCode === 8 || keyCode === 13:
                        case which >47 && which <58:
                            if(value == "0"){
                                this.value("");
                            }
                            break;
                        default:
                            e.preventDefault();
                    }
                },
                keyup:function(){
                    var value = this.value();
                    if(opts.min !== "infinite" && value < opts.min){
                        that.value(opts.min);
                    }else if(opts.max !== "infinite" && value > opts.max){
                        that.value(opts.max)
                    }
                }
            });
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init handle
        */
        initHandle:function(){
            var that     = this;
            var add      = function(){
                that.value(~~that.value() + 1).select();
            };
            var subtract = function(){
                that.value(~~that.value() - 1).select();
            };

            that[0].append(
                that.D.handles = newDiv("_handles").append([
                    that.D.add      = newDiv("_handle _add").mouse({
                        down:add,
                        longpress:add
                    }),
                    that.D.subtract = newDiv("_handle _subtract").mouse({
                        down:subtract,
                        longpress:subtract
                    })
                ]).on("mousedown",function(e){
                    e.preventDefault();
                })
            );
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * get or set value
        */
        value:function(value){
            var that = this;
            var opts = that.opts;
            var doms = that.D;

            if(value === undefined){
                return float(doms.input.value());
            }
            if(!isNumber(value)){
                value = 0;
            }
            if(opts.min !== "infinite" && value < opts.min){
                value = opts.min;
            }
            if(opts.max !== "infinite" && value > opts.max){
                value = opts.max;
            }
            that.placeHolderState(value === "");
            doms.input.value(value);

            return that;
        }
    },
    /*[#module option:private]*/
    main:function(that){
        that.initHandle();
    }
});

