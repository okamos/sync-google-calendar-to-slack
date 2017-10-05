# Sync Google Calendar to Slack
Sync Google Calendar to Slack your status  
![Google Calendar](https://github.com/okamos/sync-google-calendar-to-slack/blob/master/assets/google_ss.png)
![Slack](https://github.com/okamos/sync-google-calendar-to-slack/blob/master/assets/slack_ss.png)

## Quickstart
1. Fork this project.
1. Setting [gapps](https://github.com/danthareja/node-google-apps-script)
1. Set your Configurations.
  1. Generate the Slack token [Legacy token generator](https://api.slack.com/custom-integrations/legacy-tokens)
  1. Set script properties. Browse [your project](https://script.google.com) -> File -> Project properties -> Script properties
    1. Add `CALENDAR_ID` property. Set value to your Email. e.g. example.gmail.com
    1. Add `SLACK_TOKEN` property. Set value to Slack token.
    1. Save
  1. Set trigger. Edit -> Project trigger
    * Select onEvent
    * Select minutes timmer and Select per 1minute or per 5minute. `recommended`
  1. If you using CircleCI, Connect CircleCI `https://circleci.com/add-projects/gh/YOUR_ORG`
    1. Add project's Environment Variables
      * Name: gapps, Value: ~/.gapps file body. e.g. `{"client_id": "477513152433-....apps.googleusercontent.com", "client_secret": "1EBL0NLBE3L...", "redirect_uri": "urn:ietf:wg:oauth:2.0:oob", "refresh_token": "1/-1hLM6J...pc31krQ4OylDs-M"}`
      * Name: gapps_config, Value: ./gapps.config.json e.g. `{"path": "src", "fileId": "1iiKQdAio0...dCj8WDpbLb"}`
1. Edit dict.json.
  * [regexp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) set patterns. e.g. `vacation|dont work|day off`
  * `status_emoji` set [emoji](https://www.webpagefx.com/tools/emoji-cheat-sheet/). You can use [Custom Emoji](https://get.slack.help/hc/en-us/articles/206870177-Create-custom-emoji)
  * `status_text` set your status.
1. Push to github, or build and deploy your local machine.

## Build and Deploy
If you using CircleCI. It is not necessary local build and deploy.

```
yarn build
yarn deploy
```
