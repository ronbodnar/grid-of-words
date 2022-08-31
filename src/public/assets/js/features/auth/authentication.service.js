import { showView } from '../view/view.service.js'
import { showMessage } from '../../shared/services/message.service.js'
import { retrieveSession, removeSession } from '../../shared/services/storage.service.js'
import { fetchData } from '../../shared/services/api.service.js'
import { logger } from '../../main.js'

/**
 * Posts form data to the specified `url` and invokes `successFn()` or `failureFn()` depending on the response.
 *
 * @param {string} url The url used in the fetch request.
 * @param {object} params The parameters to pass in the fetch request.
 * @param {Function} successFn A function that will be called when the response is received.
 * @param {Function} failureFn A function that will be called if an error or timeout occurs.
 */
export const submitAuthForm = async (url, params, successFn, failureFn) => {
  const submitButton = document.querySelector("button[type='submit']")
  const submitButtonLoader = document.querySelector('#submitButtonLoader')

  if (submitButton) {
    submitButton.disabled = true
  }
  submitButtonLoader?.classList.remove('hidden')

  const responsePromise = await fetchData(url, 'POST', params)

  logger.debug('submitAuthForm responsePromise', responsePromise)

  // Validate the response and statusCode to handle any errors.
  // Invalid responses will display an error message, re-enable the form, then invoke an optional failureFn callback.
  if (!responsePromise?.payload || responsePromise.statusCode !== 200) {
    if (submitButton) {
      submitButton.disabled = false
    }
    submitButtonLoader?.classList.add('hidden')

    showMessage(responsePromise?.payload?.message || 'An error has occurred. Please try again.', {
      className: 'error',
      hide: false
    })

    // Call the optional failureFn callback with the response data if available.
    if (failureFn) {
      failureFn(responsePromise?.payload)
    }
    return
  }

  // Enable the submit button and hide the button loader.
  if (submitButton) {
    submitButton.disabled = false
  }
  submitButtonLoader?.classList.add('hidden')

  // Call the successFn callback with the response data.
  if (successFn) {
    successFn(responsePromise.payload)
  }
}

/**
 * Attempts to log the user out, remove session data, and redirect them home with a confirmation message.
 */
export const logout = async () => {
  const logoutResponse = await fetchData('/auth/logout', 'POST')

  // TODO: the user shouldn't care if it fails, should they? should we?
  if (logoutResponse?.statusCode === 200) {
    removeSession('user')
    removeSession('game')
    showView('home')
    const messageOptions = {
      hide: true,
      className: 'success'
    }
    showMessage(
      logoutResponse.payload?.message || 'You have been successfully logged out.',
      messageOptions
    )
  } else {
    showMessage('An error occurred while logging out. Please try again.', {
      className: 'error',
      hide: false
    })
  }
  logger.debug('Logout response', logoutResponse)
}

/**
 * Validates a password reset token with the API.
 *
 * @param {*} passwordResetToken The password reset token to validate.
 * @returns {Promise<any>} A promise that resolves with the API response.
 */
export const validateResetToken = async (passwordResetToken) => {
  return await fetchData('/auth/validate-token', 'POST', {
    passwordResetToken: passwordResetToken
  })
}

/**
 * Checks if the user is authenticated based on the user session storage data.
 *
 * @returns {boolean} Returns true if the user is authenticated, false otherwise.
 */
export const isAuthenticated = () => {
  return getAuthenticatedUser()
}

/**
 * Obtains the authenticated user object from the session storage.
 *
 * @returns The authenticated user object or null if no user is authenticated.
 */
export const getAuthenticatedUser = () => {
  return retrieveSession('user')
}

export { submitChangePasswordForm as changePassword } from './change-password/change-password.js'
export { submitResetPasswordForm as resetPassword } from './reset-password/reset-password.js'
export { submitForgotPasswordForm as forgotPassword } from './forgot-password/forgot-password.js'
export { submitLoginForm as login } from './login/login.js'
export { submitRegisterForm as register } from './register/register.js'
