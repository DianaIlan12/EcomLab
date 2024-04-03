let connection = null;

class Socket {
    socket;

    constructor() {
        this.socket = null;
    }
    connect(server) {
        const io = require("socket.io")(server, {
            cors: {
                origin: '*',
            }
        });
        io.on("connection", (socket) => {
            this.socket = socket;
        });
    }
    emit(event, data) {
        this.socket.emit(event, data);
    }
    static init(server) {
        if (!connection) {
            connection = new Socket();
            connection.connect(server);
        }
    }
    static getConnection() {
        if (connection) {
            return connection;
        }
    }
}


module.exports = { Socket, connect: Socket.init, connection: Socket.getConnection }