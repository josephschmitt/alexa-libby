# Libby Alexa Skill

This is a skill built for Amazon's Alexa service that tells you about your Couch Potato and
Sickbeard queue. It allows you to ask Alexa the following:

> Alexa, ask Libby to add the movie The Godfather
>
> Alexa, ask Libby to add the movie The Godfather released in 1974
>
> Alexa, ask Libby if the film The Dark Knight is on the list
>
> Alexa, ask Libby if the film Batman 1989 is on the list
>
> Alexa, ask Libby to add the show Silicon Valley
>
> Alexa, ask Libby if the series Jessica Jones is on the list

If you're just getting started developing skills for Alexa, I'd recommend reading [Getting Started
with the Alexa Skills
Kit](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/getting-started-guide) and
[Developing an Alexa Skill as a Lambda
Function](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function) to get familiar with the process.

You can download a [pre-packaged version of the
app](https://github.com/josephschmitt/alexa-libby/releases/latest/) if you don't want to run
from source..

## Configuring The Skill

Open the `config/default.json` file and fill in the right values for your server configuration. If
you use an `apiKey` (which you should), then you can leave `username` and `password` blank.
Otherwise fill those in instead.

If you don't want to accidentally commit your configuration, then make a duplicate of the
`default.json` file and call it `local.json`. It will override any configuration from default and
is ignored by git.

## Creating a Lambda function

The skill is built to be easily hosted on Amazon's [AWS Lambda
service](https://aws.amazon.com/lambda/). You'll need to create an Amazon AWS account, and then head
over to the [Lambda Dashboard](https://console.aws.amazon.com/lambda/home). Once there, click
"Create a Lambda function", and provide the following settings:

1. **Select blueprint**: Click on _Blank Function_.
2. **Configure triggers**: This one can be easy to miss. You should see a dotted out rounded square
to the left of the Lambda logo. Click on it and from the dropdown, choose _Alexa Skills Kit_.
3. **Configure function**:
  - Name: `alexa-libby`. Honestly this can be whatever you want, but if you want to use the
    deploy function later, it's best to use the same name as the project here.
  - Description: Doesn't matter. Feel free to copy the project description.
  - Runtime: _Node.js 6.10_. You can choose the older version if you want, but if you do make
    sure to update the `.babelrc` file to tell babel to target the older verison of Node. If you
    don't know what that means, just go with 6.10.
  - Code entry type: _Upload a .ZIP file_. (Instructions on generating this ZIP file are below)
  - Lambda function handler and role: Under **Existing role** choose `lambda_basic_execution`.

Click Create lambda function and you're done. After you've created your Lambda function, look at the
top right of the page to get your Lambda ARN number. You'll need this in the next step, so either
write that number down, or keep this page open.

## Deploying the Skill

If you don't care about the nitty-gritty of NodeJS projects, you can just download the
`alexa-libby.zip` file from the [latest
release](https://github.com/josephschmitt/alexa-libby/releases/latest/), update the
`config/default.json` file with your server settings, re-zip, and upload to lambda.

_If you want more control, or to make your own updates to the project, check out the master branch
and then do an `npm install` at the project root. Once all the dependencies are  installed, run
`npm run package`, which will create an `alexa-libby.zip` file in your project  directory.
Back in the Lambda dashboard, look to see where it says "Upload" next to "Function package". Click
upload, choose the zip file, and click save._

_You can also use [node-lambda](https://github.com/motdotla/node-lambda) to deploy to your Lambda
function directly from the command line. Simply add a deploy.env file with your environment
configuration (and double check the supplied `.env file` in this repository) and then run
`npm run deploy`. Please visit the [node-lambda](https://github.com/motdotla/node-lambda)
project page for more information on deploying from the command line._

## Setting up the Skill

To set up the skill, head on over to [Alexa skills kit
development console](https://developer.amazon.com/edw/home.html) and add a new skill by following
these steps:

1. **Skill Information**: Fill in the basic skill information however you choose. If you're feeling
uncreative, you can put `alexa-libby` for the name, and `libby` for the _Invocation
Name_.
2. **Interaction Model**: There are two ways to do this. The first is the old/traditional way. In
the Intent Schema field, copy the contents of the `interaction_model/intent_schema.json` file and
paste them in. Then in the Sample Utterances field, copy the contents of
`interaction_model/sample_utterances.txt` and paste those in. Make sure to Save your changes. The
second way is to use the new Skill Builder. Once you have it loaded, click on Code Editor, click on
the area titled "Drag and drop your .json file", and choose the
`interaction_model/skill_builder.json` file. Click Save Model, then Build Model.
3. **Configuration**: Set the Service Endpoint Type to AWS Lambda ARN, and choose your region. Now
comes the time to grab the ARN from the previous step that you hopefully either wrote down or kept
open in a different tab or browser window.
4. **Test**: Make sure the toggle at the top is Enabled. You should now be able to test to make sure
everything's working. Scroll down to the Service Simulator and in the Enter Utterance field, try
asking Libby one of the phrases from up top, like "is The Dark Knight on the list". If everything's
working correctly, you should see data get filled in on both the Request and Response boxes. If you
do, then you're pretty much done and all set.
5. **Publishing Information**: This isn't necessary, but it helps the skill look nice in your Alexa
app. You can fill in as much of the metadata as you like, but the one I'd really recommend is
uploading an icon. An icon is included in this project and should work well for the 108x108 small
icon slot.

And that's it, all done.

## Testing The Skill Locally

You can use [node-lambda](https://github.com/motdotla/node-lambda) to test this skill locally. In
the `test_events` directory are several event files you can use for testing, and they should map
pretty well to each Intent. To test an intent, simply update the `EVENT_FILE` value in your `.env`
config file to point to the event to test against. Make sure you run `npm install` from the command
line to get the the latest npm packages, and then run `npm start`.
