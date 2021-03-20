/**
 * @fileoverview Config management
 */

//Imports
import {config} from 'dotenv';

//Export
export default () =>
{
  //Get the config
  config();

  //Discord API
  const discordWebhookURL = process.env.DISCORD_WEBHOOK_URL;

  if (discordWebhookURL == null)
  {
    console.error('Discord webhook URL not provided!');
    process.exit(1);
  }

  //Pico API
  const picoUsername = process.env.PICO_USERNAME;
  const picoPassword = process.env.PICO_PASSWORD;
  const picoEvent = process.env.PICO_EVENT;
  const picoTeamMode = process.env.PICO_TEAM_MODE || true;

  if (picoUsername == null || picoPassword == null || picoEvent == null)
  {
    console.error('Pico username, password, or event ID not provided!');
    process.exit(1);
  }

  if (parseInt(picoEvent) == NaN)
  {
    console.error('Pico event ID is not an integer!');
    process.exit(1);
  }

  //NCS
  const ncsCutoff = process.env.NCS_CUTOFF || '0.4';

  if (parseFloat(ncsCutoff) == NaN)
  {
    console.error('National Cyber Scholarship cutoff is not a float!');
    process.exit(1);
  }

  return {
    discordWebhookURL,
    picoUsername,
    picoPassword,
    picoEvent,
    picoTeamMode,
    ncsCutoff
  }
};