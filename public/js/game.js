/* global Common, EventsView, PlayersView, ScoreView, WebSocketClient */

//   ###                          ###
//  #   #                           #
//  #       ###   ## #    ###       #   ###
//  #          #  # # #  #   #      #  #
//  #  ##   ####  # # #  #####      #   ###
//  #   #  #   #  # # #  #      #   #      #
//   ###    ####  #   #   ###    ###   ####
/**
 * A class that provides functions for the game page.
 */
class GameJs {
    // ###    ##   #  #   ##                #                 #    #                    #           #
    // #  #  #  #  ####  #  #               #                 #    #                    #           #
    // #  #  #  #  ####  #      ##   ###   ###    ##   ###   ###   #      ##    ###   ###   ##    ###
    // #  #  #  #  #  #  #     #  #  #  #   #    # ##  #  #   #    #     #  #  #  #  #  #  # ##  #  #
    // #  #  #  #  #  #  #  #  #  #  #  #   #    ##    #  #   #    #     #  #  # ##  #  #  ##    #  #
    // ###    ##   #  #   ##    ##   #  #    ##   ##   #  #    ##  ####   ##    # #   ###   ##    ###
    /**
     * Makes sure all timeago fields are rendered and starts the websocket.
     * @returns {void}
     */
    static DOMContentLoaded() {
        Common.loadTimeAgo();

        GameJs.ws = new WebSocketClient();
        GameJs.ws.onmessage = GameJs.onmessage;
        GameJs.ws.open((window.location.protocol === "http:" ? "ws:" : window.location.protocol === "https:" ? "wss:" : window.location.protocol) + "//" + window.location.host + "/game/" + GameJs.game.ip);
    }

    //  ##   ###   # #    ##    ###    ###    ###   ###   ##
    // #  #  #  #  ####  # ##  ##     ##     #  #  #  #  # ##
    // #  #  #  #  #  #  ##      ##     ##   # ##   ##   ##
    //  ##   #  #  #  #   ##   ###    ###     # #  #      ##
    //                                              ###
    /**
     * Handles incoming messages.
     * @param {string} message The data received.
     * @returns {void}
     */
    static onmessage(message) {
        const {data} = JSON.parse(message.data);

        switch (data.name) {
            case "Stats": {
                switch (data.type) {
                    case "Kill":
                        GameJs.kill(data);
                        break;
                    case "Goal":
                        GameJs.goal(data);
                        break;
                    case "Blunder":
                        GameJs.blunder(data);
                        break;
                    case "CTF":
                        GameJs.ctf(data);
                        break;
                    case "Connect":
                        GameJs.connect(data);
                        break;
                    case "Disconnect":
                        GameJs.disconnect(data);
                        break;
                    case "EndGame":
                        GameJs.endGame(data);
                        break;
                }

                document.getElementById("game").querySelector(".scores").innerHTML = ScoreView.get(GameJs.game);
                document.getElementById("events").innerHTML = EventsView.get(GameJs.game);

                break;
            }
        }
    }

    // #     ##                   #
    // #      #                   #
    // ###    #    #  #  ###    ###   ##   ###
    // #  #   #    #  #  #  #  #  #  # ##  #  #
    // #  #   #    #  #  #  #  #  #  ##    #
    // ###   ###    ###  #  #   ###   ##   #
    /**
     * Processes the blunder stat.
     * @param {{time: number, scorer: string, scorerTeam: string}} data The blunder data.
     * @returns {void}
     */
    static blunder(data) {
        const {scorer, scorerTeam} = data;

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "ANARCHY"};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode !== "MONSTERBALL") {
            GameJs.game.settings.matchMode = "MONSTERBALL";
            GameJs.game.teamScore = {"BLUE": 0, "ORANGE": 0};
            document.querySelector(".map").innerText = GameJs.game.settings.matchMode;
        }

        GameJs.game.events.push(data);
        GameJs.game.goals.push(data);

        const scorerPlayer = GameJs.game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        scorerPlayer.blunders++;

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        if (GameJs.game.teamScore[otherTeam]) {
            GameJs.game.teamScore[otherTeam]++;
        } else {
            GameJs.game.teamScore[otherTeam] = 1;
        }

        document.getElementById("players").innerHTML = PlayersView.get(GameJs.game);
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the connect stat.
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static connect(data) {
        GameJs.game.events.push(data);
    }

    //        #      #
    //        #     # #
    //  ##   ###    #
    // #      #    ###
    // #      #     #
    //  ##     ##   #
    /**
     * Process the CTF stat.
     * @param {{time: number, event: string, scorer: string, scorerTeam: string}} data The CTF data.
     * @returns {void}
     */
    static ctf(data) {
        const {event, scorer, scorerTeam} = data;

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "ANARCHY"};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode !== "CTF") {
            GameJs.game.settings.matchMode = "CTF";
            GameJs.game.teamScore = {"BLUE": 0, "ORANGE": 0};
            document.querySelector(".map").innerText = GameJs.game.settings.matchMode;
        }

        if (event === "Return" && !scorer) {
            GameJs.game.flagStats.push(data);
            GameJs.game.events.push(data);
            return;
        }

        GameJs.game.events.push(data);
        GameJs.game.flagStats.push(data);

        const scorerPlayer = GameJs.game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        switch (event) {
            case "Return":
                scorerPlayer.returns++;
                break;
            case "Pickup":
                scorerPlayer.pickups++;
                break;
            case "Capture":
                scorerPlayer.captures++;

                if (GameJs.game.teamScore[scorerTeam]) {
                    GameJs.game.teamScore[scorerTeam]++;
                } else {
                    GameJs.game.teamScore[scorerTeam] = 1;
                }

                break;
            case "CarrierKill":
                scorerPlayer.carrierKills++;
                break;
        }

        document.getElementById("players").innerHTML = PlayersView.get(GameJs.game);
    }

    //    #   #                                                #
    //    #                                                    #
    //  ###  ##     ###    ##    ##   ###   ###    ##    ##   ###
    // #  #   #    ##     #     #  #  #  #  #  #  # ##  #      #
    // #  #   #      ##   #     #  #  #  #  #  #  ##    #      #
    //  ###  ###   ###     ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the disconnect stat.
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static disconnect(data) {
        GameJs.game.events.push(data);
    }

    //                #   ##
    //                #  #  #
    //  ##   ###    ###  #      ###  # #    ##
    // # ##  #  #  #  #  # ##  #  #  ####  # ##
    // ##    #  #  #  #  #  #  # ##  #  #  ##
    //  ##   #  #   ###   ###   # #  #  #   ##
    /**
     * Processes the end game stat.
     * @param {{start: Date, end: Date, damage: object[], kills: object[], goals: object[], flagStats: object[], players: object[], teamScore: object}} data The end game data.
     * @returns {void}
     */
    static endGame(data) {
        const {start, end, damage, kills, goals, flagStats, players, teamScore} = data;

        GameJs.game.start = new Date(start);
        GameJs.game.end = new Date(end);
        GameJs.game.damage = damage || [];
        GameJs.game.kills = kills || [];
        GameJs.game.goals = goals || [];
        GameJs.game.flagStats = flagStats || [];
        GameJs.game.players = players || [];
        GameJs.game.teamScore = teamScore || {};

        GameJs.ws.instance.close();

        document.getElementById("players").innerHTML = PlayersView.get(GameJs.game);
        document.querySelector("#game .time").innerHTML = /* html */`
            Completed <time class="timeago" datetime="${new Date(GameJs.game.end).toISOString()}">${new Date(GameJs.game.end)}</time>
        `;

        Common.loadTimeAgo();
    }

    //                   ##
    //                    #
    //  ###   ##    ###   #
    // #  #  #  #  #  #   #
    //  ##   #  #  # ##   #
    // #      ##    # #  ###
    //  ###
    /**
     * Processes the goal stat.
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, assistedTeam: string}} data The goal data.
     * @returns {void}
     */
    static goal(data) {
        const {scorer, scorerTeam, assisted, assistedTeam} = data;

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "ANARCHY"};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode !== "MONSTERBALL") {
            GameJs.game.settings.matchMode = "MONSTERBALL";
            GameJs.game.teamScore = {"BLUE": 0, "ORANGE": 0};
            document.querySelector(".map").innerText = GameJs.game.settings.matchMode;
        }

        GameJs.game.events.push(data);
        GameJs.game.goals.push(data);

        const scorerPlayer = GameJs.game.getPlayer(scorer),
            assistedPlayer = GameJs.game.getPlayer(assisted);

        scorerPlayer.team = scorerTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        scorerPlayer.goals++;
        if (assistedPlayer) {
            assistedPlayer.goalAssists++;
        }

        if (GameJs.game.teamScore[scorerTeam]) {
            GameJs.game.teamScore[scorerTeam]++;
        } else {
            GameJs.game.teamScore[scorerTeam] = 1;
        }

        document.getElementById("players").innerHTML = PlayersView.get(GameJs.game);
    }

    // #      #    ##    ##
    // #            #     #
    // # #   ##     #     #
    // ##     #     #     #
    // # #    #     #     #
    // #  #  ###   ###   ###
    /**
     * Processes the kill stat.
     * @param {{time: number, attacker: string, attackerTeam: string, defender: string, defenderTeam: string, assisted: string, assistedTeam: string, weapon: string}} data The kill data.
     * @returns {void}
     */
    static kill(data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam} = data;

        if (!GameJs.game.settings) {
            GameJs.game.settings = {matchMode: "ANARCHY"};
        }

        if (!GameJs.game.settings.matchMode) {
            GameJs.game.settings.matchMode = "ANARCHY";
        }

        if (GameJs.game.settings.matchMode === "ANARCHY" && (attackerTeam || defenderTeam)) {
            GameJs.game.settings.matchMode = "TEAM ANARCHY";
            document.querySelector(".map").innerText = GameJs.game.settings.matchMode;
        }

        GameJs.game.events.push(data);
        GameJs.game.kills.push(data);

        const attackerPlayer = GameJs.game.getPlayer(attacker),
            defenderPlayer = GameJs.game.getPlayer(defender),
            assistedPlayer = GameJs.game.getPlayer(assisted);

        attackerPlayer.team = attackerTeam;
        defenderPlayer.team = defenderTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        if (attackerTeam && !GameJs.game.teamScore[attackerTeam]) {
            GameJs.game.teamScore[attackerTeam] = 0;
        }
        if (defenderTeam && !GameJs.game.teamScore[defenderTeam]) {
            GameJs.game.teamScore[defenderTeam] = 0;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam) {
            attackerPlayer.kills--;
            defenderPlayer.deaths++;

            if ((!GameJs.game.settings || GameJs.game.settings.matchMode !== "MONSTERBALL" && GameJs.game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (GameJs.game.teamScore[attackerTeam]) {
                    GameJs.game.teamScore[attackerTeam]--;
                } else {
                    GameJs.game.teamScore[attackerTeam] = -1;
                }
            }
        } else {
            attackerPlayer.kills++;
            defenderPlayer.deaths++;
            if (assistedPlayer) {
                assistedPlayer.assists++;
            }

            if ((!GameJs.game.settings || GameJs.game.settings.matchMode !== "MONSTERBALL" && GameJs.game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (GameJs.game.teamScore[attackerTeam]) {
                    GameJs.game.teamScore[attackerTeam]++;
                } else {
                    GameJs.game.teamScore[attackerTeam] = 1;
                }
            }
        }

        document.getElementById("players").innerHTML = PlayersView.get(GameJs.game);
    }
}

document.addEventListener("DOMContentLoaded", GameJs.DOMContentLoaded);
