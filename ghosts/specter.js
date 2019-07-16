const Entity = require("../entity");
const Torch = require('../items/torch');

// this.state = ['NEUTRAL', 'FETAL', 'TORCH', 'LOG', 'STICK', 'HEALING', 'BEINGHEALED']

class Specter extends Entity {
    constructor(id, pos, size) {
        super(id, pos, size);
        this.state = "NEUTRAL";
        this.speed = 1;
        this.spawned = 0;
        this.cdMax = 360;
        this.cd = 180;
        this.spawnSpecter = this.spawnSpecter.bind(this);
    };

    
    static update() {
        const pack = [];
        
        for (let i in Specter.list) {
            const specter = Specter.list[i];
            
            specter.update();
            pack.push(specter)
        }   
        return pack;
    }

    static delete(specterId){
        delete Specter.list[specterId];
    }
    
    spawnSpecter() {
        // console.log(this.cd)
        if (this.cd === 0){
            let pos = {
                x: Math.floor(Math.random() * 1400),
                y: Math.floor(Math.random() * 750)
            }
            this.spawned += 1;
            let specter = new Specter(this.spawned, pos, 15);
            Specter.list[this.spawned] = specter;
            this.cd = this.cdMax;
        }
        this.cd -= 1
    }

    // nice
    update() {
        super.update();
        this.updatePosition();
    }

    collideWithFire(fire){
        const tempPos = { x: this.x, y: this.y };
        const dx = tempPos.x - Specter.fire.x;
        const dy = tempPos.y - Specter.fire.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + fire.size - 50) {
            Specter.delete(this.id);
        }
    }
    collideWithTorch(torches){
        for (let i in torches) {
            // console.log(Specter.players[i].x);
            const tempPos = { x: this.x, y: this.y };
            const dx = tempPos.x - torches[i].x;
            const dy = tempPos.y - torches[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            if (distance < this.size + torches[i].size) {
                Torch.delete(torches[i].id)
                Specter.delete(this.id);
            }
        }
    }

    collideWithPlayer(){
        for (let i in Specter.players) {
            // console.log(Specter.players[i].x);
            if ((this.x >= Specter.players[i].x - 10 && this.x <= Specter.players[i].x + 10) && (this.y >= Specter.players[i].y - 10 && this.y <= Specter.players[i].y + 10)) {
                // console.log('Specter collided with player')
            }
        }
    }

    moveToObject(object){
        let diffX = object.x - this.x;
        let diffY = object.y - this.y;
        if (diffX > 0) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
        if (diffY > 0) {
            this.y += this.speed;
        } else {
            this.y -= this.speed;
        }
    }

    updatePosition() {
        this.moveToObject(Specter.fire);
        this.collideWithFire(Specter.fire);
        this.collideWithPlayer();
        this.collideWithTorch(Specter.torches);
    };


};
Specter.list = {};
// change to webpack?
module.exports = Specter;