/**
 * @fileoverview Main file
 */

//Imports
import {CookieJar} from 'tough-cookie';
import {DateTime} from 'luxon';
import {MessageEmbed, WebhookClient} from 'discord.js';
import axios from 'axios';
import cookieJarSupport from 'axios-cookiejar-support';
import getConfig from './config';

//Main IIFE
const main = async () =>
{
  //Get the config
  const config = getConfig();

  //Parse webhook ID and token
  const webhookURL = new URL(config.discordWebhookURL);
  const webhookID = webhookURL.pathname.split('/')[3];
  const webhookToken = webhookURL.pathname.split('/')[4];

  //Initialize the Discord webhook client
  const client = new WebhookClient(webhookID, webhookToken);

  //Cookie jar
  cookieJarSupport(axios);
  const jar = new CookieJar();

  //Authenticate
  const auth = await axios({
    method: 'POST',
    url: 'https://play.picoctf.org/api/user/login/',
    data: {
      username: config.picoUsername,
      password: config.picoPassword
    },
    jar,
    withCredentials: true
  });

  console.log(`Logged into Pico for ${auth.data.username} (${auth.data.email})`);

  //Get profile
  const profile = await axios({
    method: 'GET',
    url: `https://play.picoctf.org/api/events/${config.picoEvent}/profile/`,
    jar,
    withCredentials: true
  });

  console.log('Got event profile');

  //Get scoreboard rankings
  const scoreboards = await axios({
    method: 'GET',
    url: `https://play.picoctf.org/api/scoreboards?event=${config.picoEvent}&page_size=10`,
    jar,
    withCredentials: true
  });

  //Get scoreboards
  const globalScoreboard = scoreboards.data.results.find((scoreboard: {name: string}) => scoreboard.name == "Global");
  const usScoreboard = scoreboards.data.results.find((scoreboard: {name: string}) => scoreboard.name == "US Middle/High School");

  console.log('Fetched event info');

  //Get human-readable timestamp
  const timestamp = DateTime.now().toLocaleString(DateTime.DATETIME_MED);

  //Get National Cyber Scholarship eligibility
  const ncsEligibility = (usScoreboard.rank / usScoreboard.competitors) < parseFloat(config.ncsCutoff);

  //Generate Discord embed
  const embed = new MessageEmbed({
    color: '#c41230',
    title: 'picoCTF Ranking',
    description: `picoCTF scoreboard summary as of ${timestamp}`,
    fields: [
      {
        name: 'Global Ranking',
        value: `${globalScoreboard.rank} / ${globalScoreboard.competitors}`,
        inline: true
      },
      {
        name: 'US Ranking',
        value: `${usScoreboard.rank} / ${usScoreboard.competitors}`,
        inline: true
      },
      {
        name: `Score (${!!config.picoTeamMode ? 'Team' : 'User'})`,
        value: !!config.picoTeamMode ? profile.data.team.score : profile.data.score,
        inline: true
      },
      {
        name: 'National Cyber Scholarship Status',
        value: ncsEligibility ? 'Eligible' : 'Ineligible'
      }
    ],
    url: `https://play.picoctf.org/events/${config.picoEvent}/scoreboards`
  });

  //Send to Discord
  await client.send(null, {
    username: 'picoCTF Rank',
    avatarURL: 'https://i.imgur.com/4uIPDnM.png',
    embeds: [
      embed
    ]
  });

  console.log('Send Discord message');

  //Exit
  process.exit(0);
};
main();