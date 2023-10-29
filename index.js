const Discord = require('discord.js')
const { Embedbuilder, Events, GatewayIntentBits, ActivityType } = require('discord.js')
const fs = require('fs')
const { readdirSync } = require('fs')
const settings = require('./settings.json')
require('dotenv').config()
const client = new Discord.Client({
	allowedMentions: { parse: ["users", "roles"], repliedUser: true },
	intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.MessageContent,
	]
})

client.slashCommands = new Discord.Collection()

const slashCommandsArray = []
if(settings.language === "de") {
readdirSync(`${process.cwd()}/Language/de-lang`).forEach((dir) => {
	const commands = readdirSync(`${process.cwd()}/Language/de-lang/${dir}`).filter((file) => file.endsWith(".js"))
	for (let file of commands) {
		let pull = require(`${process.cwd()}/Language/de-lang/${dir}/${file}`)
		if (pull.name) {
			client.slashCommands.set(pull.name, pull)
			slashCommandsArray.push(pull)
		} else {
			continue
		}
	}
})
} else if(settings.language === "en") {
readdirSync(`${process.cwd()}/Language/en-lang`).forEach((dir) => {
	const commands = readdirSync(`${process.cwd()}/Language/en-lang/${dir}`).filter((file) => file.endsWith(".js"))
	for (let file of commands) {
		let pull = require(`${process.cwd()}/Language/en-lang/${dir}/${file}`)
		if (pull.name) {
			client.slashCommands.set(pull.name, pull)
			slashCommandsArray.push(pull)
		} else {
			continue
		}
	}
})
} else { return console.log("Please enter a valid language in the settings.json!") }

if(settings.language === "de") {
client.on('ready', () => {
	client.application.commands.set(slashCommandsArray).then(() => { console.log("Slash Commands wurden erfolgreich registriert!")
	console.log(`Erfolgreich als ${client.user.username} eingeloggt!`)  })
})
} else if(settings.language === "en") {
	client.on('ready', () => {
		client.application.commands.set(slashCommandsArray).then(() => { console.log("Slash Commands were successfully registered!")
		console.log(`Successfully logged in as ${client.user.username}!`)  })
		})
} else { return console.log("Please enter a valid language in the settings.json!") }

if(settings.language === "de") {
client.on(Events.InteractionCreate, interaction => {
	try {
	if(interaction.command) {
		const cmd = client.slashCommands.get(interaction.commandName)
		if(!cmd) return interaction.reply({ content: "Oupss, Es sieht so aus also würde der Programmierer `devschlumpfi` dein Command nicht finden", ephemeral: true })
		
		const args = [];

		for(let option of interaction.options.data) {
			if(option.type === "SUB_COMMAND") {
				if(option.name) args.push(option.name)
				option.options?.forEach((x) => {
					if(x.value) args.push(x.value)
				})
			} else if(option.value) args.push(option.value)
		}
		
		if(!settings.ownerids.includes(interaction.user.id)) return interaction.reply({ content: "Oupss, Es sieht so aus also wärst du nicht der Besitzer dieses Bots!", ephemeral: true })

		if(settings.onlydm === true) {
			if(interaction.guild) return interaction.reply({ content: "Oupss, Du kannst diesen Command nur auf einem Server ausführen!", ephemeral: true })
		} else {
			if(!interaction.guild) return interaction.reply({ content: "Oupss, Du kannst diesen Command nur in einer Privatnachricht ausführen!", ephemeral: true })
		if(!interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
			interaction.member = interaction.guild.members.cache.get(interaction.user.id)
			return interaction.reply({ content: "Oupss, Ich habe nicht die benötigten Rechte um diesen Command auszuführen!", ephemeral: true })
		}
	}

		cmd.run(client, interaction, args, "/")

		if(settings.logsystem === true) {
			console.log(`Slash Command: "/${interaction.commandName} ${interaction.options.getSubcommand()}" wurde ausgeführt von ${interaction.user.tag} (${interaction.user.id})`)
		}
	}
} catch (error) { }
})
} else if(settings.language === "en") {
	client.on(Events.InteractionCreate, interaction => {
		try {
		if(interaction.command) {
			const cmd = client.slashCommands.get(interaction.commandName)
			if(!cmd) return interaction.reply({ content: "Oupss, It looks like the programmer `devschlumpfi` can't find your command", ephemeral: true })
			
			const args = [];
	
			for(let option of interaction.options.data) {
				if(option.type === "SUB_COMMAND") {
					if(option.name) args.push(option.name)
					option.options?.forEach((x) => {
						if(x.value) args.push(x.value)
					})
				} else if(option.value) args.push(option.value)
			}

			if(!settings.ownerids.includes(interaction.user.id))  return interaction.reply({ content: "Oupss, It looks like you are not the owner of this bot!", ephemeral: true })
	
			if(settings.onlydm === true) {
				if(interaction.guild) return interaction.reply({ content: "Oupss, You can only execute this command on a server!", ephemeral: true })
			} else {
				if(!interaction.guild) return interaction.reply({ content: "Oupss, You can only execute this command in a private message!", ephemeral: true })
			if(!interaction.guild.members.me.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
				interaction.member = interaction.guild.members.cache.get(interaction.user.id)
				return interaction.reply({ content: "Oupss, I don't have the required permissions to execute this command!", ephemeral: true })
			}
		}
	
			cmd.run(client, interaction, args, "/")
	
			if(settings.logsystem === true) {
				console.log(`Slash Command: "/${interaction.commandName} ${interaction.options.getSubcommand()}" was executed by ${interaction.user.tag} (${interaction.user.id})`)
			}
		}
	} catch (error) { }
	})
} else { return console.log("Please enter a valid language in the settings.json!") }


client.login(process.env.TOKEN)

process.on('uncaughtException', (error) => {
	console.log({ })
  });
  
  process.on('unhandledRejection', (reason, promise) => {
	console.log({ })
  });

/**********************************************************
 * @INFO
 * Progammiert von: devschlumpfi
 * @INFO
 * Bitte erwähne mich wenn du diesen Code nutzt!
 * @INFO
 *********************************************************/