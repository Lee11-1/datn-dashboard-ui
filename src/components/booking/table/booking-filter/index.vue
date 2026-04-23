<template>
  <q-item dense class="q-pa-none">
    <div class="bg-white q-pa-md border-shadow row full-width items-left ">
      <div class="row col-md-4 items-center">
        <div class="q-pr-md">
          <span style="font-size:16px; font-weight: 500;">Dates</span>

        </div>
        <date-picker
                class="full-height"
                style="width: 250px;"
                prepend_icon="event"
                dense hide_year_navigation
                outlined
                range
                only_future
                @input="value => $emit('time_change', value)"
                :value="{from: modelValue.created_after, to: modelValue.created_before}"
                prepend_button="close"
        />

      </div>
      <div class="row col-md-4 items-center">
        <div class="q-pr-md">
          <span style="font-size:16px; font-weight: 500;">Tour Name</span>
        </div>
        <q-input color="grey-3" v-model="search_text" outlined
                class=""
                @keydown.enter.prevent="submit">
          <template v-slot:append>
            <q-icon name="search" @click="submit" class="cursor-pointer" v-if="!process" />
            <q-spinner size="sm" v-else />
          </template>
        </q-input>
      </div>
      <div class="row col-md-4 items-center">
        <div class="q-pr-md"><span style="font-size:16px; font-weight: 500;">Sort</span></div>
        <div>
          <q-select outlined map-options emit-value class="full-width"
                  v-model="modelValue.sort"
                  @update:model-value="(value) => handle_sort(value)"
                  :options="options"
                  option-value="id"
                  option-label="label"
                  />
        </div>
      </div>
    </div>
  </q-item>
</template>

<script>
import {computed, ref, onBeforeMount, watch} from 'vue'
import {useStore} from 'vuex'
import DatePicker from 'src/components/common/two-date-picker'

export default {
  components: {DatePicker},
  props: {
    modelValue: {type: Object, default: () => ({})},
    process: {type: Boolean},
  },

  setup (props, context) {
    const textinput = ref(null)
    const store = useStore()
    const options = ref([
      {
        id: '+created_at',
        label: 'Booking date ascending'
      },
      {
        id: '-created_at',
        label: 'Booking date descending'
      }
    ])
    const search_text = ref('')
    const submit = () => {
      context.emit('filter', textinput.value)
    }

    const handle_sort = (value) => {
      context.emit('sort', value)

    }
    watch (
      () => {
        if (search_text.value.length <= 3) return

        context.emit('search_tour', search_text.value)
      }
    )

    return {
      textinput,
      options,
      submit,
      search_text,
      handle_sort
    }
  }
}
</script>
