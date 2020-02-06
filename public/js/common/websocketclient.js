//  #   #         #       ###                 #              #      ###    ##      #                   #
//  #   #         #      #   #                #              #     #   #    #                          #
//  #   #   ###   # ##   #       ###    ###   #   #   ###   ####   #        #     ##     ###   # ##   ####
//  # # #  #   #  ##  #   ###   #   #  #   #  #  #   #   #   #     #        #      #    #   #  ##  #   #
//  # # #  #####  #   #      #  #   #  #      ###    #####   #     #        #      #    #####  #   #   #
//  ## ##  #      ##  #  #   #  #   #  #   #  #  #   #       #  #  #   #    #      #    #      #   #   #  #
//  #   #   ###   # ##    ###    ###    ###   #   #   ###     ##    ###    ###    ###    ###   #   #    ##
/**
 * A wrapper around WebSocket to handle gracefully reconnecting.  Based on https://github.com/websockets/ws/wiki/Websocket-client-implementation-for-auto-reconnect.
 */
class WebSocketClient {
    //                           #                       #
    //                           #                       #
    //  ##    ##   ###    ###   ###   ###   #  #   ##   ###    ##   ###
    // #     #  #  #  #  ##      #    #  #  #  #  #      #    #  #  #  #
    // #     #  #  #  #    ##    #    #     #  #  #      #    #  #  #
    //  ##    ##   #  #  ###      ##  #      ###   ##     ##   ##   #
    /**
     * Initializes the client.
     */
    constructor() {
        this.number = 0;
        this.autoReconnectInterval = 5000;
    }

    //  ##   ###    ##   ###
    // #  #  #  #  # ##  #  #
    // #  #  #  #  ##    #  #
    //  ##   ###    ##   #  #
    //       #
    /**
     * Opens the websocket.
     * @param {string} url The URL to open.
     * @returns {void}
     */
    open(url) {
        var wsc = this;

        this.url = url;
        this.instance = new WebSocket(this.url);

        this.instance.onopen = () => {
            wsc.onopen();
        };

        this.instance.onmessage = (data, flags) => {
            wsc.number++;
            wsc.onmessage(data, flags, wsc.number);
        };

        this.instance.onclose = (ev) => {
            switch (ev.code) {
                case 1000: // Normal closure.
                    break;
                default: // Abnormal closure.
                    wsc.reconnect(ev);
                    break;
            }
            wsc.onclose(ev);
        };

        this.instance.onerror = (err) => {
            switch (err.code) {
                case "ECONNREFUSED":
                    wsc.reconnect(err);
                    break;
                default:
                    wsc.onerror(err);
                    break;
            }
        };
    }

    //                       #
    //                       #
    //  ###    ##   ###    ###
    // ##     # ##  #  #  #  #
    //   ##   ##    #  #  #  #
    // ###     ##   #  #   ###
    /**
     * Sends a message to the websocket.
     * @param {string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView} data The data to send.
     * @returns {void}
     */
    send(data) {
        try {
            this.instance.send(data);
        } catch (err) {
            this.instance.emit("error", err);
        }
    }

    //                                                  #
    //                                                  #
    // ###    ##    ##    ##   ###   ###    ##    ##   ###
    // #  #  # ##  #     #  #  #  #  #  #  # ##  #      #
    // #     ##    #     #  #  #  #  #  #  ##    #      #
    // #      ##    ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Reconnects the websocket.
     * @param {object} ev The event that triggered the reconnect.
     * @returns {void}
     */
    reconnect(ev) {
        const wsc = this;

        this.instance.close();
        this.instance = null;

        setTimeout(() => {
            wsc.open(wsc.url);
        }, this.autoReconnectInterval);
    }

    //  ##   ###    ##   ###    ##   ###
    // #  #  #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  ##    #  #
    //  ##   #  #   ##   ###    ##   #  #
    //                   #
    /**
     * An event that triggers when the websocket is opened.
     * @param {object} ev The event that triggered the open.
     * @returns {void}
     */
    onopen(ev) {}

    //  ##   ###   # #    ##    ###    ###    ###   ###   ##
    // #  #  #  #  ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  #  #  #  #  ##      ##     ##   # ##   ##   ##
    //  ##   #  #  #  #   ##   ###    ###     # #  #      ##
    //                                              ###
    /**
     * An event that triggers when the websocket receives a message.
     * @param {string} data The data received.
     * @param {object} flags The flags.
     * @param {number} number The message number.
     * @returns {void}
     */
    onmessage(data, flags, number) {}

    //  ##   ###    ##   ###   ###    ##   ###
    // #  #  #  #  # ##  #  #  #  #  #  #  #  #
    // #  #  #  #  ##    #     #     #  #  #
    //  ##   #  #   ##   #     #      ##   #
    /**
     * An event that triggers when the websocket errors out.
     * @param {object} err The error.
     * @returns {void}
     */
    onerror(err) {}

    //                   ##
    //                    #
    //  ##   ###    ##    #     ##    ###    ##
    // #  #  #  #  #      #    #  #  ##     # ##
    // #  #  #  #  #      #    #  #    ##   ##
    //  ##   #  #   ##   ###    ##   ###     ##
    /**
     * An event that triggers when the websocket is closed.
     * @param {object} ev The event that triggered the close.
     * @returns {void}
     */
    onclose(ev) {}
}
