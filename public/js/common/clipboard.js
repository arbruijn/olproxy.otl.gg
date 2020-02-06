/* globals ClipboardJS */

//   ###    ##      #           #                               #
//  #   #    #                  #                               #
//  #        #     ##    # ##   # ##    ###    ###   # ##    ## #
//  #        #      #    ##  #  ##  #  #   #      #  ##  #  #  ##
//  #        #      #    ##  #  #   #  #   #   ####  #      #   #
//  #   #    #      #    # ##   ##  #  #   #  #   #  #      #  ##
//   ###    ###    ###   #      # ##    ###    ####  #       ## #
//                       #
//                       #
/**
 * A class that handles setting up the clipboard.js object.
 */
class Clipboard {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Sets up the clipboard.js object.
     * @returns {void}
     */
    static DOMContentLoaded() {
        const clipboard = new ClipboardJS("button.copy");

        clipboard.on("success", (ev) => {
            ev.trigger.innerHTML = "&#x2705;";

            if (ev.trigger.dataset.timeout) {
                clearTimeout(+ev.trigger.dataset.timeout);
            }

            ev.trigger.dataset.timeout = setTimeout(() => {
                ev.trigger.innerHTML = "&#x1F4CB;";
            }, 1000);
        });
    }
}

document.addEventListener("DOMContentLoaded", Clipboard.DOMContentLoaded);
