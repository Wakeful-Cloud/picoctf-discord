# PicoCTF Discord
[picoCTF](https://picoctf.org) [Discord](https://discord.com) notification bot

## Config
*Note: The config can be stored in a [`.env`](https://github.com/motdotla/dotenv#usage) file or set through environment variables.*
Name | Default | Description
--- | --- | ---
`DISCORD_WEBHOOK_URL` | N/A | Discord webhook URL
`PICO_USERNAME` | N/A | picoCTF username
`PICO_PASSWORD` | N/A | picoCTF password
`PICO_EVENT` | N/A | picoCTF event ID (Should be an integer)
`PICO_TEAM_MODE` | `true` | Wether this bot will report team statistics or the user statistics
`NCS_CUTOFF` | `0.4` | [National Cyber Scholarship](https://www.nationalcyberscholarship.org) eligibility cutoff (Should be a float)