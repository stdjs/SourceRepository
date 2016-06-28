/**
 *  DateTime View
 */
Std.ui.module("DateTimeView",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        type:"dateTime",  //date,time,dateTime
        width:100,
        height:30,
        minWidth:32,
        minHeight:20,
        fontSize:13,
        tabIndex:null,
        defaultClass:"StdUI_DateTimeView",
        boxSizing:"border-box",
        dateFormat:"yyyy-MM-dd",
        timeFormat:"hh:mm:ss"
    },
    /*[#module option:private]*/
    private:{
        /*
         * date time picker
        */
        picker:null,
        /*
         * timer
        */
        timer:null
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;

            that.initEvents();
            that.initTimer();
            that.update();
        },
        /*
         * height
        */
        height:function(height){
            var that = this;

            that[0].lineHeight((isNumber(height) ? height : that.height()))
        },
        /*
         * remove
        */
        remove:function(){
            var that = this;

            if(that._timer){
                clearInterval(that._timer);
            }
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;
            var opts = that.opts;

        },
        /*
         * init timer
        */
        initTimer:function(){
            var that = this;

            that._timer = setInterval(function(){
                that.update();
            },1000);

            return that;
        },
        /*
         * update
        */
        update:function(){
            var that = this;
            var doms = that.D;

            if(doms.date){
                doms.date.html(new Date().format(that.dateFormat()))
            }
            if(doms.time){
                doms.time.html(new Date().format(that.timeFormat()));
            }
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * fontSize
        */
        fontSize:function(fontSize){
            return this.opt("fontSize",fontSize,function(){
                this[0].css("fontSize",fontSize + "px");
            });
        },
        /*
         * date format
        */
        dateFormat:function(format){
            return this.opt("dateFormat",format,function(){
                this.renderState && this.update();
            })
        },
        /*
         * time format
         */
        timeFormat:function(format){
            return this.opt("timeFormat",format,function(){
                this.renderState && this.update();
            })
        },
        /*
         * type
        */
        type:function(type){
            var that = this;

            return that.opt("type",type,function(){
                that[0].clear();

                if(type === "dateTime"){
                    that[0].append([
                        that.D.date = newDiv("_date"),
                        that.D.time = newDiv("_time")
                    ]);

                }else if(type === "date"){
                    that[0].append(that.D.date = newDiv("_date"));
                }else if(type === "time"){
                    that[0].append(that.D.time = newDiv("_time"));
                }
                if(that.renderState){
                    that.update();
                }
            });
        }
    },
    /*[#module option:private]*/
    main:function(that){
        that.D = {};
        that.call_opts({
            type:"",
            fontSize:13
        },true);
    }
});

