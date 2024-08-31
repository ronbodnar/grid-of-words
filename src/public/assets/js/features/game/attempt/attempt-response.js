import { logger } from '../../../main.js'
import { setBlockKeyEvents } from '../../../shared/services/event.service.js'
import { showMessage } from '../../../shared/services/message.service.js'
import { removeSession } from '../../../shared/services/storage.service.js'
import {
  shiftActiveRow,
  transformSquares,
  updateCurrentAttemptSquares
} from '../gameboard/gameboard.service.js'
import { updateKeyboardKeys } from '../keyboard/keyboard.service.js'
import { fetchStatistics } from '../../statistics/statistics.service.js'
import { showView } from '../../view/view.service.js'
import { clearAttemptLetters, getAttemptLetters } from './attempt.service.js'

/**
 * Processes the response based on the message content, then displays the message.
 *
 * @async
 * @param {Game} game - The current game object.
 * @param {object} data - The response data from the server.
 */
export const processAttemptResponse = async (game, data) => {
  let responseMessage = 'Error'

  if (!data) {
    showMessage('No response from server', {
      className: 'error'
    })
    return
  }

  const { message, gameData } = data

  if (message) {
    switch (message) {
      case 'WRONG_WORD':
        updateCurrentAttemptSquares(game.word)

        await transformSquares(false)

        updateKeyboardKeys(game.word, getAttemptLetters())

        shiftActiveRow()

        clearAttemptLetters()
        responseMessage = ''

        setBlockKeyEvents(false)
        break

      case 'WINNER':
      case 'LOSER':
        removeSession('game')
        if (message === 'LOSER') {
          responseMessage = gameData.word.toUpperCase()
        } else {
          responseMessage = message
        }
        updateCurrentAttemptSquares(game.word)
        await transformSquares(false)
        clearAttemptLetters()

        // Pre-fetch the statistics to pass to the stats view and avoid redirecting to handle it below.
        const statistics = await fetchStatistics(false)
        setTimeout(() => {
          setBlockKeyEvents(false)
          if (statistics) {
            showView('statistics', {
              statistics: statistics
            })
          } else {
            showView('home')
          }
        }, 5000)
        break

      case 'GAME_NOT_FOUND':
        showView('home', {
          message: {
            text: 'The game could not be found. Please start a new game.',
            hideDelay: 5000,
            className: 'error'
          }
        })
        // Return early so the message is not overwritten.
        return

      // Edge cases to handle gracefully
      case 'NO_WORD_OR_NO_ID':
      case 'ATTEMPTS_EXCEEDED':
      case 'WORD_LENGTH_MISMATCH':
      case 'ADD_ATTEMPT_REPOSITORY_ERROR':

      // Only ones that are handled as of now.
      // eslint-disable-next-line no-fallthrough
      case 'NOT_IN_WORD_LIST':
      case 'DUPLICATE_ATTEMPT':
      default:
        responseMessage =
          message.at(0).toUpperCase() + message.slice(1).toLowerCase().replaceAll('_', ' ')

        await transformSquares(false, true)

        setBlockKeyEvents(false)
        break
    }
  } else {
    logger.warn('No message found in data', data)
  }

  // Update the response message element
  showMessage(responseMessage)
}
