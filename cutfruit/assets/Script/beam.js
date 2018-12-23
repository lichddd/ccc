import Bullet_Super from './bullet_super'
const PIp2 = Math.PI / 2;

const ENEMY_IMG_SRC = 'images/beam.png'
const SHOOT_FRAME = 60
const SHOOT_SPEED = 10
const SHOOT_NUM = 6
const ENEMY_WIDTH = 16
const ENEMY_HEIGHT = 256
const SCALE = 0.5
const READY = 30
const DIEING_FRAME=30
export default class Enemy extends Bullet_Super {
    constructor(cantiner,sp) {
        super(cantiner, SHOOT_FRAME,sp);
        this.type = 1;
    }
    shoot(x, y, pp={x:0,y:-250},speed = SHOOT_SPEED, num = SHOOT_NUM) {

        for (let i = 0; i < num; i++) {
            let sx = x + Math.sin((2 * i / num - 1 + 1 / num) * PIp2) * 100;
            let sy = y + Math.cos((2 * i / num - 1 + 1 / num) * PIp2) * 100;
            this.createSprite(`b${this.type}`, {
                rotation: 0,
                alpha: 0,
                dieing_frame:DIEING_FRAME,
                x: sx,
                y: sy,
                scaleX: SCALE,
                scaleY: SCALE,
                width: ENEMY_WIDTH * SCALE,
                height: ENEMY_HEIGHT * SCALE,
                angel: Math.atan((pp.x - sx) / (pp.y - sy)),
                speed: speed,
                tx: (
                    pp.y - sy > 0
                    ? -1
                    : 1),
                ty: (
                    pp.y - sy > 0
                    ? 1
                    : -1),
                ready: READY
            },{});
        }

        this.type = this.type >= 16
            ? 1
            : this.type + 1;
    }

    update(test) {
        super.update((s) => {
            if (s.ready) {
                s.ready--;
                s.alpha = 2 * (READY - s.ready) / READY;
                s.rotation = s.angel / Math.PI * 180 * (READY - s.ready) / READY;
                return;
            }
            s.y += s.ty * Math.cos(s.angel) * s.speed;
            s.x -= s.tx * Math.sin(s.angel) * s.speed;
        }, (s) => {
            s.alpha = (DIEING_FRAME - s.diecount)*2 / DIEING_FRAME;
        }, (s) => {}, test);

    }

}