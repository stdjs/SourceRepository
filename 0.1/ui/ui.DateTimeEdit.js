/**
 *  DateTime Edit
*/
Std.ui.module("DateTimeEdit",{
    /*[#module option:parent]*/
    parent:"LineEdit",
    /*[#module option:option]*/
    option:{
        minWidth:32,
        minHeight:12,
        defaultClass:"StdUI_DateTimeEdit",
        format:"yyyy-MM-dd h:m:s"
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * date time picker
        */
        picker:null,
        /*
         * picker state
        */
        pickerState:false
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;
            var opts = that.opts;

        },
        /*
         * remove
        */
        remove:function(){
            var that = this;

            if(that._picker){
                that._picker.remove();
            }
            that.removeDocumentEvents();
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init handle
        */
        initHandle:function(){
            var that = this;

            that[0].append(
                that.D.handle = newDiv("_handle").mouse({
                    click:function(){
                        if(!that._pickerState){
                            that.showPicker();
                        }else{
                            that.hidePicker();
                        }
                    }
                })
            );
            return that;
        },
        /*
         * init picker
        */
        initPicker:function(){
            var that   = this;
            var picker = that._picker = Std.ui("DatePicker",{
                format:that.opts.format,
                renderTo:"body"
            });
            if(!isEmpty(that.value())){
                picker.value(that.value())
            }
            picker.on("dateClick",function(){
                that.hidePicker();
                that.value(picker.value());
            });
            picker[0].css("position","absolute");

            return that;
        },
        /*
         * addDocumentEvents
        */
        addDocumentEvents:function(){
            var that = this;

            Std.dom(document).on("mousedown",that._documentEvents || (that._documentEvents = function(e){
                if(that[0].contains(e.target) || that._picker[0].contains(e.target)){
                    return;
                }
                that.hidePicker();
                that.removeDocumentEvents();
            }));
            return that;
        },
        /*
         * delDocumentEvents
        */
        removeDocumentEvents:function(){
            var that = this;

            if(that._documentEvents){
                Std.dom(document).off("mousedown",that._documentEvents);
            }
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * show picker
        */
        showPicker:function(){
            var that = this;

            if(!that._picker){
                that.initPicker();
            }

            var picker   = that._picker;
            var position = that[0].offset();
            var top      = position.y + that.height();

            picker[0].removeClass("StdUI_DateTimeEdit_Animate2").addClass("StdUI_DateTimeEdit_Animate1").css({
                top    : top + picker.height() >= Std.dom(document).height() ? position.y - picker.height() : top,
                left   : position.x,
                zIndex : Std.ui.status.zIndex++
            });

            that.addDocumentEvents();
            that._pickerState = true;
            return that;
        },
        /*
         * hide picker
        */
        hidePicker:function(){
            var that   = this;
            var picker = that._picker;

            picker[0].removeClass("StdUI_DateTimeEdit_Animate1").addClass("StdUI_DateTimeEdit_Animate2");

            that.removeDocumentEvents();
            that._pickerState = false;

            return that;
        }
    },
    /*[#module option:private]*/
    main:function(that){
        that.initHandle();
    }
});

