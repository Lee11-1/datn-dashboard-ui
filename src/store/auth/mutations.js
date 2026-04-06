export const signed_in = (state, data) => {
  state.access_token = data.access_token
  state.account = data.account
  state.roles = data.roles
  state.permissions = data.permissions
  state.apps = data.apps

}

export const signed_out = (state) => {
  state.access_token = null
  state.account = null
  state.roles = null
  state.permissions = null
  state.apps = null
}
