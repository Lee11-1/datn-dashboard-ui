export default async ({app, store}) => {
  // set global variables
  app.config.globalProperties.$is_mobile = store.getters['Device/is_mobile']
}
