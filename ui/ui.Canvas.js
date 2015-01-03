/**
 * canvas widget module
*/

Std.ui.module("canvas",{
    nodeName:"canvas",
    /*[#module option:widget]*/
    parent:"widget",
    /*[#module option:option]*/
    option:{
        context:"2d",
        notSupportText:"Your browser doesn't support the canvas element"
    },
    /*[#module option:public]*/
    public:{
        canvas:function(){
            return this[0].dom;
        },
        context:function(){
            return this.tmp.context;
        },
        moveTo:function(x,y){
            return this.context().moveTo(x,y);
        },
        createImageData:function(w,h){
            return this.context().createImageData(w,h);
        },
        lineTo:function(arg1,arg2){
            var that    = this;
            var context = that.context();

            if(arg1 == undefined){
                return that;
            }else if(arg2 == undefined){
                if(isArray(arg1)){
                    Std.each(arg1,function(i,value){
                        that.lineTo(value);
                    });
                    return that;
                }else if(isString(arg1)){
                    var value = arg1.split(",");
                    if(value.length == 2){
                        context.lineTo(value[0],value[1]);
                    }
                }else if(isPlainObject(arg1)){
                    context.lineTo(arg1.x || 0,arg1.y || 0);
                }
            }else{
                context.lineTo(arg1,arg2);
            }
            return that;
        },
        quadraticCurveTo:function(arg1,arg2,arg3,arg4){
            var that    = this;
            var context = that.context();

            switch(argments.length){
                case 1:
                    if(isArray(arg1)){
                        Std.each(arg1,function(i,value){
                            that.quadraticCurveTo(value);
                        });
                        return that;
                    }else if(isString(arg1)){
                        var values = arg1.split(",");
                        if(values.length == 4){
                            context.quadraticCurveTo(values[0],values[1],values[2],values[3]);
                        }
                    }else if(isPlainObject(arg1)){
                        context.quadraticCurveTo(arg1.cpx || 0,arg1.cpy || 0,arg1.x || 0,arg1.y || 0);
                    }
                    break;
                case 4:
                    context.quadraticCurveTo(arg1,arg2,arg3,arg4);
                    break;
            }
            return that;
        },
        bezierCurveTo:function(arg1,arg2,arg3,arg4,arg5,arg6){
            var that    = this;
            var context = that.context();

            switch(argments.length){
                case 1:
                    if(isArray(arg1)){
                        Std.each(arg1,function(i,value){
                            that.bezierCurveTo(value);
                        });
                        return that;
                    }else if(isString(arg1)){
                        var values = arg1.split(",");
                        if(values.length == 6){
                            context.bezierCurveTo(values[0],values[1],values[2],values[3],values[4],values[5]);
                        }
                    }else if(isPlainObject(arg1)){
                        context.bezierCurveTo(arg1.cp1x || 0,arg1.cp1y || 0,arg1.cp2x || 0,arg1.cp2y || 0,arg1.x || 0,arg1.y || 0);
                    }
                    break;
                case 6:
                    context.bezierCurveTo(arg1,arg2,arg3,arg4,arg5,arg6);
                    break;
            }
            return that;
        },
        createLinearGradient:function(arg1,arg2,arg3,arg4){
            var that    = this;
            var context = that.context();

            switch(argments.length){
                case 1:
                    if(isString(arg1)){
                        var values = arg1.split(",");
                        if(values.length == 4){
                            return context.createLinearGradient(arg1,arg2,arg3,arg4);
                        }
                    }else if(isPlainObject(arg1)){
                        return context.createLinearGradient(arg1.x0 || 0,arg1.y0 || 0,arg1.x1 || 0,arg1.y1 || 0);
                    }
                    break;
                case 4:
                    return context.createLinearGradient(arg1,arg2,arg3,arg4);
                    break;
            }
            return false;
        },
        createPattern:function(image,type){
            var that    = this;
            var context = that.context();

            if(image == undefined){
                return false;
            }
            return context.createPattern(image,type || "no-repeat");
        },
        createRadialGradient:function(arg1,arg2,arg3,arg4,arg5,arg6){
            var that    = this;
            var context = that.context();

            switch(argments.length){
                case 1:
                    if(isString(arg1)){
                        var values = arg1.split(",");
                        if(values.length == 6){
                            return context.createRadialGradient(values[0],values[1],values[2],values[3],values[4],values[5]);
                        }
                    }else if(isPlainObject(arg1)){
                        return context.createRadialGradient(arg1.y0 || 0,arg1.y1 || 0,arg1.r0 || 0,arg1.x1 || 0,arg1.y1 || 0,arg1.r1 || 0);
                    }
                    break;
                case 6:
                    return context.createRadialGradient(arg1,arg2,arg3,arg4,arg5,arg6);
                    break;
            }
            return false;
        },
        arc:function(arg1,arg2,arg3,arg4,arg5,arg6){
            var that    = this;
            var context = that.context();
            var args    = argments;

            if(args.length == 1){
                if(isArray(arg1)){
                    Std.each(arg1,function(i,value){
                        that.arc(value);
                    });
                    return that;
                }else if(isString(arg1)){
                    var values = arg1.split(",");
                    if(values.length >= 5){
                        context.arc(values[0],values[1],values[2],values[3],values[4],values[5] || false);
                    }
                }else if(isPlainObject(arg1)){
                    context.arc(arg1.x || 0,arg1.y || 0,arg1.r || 0,arg1.sAngle || 0,arg1.eAngle || 0,arg1.counterclockwise || false);
                }
            }else if(args.length >= 5){
                context.arc(arg1,arg2,arg3,arg4,arg5,arg6 || false)
            }
            return that;
        },
        arcTo:function(arg1,arg2,arg3,arg4,arg5){
            var that    = this;
            var context = that.context();
            var args    = argments;

            if(args.length == 1){
                if(isArray(arg1)){
                    Std.each(arg1,function(i,value){
                        that.arcTo(value);
                    });
                    return that;
                }else if(isString(arg1)){
                    var values = arg1.split(",");
                    if(values.length == 5){
                        context.arcTo(values[0],values[1],values[2],values[3],values[4]);
                    }
                }else if(isPlainObject(arg1)){
                    context.arcTo(arg1.x1 || 0,arg1.y1 || 0,arg1.x2 || 0,arg1.y2 || 0,arg1.r || 50);
                }
            }else if(args.length == 5){
                context.arcTo(arg1,arg2,arg3,arg4,arg5)
            }
            return that;
        },
        isPointInPath:function(x,y){
            if(x == undefined || y == undefined){
                return false;
            }
            return this.context().isPointInPath(x,y);
        },
        scale:function(arg1,arg2){
            var that    = this;
            var context = that.context();

            if(arg1 == undefined){
                return that;
            }else if(arg2 == undefined){
                context.scale(arg1,arg1);
            }else{
                context.scale(arg1,arg2);
            }
            return that;
        },
        rotate:function(angle){
            var that    = this;
            var context = that.context();

            context.rotate(angle);

            return that;
        },
        translate:function(x,y){
            var that    = this;
            var context = that.context();

            context.rotate(x,y);

            return that;
        },
        measureText:function(text){
            return this.context().measureText(text);
        },
        drawImage:function(img,sx,sy,swidth,sheight,x,y,width,height){
            var that    = this;
            var context = that.context();

            context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

            return that;
        },
        getImageData:function(x,y,width,height){
            return this.context().getImageData(x,y,width,height);
        },
        putImageData:function(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight){
            var that    = this;
            var context = that.context();

            context.drawImage(imgData,x,y,dirtyX,dirtyY,dirtyWidth,dirtyHeight);

            return that;
        }
    },
    /*[#module option:entrance]*/
    entrance:function(widget){
        Std.each("shadowColor shadowBlur fillStyle strokeStyle shadowOffsetX shadowOffsetY " +
            "lineCap lineJoin lineWidth miterLimit font textAlign textBaseline " +
            "globalAlpha globalCompositeOperation",

            function(i,name){
                widget[name] = function(value){
                    var that    = this;
                    var context = that.context();

                    if(value == undefined){
                        return context[name];
                    }
                    context[name] = value;
                    return that;
                }
            });

        Std.each("stroke fill beginPath closePath clip save restore toDataURL",function(i,name){
            widget[name] = function(){
                var that = this;
                that.context()[name]();
                return that;
            }
        });

        Std.each("rect fillRect strokeRect clearRect",function(i,name){
            widget[name] = function(arg1,arg2,arg3,arg4){
                var that    = this;
                var context = that.context();

                switch(argments.length){
                    case 1:
                        if(isArray(arg1)){
                            Std.each(arg1,function(i,value){
                                that[name](value);
                            });
                            return that;
                        }else if(isString(arg1)){
                            var values = arg1.split(",");
                            if(values.length == 4){
                                context[name](values[0],values[1],values[2],values[3]);
                            }
                        }else if(isPlainObject(arg1)){
                            context[name](arg1.x || 0,arg1.y || 0,arg1.width || 0,arg1.height || 0);
                        }
                        break;
                    case 2:
                        context[name](0,0,arg1,arg2);
                        break;
                    case 4:
                        context[name](arg1,arg2,arg3,arg4);
                        break;
                }
                return that;
            }
        },' ');

        Std.each("transform setTransform",function(i,name){
            widget[name] = function(arg1,arg2,arg3,arg4,arg5,arg6){
                var that    = this;
                var context = that.context();
                var args    = argments;

                if(args.length == 1){
                    if(isArray(arg1)){
                        Std.each(arg1,function(i,value){
                            that[name](value);
                        });
                        return that;
                    }else if(isString(arg1)){
                        var values = arg1.split(",");
                        if(values.length == 6){
                            context[name](values[0],values[1],values[2],values[3],values[4],values[5]);
                        }
                    }else if(isPlainObject(arg1)){
                        context[name](arg1.a || 0,arg1.b || 0,arg1.c || 0,arg1.d || 0,arg1.e || 0,arg1.f || 0);
                    }
                }else if(args.length == 6){
                    context[name](arg1,arg2,arg3,arg4,arg5,arg6)
                }
                return that;
            }
        },' ');

        Std.each("fillText strokeText",function(i,name){
            widget[name] = function(arg1,arg2,arg3,maxWidth){
                var that    = this;
                var context = that.context();

                switch(argments.length){
                    case 1:
                        if(isString(arg1)){
                            context[name](arg1,0,0);
                        }else if(isArray(arg1)){
                            Std.each(arg1,function(i,value){
                                that[name](value);
                            });
                            return that;
                        }else if(isPlainObject(arg1)){
                            context[name](arg1.text || 0,arg1.x || 0,arg1.y || 0,arg1.maxWidth);
                        }
                        break;
                    case 2:
                        context[name](arg1,arg2,0);
                        break;
                    case 3:
                        context[name](arg1,arg2,arg3);
                        break;
                    case 4:
                        context[name](arg1,arg2,arg3,maxWidth);
                        break;
                }
                return that;
            }
        },' ');
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        that.tmp = {
            context:SDOM.getContent(opts.context)
        };
        dom.html(opts.notSupportText);
    }
});