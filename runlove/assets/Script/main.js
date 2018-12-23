cc.Class({
    extends: cc.Component,

    properties: {
        startbtn: {
            default: null,
            type: cc.Label
        },
        diebtn: {
            default: null,
            type: cc.Label
        },
        startUI: {
            default: null,
            type: cc.Node
        },
        dieUI: {
            default: null,
            type: cc.Node
        },

        bossHPP: {
            default: null,
            type: cc.ProgressBar
        },







        canvas: {
            default: null,
            type: cc.Node
        },
        L: {
            default: null,
            type: cc.Node
        },

        R: {
            default: null,
            type: cc.Node
        },
        ball: {
            default: null,
            type: cc.Node
        },
        boss: {
            default: null,
            type: cc.Node
        },
    },
    ctor: function () {
        this.LA = -120;
        this.RA = 30;
        this.Lto = -160;
        this.Rto = 60;
        this.holdL = false;
        this.holdR = false;
    },

    // use this for initialization
    onLoad: function () {
        this.bossHP = 1000;
        this.run = false;
        this.timer=null;
        cc.director.getPhysicsManager().enabled = true;


        this.dieUI.active = false;
        this.startbtn.node.on(cc.Node.EventType.TOUCH_END, () => { 

            this.startUI.active = false; 
            this.run = true; 
            this.ball.getComponent(cc.RigidBody).gravityScale=1;
        });
        this.diebtn.node.on(cc.Node.EventType.TOUCH_END, () => { 
            this.ball.getComponent(cc.RigidBody).gravityScale=1;
            this.ball.getComponent(cc.RigidBody).angularVelocity=0;
            this.ball.getComponent(cc.RigidBody).linearVelocity=cc.v2(0,0);
            this.dieUI.active = false; 
            this.ball.x = 0; this.ball.y = 364; 
            this.run = true });


        
        this.node.on('BOSS_ON_HIT',()=>{this.hit()});






        this.canvas.on(cc.Node.EventType.TOUCH_START, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_START);
        });
        this.canvas.on(cc.Node.EventType.TOUCH_END, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_END);
        });
        this.canvas.on(cc.Node.EventType.TOUCH_CANCEL, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_CANCEL);
        });
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_MOVE);
        });
    },
    hit:function (){
        this.bossHP-=this.bossHP>10?2:0;
        this.bossHPP.progress=this.bossHP/1000;
        this.boss.color=new cc.Color(255, 100, 100);;
        clearTimeout(this.timer);
        this.timer=setTimeout(()=>{

            this.boss.color=new cc.Color(255, 255, 255);;

        },300);
    },
    setblade: function (e, ff) {
        if (!this.run) {
            return;
        }
        console.log(e);
        let l;
        let r;
        if (ff == cc.Node.EventType.TOUCH_START) {
            // l=false;
            // r=false;
            e._touches.forEach(n => {
                if (n._point.x <= 207) {
                    l = true;
                }
                if (n._point.x >= 208) {
                    r = true;
                }
            });
        } else if (ff == cc.Node.EventType.TOUCH_END || ff == cc.Node.EventType.TOUCH_CANCEL) {
            // l=true;
            // r=true;
            e._touches.forEach(n => {
                if (n._point.x <= 207) {
                    l = false;
                }
                if (n._point.x >= 208) {
                    r = false;
                }
            });
        } else if (ff == cc.Node.EventType.TOUCH_MOVE) {
            e._touches.forEach(n => {
                if (n._point.x <= 207 && n._prevPoint.x >= 208) {
                    l = true;
                    r = false;
                }
                if (n._point.x >= 207 && n._prevPoint.x <= 208) {
                    l = false;
                    r = true;
                }
            });

        }

        if (l != null) {

            this.holdL = l;
        }
        if (r != null) {

            this.holdR = r;
        }
    },
    // called every frame
    update: function (dt) {
        if (this.holdL) {
            this.L.getComponent(cc.RigidBody).angularVelocity = (this.L.rotation >= this.Lto ? -500 : 0);
        }
        else {
            this.L.getComponent(cc.RigidBody).angularVelocity = (this.L.rotation <= this.LA ? 500 : 0);
        }

        if (this.holdR) {
            this.R.getComponent(cc.RigidBody).angularVelocity = (this.R.rotation <= this.Rto ? 500 : 0);
        }
        else {
            this.R.getComponent(cc.RigidBody).angularVelocity = (this.R.rotation >= this.RA ? -500 : 0);
        }

        if (this.ball.y <= -400) {
            this.run = false;
            this.dieUI.active = true;
            this.ball.getComponent(cc.RigidBody).gravityScale=0;
        }
    },
});
