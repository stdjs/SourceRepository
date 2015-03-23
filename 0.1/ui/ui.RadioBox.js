/**
 * RadioBox widget module
*/
Std.ui.module("RadioBox",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"change checked",
    /*[#module option:option]*/
    option:{
        level:1,
        defaultClass:"StdUI_RadioBox",
        text:"RadioBox",
        checked:false,
        value:null
    },
    /*[#module option:action]*/
    action:{
        content:"text"
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
    /*[#module option:private]*/
    private:{
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
            return this.opt("checked",state,function(){
                this.toggleClass("checked",state).emit("change",state);

                if(state === true){
                    this.emit("checked");
                }
            });
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        dom.append([
            that[1] = newDiv("_icon StdUI_RadioBox_Icon"),
            that[2] = newDom("label","_text")
        ]);

        that.call_opts({
            text:"",
            checked:false
        },true);

        that.initEvents();
    }
});

