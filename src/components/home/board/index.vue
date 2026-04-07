<template>
  <div class="row bg-white q-pa-md items-center rounded-borders">
    <div class="col-3">
      <q-img :src="icon" :ratio="1" width="48px" class="q-pa-md"/>
    </div>
    <div class="column">
      <div class="text-h6 text-dark">{{ data }}</div>
      <div>{{ label }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    icon: {type: String},
    data: {type: Number},
    label: {type: String},
  }
}
</script>
