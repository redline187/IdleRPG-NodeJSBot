/*jslint node: true */
var config = {};
config.admin = {};
config.bot = {};
config.idlerpg = {};

config.idlerpg.nickname = 'multirpg';
config.idlerpg.channel = '#multirpg';

config.admin.nick = 'some-nick'; // Adminbot nickname
config.admin.user = 'some-identd'; // Adminbot identd
config.admin.server = 'irc.gamesurge.net'; //irc server
config.admin.channel = '#myadminchannel'; //Admin channel to monitor things.
config.admin.realname = 'MultiRPG NodeJSBot'; //adminbot Realname
config.admin.password = 'somepassword'; //irc server password
config.admin.port = 6667; //irc server port


config.bot.nick = 'botnick'; //bot Nickname
config.bot.user = 'botidentd'; // bot identd
config.bot.align = 'priest'; //align
config.bot.server = 'irc.gamesurge.net'; //irc server
config.bot.realname = 'MultiRPG NodeJSBot'; //bot realname also used for char class
config.bot.password = 'somepassword'; // irc server password also used for bot password
config.bot.port = 6667; //irc server port


module.exports = config;
