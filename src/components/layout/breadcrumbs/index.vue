<template>
  <q-card flat class="bg-light-green-1 text-teal-8">
    <q-item>
      <q-item-section>
        <q-breadcrumbs gutter="sm" class="text-weight-medium">
          <template v-slot:separator>
            <q-icon
              size="1.2em"
              name="chevron_right"
              color="primary"
            />
          </template>
          <q-breadcrumbs-el v-for="(segment, index) in routes"
                            :icon="segment.icon" ripple
                            :key="index"
                            :to="{name: segment.name}"
                            :label="segment.label"
                            style="font-size: 15px"/>
        </q-breadcrumbs>
      </q-item-section>
    </q-item>
  </q-card>
</template>
<script>
import {computed} from 'vue'
import {useRoute} from 'vue-router'

export default {
  setup () {
    const current_route = useRoute()

    const routes = computed(() => {
      let result = []
      current_route.matched.forEach(i => {
        let bc_item = {
          name: i.name,
        }
        if (i.name === 'main') {
          bc_item.label = 'Home'
          bc_item.icon = 'home'
        } else if(i.name === 'main.app') {
          i.name = 'main.apps'
          bc_item.label = 'Application'
        } else {
          bc_item.label = i.meta.label
        }
        result.push(bc_item)
      })
      return result
    })
    return {routes}
  }
}
</script>
