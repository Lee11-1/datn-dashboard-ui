<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <e404/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import E404 from 'src/components/errors/e404'
export default {
  components: {E404}
}
</script>
