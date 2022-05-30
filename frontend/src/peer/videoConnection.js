import Peer from 'simple-peer'

class VideoConnection {

    constructor(socket, stream) {
        this.peers = []
        this.socket = socket
        this.stream = stream
    }

    createPeer(callerID) {

        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: this.stream
        });

        peer.on('signal', signal => {
            this.socket.emit('video signal', callerID, signal)
        })

        this.peers.push({ id: callerID, peer })

        return peer
    }

    getPeerByID(id) {
        const item = this.peers.find(p => p.id === id);
        return item
    }
};

export default VideoConnection