const Discord = require('discord.js')
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder, ChannelType } = require('discord.js')
const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')
const pm2 = require('pm2')
const fs = require('fs')
const settings = require('../../../settings.json')
module.exports = {
    name: "pm2",
    description: "Pm2 Befehle",
    default_member_permission: PermissionFlagsBits.Administrator,
    options: [
        {
            name: "list",
            description: "Zeigt alle Pm2 Prozesse an",
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "manage",
            description: "Verwaltet einen Pm2 Prozess",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'id',
                    description: 'Die Id des Pm2 Prozesses!',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
    ],
run: async (client, interaction) => {
   if(!settings.ownerids.includes(interaction.user.id)) return interaction.reply({ content: "Oupss, Es sieht so aus also wärst du nicht der Besitzer dieses Bots!", ephemeral: true })
  const getProcessInfo = () => {
    return new Promise((resolve, reject) => {
      pm2.list((err, processList) => {
        if (err) return reject(err);
        resolve(processList.map(proc => ({
          name: proc.name,
          id: proc.pm_id,
          status: proc.pm2_env.status,
          cpu: proc.monit.cpu,
          memory: proc.monit.memory,
          uptime: proc.pm2_env.pm_uptime,
          restarts: proc.pm2_env.restart_time,
          lastRestart: proc.pm2_env.pm_uptime ? Date.now() - proc.pm2_env.pm_uptime : null
        })));
      });
    });
  };
    if (interaction.options.getSubcommand() === 'list') {
        const pageSize = 5;
        let currentPage = 0;
   
        

        const updateEmbed = async (interaction, processInfo) => {
          const totalPages = Math.ceil(processInfo.length / pageSize);
          const startIndex = currentPage * pageSize;
          const endIndex = startIndex + pageSize;
          const processInfoForPage = processInfo.slice(startIndex, endIndex);
          
          const description = processInfoForPage.length > 0 ? 
            processInfoForPage.map(p => `\`\`\`yaml\nName & ID: ${p.name} - (${p.id})\nUptime: ${p.status} ${"- "+ formatUptime(p.uptime) || " "} \nCPU: ${p.cpu.toFixed(1)}%\nMemory: ${(p.memory / 1024 / 1024).toFixed(2)} MB\nLetzter Neustart: ${formatUptime(p.uptime) || "Nicht Verfügbar"}\`\`\``).join('\n') : 
            'Oupss, es sieht so aus, als ob keine Prozesse ausgeführt werden.';
          
          const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.username + ' x Pm2 Manager', iconURL: client.user.avatarURL() })
            .setDescription(description + "\n➜ Fehler? oder Hilfe? --> https://github.com/devschlumpfi/Discord-Pm2-Manager")
            .setColor('Blue')
            .setFooter({ text: `Seite ${currentPage + 1} von ${totalPages}  -  Made by devschlumpfi with ❤️` });
        
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('prevprocess')
                .setLabel('Vorherige')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('👈')
                .setDisabled(currentPage === 0),
              new ButtonBuilder()
                .setCustomId('nextprocess')
                .setLabel('Nächste')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("👉")
                .setDisabled(currentPage === totalPages - 1 || processInfo.length === 0)
            );
          try {
            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
          } catch (error) {
            await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
          }
        
        };        
          
          client.on('interactionCreate', async interaction => {
            if (interaction.isButton()) {
              const processInfo = await getProcessInfo();
              if (interaction.customId === 'prevprocess') {
                currentPage--;
                await updateEmbed(interaction, processInfo);
              } else if (interaction.customId === 'nextprocess') {
                currentPage++;
                await updateEmbed(interaction, processInfo);
              }
            }
          });

          const processInfo = await getProcessInfo();

          await updateEmbed(interaction, processInfo);


    } else if(interaction.options.getSubcommand() === 'manage') {
      const procIdString = interaction.options.getString('id');
      const id = parseInt(procIdString, 10);

      if (isNaN(id)) return interaction.reply({ content: 'Oupss, Es sieht so aus als hättest du keine gültige Prozess-ID eingeben!', ephemeral: true });
    

      const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('restart')
          .setLabel('Neustart')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🔄'),
        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('Stop')
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🛑"),
        new ButtonBuilder()
          .setCustomId('start')
          .setLabel('Start')
          .setStyle(ButtonStyle.Success)
          .setEmoji("▶️"),
        new ButtonBuilder()
          .setCustomId('logs')
          .setLabel('Logs')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("📝"),
        new ButtonBuilder()
          .setCustomId('delete')
          .setLabel('Löschen')
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🗑️")
      );
      interaction.reply({
      embeds: [new EmbedBuilder().setAuthor({ name: client.user.username + ' × Pm2 Manager', iconURL: client.user.avatarURL() })
      .setDescription("➤ Um deinen Pm2 Prozess zu verwalten, klicke auf den Button!\n- Der [Discord-Pm2-Manager](https://github.com/devschlumpfi/Discord-Pm2-Manager) wurde von [devschlumpfi](https://github.com/devschlumpfi) programmiert!")],
      components: [row],
      ephemeral: true })

      client.on('interactionCreate', async interaction => {
        if (interaction.isButton()) {
          try {
          if (interaction.customId === 'restart') {
            pm2.restart(id, (err) => {
              row.components.forEach(button => {
                button.setDisabled(true);
              });
              if (err) return interaction.update({ content:  `Oupss ${interaction.user}, Es ist ein Fehler aufgetreten!`, components: [row], ephemeral: true });
              interaction.update({ content:  `${interaction.user}, Ich habe die **ID:** \`${id}\` Erfolgreich neugestartet!`, components: [row], ephemeral: true });
            });
          } else if (interaction.customId === 'stop') {
            pm2.stop(id, (err) => {
              row.components.forEach(button => {
                button.setDisabled(true);
              });
              if (err) return interaction.update({ content:  `Oupss ${interaction.user}, Es ist ein Fehler aufgetreten!`, components: [row], ephemeral: true });
              interaction.update({ content:  `${interaction.user}, Ich habe die **ID:** \`${id}\` Erfolgreich gestoppt!`, components: [row], ephemeral: true });
            });
          } else if (interaction.customId === 'start') {
            pm2.start(id, (err) => {
              row.components.forEach(button => {
                button.setDisabled(true);
              });
              if (err) return interaction.update({ content:  `Oupss ${interaction.user}, Es ist ein Fehler aufgetreten!`, components: [row], ephemeral: true });
              interaction.update({ content:  `${interaction.user}, Ich habe die **ID:** \`${id}\` Erfolgreich gestartet!`, components: [row], ephemeral: true });
            });
          } else if (interaction.customId === 'logs') {
            pm2.describe(id, (err, proc) => {
              row.components.forEach(button => {
                button.setDisabled(true);
              });
              if (err) return interaction.update({ content:  `Oupss ${interaction.user}, Es ist ein Fehler aufgetreten!`, components: [row], ephemeral: true });
            const outLogPath = proc[0].pm2_env.pm_out_log_path;

            fs.readFile(outLogPath, 'utf8', (err, outLogData) => {
              if (err) return interaction.reply(`Error reading out log: ${err.message}`, { ephemeral: true });
        
              const newFilePath = './Logs-Data-schlumpfi.txt';
              fs.writeFile(newFilePath, outLogData, (err) => {
                if (err) return interaction.update({ content:  `Oupss ${interaction.user}, Es ist ein Fehler aufgetreten!`, components: [row], ephemeral: true });
        
                interaction.update({ content:  `${interaction.user}, Ich habe die Logs für die **ID:** \`${id}\` Erfolgreich generiert!`, components: [row],files: [newFilePath], ephemeral: true })
              });
            });
            });
          } else if (interaction.customId === 'delete') {
            pm2.delete(id, (err) => {
              row.components.forEach(button => {
                button.setDisabled(true);
              });
              if (err) return interaction.update({ content:  `Oupss ${interaction.user}, Es ist ein Fehler aufgetreten!`, components: [row], ephemeral: true });
              interaction.update({ content:  `${interaction.user}, Ich habe die **ID:** \`${id}\` Erfolgreich gelöscht!`, components: [row], ephemeral: true });
            });
          }
        } catch(error) {
          row.components.forEach(button => {
            button.setDisabled(true);
          });
          interaction.update({ content:  `Oupss ${interaction.user}, Es ist ein Fehler aufgetreten!`, components: [row], ephemeral: true });
                }
        }
      });
      

    }
}
}


function formatUptime(startTime) {
  const currentTime = Date.now();
  const uptimeMs = currentTime - startTime;
  return convertMsToTime(uptimeMs);
}

function convertMsToTime(ms) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  const days = Math.floor(hours / 24);
  hours = hours % 24;

  let uptime = "";
  if (days > 0) uptime += `${days}d `;
  if (hours > 0) uptime += `${hours}h `;
  if (minutes > 0) uptime += `${minutes}m `;
  if (seconds > 0) uptime += `${seconds}s`;

  return uptime.trim();
}

/**********************************************************
 * @INFO
 * Progammiert von: devschlumpfi
 * @INFO
 * Bitte erwähne mich wenn du diesen Code nutzt!
 * @INFO
 *********************************************************/