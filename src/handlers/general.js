import getProvider from '~/api/getProvider.js';
import buildReprompt from '~/lib/buildReprompt.js';

import {
  CANCEL_RESPONSE,
  HELP_RESPONSE,
  WELCOME_DESCRIPTION
} from '~/responses/general.js';

export function handleLaunchIntent(req, resp) {
  resp
    .say(WELCOME_DESCRIPTION())
    .say(HELP_RESPONSE())
    .send();
}

export function handleYesIntent(req, resp) {
  const promptData = req.session('promptData');

  if (!promptData) {
    throw new Error('Got a AMAZON.YesIntent but no promptData. Ending session.');
  }
  else if (promptData.yesAction === 'addMedia') {
    const api = getProvider(promptData.providerType);
    const [result] = promptData.searchResults;

    return api.add(result).then(() => {
      resp
        .say(promptData.yesResponse)
        .send();
    });
  }
  else {
    throw new Error('Got an unexpected yesAction. PromptData:', promptData);
  }
}

export function handleNoIntent(req, resp) {
  const promptData = req.session('promptData');

  if (!promptData) {
    throw new Error('Got a AMAZON.NoIntent but no promptData. Ending session.');
  }
  else if (promptData.noAction === 'endSession') {
    resp.say(promptData.noResponse).send();
  }
  else if (promptData.noAction === 'suggestNext') {
    const results = promptData.searchResults;
    resp
      .say(promptData.noResponse)
      .session('promptData', buildReprompt(results.slice(1)))
      .shouldEndSession(false)
      .send();
  }
  else {
    throw new Error('Got an unexpected noAction. PromptData:', promptData);
  }
}

export function handleCancelIntent(req, resp) {
  resp.say(CANCEL_RESPONSE()).shouldEndSession(true).send();
}

export function handleHelpIntent(req, resp) {
  resp.say(HELP_RESPONSE()).send();
}
