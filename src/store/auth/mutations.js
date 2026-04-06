export const signed_in = (state, data) => {
  state.access_token = data.access_token
  state.user = data.user
  state.roles = data.user.roles
}

export const signed_out = (state) => {
  state.access_token = null
  state.account = null
  state.roles = null
}
