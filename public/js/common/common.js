/* globals timeago */

//   ###
//  #   #
//  #       ###   ## #   ## #    ###   # ##
//  #      #   #  # # #  # # #  #   #  ##  #
//  #      #   #  # # #  # # #  #   #  #   #
//  #   #  #   #  # # #  # # #  #   #  #   #
//   ###    ###   #   #  #   #   ###   #   #
/**
 * A class that provides common functions.
 */
class Common {
    //                #
    //                #
    // ###    ###   ###
    // #  #  #  #  #  #
    // #  #  # ##  #  #
    // ###    # #   ###
    // #
    /**
     * Pads a number with leading zeros.
     * @param {number} value The value.  Must be a whole number.
     * @param {number} digits The desired number of digits in the result.
     * @returns {string} A string with the number padded with the appropriate amount of leading zeros.
     */
    static pad(value, digits) {
        let ret = value.toString();

        while (ret.length < digits) {
            ret = "0" + ret;
        }

        return ret;
    }

    //   #                            #    ###    #
    //  # #                           #     #
    //  #     ##   ###   # #    ###  ###    #    ##    # #    ##
    // ###   #  #  #  #  ####  #  #   #     #     #    ####  # ##
    //  #    #  #  #     #  #  # ##   #     #     #    #  #  ##
    //  #     ##   #     #  #   # #    ##   #    ###   #  #   ##
    /**
     * Formats the time portion of the date.
     * @param {Date} time The time to display.
     * @returns {string} The formatted time.
     */
    static formatTime(time) {
        return (time.getHours() === 0 ? "12" : time.getHours() > 12 ? (time.getHours() - 12).toString() : time.getHours().toString()) + ":" + Common.pad(time.getMinutes(), 2) + " " + (time.getHours() < 12 ? "AM" : "PM");
    }

    //   #                            #    ###    #                 ##
    //  # #                           #     #                      #  #
    //  #     ##   ###   # #    ###  ###    #    ##    # #    ##    #    ###    ###  ###
    // ###   #  #  #  #  ####  #  #   #     #     #    ####  # ##    #   #  #  #  #  #  #
    //  #    #  #  #     #  #  # ##   #     #     #    #  #  ##    #  #  #  #  # ##  #  #
    //  #     ##   #     #  #   # #    ##   #    ###   #  #   ##    ##   ###    # #  #  #
    //                                                                   #
    /**
     * Formats a time span.
     * @param {number} seconds The number of seconds.
     * @returns {string} The formatted time span.
     */
    static formatTimeSpan(seconds) {
        // return `${seconds > 3600 ? `${Math.floor(seconds / 3600)}:` : ""}${seconds > 60 ? `${Common.pad(Math.floor(seconds / 60) % 60, seconds >= 600 ? 2 : 1)}:` : ""}${Common.pad(Math.floor(seconds % 60), seconds >= 10 ? 2 : 1)}.${Common.pad(Math.floor(seconds * 1000) % 1000, 3)}`;
        return (seconds > 3600 ? Math.floor(seconds / 3600).toString() + ":" : "") + (seconds > 60 ? Common.pad(Math.floor(seconds / 60) % 60, seconds >= 600 ? 2 : 1) + ":" : "") + Common.pad(Math.floor(seconds % 60), seconds >= 10 ? 2 : 1) + "." + Common.pad(Math.floor(seconds * 1000) % 1000, 3);
    }

    //   #                            #    ###          #
    //  # #                           #    #  #         #
    //  #     ##   ###   # #    ###  ###   #  #   ###  ###    ##
    // ###   #  #  #  #  ####  #  #   #    #  #  #  #   #    # ##
    //  #    #  #  #     #  #  # ##   #    #  #  # ##   #    ##
    //  #     ##   #     #  #   # #    ##  ###    # #    ##   ##
    /**
     * Formats the date to show in the user's time zone.
     * @param {Date} time The date and time to display.
     * @returns {string} The formatted date and time.
     */
    static formatDate(time) {
        const now = new Date(),
            today = new Date(now);

        today.setMilliseconds(0);
        today.setSeconds(0);
        today.setMinutes(0);
        today.setHours(0);

        const date = new Date(time);

        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);

        switch (date.getTime() - today.getTime()) {
            case 0:
                return "Today " + Common.formatTime(time);
            case 86400000:
                return "Tomorrow " + Common.formatTime(time);
            case -86400000:
                return "Yesterday " + Common.formatTime(time);
            default:
                return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][time.getMonth()] + " " + time.getDate().toString() + " " + time.getFullYear().toString() + " " + Common.formatTime(time);
        }
    }

    // #      #          ##    ####                       #
    // #      #           #    #                          #
    // ###   ###   # #    #    ###   ###    ##    ##    ###   ##
    // #  #   #    ####   #    #     #  #  #     #  #  #  #  # ##
    // #  #   #    #  #   #    #     #  #  #     #  #  #  #  ##
    // #  #    ##  #  #  ###   ####  #  #   ##    ##    ###   ##
    /**
     * HTML-encodes a string.
     * @param {string} str The string.
     * @returns {string} The encoded string.
     */
    static htmlEncode(str) {
        if (!str) {
            return "";
        }

        return str.replace(/[\u0080-\uFFFF<>&]/gim, (i) => "&#" + i.charCodeAt(0) + ";");
    }

    // ##                   #  ###          #          ###          #          ###                     ##           #
    //  #                   #  #  #         #           #           #           #                       #           #
    //  #     ##    ###   ###  #  #   ###  ###    ###   #    ###   ###    ##    #     ##   # #   ###    #     ###  ###    ##
    //  #    #  #  #  #  #  #  #  #  #  #   #    #  #   #    #  #   #    #  #   #    # ##  ####  #  #   #    #  #   #    # ##
    //  #    #  #  # ##  #  #  #  #  # ##   #    # ##   #    #  #   #    #  #   #    ##    #  #  #  #   #    # ##   #    ##
    // ###    ##    # #   ###  ###    # #    ##   # #  ###   #  #    ##   ##    #     ##   #  #  ###   ###    # #    ##   ##
    //                                                                                           #
    /**
     * Loads data from an API into an element.
     * @param {string} api The API to load data from.
     * @param {string} querySelector The query selector to fill the data into.
     * @param {function} template The template function.
     * @returns {Promise} A promise that resolves when the data has been loaded.
     */
    static loadDataIntoTemplate(api, querySelector, template) {
        var el = document.querySelector(querySelector);

        el.innerHTML = "<div class=\"loading\">Loading...</div>";

        return fetch(api).then((res) => res.json()).then((data) => {
            el.innerHTML = "";

            if (Array.isArray(data)) {
                data.forEach((item) => {
                    el.insertAdjacentHTML("beforeend", template(item));
                });
            } else {
                el.innerHTML = template(data);
            }
        });
    }

    // ##                   #  ###    #                 ##
    //  #                   #   #                      #  #
    //  #     ##    ###   ###   #    ##    # #    ##   #  #   ###   ##
    //  #    #  #  #  #  #  #   #     #    ####  # ##  ####  #  #  #  #
    //  #    #  #  # ##  #  #   #     #    #  #  ##    #  #   ##   #  #
    // ###    ##    # #   ###   #    ###   #  #   ##   #  #  #      ##
    //                                                        ###
    /**
     * Loads the timeago elements on the page.
     * @returns {void}
     */
    static loadTimeAgo() {
        const els = document.querySelectorAll(".timeago");

        if (els.length > 0) {
            timeago.render(els);
        }
    }

    //              #       #          #
    //                      #         ##
    // #  #  #  #  ##     ###  # #   # #
    // #  #  #  #   #    #  #  # #   ####
    // #  #  #  #   #    #  #  # #     #
    //  ###   ###  ###    ###   #      #
    /**
     * Gets a unique UUID.
     * @returns {string} The UUID.
     */
    static uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }
}
