<template>
  <span>{{ display_value }}</span>
</template>
<script>
import {useStore} from 'vuex'
import {computed} from 'vue'

import {change_datetime_format} from 'src/composibles/utils'

export default {
  name: 'Datetime',
  props: {
    modelValue: {type: String}
  },
  setup (props) {
    const store = useStore()
    const display_value = computed(() => {
      if (!props.modelValue) return null
      const datetime_format = store.state.Context.datetime_format
      return change_datetime_format(props.modelValue, 'iso', datetime_format)
    })
    return {display_value}
  }
}
</script>
