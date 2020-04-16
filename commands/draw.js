const trivialdb = require('trivialdb');
const ns = trivialdb.ns('mr-raffle');
const db = ns.db('raffle')

const { admins, color } = require('../config.json')
const { RichEmbed } = require('discord.js')
function randomize(number) {
    let result = Math.floor(Math.random() * (number - 1) + 1)
    return result
}

module.exports = {
	name: 'draw',
	description: 'Draw the winning number of the lottery',
	execute(message, args) {
        // CHECK IF THERE IS AN ACTIVE LOTTERY
        if(db.get('running') === false) {
            message.reply('There is no active lottery right now');
            return
        }

        // CHECK IF MEMBER HAS PERMISSIONS TO DRAW A WINNER
        if(!message.member.roles.some(r => admins.includes(r.name)) || !admins.includes(message.author.username)) {
            message.reply('Sorry, but only an admin can draw a winner');
            return
        }
	let winners = 1
        if(args.length){
           winners = parseInt(args[0])
	}
        // GENERATE LIST OF TICKET HOLDERS
		//
        let tickets = []
	tickets = db.filter(function(val, key)
	{
	        return val.user 
        })
        // CHECK THAT THERE ARE TICKETS TO DRAW FROM
        if(tickets.length < 1) {
            message.reply('There were no numbers in the pool to choose from.')
            db.save('running',false)
            return
        }
        // SELECTS RANDOM WINNER FROM TICKET POOL
        var prize = db.get('prize')
        let winnertickets = ""
        let winnermembers = ""
	let i = 1
        while ( i <= winners){
	    let rand = randomize(tickets.length)
	    let memberpick = ""
	    let ticketpick = null
            for (let [key, value] of Object.entries(tickets)) {
	        if (value.id === rand){
	            ticketpick = rand
		    memberpick = value.user
	        }
            }
            if (!winnermembers.includes(memberpick)){
	      	winnertickets += ticketpick+", "
		winnermembers += "<@"+memberpick+"> "
		i++
	    }    
	    
	}
        // CONSTRUCTS AND SENDS A RICHEMBED MESSAGE
        const embed = new RichEmbed()
            .setColor(color)
            .setTitle('Raffle Winners')
            .setDescription('Congratulations to those who won:'+prize)
            .addField('Winning Tickets', winnertickets, true)
	    .addField('Winning Members', winnermembers,true)
        message.channel.send(embed)

        // CLOSING LOTTERY
       db.clear()
       db.save('running',false)
    }
}
