/**
 * init image module base style
*/
Std.css({
    ".StdUI_Image":{
        outline:"none",
        overflow:"hidden",
        '>':{
            img:{
                float:"left",
                width:"100%",
                height:"100%",
                border:0
            }
        }
    }
});

/**
 * image widget module
*/
Std.ui.module("Image",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Image",
        level:1,
        width:22,
        height:22,
        type:"stretch", //stretch,repeat
        value:"",
        zoom:true,
        gray:false
    },
    /*[#module option:public]*/
    public:{
        /*
         * zoom
        */
        zoom:function(state){
            var that = this;
            var doms = that.D;

            return that.opt("zoom",state,function(){
                if(!doms.img){
                    return;
                }
                doms.img && doms.img.css(state ? {
                    width:"100%",
                    height:"100%"
                }:{
                    width:"auto",
                    height:"auto"
                });
            });
        },
        /*
         * to base64
        */
        toBase64:function(){
            var that      = this;
            var canvas    = newDom("canvas").dom;
            var context   = canvas.getContext("2d");

            canvas.width  = that._image.width;
            canvas.height = that._image.height;
            context.drawImage(that._image,0,0);

            var imgPixels = context.getImageData(0,0,canvas.width,canvas.height);

            context.putImageData(imgPixels,0,0,0,0,imgPixels.width,imgPixels.height);

            return canvas.toDataURL();
        },
        /*
         * get or set image address
        */
        value:function(value){
            var that = this;
            var doms = that.D;

            return this.opt("value",value,function(){
                that._image = null;

                if(!doms.img){
                    that[0].append(doms.img = newDom("img"));
                    that.zoom(that.opts.zoom);
                }
                Std.loader.image(value,function(state,imageObject){
                    if(state !== false){
                        doms.img.attr("src",value).show();
                        that.emit("load",that._image = imageObject).gray(that.opts.gray);
                    }
                });
            });
        },
        /*
         * gray image
        */
        gray:function(state){
            var that = this;

            return that.opt("gray",state,function(){
                var imageSrc = that.opts.value;

                if(isEmpty(imageSrc) || that._image === null){
                    return;
                }
                if(state === false){
                    return;
                }
                if(!Std.is.ie()){
                    that[0].css("filter",state ? "progid:DXImageTransform.Microsoft.BasicImage(grayscale=1)" : "");
                }else{
                    that[0].css("filter","grayscale(100%)");
                }
                that.emit("gray",state);
            });
        }
    },
    /*[#module option:main]*/
    main:function(that,opts){
        that.D = {};
        that.call_opts("value",true);
    }
});