const touchXfix=-207;
const touchYfix=-368;

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

        pressP: {
            default: null,
            type: cc.ProgressBar
        },






        ball: {
            default: null,
            type: cc.Node
        },
        line:{
            default: null,
            type: cc.Node
        },
        qiulist:[cc.Node],

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
        this.qiups=[
            {x:0,y:0},
            {x:-25,y:25},{x:25,y:25},
            {x:-50,y:50},{x:0,y:50},{x:25,y:50},
            {x:-75,y:75},{x:-25,y:75},{x:25,y:75},{x:75,y:75},
            {x:-100,y:100},{x:-50,y:100},{x:0,y:100},{x:50,y:100},{x:100,y:100},
            {x:200,y:200},
        ]
        this.level=1;
        this.run = false;
        this.timer=null;
        this.line.active=false;
        this.speed=0;
        this.shootable=false;

        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().gravity = cc.v2();


        this.resetBALL();
        this.resetQIU();
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


        
        this.node.on('QIU_IN_HOLE',(e)=>{this.hit(e)});
        this.node.on('BALL_IN_HOLE',()=>{this.resetBALL()});





        this.node.on(cc.Node.EventType.TOUCH_START, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_START);
        });
        this.node.on(cc.Node.EventType.TOUCH_END, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_END);
        });
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_CANCEL);
        });
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (e) => {
            this.setblade(e, cc.Node.EventType.TOUCH_MOVE);
        });
    },
    hit:function (e){
        
        let b=e.detail;
        b.active=false;
        b.getComponent(cc.RigidBody).linearVelocity=cc.v2(0,0);
        setTimeout(()=>{
            b.x=-9999;
            b.y=-9999;
        },10);
    },
    resetBALL:function (){
        this.ball.getComponent(cc.RigidBody).linearVelocity=cc.v2(0,0);
        setTimeout(()=>{


            this.ball.x=0;
            this.ball.y=-200;

        },10);

    },
    resetQIU:function(){
        for (let index = 0; index < this.qiulist.length; index++) {
           this.qiulist[index].x=this.qiups[index].x;
           this.qiulist[index].y=this.qiups[index].y;
           this.qiulist[index].getComponent(cc.RigidBody).linearVelocity=cc.v2(0,0);
           this.qiulist[index].active=true;
        }

    },
    setblade: function (e, ff) {
        if (!this.run||!this.shootable) {
            return;
        }
        if (ff == cc.Node.EventType.TOUCH_START) {
            this.line.active=true;
            this.line.x=this.ball.x;
            this.line.y=this.ball.y;
            this.line.rotation= Math.atan2((e.touch._point.x+touchXfix-this.line.x),(e.touch._point.y+touchYfix-this.line.y))/Math.PI*180;

        } else if (ff == cc.Node.EventType.TOUCH_END || ff == cc.Node.EventType.TOUCH_CANCEL) {
            
            let n=Math.sqrt((e.touch._point.x+touchXfix-this.line.x)*(e.touch._point.x+touchXfix-this.line.x)+(e.touch._point.y+touchYfix-this.line.y)*(e.touch._point.y+touchYfix-this.line.y));
            let x=(e.touch._point.x+touchXfix-this.line.x)/n;
            let y=(e.touch._point.y+touchYfix-this.line.y)/n;

            this.ball.getComponent(cc.RigidBody).linearVelocity=cc.v2(x*10000,y*10000);
            this.line.active=false;
        } else if (ff == cc.Node.EventType.TOUCH_MOVE) {
            this.line.active=true;
            this.line.x=this.ball.x;
            this.line.y=this.ball.y;
            this.line.rotation= Math.atan2((e.touch._point.x+touchXfix-this.line.x),(e.touch._point.y+touchYfix-this.line.y))/Math.PI*180;

        }

    },
    // called every frame
    update: function (dt) {
        // if (this.holdL) {
        //     this.L.getComponent(cc.RigidBody).angularVelocity = (this.L.rotation >= this.Lto ? -500 : 0);
        // }
        // else {
        //     this.L.getComponent(cc.RigidBody).angularVelocity = (this.L.rotation <= this.LA ? 500 : 0);
        // }

        // if (this.holdR) {
        //     this.R.getComponent(cc.RigidBody).angularVelocity = (this.R.rotation <= this.Rto ? 500 : 0);
        // }
        // else {
        //     this.R.getComponent(cc.RigidBody).angularVelocity = (this.R.rotation >= this.RA ? -500 : 0);
        // }

        let lv=cc.v2(0,0);
        lv.x=this.ball.getComponent(cc.RigidBody).linearVelocity.x;
        lv.y=this.ball.getComponent(cc.RigidBody).linearVelocity.y;
        if (Math.abs(lv.x)>10) {
            lv.x=lv.x*0.95;
        }
        else{
            lv.x=0;
        }
        if (Math.abs(lv.y)>10) {
            lv.y=lv.y*0.95;
        }
        else{
            lv.y=0;
        }
        if (lv.y==0&&lv.x==0) {
            this.shootable=true;
        }
        else
        {
            this.shootable=false;
        }
        this.ball.getComponent(cc.RigidBody).linearVelocity=lv;
        this.qiulist.forEach(element => {
            let lv=cc.v2(0,0);
            lv.x=element.getComponent(cc.RigidBody).linearVelocity.x;
            lv.y=element.getComponent(cc.RigidBody).linearVelocity.y;
            if (Math.abs(lv.x)>10) {
                lv.x=lv.x*0.96;
            }
            else{
                lv.x=0;
            }
            if (Math.abs(lv.y)>10) {
                lv.y=lv.y*0.96;
            }
            else{
                lv.y=0;
            }
            element.getComponent(cc.RigidBody).linearVelocity=lv;
        });

        if (this.ball.y <= -400) {
            this.run = false;
            this.dieUI.active = true;
            this.ball.getComponent(cc.RigidBody).gravityScale=0;
        }
    },
});
