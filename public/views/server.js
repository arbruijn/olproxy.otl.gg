//   ###                                      #   #    #
//  #   #                                     #   #
//  #       ###   # ##   #   #   ###   # ##   #   #   ##     ###   #   #
//   ###   #   #  ##  #  #   #  #   #  ##  #   # #     #    #   #  #   #
//      #  #####  #       # #   #####  #       # #     #    #####  # # #
//  #   #  #      #       # #   #      #       # #     #    #      # # #
//   ###    ###   #        #     ###   #        #     ###    ###    # #
/**
 * A class that represents the server view.
 */
class ServerView {
    //              #
    //              #
    //  ###   ##   ###
    // #  #  # ##   #
    //  ##   ##     #
    // #      ##     ##
    //  ###
    /**
     * Gets the rendered server page template.
     * @returns {string} An HTML string of the server page.
     */
    static get() {
        return /* html */`
            <h2>Server Setup</h2>
            <div class="section">
                <div class="header">Overview</div>
                <div>
                    Running an private Overload server requires a few things:<br /><br />
                    1) Open UDP ports 7000 to 8001.  Note: this guide does not cover opening these ports.<br />
                    2) An installation of Overload.<br />
                    3) olmod v0.2.7 or later.<br />
                    4) Configure your server by modifying olmodsettings.json.<br />
                    <div class="code">
                        {<br />
                        <pre>    </pre>"isServer": true,<br />
                        <pre>    </pre>"trackerBaseUrl": "https://tracker.otl.gg",<br />
                        <pre>    </pre>"keepListed": false,<br />
                        <pre>    </pre>"serverName": "roncli's Testing Server",<br />
                        <pre>    </pre>"notes": "Contact roncli@roncli.com for details!"<br />
                        }
                    </div>
                    You must set isServer to true and ensure the trackerBaseUrl is http://tracker.otl.gg to get listed.  You should also set the serverName to name your server, and add any notes that you would like listed alongside your server within the Overload Game Browser.  If you wish for your server to remain listed even after it is offline, set keepListed to true.
                </div>
            </div>
            <div class="section">
                <div class="header">Example: Ubuntu 18.04 with Overload download from gog.com</div>
                <div>
                    The file setup.sh is available from <a target="_blank" href="https://gist.github.com/roncli/602d747ce28a57b801f53f6a29438834">https://gist.github.com/roncli/602d747ce28a57b801f53f6a29438834</a>.  This is a simple, all-in-one script that downloads and installs everything necessary to get Overload and olmod running as a service.  It does require some user input, just agree and accept defaults where necessary.  Don't forget to use the instructions on the <a href="/download">download</a> page to edit the olmodsettings.json file to ensure that your server appears on the tracker.
                </div>
            </div>
            <div class="section">
                <div class="header">Adding Examples</div>
                <div>
                    If you'd like to add an example script for your operating system, please issue a pull request to the repository for this website at <a target="_blank" href="https://github.com/overload-development-community/olproxy.otl.gg">https://github.com/overload-development-community/olproxy.otl.gg</a>, adding your example to /web/views/server.js.
                </div>
            </div>
        `;
    }
}

if (typeof module !== "undefined") {
    module.exports = ServerView; // eslint-disable-line no-undef
}
