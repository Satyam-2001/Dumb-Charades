import Peer from 'simple-peer'

class Connection {

    constructor(socket, stream) {
        this.peers = []
        this.socket = socket
        this.stream = stream
    }

    setStream(stream) {
        this.stream = stream
    }

    addPeer(callerID, incomingSignal) {

        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: this.stream
        })

        peer.on('signal', signal => {
            this.socket.emit('returning signal', callerID, signal)
        })

        peer.signal(incomingSignal);
        this.peers.push({ id: callerID, peer })
        return peer
    }

    createPeer(callerID) {

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: this.stream
        });

        peer.on('signal', signal => {
            this.socket.emit('sending signal', callerID, signal)
        })

        this.peers.push({ id: callerID, peer })
        return peer
    }

    getPeerByID(id) {
        const item = this.peers.find(p => p.id === id);
        return item
    }

    addStream(stream) {
        this.peers.forEach(({ peer }) => {
            peer.addStream(stream)
        })
    }
};

export default Connection