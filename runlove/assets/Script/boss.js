cc.Class({
    extends: cc.Component,

    onPostSolve: function (contact, selfCollider, otherCollider) {

        this.node.dispatchEvent(new cc.Event.EventCustom('BOSS_ON_HIT', true));
    }
});
