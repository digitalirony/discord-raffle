const trivialdb = require('trivialdb');
const ns = trivialdb.ns('mr-raffle');
const db = ns.db('raffle')

const { prefix, admins, color } = require('../config.json');
const { RichEmbed } = require('discord.js')

module.exports = {
	name: 'start',
	description: 'Start a Lottery',
	execute(message, args) {
        // CHECK IF A LOTTERY IS ALREADY IN PROCESS
        if(db.get('running') === true) {
            message.reply('A lottery is already in process');
            return
        }
        // CHECK IF MEMBER HAS PERMISSIONS TO START A LOTTERY
        if(!message.member.roles.some(r => admins.includes(r.name)) || !admins.includes(message.author.username)) {
            message.reply('Sorry, but only an admin can start a raffle');
            return
        }

        // ASSIGN VALUES TO SEND A MESSAGE BASED ON ARGUMENTS, OR TO DEFAULT
        // IF NO ARGUMENTS ARE GIVEN
        var days = (args[0]) ? parseInt(args[0]): 30
        var prize = (args[1]) ? args.slice(1).join(" ") : 'Undecided'

        // CALCULATES THE DRAW DATE BASED ON THE ARGUMENTS GIVEN
        // OR DEFAULTS TO 24 HOURS FROM CURRENT DATE
        
	var date = new Date()
        var drawdate = new Date(date)
	drawdate.setDate(date.getDate() +  days)

        // START LOTTERY SETTINGS AND PREVENT NEW LOTTERIES FROM BEING STARTED
        db.save('drawdate', drawdate.getTime())
        db.save('running', true)
	db.save('prize', prize)
	db.save('last',0)

        // CONSTRUCTS AND SENDS A RICHEMBED MESSAGE
        const embed = new RichEmbed()
            .setColor(color)
            .setTitle('Starting a new Lottery!')
            .setDescription("Prize: " + prize)
            .addField('Draw Date', 'Winner will be drawn on ' + drawdate.toDateString(), true)
            .addField('Get A Ticket!', 'Play games, GM Games, and show up on time to earn tickets', true)

        message.channel.send(embed)
	},
};
