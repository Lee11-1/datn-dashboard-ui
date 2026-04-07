<template>
  <q-page>
    <home-page />
  </q-page>
</template>
<script>
import {useRoute} from 'vue-router'

import HomePage from 'components/home/'

export default {
  components: {
    HomePage
  },
  setup () {
    const route = useRoute()
    let default_filters = {}

    const tracing_ids = route.query.tracing_ids
    if (tracing_ids) default_filters.tracing_ids = tracing_ids.split(',')

    const types = route.query.types
    if (types) default_filters.types = types.split(',')

    return {
      default_filters
    }
  }
}
</script>
