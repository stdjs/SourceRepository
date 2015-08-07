/**
 * ColorPicker widget module
*/
Std.ui.module("ColorPicker",{
    /*[#module option:parent]*/
    parent:"widget",
    /*[#module option:events]*/
    events:"change",
    /*[#module option:action]*/
    action:{
        content:"value"
    },
    /*[#module option:option]*/
    option:{
        level:3,
        defaultClass:"StdUI_ColorPicker",
        boxSizing:"border-box",
        fixedLayoutWidth:true,
        fixedLayoutHeight:true,
        minWidth:380,
        minHeight:220,
        width:380,
        height:220,
        paletteSize:150,
        value:"#000"
    },
    /*[#module option:private]*/
    private:{
        rollY:0,
        paletteX:0,
        paletteY:0
    },
    /*[#module option:extend]*/
    extend:{
        /*
         * render
        */
        render:function(){
            var that = this;
            var opts = that.opts;

            that.value(opts.value);

            that.initPalette();
            that.initRoll();
            that.initInputs();
            that.initColors();
        }
    },
    /*[#module option:protected]*/
    protected:{
        /*
         * init inputs
        */
        initInputs:function(){
            var that    = this;
            var doms    = that.D;

            doms.values.delegate("focusout","input",function(e){
                var input     = Std.dom(this);
                var className = input.className().substr(1);

                switch(className){
                    case "R":
                    case "G":
                    case "B":
                        that.rgb(doms.R.value(),doms.G.value(),doms.B.value());
                        break;
                    case "H":
                    case "S":
                    case "V":
                        that.hsv(doms.H.value(),doms.S.value(),doms.V.value());
                        break;
                    case "HEX":
                        that.hex(doms.HEX.value());
                        break;
                }
            });
            return that;
        },
        /*
         * init colors
        */
        initColors:function(){
            var that     = this;
            var doms     = that.D;
            var colors   = Std.convert.colors;
            var current  = null;
            var fragment = Std.dom.fragment();
            var element  = document.createElement("div");

            element.className = "_color";

            for(var name in colors){
                var clone = Std.dom.clone(element);
                clone.style.backgroundColor = colors[name];
                fragment.appendChild(clone);
            }

            doms.colors.append(fragment).delegate("click","._color",function(){
                if(current !== null){
                    current.removeClass("selected")
                }
                that.hex(Std.convert.rgb2hex(
                    Std.convert.color(
                        (current = Std.dom(this).addClass("selected")).css("background-color")
                    )
                ));
            });

            return that;
        },
        /*
         * init palette
        */
        initPalette:function(){
            var that      = this;
            var doms      = that.D;
            var offset    = null;
            var docObject = Std.dom(that[0].document());

            var mousemove = function(e){
                that.move1(e.pageX - offset.x,e.pageY - offset.y).updateUI();
            };
            doms.palette.mouse({
                unselect:true,
                down:function(e){
                    offset = doms.palette.offset();
                    doms.position1.css("visibility","hidden");
                    that.move1(e.pageX - offset.x,e.pageY - offset.y).updateUI();
                    docObject.on("mousemove",mousemove);
                },
                up:function(){
                    docObject.off({
                        mousemove:mousemove
                    });
                    doms.position1.removeStyle("visibility");
                }
            });

            return that;
        },
        /*
         * init roll
        */
        initRoll:function(){
            var that      = this;
            var doms      = that.D;
            var offsetTop = null;
            var docObject = Std.dom(that[0].document());

            var mousemove = function(e){
                that.move2(e.pageY - offsetTop).updateUI();
            };
            var mouseup   = function(e){
                docObject.off({
                    mouseup:mouseup,
                    mousemove:mousemove
                });
            };
            doms.roll.on("mousedown",function(e){
                offsetTop = doms.roll.offset().y;
                docObject.on({
                    mouseup:mouseup,
                    mousemove:mousemove
                }).once("selectstart",function(){
                    return false;
                });
                that.move2(e.pageY - offsetTop).updateUI();
                return false;
            });
            return that;
        },
        /*
         * move1
        */
        move1:function(left,top){
            var that        = this;
            var paletteSize = that.opts.paletteSize;

            if(left < 0){
                left = 0;
            }else if(left > paletteSize){
                left = paletteSize;
            }
            if(top < 0){
                top = 0;
            }else if(top > paletteSize){
                top = paletteSize;
            }
            that.D.position1.css({
                left:(that._paletteX = left) - 7,
                top:(that._paletteY = top) - 7}
            );
            return that;
        },
        /*
         * move2
        */
        move2:function(top){
            var that        = this;
            var paletteSize = that.opts.paletteSize;

            if(top < 0){
                top = 0;
            }else if(top > paletteSize){
                top = paletteSize;
            }
            that.D.position2.css("top",(that._rollY = top) - 4);

            return that;
        },
        /*
         * update UI
        */
        updateUI:function(){
            var that = this;
            var doms = that.D;

            var hsv  = that.hsv();
            var rgb  = Std.convert.hsv2rgb(hsv.h,hsv.s,hsv.v);
            var hex  = Std.convert.rgb2hex(rgb.r,rgb.g,rgb.b);

            doms.R.value(rgb.r);
            doms.G.value(rgb.g);
            doms.B.value(rgb.b);
            doms.H.value(hsv.h);
            doms.S.value(hsv.s);
            doms.V.value(hsv.v);
            doms.HEX.value(hex);

            doms.view.css("background-color",hex);
            doms.palette.css("background-color",Std.convert.rgb2hex(
                Std.convert.color("hsv("+hsv.h+",100,100)"))
            );

            return that.emit("change",hex);
        }
    },
    /*[#module option:public]*/
    public:{
        /*
         * value
        */
        value:function(color){
            var that = this;

            if(color === undefined){
                return that.hex();
            }
            if(isString(color)){
                color = Std.convert.color(color);
            }
            return that.rgb(color.r,color.g,color.b);
        },
        /*
         * rgb
        */
        rgb:function(r,g,b){
            var that = this;

            if(r === undefined){
                return Std.convert.hsv2rgb(that.hsv());
            }
            var hsv = Std.convert.rgb2hsv(r,g,b);

            return that.hsv(hsv.h,hsv.s,hsv.v);
        },
        /*
         * hex
        */
        hex:function(hex){
            var that = this;

            if(hex === undefined){
                return Std.convert.rgb2hex(that.rgb());
            }
            var rgb = Std.convert.hex2rgb(hex);
            return that.rgb(rgb.r,rgb.g,rgb.b);
        },
        /*
         * hsv
        */
        hsv:function(h,s,v){
            var that        = this;
            var paletteSize = that.opts.paletteSize;

            if(h === undefined){
                return {
                    h:int((paletteSize - that._rollY) * (360 / paletteSize)),
                    s:int(that._paletteX * (100 / paletteSize)),
                    v:int((paletteSize - that._paletteY) * (100 / paletteSize))
                };
            }else{
                that.move1(that._paletteX = s / (100 / paletteSize),that._paletteY = paletteSize - v / (100 / paletteSize));
                that.move2(that._rollY = paletteSize - h / (360 / paletteSize));
            }
            return that.updateUI();
        }
    },
    /*[#module option:main]*/
    main:function(that,opts,dom){
        var doms = that.D = {};

        Std.each("client views view palettes palette roll position1 position2 values colors",function(i,name){
            doms[name] = newDiv("_"+name);
        });
        Std.each("R G B HEX H S V",function(i,name){
            doms.values.append(
                newDiv("_field").append([
                    newDom("span","_label").html(name),
                    doms[name] = newDom("input","_" + name)
                ])
            )
        });

        dom.append([
            doms.palettes.append([
                doms.palette.append(doms.position1.append(newDiv("inner"))),
                doms.roll.append(doms.position2)
            ]),
            newDiv("_client").append([
                doms.colors,
                doms.views.append([
                    doms.view
                ])
            ]),
            doms.values
        ]);
    }
});