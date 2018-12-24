cc.Class({
    extends: cc.Component,

    onPostSolve: function (contact, selfCollider, otherCollider) {

        if (otherCollider.name=='ball<PhysicsCircleCollider>') {
            this.node.dispatchEvent(new cc.Event.EventCustom('BALL_IN_HOLE', true)); 
        }else
        {
            let e=new cc.Event.EventCustom('QIU_IN_HOLE', true);
            e.detail=otherCollider.node;
            this.node.dispatchEvent(e); 
        }

    }
});
