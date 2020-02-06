/* global Common, CompletedDetailsView, Countdown, DetailsView, Elapsed, Game, Player, ScoreView, ServersView, WebSocketClient */

//  #   #
//  #   #
//  #   #   ###   ## #    ###
//  #####  #   #  # # #  #   #
//  #   #  #   #  # # #  #####
//  #   #  #   #  # # #  #
//  #   #   ###   #   #   ###
/**
 * A class that provides functions for the home page.
 */
class Home {
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

        Home.ws = new WebSocketClient();
        Home.ws.onmessage = Home.onmessage;
        Home.ws.open((window.location.protocol === "http:" ? "ws:" : window.location.protocol === "https:" ? "wss:" : window.location.protocol) + "//" + window.location.host);
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
        const {ip, data} = JSON.parse(message.data),
            game = Game.getGame(ip);

        switch (data.name) {
            case "Stats":
                switch (data.type) {
                    case "StartGame":
                    case "LobbyStatus":
                        Home.startGame(ip, data);
                        break;
                    case "Kill":
                        Home.kill(ip, data);
                        break;
                    case "Goal":
                        Home.goal(ip, data);
                        break;
                    case "Blunder":
                        Home.blunder(ip, data);
                        break;
                    case "CTF":
                        Home.ctf(ip, data);
                        break;
                    case "Connect":
                        Home.connect(ip, data);
                        break;
                    case "Disconnect":
                        Home.disconnect(ip, data);
                        break;
                }

                document.getElementById(`game-${ip}`).querySelector(".scores").innerHTML = ScoreView.get(game);

                if (data.type === "EndGame") {
                    Home.endGame(ip, data);
                }
                if (data.type === "LobbyExit") {
                    Home.exitGame(ip);
                }
                break;
            case "Server": {
                const oldServer = Home.servers.find((s) => s.ip === ip);
                if (oldServer) {
                    Home.servers.splice(Home.servers.indexOf(oldServer), 1);
                }

                if (data.visible) {
                    Home.servers.push(data.server);
                }

                document.getElementById("browser").innerHTML = ServersView.get(Home.servers);
                Common.loadTimeAgo();

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
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, scorer: string, scorerTeam: string}} data The blunder data.
     * @returns {void}
     */
    static blunder(ip, data) {
        const {scorer, scorerTeam} = data,
            game = Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "ANARCHY"};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode !== "MONSTERBALL") {
            game.settings.matchMode = "MONSTERBALL";
            game.teamScore = {"BLUE": 0, "ORANGE": 0};
            document.getElementById(`game-${ip}`).querySelector(".map").innerText = game.settings.matchMode;
        }

        game.events.push(data);
        game.goals.push(data);

        const scorerPlayer = game.getPlayer(scorer);

        scorerPlayer.team = scorerTeam;

        scorerPlayer.blunders++;

        const otherTeam = scorerTeam === "BLUE" ? "ORANGE" : "BLUE";

        if (game.teamScore[otherTeam]) {
            game.teamScore[otherTeam]++;
        } else {
            game.teamScore[otherTeam] = 1;
        }
    }

    //                                      #
    //                                      #
    //  ##    ##   ###   ###    ##    ##   ###
    // #     #  #  #  #  #  #  # ##  #      #
    // #     #  #  #  #  #  #  ##    #      #
    //  ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the connect stat.
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static connect(ip, data) {
        const game = Game.getGame(ip);

        game.events.push(data);
    }

    //        #      #
    //        #     # #
    //  ##   ###    #
    // #      #    ###
    // #      #     #
    //  ##     ##   #
    /**
     * Process the CTF stat.
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, event: string, scorer: string, scorerTeam: string}} data The CTF data.
     * @returns {void}
     */
    static ctf(ip, data) {
        const {event, scorer, scorerTeam} = data,
            game = Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "ANARCHY"};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode !== "CTF") {
            game.settings.matchMode = "CTF";
            game.teamScore = {"BLUE": 0, "ORANGE": 0};
            document.getElementById(`game-${ip}`).querySelector(".map").innerText = game.settings.matchMode;
        }

        if (event === "Return" && !scorer) {
            game.flagStats.push(data);
            game.events.push(data);
            return;
        }

        game.events.push(data);
        game.flagStats.push(data);

        const scorerPlayer = game.getPlayer(scorer);

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

                if (game.teamScore[scorerTeam]) {
                    game.teamScore[scorerTeam]++;
                } else {
                    game.teamScore[scorerTeam] = 1;
                }

                break;
            case "CarrierKill":
                scorerPlayer.carrierKills++;
                break;
        }
    }

    //    #   #                                                #
    //    #                                                    #
    //  ###  ##     ###    ##    ##   ###   ###    ##    ##   ###
    // #  #   #    ##     #     #  #  #  #  #  #  # ##  #      #
    // #  #   #      ##   #     #  #  #  #  #  #  ##    #      #
    //  ###  ###   ###     ##    ##   #  #  #  #   ##    ##     ##
    /**
     * Processes the disconnect stat.
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, player: string}} data The connect data.
     * @returns {void}
     */
    static disconnect(ip, data) {
        const game = Game.getGame(ip);

        if (!game.end) {
            game.events.push(data);
        }
    }

    //                #   ##
    //                #  #  #
    //  ##   ###    ###  #      ###  # #    ##
    // # ##  #  #  #  #  # ##  #  #  ####  # ##
    // ##    #  #  #  #  #  #  # ##  #  #  ##
    //  ##   #  #   ###   ###   # #  #  #   ##
    /**
     * Processes the end game stat.
     * @param {string} ip The IP address of the server to update.
     * @param {{start: Date, end: Date, damage: object[], kills: object[], goals: object[], flagStats: object[], players: object[], teamScore: object}} data The end game data.
     * @returns {void}
     */
    static endGame(ip, data) {
        const {id, start, end, damage, kills, goals, flagStats, players, teamScore} = data,
            game = Game.getGame(ip);

        game.start = new Date(start);
        game.end = new Date(end);
        game.damage = damage;
        game.kills = kills;
        game.goals = goals;
        game.flagStats = flagStats;
        game.players = players;
        game.teamScore = teamScore;

        const gameEl = document.getElementById(`game-${ip}`);
        gameEl.parentNode.removeChild(gameEl);

        const gameId = `completed-${Common.uuidv4()}`;

        document.getElementById("completed").insertAdjacentHTML("beforeend", /* html */`
            <div class="game" id="${gameId}">
                ${CompletedDetailsView.get(game, true, id)}
            </div>
        `);

        Common.loadTimeAgo();

        game.remove();

        setTimeout(() => {
            const completedEl = document.getElementById(gameId);
            completedEl.parentNode.removeChild(completedEl);
        }, 3600000);
    }

    //              #     #     ##
    //                    #    #  #
    //  ##   #  #  ##    ###   #      ###  # #    ##
    // # ##   ##    #     #    # ##  #  #  ####  # ##
    // ##     ##    #     #    #  #  # ##  #  #  ##
    //  ##   #  #  ###     ##   ###   # #  #  #   ##
    /**
     * Removes a game.
     * @param {string} ip The IP address of the game to remove.
     * @returns {void}
     */
    static exitGame(ip) {
        const game = Game.getGame(ip);

        const gameEl = document.getElementById(`game-${ip}`);
        gameEl.parentNode.removeChild(gameEl);

        game.remove();
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
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, scorer: string, scorerTeam: string, assisted: string, assistedTeam: string}} data The goal data.
     * @returns {void}
     */
    static goal(ip, data) {
        const {scorer, scorerTeam, assisted, assistedTeam} = data,
            game = Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "ANARCHY"};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode !== "MONSTERBALL") {
            game.settings.matchMode = "MONSTERBALL";
            game.teamScore = {"BLUE": 0, "ORANGE": 0};
            document.getElementById(`game-${ip}`).querySelector(".map").innerText = game.settings.matchMode;
        }

        game.events.push(data);
        game.goals.push(data);

        const scorerPlayer = game.getPlayer(scorer),
            assistedPlayer = game.getPlayer(assisted);

        scorerPlayer.team = scorerTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        scorerPlayer.goals++;
        if (assistedPlayer) {
            assistedPlayer.goalAssists++;
        }

        if (game.teamScore[scorerTeam]) {
            game.teamScore[scorerTeam]++;
        } else {
            game.teamScore[scorerTeam] = 1;
        }
    }

    // #      #    ##    ##
    // #            #     #
    // # #   ##     #     #
    // ##     #     #     #
    // # #    #     #     #
    // #  #  ###   ###   ###
    /**
     * Processes the kill stat.
     * @param {string} ip The IP address of the server to update.
     * @param {{time: number, attacker: string, attackerTeam: string, defender: string, defenderTeam: string, assisted: string, assistedTeam: string, weapon: string}} data The kill data.
     * @returns {void}
     */
    static kill(ip, data) {
        const {attacker, attackerTeam, defender, defenderTeam, assisted, assistedTeam} = data,
            game = Game.getGame(ip);

        if (!game.settings) {
            game.settings = {matchMode: "ANARCHY"};
        }

        if (!game.settings.matchMode) {
            game.settings.matchMode = "ANARCHY";
        }

        if (game.settings.matchMode === "ANARCHY" && (attackerTeam || defenderTeam)) {
            game.settings.matchMode = "TEAM ANARCHY";
            document.getElementById(`game-${ip}`).querySelector(".map").innerText = game.settings.matchMode;
        }

        game.events.push(data);
        game.kills.push(data);

        const attackerPlayer = game.getPlayer(attacker),
            defenderPlayer = game.getPlayer(defender),
            assistedPlayer = game.getPlayer(assisted);

        attackerPlayer.team = attackerTeam;
        defenderPlayer.team = defenderTeam;
        if (assistedPlayer) {
            assistedPlayer.team = assistedTeam;
        }

        if (attackerTeam && !game.teamScore[attackerTeam]) {
            game.teamScore[attackerTeam] = 0;
        }
        if (defenderTeam && !game.teamScore[defenderTeam]) {
            game.teamScore[defenderTeam] = 0;
        }

        if (attackerTeam && attackerTeam !== "ANARCHY" && attackerTeam === defenderTeam || attacker === defender) {
            attackerPlayer.kills--;
            defenderPlayer.deaths++;

            if ((!game.settings || !game.settings.matchMode || game.settings.matchMode !== "MONSTERBALL" && game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (game.teamScore[attackerTeam]) {
                    game.teamScore[attackerTeam]--;
                } else {
                    game.teamScore[attackerTeam] = -1;
                }
            }
        } else {
            attackerPlayer.kills++;
            defenderPlayer.deaths++;
            if (assistedPlayer) {
                assistedPlayer.assists++;
            }

            if ((!game.settings || !game.settings.matchMode || game.settings.matchMode !== "MONSTERBALL" && game.settings.matchMode !== "CTF") && attackerTeam && attackerTeam !== "ANARCHY") {
                if (game.teamScore[attackerTeam]) {
                    game.teamScore[attackerTeam]++;
                } else {
                    game.teamScore[attackerTeam] = 1;
                }
            }
        }
    }

    //         #                 #     ##
    //         #                 #    #  #
    //  ###   ###    ###  ###   ###   #      ###  # #    ##
    // ##      #    #  #  #  #   #    # ##  #  #  ####  # ##
    //   ##    #    # ##  #      #    #  #  # ##  #  #  ##
    // ###      ##   # #  #       ##   ###   # #  #  #   ##
    /**
     * Processes the start game stat.
     * @param {string} ip The IP address of the server to update.
     * @param {object} data The start game data.
     * @returns {void}
     */
    static startGame(ip, data) {
        const game = Game.getGame(ip);

        game.server = data.server;
        game.settings = data;
        game.inLobby = data.type === "LobbyStatus";
        game.players = data.players && data.players.map((player) => new Player({
            name: player,
            kills: 0,
            assists: 0,
            deaths: 0,
            goals: 0,
            goalAssists: 0,
            blunders: 0,
            returns: 0,
            pickups: 0,
            captures: 0,
            carrierKills: 0,
            connected: data.time
        })) || [];
        game.countdown = data.countdown;
        game.elapsed = data.elapsed;

        let gameEl = document.getElementById(`game-${ip}`);

        if (!gameEl) {
            document.getElementById("games").insertAdjacentHTML("beforeend", /* html */`
                <div class="game" id="game-${ip}">
                </div>
            `);
            gameEl = document.getElementById(`game-${ip}`);
        }

        gameEl.innerHTML = DetailsView.get(game, true);

        const el = gameEl.querySelector(".time");

        if (!game.inLobby) {
            if (game.countdown) {
                new Countdown(game.countdown, el);
            } else if (game.elapsed || game.elapsed === 0) {
                new Elapsed(game.elapsed, el);
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", Home.DOMContentLoaded);
