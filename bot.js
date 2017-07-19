/*jslint node: true */

var config = require('./config');
console.log('Config loaded');
var commands = require('./commands');
console.log('Commands module loaded');
var factory = require('irc-factory'),
    api = new factory.Api();
console.log('IRC module loaded');
var wildcard = require('node-wildcard');
console.log('Wildcard module loaded');
var download = require('download-file');
console.log('download-file module loaded');
var http = require('http');
var fs = require('fs');

var url = "http://idlerpg.org/rawplayers3.php";
var myArray;
var options = {
    filename: "players.txt"
};
var victim;
var numberPattern = /\d+/g;
var teamid;

var Attacktimer;
var Fighttimer;
var Slaytimer;
var Chaltimer;
var Updatetimer;
var Deposittimer;

var adminbot = api.createClient('admin', {
    nick: config.admin.nick,
    user: config.admin.user,
    server: config.admin.server,
    realname: config.admin.realname,
    password: config.admin.password,
    port: config.admin.port,
    secure: false
});

var client = api.createClient('bot', {
    nick: config.bot.nick,
    user: config.bot.user,
    server: config.bot.server,
    realname: config.bot.realname,
    password: config.bot.password,
    port: config.bot.port,
    secure: false
});

api.hookEvent('admin', 'registered', function (message) {
    adminbot.irc.join(config.admin.channel);
    console.log('Registered on IRC with adminbot');

});

api.hookEvent('bot', 'privmsg', function (message) {
    if (message.nickname === config.idlerpg.nickname && message.target === config.bot.nick) {
        adminbot.irc.privmsg(config.admin.channel, message.message);
    }
});

api.hookEvent('bot', 'registered', function (message) {
    client.irc.join(config.idlerpg.channel);
    console.log('Registered on IRC logging in on multirpg');
    client.irc.privmsg(config.idlerpg.nickname, 'login ' + config.bot.nick + ' ' + config.bot.password);
});

api.hookEvent('bot', 'notice', function (message) {
    if (message.nickname === config.idlerpg.nickname) {
        if (message.message.search('no such account name') !== -1) {

            client.irc.privmsg(config.idlerpg.nickname, 'register ' + config.bot.nick + ' ' + config.bot.password + ' ' + config.bot.realname);
        }
        if (message.message.search('Wrong password.') !== -1) {
            console.log('Wrong password to idlerpg!!!!');
            adminbot.irc.privmsg(config.admin.channel, 'Wrong password to idlerpg...check your settings in config.js!!!!');
            process.exit();
        }
        if (message.message.search('you are already online') !== -1) {
            client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
        }
    }
});

process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    adminbot.irc.privmsg(config.admin.channel, "Gracefully shutting down from SIGINT (Ctrl-C) Bye bye!");
    process.exit();
});


api.hookEvent('bot', 'privmsg', function (message) {
    if (message.nickname === config.idlerpg.nickname && message.target === config.bot.nick) {
        if (wildcard(message.message, 'level*gold*bank*slayttl*')) {
            var arr = message.message.split(" "),
                level = Number(arr[1]),
                gold = Number(arr[3]),
                bank = Number(arr[5]),
                team = Number(arr[7]),
                sum = Number(arr[9]),
                fights = Number(arr[11]),
                bets = Number(arr[13]),
                powerpots = Number(arr[15]),
                luckpots = Number(arr[17]),
                align = arr[19],
                attackttl = Number(arr[21]),
                challengettl = Number(arr[23]),
                slayttl = Number(arr[25]),
                ttl = Number(arr[27]),
                hero = Number(arr[29]),
                hlevel = Number(arr[31]),
                engineer = Number(arr[33]),
                englevel = Number(arr[35]),
                ring = Number(arr[37].match(numberPattern)),
                amulet = Number(arr[39].match(numberPattern)),
                charm = Number(arr[41].match(numberPattern)),
                weapon = Number(arr[43].match(numberPattern)),
                helm = Number(arr[45].match(numberPattern)),
                tunic = Number(arr[47].match(numberPattern)),
                gloves = Number(arr[49].match(numberPattern)),
                shield = Number(arr[51].match(numberPattern)),
                leggings = Number(arr[53].match(numberPattern)),
                boots = Number(arr[55].match(numberPattern));
            teamid = Number(arr[7]);
            if (gold > 40) {
                var w = gold - 40;
                var m = 'bank deposit ' + w;
                clearInterval(Deposittimer);
                Deposittimer = setInterval(function () {
                    client.irc.privmsg(config.idlerpg.nickname, m);
                    clearInterval(Deposittimer);
                }, 5000);
            }
            if (gold < 40 && bank > 20) {
                client.irc.privmsg(config.idlerpg.nickname, 'bank withdraw 20');
            }
            if (hlevel === 9 && bank >= 220 && bets === 5) {
                client.irc.privmsg(config.idlerpg.nickname, 'bank withdraw 100');
                client.irc.privmsg(config.idlerpg.nickname, 'upgrade all 5');
            }
            if (level >= 10) {
                clearInterval(Attacktimer);
                Attacktimer = setInterval(function () {
                    adminbot.irc.privmsg(config.admin.channel, 'Attacking Monster ' + commands.Creeps(level, sum));
                    client.irc.privmsg(config.idlerpg.nickname, 'align priest');
                    client.irc.privmsg(config.idlerpg.nickname, 'attack ' + commands.Creeps(level, sum));
                    client.irc.privmsg(config.idlerpg.nickname, 'align ' + config.bot.align);
                    clearInterval(Attacktimer);
                }, attackttl * 1000);
            }
            if (level >= 40) {
                clearInterval(Slaytimer);
                Slaytimer = setInterval(function () {
                    adminbot.irc.privmsg(config.admin.channel, 'Sending slay ' + commands.Monsters(sum));
                    client.irc.privmsg(config.idlerpg.nickname, 'align priest');
                    client.irc.privmsg(config.idlerpg.nickname, 'slay ' + commands.Monsters(sum));
                    client.irc.privmsg(config.idlerpg.nickname, 'align ' + config.bot.align);
                    clearInterval(Slaytimer);
                }, slayttl * 1000);

            }
            if (level >= 35) {
                clearInterval(Chaltimer);
                Chaltimer = setInterval(function () {
                    adminbot.irc.privmsg(config.admin.channel, 'Sending Challenge');
                    client.irc.privmsg(config.idlerpg.nickname, 'align priest');
                    client.irc.privmsg(config.idlerpg.nickname, 'challenge');
                    client.irc.privmsg(config.idlerpg.nickname, 'align ' + config.bot.align);
                    clearInterval(Chaltimer);
                }, challengettl * 1000);
            }

            if (level >= 10 && fights === 0 && attackttl > 10 && gold === 40) {
                clearInterval(Fighttimer);
                Fighttimer = setInterval(function () {
                    adminbot.irc.privmsg(config.admin.channel, 'Sending Fight');
                    bestfight(level);
                    clearInterval(Fighttimer);
                }, 35000);

            }
            if (level >= 15 && engineer === 0 && bank >= 1000) {
                client.irc.privmsg(config.idlerpg.nickname, 'bank withdraw 1000');
                client.irc.privmsg(config.idlerpg.nickname, 'hire engineer');
            }
            if (engineer === 1 && bank >= 200 && englevel < 9) {
                client.irc.privmsg(config.idlerpg.nickname, 'bank withdraw 200');
                client.irc.privmsg(config.idlerpg.nickname, 'engineer level');
            }
            if (englevel === 9 && hero === 0 && bank >= 1000) {
                client.irc.privmsg(config.idlerpg.nickname, 'bank withdraw 1000');
                client.irc.privmsg(config.idlerpg.nickname, 'summon hero');
            }
            if (hero === 1 && hlevel < 9 && bank >= 200) {
                client.irc.privmsg(config.idlerpg.nickname, 'bank withdraw 200');
                client.irc.privmsg(config.idlerpg.nickname, 'hero level');
            }
            if (level >= 30 && bank >= 100 && bets < 5) {
                adminbot.irc.privmsg(config.admin.channel, 'Sending bet');
                bestbet();
            }
        }
    }
});

api.hookEvent('bot', 'privmsg', function (message) {
    if (message.nickname === config.idlerpg.nickname && message.target === config.idlerpg.channel) {
        if (wildcard(message.message, '*' + config.bot.nick + '*')) {
            clearInterval(Updatetimer);
            Updatetimer = setInterval(function () {
                client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
                clearInterval(Updatetimer);
            }, 5000);
        }
        if (wildcard(message.message, '* automatically logged in: *')) {
            clearInterval(Updatetimer);
            Updatetimer = setInterval(function () {
                client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
                clearInterval(Updatetimer);
            }, 5000);
        }
    }
});

api.hookEvent('bot', 'privmsg', function (message) {
    if (message.nickname === config.idlerpg.nickname && message.target === config.bot.nick) {
        if (wildcard(message.message, 'You have deposited * gold into the bank.')) {
            clearInterval(Updatetimer);
            Updatetimer = setInterval(function () {
                client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
                clearInterval(Updatetimer);
            }, 5000);
        }
        if (wildcard(message.message, 'You have withdrawn * gold from the bank.')) {
            clearInterval(Updatetimer);
            Updatetimer = setInterval(function () {
                client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
                clearInterval(Updatetimer);
            }, 5000);

        }
        if (wildcard(message.message, 'Your Engineer level is now *')) {
            clearInterval(Updatetimer);
            Updatetimer = setInterval(function () {
                client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
                clearInterval(Updatetimer);
            }, 5000);
        }
        if (wildcard(message.message, 'Your Hero level is now *')) {
            clearInterval(Updatetimer);
            Updatetimer = setInterval(function () {
                client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
                clearInterval(Updatetimer);
            }, 5000);
        }
        if (wildcard(message.message, '*upgraded its * points to level * and has * gold left.')) {
            clearInterval(Updatetimer);
            Updatetimer = setInterval(function () {
                client.irc.privmsg(config.idlerpg.nickname, 'rawstats2');
                clearInterval(Updatetimer);
            }, 5000);
        }
        if (wildcard(message.message, '*You are not logged in*')) {
            client.irc.privmsg(config.idlerpg.nickname, 'login ' + config.bot.nick + ' ' + config.bot.password);
        }
    }
});

function bestfight(level) {
    var LineReader = require('linereader');
    var myArray;
    var odds = 999999;
    var lr = new LineReader('http://idlerpg.org/rawplayers3.php', {
        encoding: 'utf8',
        skipEmptyLines: true
    });


    lr.on('error', function (err) {
        console.log(err);
        lr.close();
    });

    lr.on('line', function (lineno, line) {
        var myRe = /^(rank \d+ char ([^\x20]+) network ([^\x20]+) userhost ([^\x20]+) level (\d+) created \d+ lastlogin \d+ online (.) sex \S+ class \{[^\}]+\} team (\d+) ttl \d+ regentm \d+ challengetm \d+ slaytm \d+ idled \d+ x_pos \d+ y_pos \d+ sum (\d+) amulet \S+ charm \S+ helm \S+ boots \S+ gloves \S+ ring \S+ leggings \S+ shield \S+ tunic \S+ weapon \S+ align (.) alignchanged . powerpots \d+ luckpots \d+ fights \d+ bets \d+ bwon \d+ blost \d+ badd \d+ bminus \d+ hero (.) hlevel (\d+))/;
        myArray = myRe.exec(line);
        var realsum;
        console.log('haha1')
        if (teamid === 0) {
            teamid = 1;
        }
        console.log('haha2')
        if (Number(myArray[6]) == 1 && Number(myArray[7]) != teamid && level <= Number(myArray[5]) && myArray[2] != config.bot.nick) {
            console.log('haha3')
            if (myArray[9] === 'e') {
                var c = 0.1 * Number(myArray[8]);
                realsum = Number(myArray[8]) - c;
            }
            if (myArray[9] === 'n') {
                realsum = Number(myArray[8]);
            }
            if (myArray[9] === 'g') {
                var c = 0.1 * Number(myArray[8]);
                realsum = Number(myArray[8]) + c;
            }
            if (realsum < odds) {
                odds = realsum;
                victim = myArray[2];

            }
        }
    });

    lr.on('end', function () {
        console.log("End");
        client.irc.privmsg(config.idlerpg.nickname, 'align priest');
        client.irc.privmsg(config.idlerpg.nickname, 'fight ' + victim);
        client.irc.privmsg(config.idlerpg.nickname, 'align ' + config.bot.align);
    });

};


function bestbet() {
    var players = [];
    var LineReader = require('linereader');
    var myArray;
    var lr = new LineReader('http://idlerpg.org/rawplayers3.php', {
        encoding: 'utf8',
        skipEmptyLines: true
    });


    lr.on('error', function (err) {
        console.log(err);
        lr.close();
    });

    lr.on('line', function (lineno, line) {
        var myRe = /^(rank \d+ char ([^\x20]+) network ([^\x20]+) userhost ([^\x20]+) level (\d+) created \d+ lastlogin \d+ online (.) sex \S+ class \{[^\}]+\} team (\d+) ttl \d+ regentm \d+ challengetm \d+ slaytm \d+ idled \d+ x_pos \d+ y_pos \d+ sum (\d+) amulet \S+ charm \S+ helm \S+ boots \S+ gloves \S+ ring \S+ leggings \S+ shield \S+ tunic \S+ weapon \S+ align (.) alignchanged . powerpots \d+ luckpots \d+ fights \d+ bets \d+ bwon \d+ blost \d+ badd \d+ bminus \d+ hero (.) hlevel (\d+))/;
        myArray = myRe.exec(line);
        if (Number(myArray[6]) === 1 && Number(myArray[5]) >= 30) {
            players.push({
                name: myArray[2],
                level: Number(myArray[5]),
                sum: Number(myArray[8]),
                align: myArray[9],
                hero: Number(myArray[10]),
                hlevel: Number(myArray[11]),
                team: Number(myArray[7])
            });
        }
    });

    lr.on('end', function () {
        console.log("End");
        var playersource;
        var playerdest;
        var bestratio = 0;
        var bestsource;
        var bestdest;

        var bestratio2 = 0;
        var bestsource2;
        var bestdest2;
        players.forEach(function (source) {
            if (source.level < 30) {
                return;
            };
            players.forEach(function (dest) {
                var sourcerealsum;
                var destrealsum;
                if (source.align === 'e') {
                    var c = 0.1 * source.sum;
                    sourcerealsum = source.sum - c;
                }
                if (source.align === 'n') {
                    sourcerealsum = source.sum;
                }
                if (source.align === 'g') {
                    var c = 0.1 * source.sum;
                    sourcerealsum = source.sum + c;
                }
                if (source.hero === 1) {
                    var c = 0.01 * source.hlevel;
                    var d = c * sourcerealsum;
                    sourcerealsum = sourcerealsum + d;
                }
                if (dest.align === 'e') {
                    var c = 0.1 * dest.sum;
                    destrealsum = dest.sum - c;
                }
                if (dest.align === 'n') {
                    destrealsum = dest.sum;
                }
                if (dest.align === 'g') {
                    var c = 0.1 * dest.sum;
                    destrealsum = dest.sum + c;
                }
                if (dest.hero === 1) {
                    var c = 0.01 * dest.hlevel;
                    var d = c * destrealsum;
                    destrealsum = destrealsum + d;
                }
                if (source.level > dest.level) {
                    return;
                };
                if (source.name === dest.name) {
                    return;
                };
                if (sourcerealsum < destrealsum) {
                    return;
                };
                var ratio = sourcerealsum / destrealsum;
                if (ratio > bestratio) {
                    bestratio2 = bestratio;
                    bestsource2 = bestsource;
                    bestdest2 = bestdest;

                    bestratio = ratio;
                    bestsource = source.name;
                    bestdest = dest.name;
                }
            });
        });
        if (bestsource == "" || bestdest == "") {
            return;
        };
        client.irc.privmsg(config.idlerpg.nickname, 'bank withdraw 100');
        client.irc.privmsg(config.idlerpg.nickname, 'bet ' + bestsource + ' ' + bestdest + ' 100');
    });
}
console.log('All things is loaded, Good Luck!');
