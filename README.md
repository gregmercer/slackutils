# slackutils
Command-line Nodejs Slack Utils using commander, inquirer, and colors

```
> git clone git@github.com:gregmercer/slackutils.git
> slackutils
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

Set the CHANNELS_TOKEN as an environment variable
```
> export CHANNELS_TOKEN=<your slack token>
```

Run the Slack Utilities
```
slackutils menu
```

