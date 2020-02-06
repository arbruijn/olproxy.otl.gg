/**
 * @typedef {import("express").Request} Express.Request
 * @typedef {{js?: string[], css?: string[]}} Files
 */

const HtmlMinifier = require("html-minifier"),
    Minify = require("../../src/minify"),
    pjson = require("../../package.json"),
    settings = require("../../settings");

/**
 * @type {typeof import("../../public/views/index")}
 */
let IndexView;

//   ###
//  #   #
//  #       ###   ## #   ## #    ###   # ##
//  #      #   #  # # #  # # #  #   #  ##  #
//  #      #   #  # # #  # # #  #   #  #   #
//  #   #  #   #  # # #  # # #  #   #  #   #
//   ###    ###   #   #  #   #   ###   #   #
/**
 * A class that handles common web functions.
 */
class Common {
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
        return `${time.getHours() === 0 ? "12" : time.getHours() > 12 ? (time.getHours() - 12).toString() : time.getHours().toString()}:${(time.getMinutes() < 10 ? "0" : "") + time.getMinutes().toString()} ${time.getHours() < 12 ? "AM" : "PM"}`;
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
                return `Today ${Common.formatTime(time)}`;
            case 86400000:
                return `Tomorrow ${Common.formatTime(time)}`;
            case -86400000:
                return `Yesterday ${Common.formatTime(time)}`;
            default:
                return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][time.getMonth()]} ${time.getDate().toString()} ${time.getFullYear().toString()} ${Common.formatTime(time)}`;
        }
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
        return `${seconds > 3600 ? `${Math.floor(seconds / 3600)}:` : ""}${seconds > 60 ? `${Common.pad(Math.floor(seconds / 60) % 60, seconds >= 600 ? 2 : 1)}:` : ""}${Common.pad(Math.floor(seconds % 60), seconds >= 10 ? 2 : 1)}.${Common.pad(Math.floor(seconds * 1000) % 1000, 3)}`;
    }

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
            ret = `0${ret}`;
        }

        return ret;
    }

    // ###    ###   ###   ##
    // #  #  #  #  #  #  # ##
    // #  #  # ##   ##   ##
    // ###    # #  #      ##
    // #            ###
    /**
     * Generates a webpage from the provided HTML using a common template.
     * @param {string} head The HTML to insert into the header.
     * @param {Files} files The files to combine and minify.
     * @param {string} html The HTML to make a full web page from.
     * @param {Express.Request} req The request of the page.
     * @returns {string} The HTML of the full web page.
     */
    static page(head, files, html, req) {
        if (!IndexView) {
            IndexView = require("../../public/views/index");
        }

        if (!files) {
            files = {js: [], css: []};
        }

        if (!files.js) {
            files.js = [];
        }

        if (!files.css) {
            files.css = [];
        }

        files.js.unshift("/js/common/common.js");
        files.css.unshift("/css/common.css");
        files.css.unshift("/css/reset.css");

        head = `${head}${Minify.combine(files.js, "js")}${Minify.combine(files.css, "css")}`;

        return HtmlMinifier.minify(
            IndexView.get({
                head,
                html,
                protocol: req.protocol,
                host: req.get("host"),
                originalUrl: req.originalUrl,
                year: new Date().getFullYear(),
                version: pjson.version
            }),
            settings.htmlMinifier
        );
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

        return str.replace(/[\u0080-\uFFFF<>&]/gim, (i) => `&#${i.charCodeAt(0)};`);
    }

    //   #          ####                       #
    //              #                          #
    //   #    ###   ###   ###    ##    ##    ###   ##
    //   #   ##     #     #  #  #     #  #  #  #  # ##
    //   #     ##   #     #  #  #     #  #  #  #  ##
    // # #   ###    ####  #  #   ##    ##    ###   ##
    //  #
    /**
     * Javascript-encodes a string.
     * @param {*} str The string.
     * @returns {string} The encoded string.
     */
    static jsEncode(str) {
        return str.replace(/"/gim, "\\\"");
    }
}

Common.route = {
    include: true
};

module.exports = Common;
