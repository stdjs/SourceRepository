/**
 *  ImageCutterView widget module
*/
Std.ui.module("ImageCutterView",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"dragStart dragStop dblclick",
    /*[#module option:option]*/
    option:{
        level:4,
        pickerWidth:150,
        pickerHeight:150,
        image:null,
        scale:1,
        lockerOpacity:0.4
    },
    protected:{
        positionX : 0,
        positionY : 0,
        imageData : null
    },
    extend:{
        /*
         *
        */
        render:function(){
            var that = this;

            that.initPicker();
            that.initDrag();
        }
    },
    /*[#module option:private]*/
    private:{
        /*
         * init picker
         */
        initPicker:function(){
            var that = this;
            var opts = that.opts;

            Std.dom(that.D.picker).css({
                width  : opts.pickerWidth,
                height : opts.pickerHeight
            });

            return that;
        },
        /*
         * init events
         */
        initDrag:function(){
            var that   = this;
            var opts   = that.opts;
            var posX   = 0;
            var posY   = 0;
            var rect   = null;
            var offset = null;

            var moving = function(e){
                var context   = that.D.picker.getContext("2d");
                var positionX = e.pageX - offset.x - posX + rect.left;
                var positionY = e.pageY - offset.y - posY + rect.top;

                if(positionX < 0){
                    positionX = 0;
                }else if(positionX > rect.width - opts.pickerWidth - 2){
                    positionX = rect.width - opts.pickerWidth - 2;
                }

                if(positionY < 0){
                    positionY = 0;
                }else if(positionY > rect.height - opts.pickerHeight - 2){
                    positionY = rect.height - opts.pickerHeight - 2;
                }

                Std.dom(that.D.picker).css({
                    top  : positionY,
                    left : positionX
                });

                context.clearRect(0,0,opts.pickerWidth,opts.pickerHeight);
                context.drawImage(
                    that._imageData,
                    -++positionX,
                    -++positionY,
                    that._imageData.width  * that.scale(),
                    that._imageData.height * that.scale()
                );
                that._positionX = positionX + 1;
                that._positionY = positionY + 1;
            };

            Std.dom(that.D.picker).mouse({
                dblclick:function(){
                    that.emit("dblclick");
                },
                up:function(e){
                    that.emit("dragStop",e);
                    that[0].off("mousemove",moving);
                    that[0].removeStyle("cursor");
                },
                down:function(e){
                    var pos = Std.dom(that.D.picker).position();

                    if(!that._imageData){
                        return;
                    }

                    offset  = that[0].offset();
                    rect    = Std.dom(that.D.image).css(["width","height"]);
                    posX    = e.pageX - offset.x - pos.x;
                    posY    = e.pageY - offset.y - pos.y;

                    rect.top  = that[0].scrollTop();
                    rect.left = that[0].scrollLeft();

                    that.emit("dragStart",e);
                    that[0].on("mousemove",moving);
                    that[0].css("cursor","move");
                }
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * locker opacity
        */
        lockerOpacity:function(opacity){
            return this.opt("lockerOpacity",opacity,function(){
                this.D.locker.opacity(opacity);
            });
        },
        /*
         * image size
        */
        imageSize:function(){
            var that = this;
            var data = that._imageData;

            return data === null ? data : {
                width  : data.width,
                height : data.height
            };
        },
        /*
         * attribute
        */
        attribute:function(){
            var that = this;
            var opts = that.opts;

            return {
                width     : opts.pickerWidth,
                height    : opts.pickerHeight,
                positionX : that._positionX,
                positionY : that._positionY
            };
        },
        /*
         * scale
         */
        scale:function(n){
            var that = this;
            var opts = that.opts;

            return this.opt("scale",n,function(){
                var image      = that._imageData;
                var dom_image  = that.D.image;
                var dom_picker = that.D.picker;
                var dom_locker = that.D.locker;

                if(!dom_image || !image){
                    return;
                }

                dom_image.width  = image.width  * that.scale();
                dom_image.height = image.height * that.scale();
                dom_image.getContext("2d").drawImage(
                    image,0,0,
                    image.width  * that.scale(),
                    image.height * that.scale()
                );

                dom_picker.width  = opts.pickerWidth;
                dom_picker.height = opts.pickerHeight;
                dom_picker.getContext("2d").drawImage(
                    image,-1,-1,
                    image.width  * that.scale(),
                    image.height * that.scale()
                );

                dom_locker.css({
                    width:image.width  * that.scale(),
                    height:image.height * that.scale()
                });
                Std.dom(dom_picker).css({left:0,top:0});
            });
        },
        /*
         * to base64
        */
        toBase64:function(){
            var that    = this;
            var opts    = that.opts;
            var data    = that._imageData;
            var canvas  = document.createElement("canvas");
            var context = canvas.getContext("2d");

            if(data === null){
                return data;
            }

            canvas.width  = opts.pickerWidth;
            canvas.height = opts.pickerHeight;
            context.drawImage(
                data,-that._positionX,-that._positionY,
                data.width * that.scale(),
                data.height * that.scale()
            );

            return canvas.toDataURL();
        },
        /*
         * load image
         */
        image:function(url){
            var that = this;
            var load = function(image){
                that._imageData = image;
                that.scale(that.opts.scale);
            };

            if(isObject(url)){
                load(url);
            }else if(url.substr(0,5) === "data:"){
                Std.loader.image(url,function(state,imageData){
                    load(imageData)
                });
            }else{
                Std.loader(url,function(image){
                    if(image = image.data){
                        load(image);
                    }
                });
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {
            image  : newDom("canvas","_image").dom,
            locker : newDiv("_locker").css({
                position:"absolute",
                left:0,
                top:0,
                width:"100%",
                height:"100%",
                background:"black"
            }),
            picker : newDom("canvas","_picker").css({
                position:"absolute",
                left:0,
                top:0,
                border:"1px dashed rgba(196,17,17,0.5)"
            }).dom
        };

        dom.css({
            position:"relative",
            overflow:"auto",
            background:"white"
        }).append([
            that.D.image,
            that.D.locker,
            that.D.picker
        ]);

        that.call_opts("image",true);
        that.lockerOpacity(opts.lockerOpacity);
    }
});

/**
 *  ImageCutter widget module
*/
Std.ui.module("ImageCutter",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"submit",
    /*[#module option:option]*/
    option:{
        level:4,
        pickerWidth:150,
        pickerHeight:150,
        image:null,
        scale:1,
        lockerOpacity:0.4
    },
    /*[#module option:private]*/
    private:{
        /*
         * init events
        */
        initEvents:function(){
            var that = this;
            var view = that.widgets.view;

            that.widgets.slider.on("change",function(pos){
                view.scale(pos / 100);
            });
            that.widgets.OK.on("click",function(){
                that.emit("submit",[
                    view.toBase64(),
                    view.attribute()
                ],true);
            });
            return that;
        },
        /*
         * init select
        */
        initSelect:function(){
            var that   = this;
            var input  = new Std.dom("input[type='file']",that.widgets.select).css({
                left:0,
                top:0,
                opacity:0,
                position:"absolute",
                width:"100%",
                height:"100%"
            });

            input.on("change",function(){
                var files = input.dom.files;

                if(files.length < 0 || !Std.url.suffix.img(Std.url(files[0].name).suffix)){
                    return;
                }
                var reader  = new FileReader;
                reader.readAsDataURL(files[0]);
                reader.onload = function(){
                    that.widgets.view.image(reader.result)
                };
            });
            return that;
        },
        /*
         * init widgets
        */
        initWidgets:function(){
            var that = this;
            var opts = that.opts;

            that.widgets = Std.ui({
                view:{
                    ui:"ImageCutterView",
                    scale:opts.scale,
                    image:opts.image,
                    pickerWidth:opts.pickerWidth,
                    pickerHeight:opts.pickerHeight,
                    lockerOpacity:opts.lockerOpacity
                },
                slider:{
                    ui:"HSlider",
                    min:10,
                    max:200,
                    value:100
                },
                select:{
                    ui:"Button",
                    text:"select"
                },
                OK:{
                    ui:"Button",
                    text:"OK"
                }
            });
            return that;
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * image
        */
        image:function(url){
            var that = this;

            that.widgets.view.image(url);

            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.initWidgets();
        that.initEvents();
        that.initSelect();
        that.layout({
            ui:"VBoxLayout",
            items:[
                that.widgets.view,
                {
                    ui:"HBoxLayout",
                    items:[
                        that.widgets.slider,
                        that.widgets.select,
                        that.widgets.OK
                    ]
                }
            ]
        })
    }
});