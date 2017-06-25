import SSML from 'alexa-app/lib/to-ssml.js';

export default function getResponseSSML(response) {
  return SSML.cleanse(response.response.response.outputSpeech.ssml);
}
