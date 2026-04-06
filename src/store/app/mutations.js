export const data = (state, data) => {
  Object.assign(state.data, data)
}

export const processes = (state, data) => {
  state.processes = data
}

export const process_created = (state, data) => {
  state.processes.push(data)
}
