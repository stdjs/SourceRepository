/**
 *  date picker widget
*/
Std.ui.module("DatePicker",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"dateClick",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_DatePicker",
        editable:true,
        value:"",
        minWidth:233,
        maxWidth:233,
        format:"yyyy-MM-dd hh:mm:ss",
        footer:true,
        position:"none"
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.value(opts.value);
            that.initEvents();
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * date count
        */
        dateCount:function(year,month){
            var that = this;

            if(year == undefined){
                return new Date(that.year(),that.month(),0).getDate();
            }
            return new Date(year,month,0).getDate();
        },
        /*
         * clear dates
        */
        clearDates:function(){
            var that       = this;
            var doms_dates = that.D.dates;

            for(var i in doms_dates){
                doms_dates[i].remove();
                delete doms_dates[i];
            }
            return that;
        },
        /*
         * refresh time
        */
        refreshTime:function(){
            var that        = this;
            var currentDate = new Date();

            that.hour(currentDate.getHours());
            that.minute(currentDate.getMinutes());
            that.second(currentDate.getSeconds());

            return that;
        },
        /*
         * update dates
        */
        updateDates:function(){
            var that       = this;
            var doms       = that.D;
            var doms_dates = doms.dates;

            //-------
            var maxDay     = that.dateCount();
            var year       = that.year();
            var month      = that.month();
            var day        = new Date(year,month - 1).getDay();

            //-------
            that.clearDates();

            //-------
            for(var i=1,dateCount=that.dateCount(month < 1 ? year -1 : year,month < 1 ? 12 : month - 1);i<=day;i++){
                doms.dateBox.append(
                    doms_dates["l"+i] = newDom("span","_date _lastMonthDate").html(dateCount - day + i)
                );
            }
            for(var i=1;i<=maxDay;i++){
                doms.dateBox.append(
                    doms_dates[i] = newDom("span",i === that.date() ? "_date selected" : "_date").html(i)
                );
            }
            for(var i=1,nextDay=new Date(that.year(),that.month()).getDay();i<=7-nextDay;i++){
                doms.dateBox.append(
                    doms_dates["n"+i] = newDom("span","_date _nextMonthDate").html(i)
                );
            }
            return that;
        },
        /*
         * edit value
         */
        editValue:function(key,blur){
            var target;
            var that = this;

            if(!that.editable()){
                return that;
            }
            if(key === "year"){
                target = that.D.year;
            }else if(key === "month"){
                target = that.D.month;
            }

            var input = newDom("input").insertAfter(target.hide());
            input.width(target.outerWidth() - input.boxSize().width).on({
                focus:function(){
                    var keydown   = function(e){
                        if(e.keyCode === 13){
                            input.blur().off("keydown",keydown);
                        }
                    };
                    var mousedown = function(e){
                        if(!input.is(e.target)){
                            input.blur();
                            that[0].off("mousedown",mousedown);
                        }
                    };
                    input.on("keydown",keydown);
                    input.value(target.text());
                    that[0].on("mousedown",mousedown);
                },
                blur:function(){
                    var value = input.value();

                    if(value.isNumber() && blur.call(target,~~value)){
                        target.html(value);
                    }
                    this.remove();
                    target.show();
                }
            }).focus().select();

            return that;
        },
        /*
         * init footer
        */
        initFooter:function(){
            var that        = this;
            var doms        = that.D;
            var createInput = function(className){
                return newDom("input",className).contentEditable(true).attr("maxlength",2).value("00");
            };

            that[0].append(doms.footer = newDiv("_footer").append([
                newDom("span","_label").html("time:"),
                newDiv("_time").append([
                    doms.hour    = createInput("_hour"),
                    newDiv("_and").html(":"),
                    doms.minute  = createInput("_minute"),
                    newDiv("_and").html(":"),
                    doms.second  = createInput("_second")
                ]),
                doms.refresh = newDiv("_refresh").mouse({
                    click:function(){
                        that.refreshTime();
                    }
                }),
                doms.today   = newDiv("_today").html("Today").mouse({
                    click:function(){
                        var date = new Date();
                        that.year(date.getFullYear());
                        that.month(date.getMonth() + 1);
                        that.date(date.getDate());
                    }
                })
            ]));

            doms.footer.delegate("keydown keyup","input",function(e){
                var input = this;
                var value = input.value();

                if(e.name === "keydown"){
                    if(!((e.keyCode>=48 && e.keyCode<=57) || (e.keyCode>=96 && e.keyCode<=105))){
                        return false;
                    }
                }else if(e.name === "keyup"){
                    if(~~value > 23 && input.index() === 0){
                        input.value("00");
                    }else if(~~value > 59){
                        input.value("59");
                    }
                }
            });
            return that;
        },
        /*
         * init events
        */
        initEvents:function(){
            var that  = this;
            var doms  = that.D;

            doms.prevYear.on("click",function(){
                that.year(that.year() - 1);
            });

            doms.nextYear.on("click",function(){
                that.year(that.year() + 1);
            });

            doms.prevMonth.on("click",function(){
                var month = that.month() - 1;
                if(month < 1){
                    that.year(that.year() - 1);
                    that.month(12);
                }else{
                    that.month(month);
                }
            });

            doms.nextMonth.on("click",function(){
                var month = that.month() + 1;
                if(month > 12){
                    that.year(that.year() + 1);
                    that.month(1);
                }else{
                    that.month(month);
                }
            });

            doms.year.on("click",function(e){
                that.editValue("year",function(value){
                    if(value > 1000 && value < 10000){
                        that.year(value);
                        return true;
                    }
                });
            });

            doms.month.on("click",function(){
                that.editValue("month",function(value){
                    if(value > 0 && value < 13){
                        that.month(value);
                        return true;
                    }
                });
            });

            doms.dateBox.on("click",function(e){
                var dateText;
                var target = Std.dom(e.target);

                if(this.is(target)){
                    return false;
                }
                if(target.hasClass("_lastMonthDate")){
                    if(that.month() - 1 < 1){
                        that.year(that.year() - 1).month(12);
                    }else{
                        that.month(that.month() - 1);
                    }
                }else if(target.hasClass("_nextMonthDate")){
                    if(that.month() + 1 > 12){
                        that.year(that.year() + 1).month(1);
                    }else{
                        that.month(that.month() + 1);
                    }
                }

                that.date(dateText = ~~target.text());
                that.emit("dateClick",dateText);
            });

            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * get day
        */
        day:function(){
            return this._date.getDay();
        },
        /*
         * editable
        */
        editable:function(state){
            return this.opt("editable",state);
        },
        /*
         * get or set year
        */
        year:function(year){
            var that = this;
            var date = that._date;

            if(year === undefined){
                return ~~date.getFullYear();
            }

            date.setFullYear(year);
            that.D.year.html(year);
            that.renderState && that.updateDates();

            return that;
        },
        /*
         * get or set month
        */
        month:function(month){
            var that = this;
            var date = that._date;

            if(month === undefined){
                return ~~date.getMonth() + 1;
            }

            if(month > 12){
                month = 12;
            }else if(month < 1){
                month = 1;
            }

            if(that.date() > that.dateCount(that.year(),month)){
                that.date(1)
            }

            date.setMonth(month - 1);
            that.D.month.html(month);
            that.renderState && that.updateDates();

            return that;
        },
        /*
         * get or set date
        */
        date:function(date){
            var that = this;

            if(date === undefined){
                return that._date.getDate();
            }
            var doms_dates = that.D.dates;
            var dateToday  = that.date();

            that._date.setDate(date);

            if(doms_dates[dateToday]){
                doms_dates[dateToday].className("_date");
            }
            if(date in doms_dates){
                doms_dates[date].className("_date selected");
            }
            return that;
        },
        /*
         * hour
        */
        hour:function(hour){
            var that = this;

            if(hour === undefined){
                return that._date.getHours();
            }
            that._date.setHours(hour);
            that.opts.footer && that.D.hour.value(hour);

            return that;
        },
        /*
         * minute
        */
        minute:function(minute){
            var that = this;

            if(minute === undefined){
                return that._date.getMinutes();
            }
            that._date.setMinutes(minute);
            that.opts.footer && that.D.minute.value(minute);

            return that;
        },
        /*
         * second
        */
        second:function(second){
            var that = this;

            if(second === undefined){
                return that._date.getSeconds();
            }
            that._date.setSeconds(second);
            that.opts.footer && that.D.second.value(second);

            return that;
        },
        /*
         * value
        */
        value:function(value){
            var that = this;
            var opts = that.opts;

            if(value === undefined){
                return that._date.format(opts.format);
            }
            var date = that._date = new Date();

            if((value = value.trim()) !== ""){
                date.format(opts.format,value);
            }

            that.year(date.getFullYear());
            that.month(date.getMonth() + 1);
            that.date(date.getDate());
            that.hour(date.getHours());
            that.minute(date.getMinutes());
            that.second(date.getSeconds());
            that.updateDates();

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D = {
            dates:{}
        };

        dom.unselect(true).append([
            doms.header = newDiv("_header").append([
                doms.prevYear  = newDiv("_btn _prevYear"),
                doms.year      = newDiv("_value _year"),
                doms.nextYear  = newDiv("_btn _nextYear"),

                doms.prevMonth = newDiv("_btn _prevMonth"),
                doms.month     = newDiv("_value _month"),
                doms.nextMonth = newDiv("_btn _nextMonth")
            ]),
            newDiv("_body").append([
                doms.dayBox  = newDiv("_dayBox"),
                doms.dateBox = newDiv("_dateBox")
            ])
        ]);

        //---------
        Std.each(["Su","Mo","Tu","We","Th","Fr","Sa"],function(i,value){
            doms.dayBox.append(newDom("span","_day").html(value));
        });

        if(opts.footer === true){
            that.initFooter();
        }
    }
});

/**
 *  date picker plugin,base on datePicker widget
*/
Std.plugin.module("DatePicker",{
    /*[#module option:events]*/
    events:"apply dateClick",
    /*[#module option:option]*/
    option:{
        value:"",
        editable:true,
        format:"yyyy-MM-dd h:m:s"
    },
    /*[#module option:public]*/
    public:{
        /*
         * value
        */
        value:function(value){
            var that = this;

            if(value === undefined){
                return that.datePicker.value();
            }
            that.datePicker.value(value);
            return that;
        },
        /*
         * remove
        */
        remove:function(){
            this.datePicker.remove();
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,widget){
        var datePicker = that.datePicker = Std.ui("DatePicker",Std.extend({
            renderTo:"body",
            visible:false
        },opts));

        datePicker.on({
            dateClick:function(){
                datePicker.hide();
                that.emit("apply",that.value());
                widget.value(that.value());
            }
        })[0].css("position","absolute");

        widget[0].on("click",function(e){
            var offset = widget[0].offset();

            datePicker.show()[0].css({
                top    : offset.y + widget.height(),
                left   : offset.x,
                zIndex : Std.ui.status.zIndex++
            });

            e.stopPropagation()
        });
    }
});
