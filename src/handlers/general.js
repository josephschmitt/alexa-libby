import getProvider from '~/api/getProvider.js';
import buildReprompt from '~/lib/buildReprompt.js';

import {
  CANCEL_RESPONSE,
  HELP_RESPONSE,
  WELCOME_DESCRIPTION
} from '~/responses/general.js';

export function handleLaunchIntent(req, resp) {
  return Promise.resolve(
    resp
    .say(WELCOME_DESCRIPTION())
    .say(HELP_RESPONSE())
  );
}

export function handleYesIntent(req, resp) {
  if (!req.hasSession()) {
    throw new Error('No session data in yesAction.');
  }

  const session = req.getSession();
  const promptData = session.get('promptData');

  if (!promptData) {
    throw new Error('Got a AMAZON.YesIntent but no promptData. Ending session.');
  }
  else if (promptData.yesAction === 'addMedia') {
    const api = getProvider(promptData.providerType);
    const [result] = promptData.searchResults;

    return api.add(result).then(() => {
      return Promise.resolve(resp.say(promptData.yesResponse));
    });
  }

  throw new Error('Got an unexpected yesAction. PromptData:', promptData);
}

export function handleNoIntent(req, resp) {
  if (!req.hasSession()) {
    throw new Error('No session data in noAction.');
  }

  const session = req.getSession();
  const promptData = session.get('promptData');

  if (!promptData) {
    throw new Error('Got a AMAZON.NoIntent but no promptData. Ending session.');
  }
  else if (promptData.noAction === 'endSession') {
    return Promise.resolve(resp.say(promptData.noResponse).shouldEndSession(true));
  }
  else if (promptData.noAction === 'suggestNext') {
    const results = promptData.searchResults;

    return Promise.resolve(
      resp
        .say(promptData.noResponse)
        .session('promptData', buildReprompt(results))
        .shouldEndSession(results.length <= 1)
    );
  }

  throw new Error('Got an unexpected noAction. PromptData:', promptData);
}

export function handleCancelIntent(req, resp) {
  return resp.say(CANCEL_RESPONSE()).shouldEndSession(true);
}

export function handleHelpIntent(req, resp) {
  return resp.say(HELP_RESPONSE());
}
