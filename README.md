# slackutils
Command-line Nodejs Slack Utils using commander, inquirer, and colors

```
> git clone git@github.com:gregmercer/slackutils.git
> cd slackutils
> npm init -y
> npm install --save commander inquirer colors axios
```

## To install app globally
```
> npm install -g ./
```
## Setup on Slack

Go to here to create a token for Slack API calls
```
https://api.slack.com/custom-integrations/legacy-tokens
```

Go to here to setup a new Slack app for your workspace
```
https://api.slack.com/apps
```

Go to the 'Incoming Webhooks' tab to 'Activate Incoming Webhooks'

Go to the 'Oath & Permissions' tab to set these scopes
```
channels:write
incoming-webhook
```

## Run the App

Set the CHANNELS_TOKEN as an environment variable
```
> export CHANNELS_TOKEN=<your slack token>
```

Run the Slack Utilities
```
> slackutils menu
```

