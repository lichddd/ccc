import Bullet_Super from './bullet_super'

const BULLET_IMG_SRC = 'images/bullet.png';
const BULLET_WIDTH = 62;
const BULLET_HEIGHT = 108;
const SCALE = 0.3
const PIp2 = Math.PI / 2;
const DIEING_FRAME = 10;
export default class Bullet extends Bullet_Super {
    constructor(cantiner,sp) {
        super(cantiner, 0,sp);
    }
    shoot(speed, x, y, num) {
        for (let i = 0; i < num; i++) {
            this.createSprite(`play`, {
                y: y - 20 + Math.floor(Math.random() * 10),
                x: x + Math.floor(Math.random() * 40 - 20),
                dieing_frame: DIEING_FRAME,
                scaleX: SCALE,
                scaleY: SCALE,
                width: BULLET_WIDTH * SCALE,
                height: BULLET_HEIGHT * SCALE,
                // angel: (i - num / 2) / num,
                speed: speed
            }, {});
        }
    }
    update(test) {
        super.update((s) => {
            s.y += s.speed;
        }, (s) => {}, (s) => {}, test);
    }

}
