/**
 * RadioBox widget module
*/
Std.ui.module("RadioBox",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"change",
    /*[#module option:option]*/
    option:{
        level:1,
        defaultClass:"StdUI_RadioBox",
        text:"RadioBox",
        value:false,
        valueType:"bool" //bool,int,any
    },
    /*[#module option:action]*/
    action:{
        content:"text"
    },
    /*[#module option:private]*/
    private:{
        checked:false
    },
    /*[#module option:static]*/
    static:{
        /*
         * connect
        */
        connect:function(radios){
            return new (Std.ui("RadioBox").connection)(radios);
        },
        /*
         * connection
        */
        connection:Std.module({
            public:{
                change:function(radio){
                    var that = this;
                    Std.each(that.radios,function(i,data){
                        if(data.widget !== radio){
                            data.widget.checked(false);
                        }
                    });
                },
                connect:Std.func(function(radio){
                    if(radio instanceof Std.ui("RadioBox")){
                        var that   = this;
                        var handle = function(state){
                            if(state === true){
                                that.change(that.current = radio);
                            }
                        };
                        that.radios.push({
                            widget:radio,
                            handle:handle
                        });
                        radio.on("change",handle);
                    }
                },{
                    each:[isArray]
                }),
                disconnect:function(radio){
                    Std.each(this.radios,function(i,data){
                        if(data.widget === radio){
                            radio.off("change",data.handle);
                            this.remove(i);
                            return false;
                        }
                    });
                },
                value:function(value){
                    if(value === undefined){
                        if(this.current){
                            return this.current.value();
                        }
                        return null;
                    }
                    Std.each(this.radios,function(i,data){
                        if(data.widget.value() === value){
                            data.widget.checked(true);
                            return false;
                        }
                    });
                }
            },
            main:function(radios){
                var that    = this;

                that.radios = [];
                that.connect(radios);
            }
        })
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;

            that[0].mouse({
                click:function(){
                    if(that.enable()){
                        !that.checked() && that.checked(true)
                    }
                }
            });
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * value type
        */
        valueType:function(type){
            return this.opt("valueType",type);
        },
        /*
         * text
        */
        text:function(text){
            return this.opt("text",text,function(){
                this[2].html(text);
            })
        },
        /*
         * checked
        */
        checked:function(state){
            var that = this;

            if(state === undefined){
                return that._checked;
            }
            if(that._checked !== state){
                that.toggleClass("checked",that._checked = state);
                that.renderState && that.emit("change",state);
            }
            return that;
        },
        /*
         * value
        */
        value:function(value){
            var that = this;
            var type = that.valueType();

            if(value === undefined){
                if(type == "any"){
                    return that.opts.value;
                }
                if(type == "bool"){
                    return that.checked();
                }
                return ~~that.checked();
            }
            if(type == "any"){
                that.opts.value = value;
            }else{
                that.checked(Boolean(value));
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        dom.append([
            that[1] = newDiv("_icon StdUI_RadioBox_Icon"),
            that[2] = newDom("label","_text")
        ]);

        that.call_opts(["text","value"]);
        that.initEvents();
    }
});

