# Discord-Pm2-Manager

## 🇩🇪 Deutsche Version

### Beschreibung
Der Discord-Pm2-Manager ist ein Discord-Bot, entwickelt um PM2-Prozesse direkt über Discord zu verwalten. Mit diesem Bot können Sie PM2-Prozesse starten, stoppen, neustarten, löschen und Logs anzeigen.

### Voraussetzungen
- Node.js und npm müssen installiert sein
- PM2 muss installiert sein. [Hier erfahren Sie, wie Sie PM2 installieren können](https://pm2.keymetrics.io/docs/usage/quick-start/)

### Installation
1. Klone dieses Repository: `git clone https://github.com/devschlumpfi/Discord-Pm2-Manager`
2. Installiere die benötigten Node.js-Pakete: `npm install`
3. Erstelle eine `settings.json` Datei und konfiguriere sie nach deinen Bedürfnissen:
    ```json
    {
        "logsystem": true,
        "onlydm": false,
        "language": "de",
        "ownerid": "DeineUserID"
    }
    ```
4. Erstelle eine `.env` Datei und füge deinen Discord-Bot-Token hinzu: `TOKEN=deinToken`
5. Starte den Bot: `node index.js`

### Befehle
- `/pm2 list`: Listet alle PM2-Prozesse auf.
- `/pm2 manage`: Verwaltet einen PM2-Prozess mit der angegebenen ID.

### Demonstration
![Bild 1](images/de-lang/de-image1.png)
![Bild 2](images/de-lang/de-image2.png)

### To-Do Liste
- [ ] Automatisch aktualisierende Statusnachrichten hinzufügen

## 🇬🇧 English Version

### Description
The Discord-Pm2-Manager is a Discord bot developed to manage PM2 processes directly through Discord. With this bot, you can start, stop, restart, delete, and view logs of PM2 processes.

### Prerequisites
- Node.js and npm must be installed
- PM2 must be installed. [Learn how to install PM2 here](https://pm2.keymetrics.io/docs/usage/quick-start/)

### Installation
1. Clone this repository: `git clone https://github.com/devschlumpfi/Discord-Pm2-Manager`
2. Install the required Node.js packages: `npm install`
3. Create a `settings.json` file and configure it according to your needs:
    ```json
    {
        "logsystem": true,
        "onlydm": false,
        "language": "en",
        "ownerid": "YourUserID"
    }
    ```
4. Create a `.env` file and add your Discord bot token: `TOKEN=yourToken`
5. Start the bot: `node index.js`

### Commands
- `/pm2 list`: Lists all PM2 processes.
- `/pm2 manage`: Manages a PM2 process with the specified ID.

### Demonstration
![Image 1](images/en-lang/en-image1.png)
![Image 2](images/en-lang/en-image2.png)

### To-Do List
- [ ] Add automatically updating status messages

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements
- [Discord.js](https://discord.js.org/)
- [PM2](https://pm2.keymetrics.io/)
