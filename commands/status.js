
const trivialdb = require('trivialdb');
const ns = trivialdb.ns('mr-raffle');
const db = ns.db('raffle')
const { RichEmbed } = require('discord.js')
const { prefix, admins, color } = require('../config.json');
module.exports = {
	name: 'status',
	description: 'Usage: !status -- Check tickets awarded',
	execute(message, args) {

        if(db.get('running') == false) {
            message.reply('There is no active lottery at the moment')
            return
        }

        // CHECK THAT LOTTERY IS NOT OVER
        var now = new Date()
        var time = parseInt(db.get('drawdate')) - now.getTime()
        if(time < 1) {
            message.reply('This lottery is finished, drawing will occur soon.')
            return
        }
        
	let statustitle = null	
	let statusdesc  = null
	let numtickets  = null
	var prize = db.get('prize')
	let tickets =[]
	if(message.mentions.users.size > 1){
	    message.reply('Only one user at a time')
	    return
	}
        if(message.mentions.users.size) {
	    let mention = message.mentions.users.first()
	    let target = mention.id
            tickets = db.filter(function(val, key){
	        return val.user === target
	    })
	    statustitle = 'Entries to win: '+prize
	    numtickets  = tickets.length
	    statusdesc  = '<@'+target+'> has '+numtickets+' tickets'
	   
	}
	else {
            tickets = db.filter(function(val, key){
                return val.user
	    })
            statustitle = 'Total entries to win: '+prize
            numtickets  = tickets.length
            statusdesc  = 'There have been '+numtickets+' tickets given out'
	}


	//Contruct our output
        var date = new Date() 
	date.setTime(db.get('drawdate'))
        const embed = new RichEmbed()
	    .setColor(color)
	    .setTitle(statustitle)
	    .setDescription(statusdesc)
            .addField('Draw Date',date.toDateString(), true)
            .addField('Get A Ticket!', 'Play games, GM Games, and show up on time to earn tickets', true)
        message.channel.send(embed)
    }
}
