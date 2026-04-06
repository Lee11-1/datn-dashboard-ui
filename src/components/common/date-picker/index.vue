<template>
  <q-field v-bind="q_field_bind"
           :rules="rules"
           :label="label" :model-value="date">
    <template v-slot:control>{{ date }}</template>
    <template v-slot:append>
      <q-icon name="event"/>
    </template>
    <q-popup-proxy ref="popup_proxy"
                   transition-show="scale"
                   transition-hide="scale">
      <q-date no-unset minimal ref="date_picker"
              @update:model-value="$refs.popup_proxy.hide()"
              v-model="date" :mask="mask_format"/>
    </q-popup-proxy>
  </q-field>
</template>
<script>
import {computed, ref, watch} from 'vue'
import {useStore} from 'vuex'

import {change_datetime_format} from 'src/composibles/utils'

export default {
  props: {
    meta: {type: Object, default: () => ({})},
    modelValue: {type: String},
    label: {type: String},
    rules: {type: Array},
  },
  setup (props, context) {
    const store = useStore()
    const mask_format = store.state.Context.date_format
    const date = ref(null)
    if (props.modelValue) date.value = change_datetime_format(
      props.modelValue,
      'iso',
      mask_format
    )
    const q_field_bind = computed(() => {
      let result = {
        'dense': true,
      }
      Object.keys(result).forEach(k => {
        const v = props.meta[k]
        if (v !== undefined) result[k] = v
      })
      return result
    })

    watch(
      date,
      (val) => {
        context.emit('update:modelValue', change_datetime_format(
          val,
          mask_format,
          'iso'
        ))
      }
    )

    return {
      q_field_bind,
      date,
      mask_format
    }
  }
}
</script>
