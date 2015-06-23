/**
 * video widget module
*/
Std.ui.module("video",{
    /*[#module option:parent]*/
    parent:"widget",
    /*#module option:action]*/
    action:{
        content:"src"
    },
    /*[#module option:option]*/
    option:{
        defaultClass:"StdUI_Video",
        autoplay:false,
        preload:true,
        src:null,   //this src address can be a string or array
        loop:false
    },
    /*[#module option:events]*/
    events:"statusChange",
    /*[#module option:extend]*/
    extend:{
        /*
         * extend render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            if(opts.autoplay){
                that.play();
            }
        },
        /*
         * extend width
        */
        width:function(n){
            var that  = this;
            var doms  = that.dom;
            var width = -that.outerSize.width;

            if(isNumber(n)){
                width += n;
            }else{
                width += that.width();
            }
            doms.video.width(width);
        },
        /*
         * extend height
        */
        height:function(n){
            var that   = this;
            var doms   = that.dom;
            var height = -that.outerSize.height;

            if(isNumber(n)){
                height += n;
            }else{
                height += that.height();
            }
            doms.video.height(height);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * auto play video
        */
        autoplay:function(value){
            return this.opt("autoplay",value);
        },
        /*
         * get or set video preload state
        */
        preload:function(value){
            return this.opt("preload",value);
        },
        /*
         * get or set video url address
        */
        src:function(src){
            return this.opt("src",src);
        },
        /*
         * get or set loop
        */
        loop:function(value){
            return this.opt("loop",value);
        },
        /*
         * change video status
        */
        status:function(status){
            var that      = this;
            var dom_video = that.D.video.dom;

            switch(status){
                case "play":
                    dom_video.play();
                    break;
                case "pause":
                    dom_video.pause();
                    break;
                case "stop":
                    dom_video.stop();
                    break;
            }

            return that.emit("statusChange",status);
        },
        /*
         * start play video
        */
        play:function(bValue){
            var that = this;

            if(bValue == undefined){
                return that.status() == "play";
            }
            if(bValue == true){
                that.status("play");
            }else{
                that.status("stop");
            }
            return that;
        },
        /*
         * pause video
        */
        pause:function(bValue){
            var that = this;

            if(bValue == undefined){
                return that.status() == "pause";
            }
            if(bValue == true){
                that.status("pause");
            }else{
                that.status("play");
            }
            return that;
        },
        /*
         * stop video
        */
        stop:function(bValue){
            var that = this;

            if(bValue == undefined){
                return that.status() == "stop";
            }
            if(bValue == true){
                that.status("stop");
            }else{
                that.status("play");
            }
            return that;
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.D = {};
        dom.appendChild(
            that.D.video = newDom("video")
        );

    }
});