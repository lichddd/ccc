import Beam from './beam'
import Player_bullet from './player_bullet'
import Magic_dm from './magic_dm'
import Bullet from './bullet'


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
        startUI:{
            default: null,
            type: cc.Node
        },
        dieUI:{
            default: null,
            type: cc.Node
        },
        stage:{
            default: null,
            type: cc.Node
        },



        player:{
            default: null,
            type: cc.Node
        },
        boss:{
            default: null,
            type: cc.Node
        },

        magic_dmSP:{
            default: null,
            type: cc.SpriteFrame
        },
        bulletSP:{
            default: null,
            type: cc.SpriteFrame
        },
        beamSP:{
            default: null,
            type: cc.SpriteFrame
        },
        player_bulletSP:{
            default: null,
            type: cc.SpriteFrame
        },

        playHPP:{
            default: null,
            type: cc.ProgressBar
        },
        bossHPP:{
            default: null,
            type: cc.ProgressBar
        },
    },

    // use this for initialization
    onLoad: function () {

        console.log(this.playHPP);
        this.timer=0;
        this.run=false;
        this.playHP=100;
        this.bossHP=1000;


        this.player.y=-250;


        this.magic_dm=new Magic_dm(this.stage,this.magic_dmSP);
        this.bullet=new Bullet(this.stage,this.bulletSP);
        this.beam=new Beam(this.stage,this.beamSP);
        this.player_bullet =new Player_bullet(this.stage,this.player_bulletSP);



        this.dieUI.active=false;
        this.startbtn.node.on(cc.Node.EventType.TOUCH_END,()=>{this.startUI.active=false;this.run=true});
        this.diebtn.node.on(cc.Node.EventType.TOUCH_END,()=>{this.dieUI.active=false;this.playHP=100,this.run=true});
        this.stage.on(cc.Node.EventType.TOUCH_MOVE,(e)=>{
            this.player.x+=e.getDeltaX();
            this.player.y+=e.getDeltaY();
        });
    },

    // called every frame
    update: function (dt) {
            if (!this.run) {
                return ;
            }
            this.timer++;

            this.magic_dm.update(true);
            this.bullet.update(true);
            this.beam.update(true);
            this.player_bullet.update(true);
            
            if (this.timer%20==0) {
                this.bullet.shoot(this.boss.x,this.boss.y);
            }
            if (this.timer%50==0) {
                this.magic_dm.shoot(this.boss.x,this.boss.y);
            }
            if (this.timer%100==0) {
                this.beam.shoot(this.boss.x,this.boss.y,{x:this.player.x,y:this.player.y});
            }
            if (this.timer%40==0) {
                this.player_bullet.shoot(5,this.player.x,this.player.y,5);
            }
            if (this.timer>=200) {
                this.timer=0;
            }
            this.collisionDetection();


            this.playHPP.progress=this.playHP/100;
            this.bossHPP.progress=this.bossHP/1000;
            if (this.playHP<=0) {
                this.run=false;
                this.dieUI.active=true;
            }
    },


    isCollideWith:function (rectObj,pointObj) {
        let spX = pointObj.x;
        let spY = pointObj.y;
        return !!(spX >= rectObj.x - rectObj.width / 2
          && spX <= rectObj.x + rectObj.width / 2
          && spY >= rectObj.y - rectObj.height / 2
          && spY <= rectObj.y + rectObj.height / 2)
      },
      collisionDetection:function () {
        let that = this;
        let pp={x:this.player.x,y:this.player.y};
        let br={x:this.boss.x,y:this.boss.y,width:72,height:97};
        this.player_bullet.list.forEach((bu) => {
          if ( this.isCollideWith(br,bu)&&!bu.isdie) {
            bu.die();
            if (this.bossHP>100) {
                this.bossHP -= 1;
            }

          }
        });
          this.bullet.list.forEach((b) => {
            if ( this.isCollideWith(b,pp)&&!b.isdie) {
              b.die();
              this.playHP -= 1;
            }
          });
          this.magic_dm.list.forEach((b) => {
            if ( this.isCollideWith(b,pp)&&!b.isdie) {
              b.die();
              this.playHP -= 2;
            }
          });
          this.beam.list.forEach((b) => {
            if ( this.isCollideWith(b,pp)&&!b.isdie) {
              b.die();
              this.playHP -= 5;
            }
          });
      }
});
