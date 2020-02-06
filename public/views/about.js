//    #    #                     #     #   #    #
//   # #   #                     #     #   #
//  #   #  # ##    ###   #   #  ####   #   #   ##     ###   #   #
//  #   #  ##  #  #   #  #   #   #      # #     #    #   #  #   #
//  #####  #   #  #   #  #   #   #      # #     #    #####  # # #
//  #   #  ##  #  #   #  #  ##   #  #   # #     #    #      # # #
//  #   #  # ##    ###    ## #    ##     #     ###    ###    # #
/**
 * A class that represents the about view.
 */
class AboutView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered about page template.
     * @returns {string} An HTML string of the about page.
     */
    static get() {
        return /* html */`
            <h2>About this website</h2>
            <div class="section">
                <div class="header">What is the Overload Server Browser?</div>
                <div>
                    This website, the Overload Server Browser, shows the most recent servers available that are running olmod 0.2.7 or greater.
                </div>
            </div>
            <div class="section">
                <div class="header">I run an Overload game server.  How do I get listed on the browser?</div>
                <div>
                    You must edit the olmodsettings.json file so that olmod knows to list your sever on this site.  See the <a href="/download">Download</a> page for more information.
                </div>
            </div>
            <div class="section">
                <div class="header">Where can I find out more about olmod?</div>
                <div>
                    olmod is open source software, and is available on Github at <a href="https://github.com/arbruijn/olmod" target="_blank">https://github.com/arbruijn/olmod</a>.
                </div>
            </div>
            <div class="section">
                <div class="header">What was olproxy?</div>
                <div>
                    olproxy used to be required to run an Overload server that could play games over the Internet.  As of version 0.2.7, this is no longer required.
                </div>
            </div>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = AboutView; // eslint-disable-line no-undef
}
