import getProvider, {PROVIDER_TYPE} from '~/api/getProvider.js';

import buildCard from '~/lib/buildCard.js';
import buildReprompt from '~/lib/buildReprompt.js';
import getArtwork from '~/lib/getArtwork.js';

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
      if (!result) {
        return null;
      }

      return getArtwork(result);
    }).then((artwork) => {
      if (artwork) {
        let title = result.title;
        if (promptData.providerType === PROVIDER_TYPE.MOVIES) {
          title += ` (${result.year})`;
        }

        resp.card(buildCard(title, artwork, promptData.yesResponse));
      }

      return resp.say(promptData.yesResponse);
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

    if (results.length <= 1) {
      return Promise.resolve(resp.say(promptData.noResponse).shouldEndSession(true));
    }

    return Promise.resolve(
      resp
        .say(promptData.noResponse)
        .session('promptData', buildReprompt(results.slice(1), promptData.providerType))
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
