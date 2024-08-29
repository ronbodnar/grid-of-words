/**
 * Handles the logout process by clearing the `token` cookie in the response object.
 */
export const handleLogoutUser = (req, res, next) => {
  try {
    res.clearCookie('token')
    res.json({
      status: 'success',
      message: 'You have logged out successfully.'
    })
  } catch (error) {
    next(error)
  }
}
