export class HTTPStatus {
    urlParams = new URLSearchParams(location.search);
    debug;

    beatSaverURL = "https://api.beatsaver.com/maps/hash/";

    elapsedTimer;
    npsTimer;

    elapsed = 0;
    nps = 0;

    constructor(_debug) {
        if (this.urlParams.has("debug") && (this.urlParams.get("debug") === "HTTPStatus")) {
            this.debug = true;
        } else {
            this.debug = _debug;
        }

        if (this.debug) {
            console.log("%cWarning! Debug mode for HTTPStatus activated! You risk being spammed in the log console", "background-color:red");
            console.log("\n");
        }
    }


    eventHandler(value) {
        let dataParsed = JSON.parse(value.data);

        if (this.debug) {
            console.log("%cHTTPStatus.js log...", "background-color:blue");
            console.log("Data : ");
            console.log(dataParsed);
            console.log("\n");
        }

        switch (dataParsed.event) {
            case "hello":
                console.log("%cConnected to HTTPStatus Plugin", "background-color: green")
                console.log("%cBeat Saber " + dataParsed.status.game.gameVersion + " | HTTPStatus " + dataParsed.status.game.pluginVersion, "background-color: green");

                if (dataParsed.status.beatmap && dataParsed.status.performance) {
                    if (this.debug) {
                        console.log("%cHTTPStatus.js log...", "background-color:blue");
                        console.log("The song is already started !");
                        console.log("\n");
                    }

                    if (dataParsed.status.beatmap.paused != null) {
                        this.elapsed = (Math.floor((Date.now() - dataParsed.status.beatmap.start) / 1000) - Math.floor((Date.now() - dataParsed.status.beatmap.paused) / 1000)) - 1;
                    } else {
                        this.startTimers();
                    }

                    this.updateScore(dataParsed.status.performance.score);
                    this.setSongData(dataParsed.status.beatmap);

                    document.getElementById("box").style.opacity = 1;
                    document.getElementById("scoreInformations").style.opacity = 1;
                }
                break;
            case "songStart":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is started");
                    console.log("\n");
                }

                this.startSongeffect();
                // this.elapsed = Math.floor((Date.now() - dataParsed.status.beatmap.start) / 1000);
                // this.updateScore(dataParsed.status.performance.score);
                // this.setSongData(dataParsed.status.beatmap);

                //this.startTimers();

                //document.getElementById("box").style.opacity = 1;
                //document.getElementById("scoreInformations").style.opacity = 1;
                break;
            case "scoreChanged":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The score is changed");
                    console.log("\n");
                }

                //this.updateScore(dataParsed.status.performance.score);
                //this.performance(dataParsed.status.performance);
                break;
            case "noteCut":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("Data : ");
                    console.log(dataParsed);
                    console.log("\n");
                }

                this.bongocat(dataParsed.noteCut, true);
                this.performance(dataParsed.status.performance, true);
                break;
            case "noteMissed":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The note is missed");
                    console.log("\n");
                }

                this.bongocat(dataParsed.noteCut, true);
                this.performance(dataParsed.status.performance, true);
                break;
            case "pause":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is paused");
                    console.log("\n");
                }
                this.pauseEffect();
                //this.stopTimers();
                break;
            case "resume":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is resumed");
                    console.log("\n");
                }
                this.resumeEffect();
                //this.elapsed++;
                //this.startTimers();
                break;
            case "menu":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("In menu");
                    console.log("\n");
                }

                //this.stopTimers();

                //document.getElementById("box").style.opacity = 0;
                //document.getElementById("scoreInformations").style.opacity = 0;
                break;
            default:
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("%cEvent not supported", "background-color: red");
                    console.log("\n");
                }
                break;
        }
    }

    /**
     * Other function
     */
    startSongeffect() {
        const image = document.getElementsByClassName("loading")[0];
        image.src = "./image/loading.gif";
        setTimeout(() => {
            image.src = "./image/loading.png";
        }, 2000);

        let audio = new Audio('./sound/start.mp3');
        audio.play();
    }
    pauseEffect() {
        console.log("pause!");
        let audio = new Audio('./sound/pause.ogg');
        audio.play();
    }
    resumeEffect() {
        console.log("resume!");

    }
    updateScore(score) {

    }
    bongocat(data, isNote = false) {
        //여기다가 고양이 치는거
        let nowBongocat = 1;
        switch (data.noteCutDirection) {
            case "UpLeft":
            case "Up":
            case "UpRight":
            case "Left":
                if (data.saberType == "SaberA") {
                    while ($("#bongoCat" + nowBongocat).css("display") != "none") {
                        nowBongocat += 1;
                    }
                    if (nowBongocat == 1 || nowBongocat == 2) {
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 3) {
                        nowBongocat = 1;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 4) {
                        nowBongocat = 2;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    }
                } else if (data.saberType == "SaberB") {
                    while ($("#bongoCat" + nowBongocat).css("display") != "none") {
                        nowBongocat += 1;
                    }
                    if (nowBongocat == 1 || nowBongocat == 3) {
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 2) {
                        nowBongocat = 1;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 4) {
                        nowBongocat = 3;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    }
                }

                break;

            case "Down":
            case "DownRight":
            case "DownLeft":
            case "Right":
                if (data.saberType == "SaberA") {
                    while ($("#bongoCat" + nowBongocat).css("display") != "none") {
                        nowBongocat += 1;
                    }
                    if (nowBongocat == 3 || nowBongocat == 4) {
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 1) {
                        nowBongocat = 3;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 2) {
                        nowBongocat = 4;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    }
                } else if (data.saberType == "SaberB") {
                    while ($("#bongoCat" + nowBongocat).css("display") != "none") {
                        nowBongocat += 1;
                    }
                    if (nowBongocat == 2 || nowBongocat == 4) {
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 1) {
                        nowBongocat = 2;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    } else if (nowBongocat == 3) {
                        nowBongocat = 4;
                        $("#bongoCat" + nowBongocat).css("display", "block");
                        for (let i = 1; i < 5; i++) {
                            if (nowBongocat == i) {
                                continue;
                            }
                            $("#bongoCat" + i).css("display", "none");
                        }
                    }
                }
                break;
            case "Any":


                break;

            default:
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("%cEvent not supported", "background-color: red");
                    console.log("\n");
                }
                break;
        }
    }
    performance(data, isNote = false) {
        if (isNote) {
            if (data.combo == 0) {
                return;
            } else if (data.combo == 50) {
                // let audio = new Audio('/html/inc/overlay/sound/comboburst-0.wav');
                // audio.play();
            } else if ((data.combo / 100) % 1 === 0) {
                // let audio = new Audio('/html/inc/overlay/sound/comboburst-' + data.combo + '.wav');
                // audio.play();
            }
        }
    }

    setSongData(data) {
        fetch(this.beatSaverURL + data.songHash).then(function(response) {
            response.json().then(function(json) {
                $("#mapIdJS").text(json.id);
            });
        });

    }

    formatTime(value) {
        let secs = value % 60;
        let mins = Math.floor(value / 60);

        return mins + ":" + secs.toString().padStart(2, "0");
    }

    startTimers() {
        this.elapsedTimer = setInterval(() => {
            this.elapsed++;
            $("#mapDurationElapsed").text(this.formatTime(this.elapsed));
        }, 1000);

        this.npsTimer = setInterval(() => {
            $("#calcNPSValue").text(this.nps);
        }, 1000);
    }

    stopTimers() {
        clearInterval(this.elapsedTimer);
    }
}