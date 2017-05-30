const utterances = require('alexa-utterances');
const fs = require('fs-extra');
const path = require('path');

const dictionary = require('../models/dictionary.js');
const schemas = require('../models/schemas');

const outputDir = path.resolve(process.env.PWD, 'interaction_model');

const sampleUtterances = Object.keys(schemas).map((name) => {
  const schema = Object.assign({}, schemas[name]);
  const slots = {};
  schema.slots.forEach((slot) => slots[slot.name] = slot.type);

  return schema.samples.map((template) => {
    return utterances(template, slots, dictionary).map((utterance) => {
      return `${schema.name} ${utterance}`;
    }).join('\n');
  }).join('\n\n');
}).join('\n\n\n');

const intentSchema = {
  intents: [
    {intent: 'AMAZON.YesIntent'},
    {intent: 'AMAZON.NoIntent'},
    {intent: 'AMAZON.CancelIntent'},
    {intent: 'AMAZON.HelpIntent'}
  ]
};
Object.keys(schemas).forEach((name) => {
  const schema = Object.assign({}, schemas[name]);

  intentSchema.intents.push({
    intent: schema.name,
    slots: schema.slots
  });
});

const skillBuilder = {
  intents: [
    {name: 'AMAZON.YesIntent', samples: []},
    {name: 'AMAZON.NoIntent', samples: []},
    {name: 'AMAZON.CancelIntent', samples: []},
    {name: 'AMAZON.HelpIntent', samples: []}
  ]
};
Object.keys(schemas).forEach((name) => {
  const schema = Object.assign({}, schemas[name]);
  const slots = {};
  schema.slots.forEach((slot) => slots[slot.name] = slot.type);

  let samples = [];
  schema.samples.forEach((template) => {
    samples = samples.concat(utterances(template, slots, dictionary));
  });
  schema.samples = samples;

  skillBuilder.intents.push(schema);
});

/**
 * Outputs a generated sample_utterances.txt file that is created using an utterance template in
 * combination with the top 100 most populat Trakt.tv movies, to try and create as much sample data
 * as possible for the ASK to work with.
 */
fs.outputFile(path.resolve(outputDir, 'sample_utterances.txt'), sampleUtterances);

/**
 * Outputs a generated intent_schema.json file.
 */
fs.outputFile(path.resolve(outputDir, 'intent_schema.json'), JSON.stringify(intentSchema, null, 2));

/**
 * Outputs a generated skill_builder.json file that can be uploaded to the Skill Builder Beta. It
 * contains both the intent schema and utterances/samples in one file. I'm guessing eventually this
 * will be the primary UI and we won't need the other two files anymore.
 */
fs.outputFile(path.resolve(outputDir, 'skill_builder.json'), JSON.stringify(skillBuilder, null, 2));
