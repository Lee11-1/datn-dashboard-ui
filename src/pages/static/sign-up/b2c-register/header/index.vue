<template>
  <q-toolbar class="eg-header-toolbar">
    <div style="cursor: pointer" class="col-12" @click="redirect_login_page">
      <div class="row items-center q-py-md">
        <q-img :src="header_logo" width="143px" height="52px" class="q-mr-sm"/>
        <!-- <div class="q-pt-sm" :class="$is_mobile ? 'header-title-eg-mobile' : 'header-title-eg'">
          VNAMAZING
        </div> -->
      </div>
    </div>
  </q-toolbar>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
import { S3_IMAGE_LINK } from 'src/components/constants'
import {useRouter} from "vue-router"

export default {
  components: {
    // B2cLoginDialog,
  },
  setup () {
    const router = useRouter()

    return {
        router,
      }
    },
  methods: {
    redirect_login_page () {
      let tazoom_link = process.env.FRONTEND_URL
      window.location.href = tazoom_link
    },
  },
  computed: {
    header_logo () {
      let result = S3_IMAGE_LINK + 'loading-logo.jpg'
      return result 
    },
  }
}
</script>