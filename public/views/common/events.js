//  #####                        #            #   #    #
//  #                            #            #   #
//  #      #   #   ###   # ##   ####    ###   #   #   ##     ###   #   #
//  ####   #   #  #   #  ##  #   #     #       # #     #    #   #  #   #
//  #       # #   #####  #   #   #      ###    # #     #    #####  # # #
//  #       # #   #      #   #   #  #      #   # #     #    #      # # #
//  #####    #     ###   #   #    ##   ####     #     ###    ###    # #
/**
 * A class that represents the game events view.
 */
class EventsView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered events template.
     * @param {object} game The game to display.
     * @returns {string} An HTML string of the rendered events template.
     */
    static get(game) {
        return /* html */`
            ${game.events && game.events.sort((a, b) => b.time - a.time).map((event) => /* html */`
                <div class="time">${EventsView.Common.formatTimeSpan(event.time)}</div>
                <div class="event">${EventsView.Common.htmlEncode(event.description)}</div>
            `).join("") || ""}
        `;
    }
}

// @ts-ignore
EventsView.Common = typeof Common === "undefined" ? require("../../../web/includes/common") : Common; // eslint-disable-line no-undef

if (typeof module !== "undefined") {
    module.exports = EventsView; // eslint-disable-line no-undef
}
