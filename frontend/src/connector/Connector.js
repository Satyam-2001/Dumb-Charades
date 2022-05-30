class Connector {
    constructor() {
        this.storage = {}
    }
    litsen(id,cmd,callback) {
        if (cmd in this.storage) {
            this.storage[cmd][id] = callback
        }
        else {
            this.storage[cmd] = { id : callback}
        }
    }
    broadcast(cmd,...values) {
        for(const id in this.storage[cmd]) {
            this.storage[cmd][id](...values)
        }
    }
    remove(id,cmd) {
        if (this.storage?.[cmd]?.[id]) {
            delete this.storage[cmd][id]
        }
    }
}

export default Connector