# Couch Potato Alexa Skill

This is a skill built for Amazon's Alexa service that tells you about your Couch Potato queue. It
allows you to ask Alexa the following:

> Alexa, ask Couch Potato to add The Godfather
> Alexa, ask Couch Potato to add The Godfather released in 1974
> Alexa, ask Couch Potato if The Dark Knight is on the list
> Alexa, ask Couch Potato if Batman 1989 is on the list

If you're just getting started developing skills for Alexa, I'd recommend reading [Getting Started
with the Alexa Skills
Kit](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/getting-started-guide) and
[Developing an Alexa Skill as a Lambda
Function](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/developing-an-alexa-skill-as-a-lambda-function) to get familiar with the process.

## Configuring The Skill

To configure the skill, copy `default.env` to `.env` and fill in the correct values for `CP_URL`,
which should point to your Couch Potato server, and `CP_API_KEY` which should have your server's
API key.

## Testing The Skill Locally

You can use [node-lambda](https://github.com/motdotla/node-lambda) to test this skill locally. In
the `test_events` directory are several event files you can use for testing, and they should map
pretty well to each Intent. To test an intent, simply update the `EVENT_FILE` value in your `.env`
config file to point to the event to test against. Make sure you run `npm install` from the command
line to get the the latest npm packages, and then run `npm run test-lambda`.

## Setting up the Skill

To set up the skill, head on over to [Alexa skills kit
development console](https://developer.amazon.com/edw/home.html) and add a new skill. Fill in the
basic skill information however you choose. For Endpoint, you'll need to fill in your Lambda ARN
which you'll get in the next step. Next, head on over to Interaction Model. In the Intent
Schema field, copy and paste the contents of the `interaction_model/intent_schema.json` file. Then
in the Sample Utterances field, copy and paste the contents of
`interaction_model/sample_utterances.txt`.

## Hosting the Skill

The skill is built to be easily hosted on Amazon's [AWS
Lambda service](https://aws.amazon.com/lambda/). Create your Lambda function (using the
alexa-skills-kit-color-expert blueprint) and make sure you choose Node.js as the runtime. After
you've created your Lambda function, look at the top right of the page to get your Lambda ARN
number and put that in the Alexa Skill Information Endpoint field.

To deploy to Lambda, first makes sure you do an `npm install` at the root of the project.
Once all the dependencies are installed, run `npm run package`, which will create a an
`alexa-couchpotato.zip` file in your project directory. You can then upload that zip file to Lambda
for use in your function and skill.

You can also use [node-lambda](https://github.com/motdotla/node-lambda) to deploy to your Lambda
function directly from the command line. Simply add a deploy.env file with your environment
configuration (and double check the supplied `.env file` in this repository) and then run
`npm run deploy`. Please visit the [node-lambda](https://github.com/motdotla/node-lambda)
project page for more information on deploying from the command line.
