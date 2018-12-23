export default class Bullet_Super {

    constructor(cantiner, SHOOT_FRAME = 10,sprite_sheet) {
        this.cantiner = cantiner;
        this.shoot_frame = SHOOT_FRAME;
        this.list = [];
        this.deletelist = [];
        this.y = 0;
        this.x = 0;

        this.spriteSheet = sprite_sheet;
    }
    outOfScreen(s, test) {
        if (test) {
            if (s.y < -400 - 100 ||s.y > 400 + 100  || s.x > 300 + 100 || s.x <-300 -100) {
                this.deletelist.push(s);
                s.active = false;
                return false;
            }
        }
        return true;
    }
    createSprite(anime, option, die_option) {
        let isnew = true;
        let sprite = null;

        if (this.deletelist.length > 0) {
            isnew = false;sprite= this.deletelist.shift()
        } else {
            sprite = new cc.Node();
            var sp = sprite.addComponent(cc.Sprite);
    
            sp.spriteFrame = this.spriteSheet;
            
        }


        sprite.isdie = false;
        sprite.dieing_frame=0;
        sprite.diecount = 0;
        Object.assign(sprite, option);
        sprite.die = sprite.die || (() => {
            sprite.isdie = true;
            Object.assign(sprite, die_option);
        });
        !isnew
            ? (sprite.active = true)
            : sprite.parent = this.cantiner;;
        this.list.push(sprite);
    }
    update(timeFunc, dieFunc, diedFunc, test) {
        this.list = this.list.filter((s) => {
            if (s.isdie) {
                s.diecount++;
                dieFunc(s);
                if (s.diecount > (s.dieing_frame)) {
                    diedFunc(s);
                    this.deletelist.push(s);
                    s.active = false;
                    return false;
                }
                return true;
            }
            timeFunc(s);
            return this.outOfScreen(s, test);
        });
    }
}
