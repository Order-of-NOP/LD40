class Mino
{
    /** Mino
     * 
     * @param {{x:number, y:number}} pos 
     * @param {string} color 
     */
    Mino(pos, color) {
        this.pos = pos;
        this.color = color;
    }
};

class Snake
{
    /** init
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} color 
     */
    Snake(x, y, color) {
        v = validate(x, y, color)
        this.Minos = [new Mino(v.pos, v.color)];
    }
    /** valid_set
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {string} color 
     */
    valid_set(x, y, color){
        return {
            pos: {
                x: x == null ? 0 : x,
                y: y == null ? 0 : y
            },
            color: color == null ? '#000' : color,
            valid: x == null || y == null || color == null
        }
    }
    /** add_mino
     * 
     * @param {{x:number, y:number}} pos 
     * @param {string} color 
     */
    add_mino(pos, color) {
        v = validate(x, y, color)
        if (v.valid) 
            this.Minos.push(new Mino(v.pos, v.color))
    }
    // get the first mino
    get_head() { return this.Minos[0]; }
    // get the last mino
    get_tail() { return this.Minos[this.Minos.length - 1] }
    /**
     * 
     * @param {number} dx 
     * @param {number} dy 
     */ 
    move(dx, dy) {
        // move mines from second to last blocks
        for(let i = this.Minos.length; i > 0; i--) {
            this.Minos[i].pos = this.Minos[i-1].pos
        }
        // move head
        let h_pos = Minos[0].pos;
        this.Minos[0].pos = {
            x: h_pos.x + dx,
            y: h_pos.y + dy
        }
    }
}

function newGame() {
    console.log(g)
}

