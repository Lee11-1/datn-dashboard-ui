<template>
    <div class="eg-header"
              id="layout-header"
              :style="!$is_mobile ? {'background-color':'white', 'position': 'sticky'} : {'background-color':'white'}">
      <header-introduction style="max-width: 1300px; margin: auto;border-bottom: 2px solid #224E67;" />
    </div>
    <div class="landing-page-hot-deal" :class="$is_mobile ? 'q-px-sm register-container-mobile': 'register-container'" :style="{'background-image': `url(${get_background_image})`}">
      <div class="bg-white">
        <!-- <div class="text-center most-revenue-tazoom"
          :class="$is_mobile ? 'info-content-title-most-revenue q-pt-lg' : 'info-content-title-most-revenue-mobile'">
            {{title_welcome }}
      </div> -->
      <div class="text-center"
             :class="$is_mobile ? 'info-content-title q-pt-xl' : 'info-content-title-mobile q-pt-md'">
            {{ subtitle_welcome }}
      </div>
      <div class="q-pt-sm text-center"
             :class="$is_mobile ? 'info-content-caption' : 'info-content-caption-mobile'">
            {{ description }}
      </div>
      <div class="q-pt-sm text-center"
             :class="$is_mobile ? 'info-content-caption' : 'info-content-caption-mobile'">
            {{ description_signing_up }}
      </div>
      <div class="row justify-center q-pt-sm">
            <div class="col-lg-3 col-12"
                 :class="$is_mobile ? 'q-mx-md desktop-special-img q-my-lg': 'q-mt-md'"
                 v-for="(tour, idx) in tour_explore" :key="idx">
                <q-card class="special-deal-item">
                    <q-img :src="tour.list_image[0].url" v-if="$is_mobile" :ratio="3/2" class="img-special-deals">
                        <div class="absolute-bottom text-subtitle2 deal-item-content-mobile"
                             :class="$is_mobile ? 'desktop-item-content': ''">
                            <div
                            :class="tour.destination === 'Safari' ? 'text-title-destination-mobile' : ''"
                            >{{ tour.title }}</div>
                            <!-- <div>{{ tour.note }}</div> -->
                            <q-btn dense flat round
                                   class="special-option-btn">
                                <q-icon size="sm" name="blur_on"/>
                            </q-btn>
                        </div>
                        <div class="item-layer"></div>
                    </q-img>
                    <q-img :src="tour.list_image[0].url" v-else>
                        <div class="absolute-bottom text-subtitle2 deal-item-content"
                             :class="$is_mobile ? 'desktop-item-content': ''">
                            <div
                            :class="tour.destination === 'Safari' ? 'text-title-destination' : ''">
                            {{ tour.title }}</div>
                            <!-- <div>{{ tour.note }}</div> -->
                            <q-btn dense flat round
                                   class="special-option-btn">
                                <q-icon size="sm" name="blur_on"/>
                            </q-btn>
                        </div>
                        <div class="item-layer"></div>
                    </q-img>
                </q-card>
            </div>
        </div>
        <div class="row" :class="!this.$is_mobile ? 'q-py-md' : 'q-py-xl'">
            <div class="row col-12 justify-center">
                <q-btn class="q-px-lg btn-see-all-deal text-weight-bold" no-caps label="Get Started"  @click="this.$refs.b2b_register_dialog.open()"/>
                <b2b-register-dialog ref="b2b_register_dialog"
                           @registered="handle_registered"/>
            </div>
        </div>
      </div>
    </div>
    <footer-introduction class="footer-information" />
   
    <b2b-register-success-dialog ref="b2b_register_success_dialog" />

</template>
<script>
import B2bRegisterDialog from 'src/pages/static/sign-up/create-account'
import B2bRegisterSuccessDialog from 'src/pages/static/sign-up/b2c-register/register-success'
import HeaderIntroduction from './header'
import FooterIntroduction from './footer'
import {use_api} from 'src/composibles/api'
import { S3_IMAGE_LINK } from 'src/components/constants'

export default {
  components:{
      B2bRegisterDialog,
      B2bRegisterSuccessDialog,
      HeaderIntroduction,
      FooterIntroduction
  },
 
  data () {
    return {
      showed: true,
      title_welcome: 'More Revenue for Your Safari & Tour Business',
      subtitle_welcome: 'Reach 400 + million Shoppers',
      description: 'Signing up & becoming a partner in the Meetings VietNam marketplace is free, fast, and easy.',
      description_signing_up: 'What to look out for when signing-up',
      tour_explore: [],
      have_tour: false
    }
  },
  computed:{
    get_background_image(){
      let image_link = S3_IMAGE_LINK + 'background-home-page.jpg'
      return image_link
    }
  },
  created () {
      this.init()
    },
  methods: {
    open () {
      this.showed = true
    },
    close () {
      this.showed = false
    },
    handle_registered () {
        this.$emit('registered')
        this.close()
      },
    async init () {
        const api = use_api()
        const product_response = await api.get_explore()
        if (product_response.status === 200) {
            this.tour_explore = product_response.data.result.filter(te => te.product_code == 'tour' && te.destination == 'SignUp')
        }
        this.tour_explore = this.tour_explore.map(t => ({...t, model: 0}))
        },
  }
}
</script>
