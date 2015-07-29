Std.plugin.module("smoothWheel", {
    private:{
        timer:null,
        state:true
    },
    public:{
        remove:function(){
            var that       = this;
            var wheelEvent = that._wheelEvent;

            if(wheelEvent){
                Std.dom(that.owner).off("mousewheel",wheelEvent);
                clearInterval(that._timer);
            }
            that._state = false;
        }
    },
    main:function(that){
        if('ontouchstart' in window){
            return;
        }
        var owner       = Std.dom(that.owner);
        var vy          = 0,fricton = 0.9,oldY = 0,stepAmt = 5;
        var targetY     = 0,currentY = 0,maxScrollTop = 0,minMovement = 0.1;
        var direction   = null,minScrollTop = null;
        var animateLoop = function(){
            requestAnimationFrame(function(){
                if(that._state){
                    animateLoop();
                }
            });
            if(vy < -(minMovement) || vy > minMovement){
                if((currentY = (currentY + vy)) > maxScrollTop){
                    currentY = vy = 0;
                }else if(currentY < minScrollTop){
                    vy       = 0;
                    currentY = minScrollTop;
                }
                vy *= fricton;
                owner.scrollTop(-currentY);
            }
        };
        owner.on("mousewheel",that._wheelEvent = function(e){
            var delta = e.detail ? e.detail * -1 : e.wheelDelta / 40;
            var dir   = e.dir;

            if(dir != direction){
                vy        = 0;
                direction = dir;
            }
            currentY = -owner.scrollTop();
            targetY += delta;
            vy      += (targetY - oldY) * stepAmt;
            oldY     = targetY;

            e.preventDefault();
        });

        that._timer = setInterval(function(){
            minScrollTop = owner.clientHeight() - owner.scrollHeight();
        },200);

        targetY      = oldY = owner.scrollTop();
        currentY     = -targetY;
        minScrollTop = owner.clientHeight() - owner.scrollHeight();
        animateLoop();
    }
});