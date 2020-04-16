const trivialdb = require('trivialdb');
const ns = trivialdb.ns('mr-raffle');
const db = ns.db('raffle')

const { prefix, admins, color } = require('../config.json');
module.exports = {
	name: 'addticket',
	description: 'Usage: !addticket <user> <number of tickets> -- Give a user a ticket (GM only)',
	execute(message, args) {

	if(!message.member.roles.some(r => admins.includes(r.name)) || !admins.includes(message.author.username)) {
	    message.reply('Sorry, but only an a GM can add tickets');
	    return
	}

	// CHECK THAT A LOTTERY IS RUNNING
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

        // CHECK THAT MEMBER IS CHOOSING A NUMBER

        if(args.length < 1) {
            message.reply('You need to supply a username!')
            return
        }

        // ser user, and figure out first ticket
        let ticketuser = message.mentions.users.first()
        let ticketnum = (args[1]) ? args[1] : 1
        let firstticket = db.get("last")+1
	let ticket = null
        // CHECK THAT CHOSEN NUMBER IS WITHIN RANGE
        if(ticketnum < 0 )
        {
            message.reply('Sorry, but you need to add at least one ticket!')
	    return
        }
        // STORE THE MEMBER'S TICKET NUMBER AND WISH THEM GOOD LUCK
	let user = ticketuser.username
        for ( ticket = firstticket; ticket <= firstticket + (ticketnum-1); ticket++ ){
            db.save(ticket, { user: ticketuser.id})
            message.channel.send('User '+ user +' has been assigned ticket number ' + ticket + '.')
	}
        db.save("last",ticket-1)
    }
}
