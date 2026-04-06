<template>
  <router-view/>
</template>
<script>
import {useQuasar} from 'quasar'
import {useStore} from 'vuex'
import {onMounted, watch} from 'vue'

export default {
  setup () {
    const store = useStore()
    const $q = useQuasar()

    onMounted(() => {
      store.commit('Device/screen_size', $q.screen.name)
      window.addEventListener('focus', () => {
        store.commit('Device/background', false)
      })
      window.addEventListener('blur', () => {
        store.commit('Device/background', true)
      })
    })

    watch(
      () => $q.screen.name,
      () => {
        store.commit('Device/screen_size', $q.screen.name)
      }
    )

  }
}
</script>
