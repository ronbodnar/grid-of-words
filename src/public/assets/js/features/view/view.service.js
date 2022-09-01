import { buildChangePasswordView } from '../auth/change-password/change-password.view.js'
import { buildForgotPasswordView } from '../auth/forgot-password/forgot-password.view.js'
import { buildLoginView } from '../auth/login/login.view.js'
import { buildRegisterView } from '../auth/register/register.view.js'
import { buildResetPasswordView } from '../auth/reset-password/reset-password.view.js'
import { buildGameView } from '../game/game.view.js'
import { buildHomeView } from '../home/home.view.js'
import { buildHowToPlayView } from '../how-to-play/how-to-play.view.js'
import { buildLoadingView } from '../loading/loading.view.js'
import { buildOptionsView } from '../options/options.view.js'
import { retrieveSession } from '../../shared/services/storage.service.js'
import { buildStatisticsView } from '../statistics/statistics.view.js'

let viewHistory = []

const viewFunctions = {
  // Main view functions
  home: (options = {}) => {
    viewHistory = []
    buildHomeView(options)
  },
  game: (options = {}) => {
    buildGameView({
      game: options.game,
      wordLength: options.wordLength,
      maxAttempts: options.maxAttempts
    })
    viewHistory = []
  },
  howToPlay: () => buildHowToPlayView(),
  loading: () => buildLoadingView(),
  options: () => buildOptionsView(),
  statistics: (options = {}) => buildStatisticsView(options),

  // Authentication view functions
  changePassword: () => buildChangePasswordView(),
  forgotPassword: (options = {}) => buildForgotPasswordView(options.message),
  login: (options = {}) => buildLoginView(options.message),
  register: () => buildRegisterView(),
  resetPassword: () => {
    const passwordResetToken = retrieveSession('passwordResetToken')
    if (!passwordResetToken) {
      buildForgotPasswordView("Unexpected error. Please click the link in your e-mail again or request a new link.")
      return;
    }
    buildResetPasswordView()
  }
}

/**
 * Clears the current content container's innerHTML and builds view containers.
 * @param {string} name - The name of the view container to build and display.
 * @param {object} options - A list of options that can be passed to views.
 */
export const showView = (name, options = {}) => {
  if (!name) {
    showView('home')
    return
  }

  const { hideFromHistory = false } = options

  const currentView = getCurrentViewName()
  const addToHistory =
    currentView !== 'loading' &&
    currentView !== 'game' &&
    currentView !== 'statistics' &&
    !hideFromHistory

  if (addToHistory) {
    viewHistory.push(getCurrentViewName())
  }

  const viewFunction = viewFunctions[name]
  if (viewFunction && typeof viewFunction === 'function') {
    viewFunction(options)
  } else {
    buildHomeView()
    viewHistory = []
    throw new Error(`View "${name}" does not have a mapped function`)
  }
}

/**
 * Retrieves the current view from the id tag of the main content container.
 * @returns {string} The name of the current view.
 */
export const getCurrentViewName = () => {
  const currentView = document.querySelector('.content')
  return currentView?.id
}

/**
 * @returns {Array} A stack of views that have been visited, for navigation.
 */
export const getViewHistory = () => {
  return viewHistory
}
