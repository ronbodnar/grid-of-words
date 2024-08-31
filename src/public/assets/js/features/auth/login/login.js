import { showMessage } from '../../../shared/services/message.service.js'
import { storeSession } from '../../../shared/services/storage.service.js'
import { showView } from '../../view/view.service.js'
import { EMAIL_REGEX } from '../../../shared/utils/constants.js'
import { submitAuthForm } from '../authentication.service.js'

/**
 * Handles the login form submission by validating inputs and awaiting {@link submitAuthForm} with a `successFn` callback.
 * 
 * @async
 */
export const submitLoginForm = async () => {
  const emailInput = document.querySelector('#email')
  const passwordInput = document.querySelector('#password')

  if (!emailInput || !passwordInput) {
    showMessage('Please enter your email address and password.', {
      className: 'error',
      hide: false
    })
    return
  }

  // Make sure the email doesn't have any invalid characters
  if (!EMAIL_REGEX.test(emailInput.value)) {
    showMessage('Invalid e-mail address format.', {
      className: 'error',
      hide: false
    })
    emailInput.classList.add('error')
    return
  } else {
    emailInput.classList.remove('error')
  }

  const params = {
    email: emailInput.value,
    password: passwordInput.value
  }

  const successFn = (response) => {
    if (response?.user) {
      storeSession('user', response.user)
      showView('home', {
        message: {
          text: `Welcome, ${response.user.username}!\n\nYou have successfully logged in.`,
          className: 'success',
          hide: true,
          hideDelay: 2500
        }
      })
    } else {
      throw new Error("Couldn't login: no user in response", {
        response: response
      })
    }
  }

  await submitAuthForm('/auth/login', params, successFn)
}
