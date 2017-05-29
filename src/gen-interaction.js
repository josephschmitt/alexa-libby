import utterances from 'alexa-utterances';
import fs from 'fs-extra';
import path from 'path';

import dictionary from '~/models/dictionary.js';
import * as schemas from '~/models/schemas';

const sampleUtterances = Object.keys(schemas).map((name) => {
  const schema = schemas[name];
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
Object.keys(schemas).map((name) => {
  const schema = schemas[name];

  intentSchema.intents.push({
    intent: schema.name,
    slots: schema.slots
  });
});

/**
 * Outputs a generated sample_utterances.txt file that is created using an utterance template in
 * combination with the top 100 most populat Trakt.tv movies, to try and create as much sample data
 * as possible for the ASK to work with.
 */
const outputDir = path.resolve(process.env.PWD, 'interaction_model');
fs.outputFile(path.resolve(outputDir, 'sample_utterances.txt'), sampleUtterances);
fs.outputFile(path.resolve(outputDir, 'intent_schema.json'), JSON.stringify(intentSchema, null, 2));
