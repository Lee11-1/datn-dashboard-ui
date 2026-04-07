<template>
  <div>
    <!-- <footer class="footer">
      <div class="col-12 row justify-between q-pt-md">
        <div class="col-4 row justify-between">
          <a @click="redirect_page('/about-us')" class="nav-link">About</a>
          <a @click="redirect_page('/accessibility')" class="nav-link">Accessibility</a>
          <a @click="redirect_page('/legal')" class="nav-link">Legal</a>
          <a @click="redirect_page('/support')" class="nav-link">Support</a>
        </div>
        <div class="col-2 row justify-between">
          <div class="col-12 row">
            <a href="" class="nav-content">Safari & Tour Operators</a>
          </div>
          <div class="col-12 flex justify-between q-pb-sm q-mb-md q-pt-sm">
            <q-btn @click="this.$refs.b2b_register_dialog.open()" class="text-capitalize footer-btn-join" label="Join" />
            <q-btn class="q-px-lg footer-btn text-weight-bold" @click="redirect_login_page" no-caps label="Login" />
          </div>
        </div>
        <div class="row col-md-4 col-12 q-pt-sm q-pb-sm" :class="$is_mobile ? '' : ''">
          <div class="col-12 row footer_icon">
            <q-img
              :src="footer_icon_facebook"
              class="eg-footer-logo-icon"
              contain
            />
            <q-img
              :src="footer_icon_tiktok"
              class="eg-footer-logo-icon"
              contain
            />
            <q-img
              :src="footer_icon_youtube"
              class="eg-footer-logo-icon"
              contain
            />
          </div>
        </div>
      </div>
      <div class="col-12 footer-title" :class="$is_mobile ? 'q-pb-md' : 'q-pb-lg'">
        <p class="title">VNAMAZING</p>
        <p class="copy-right">© 2025 VNAmazing. All Rights Reserved.</p>
      </div>
      <b2b-register-dialog ref="b2b_register_dialog"
                           @registered="handle_registered"/>
    </footer> -->
    <div v-if="$is_mobile">
      <footer class="footer">
        <div class="container-wrapper">
           <nav class="navbar navbar-footer">
            <ul
              id="footer_0_contentfooter_0_navFooter"
              class="nav navbar-nav five-columns"
            >
              <li class="dropdown">
                <div
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-list-type="Footer"
                  data-content-type="Navigation"
                  data-content-title="Tour Packages"
                >
                  <p style="font-size: 18px; font-weight: 700; opacity: 1">
                    Tour Packages
                  </p>
                </div>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="About us"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Cultural Highlights</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Our Fleet"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Golf Packages</a
                    >
                  </li>

                  <li>
                    <a
                      class="Footer"
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Luxury & Wellness"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Luxury & Wellness
                    </a>
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Special events & MICE"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Special events & MICE</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Beach Holidays"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Beach Holidays</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="River cruising"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      River cruising</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Tour of special interest"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Tour of special interest</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Adventures"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Adventures</a
                    >
                  </li>
                </ul>
              </li>

              <li class="dropdown">
                <div
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-list-type="Footer"
                  data-content-type="Navigation"
                  data-content-title="Destinations"
                >
                  <p style="font-size: 18px; font-weight: 700; opacity: 1">
                    Destinations
                  </p>
                </div>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Vietnam"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Vietnam</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Laos"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Laos</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Cambodia"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Cambodia</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Myanmar"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Myanmar</a
                    >
                  </li>
                </ul>
              </li>

              <li class="dropdown">
                <div
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-list-type="Footer"
                  data-content-type="Navigation"
                  data-content-title="ITS Brochures"
                >
                  <p style="font-size: 18px; font-weight: 700; opacity: 1">
                    ITS Brochures
                  </p>
                </div>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Brochures"
                      data-content-id=""
                      href=""
                    >
                      <q-icon name="arrow_forward" />
                      Brochures</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Terms & Conditions"
                    >
                      <q-icon name="arrow_forward" />
                      Terms & Conditions</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Travel guide and tips"
                    >
                      <q-icon name="arrow_forward" />
                      Travel guide and tips</a
                    >
                  </li>
                </ul>
              </li>
              <li class="dropdown">
                <div
                  class="dropdown-toggle"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  data-list-type="Footer"
                  data-content-type="Navigation"
                  data-content-title="Useful Information"
                >
                  <p style="font-size: 18px; font-weight: 700; opacity: 1">
                    Sitemap
                  </p>
                </div>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Why Us"
                    >
                      <q-icon name="arrow_forward" />
                      Why Us</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Tour Packages"
                    >
                      <q-icon name="arrow_forward" />
                      Tour Packages</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Special Deals"
                    >
                      <q-icon name="arrow_forward" />
                      Special Deals</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="News Feed"
                    >
                      <q-icon name="arrow_forward" />
                      News Feed</a
                    >
                  </li>

                  <li>
                    <a
                      data-list-type="Footer"
                      data-content-type="Navigation"
                      data-content-title="Contact Us"
                    >
                      <q-icon name="arrow_forward" />
                      Contact Us</a
                    >
                  </li>
                </ul>
              </li>
            </ul>
            <div class="circle-with-arrow">
              <div class="arrow">
                <q-icon class="arrow-up" name="keyboard_arrow_up" />
              </div>
            </div>
          </nav>
        <div
            id="footer_0_copyright_0_divCopyright"
            role="tabpanel"
            class="tab-pane"
            tabindex="0"
          >
            <!-- <div class="copyright-footer">
              <div>
                <a href="" class="nav-content" dom-key="common.safari-tour-operators">{{ $t('common.safari-tour-operators') }}</a>
              </div>
              <div>
                <q-btn @click="get_dashboard_link('/sign-up')" class="text-capitalize footer-btn-join" :label="$t('common.join')" dom-key="common.join" />
                <q-btn class="q-px-lg ext-capitalize footer-btn-join" @click="get_dashboard_link('/auth')" no-caps :label="$t('common.login')" dom-key="common.login" />
              </div>
            </div> -->

            <div class="footer-row">
              <div class="clearfix-footer">
                <div
                  id="footer_0_copyright_0_ctl00_hplSkyteamFt"
                  class="skyteam-ft"
                >
                  <img
                    src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/logo-indochina.png"
                    alt=""
                    width="170px"
                    height="62px"
                  />
                </div>

              
              </div>
              <div class="company-info">
                <!-- <p class=""> -->
                <p style="line-height: 14px; position: relative; top: -7px">
                  © Copyright by Indochina 2025 All Rights Reserved
                </p>
                <p style="margin-bottom: 2px; position: relative; top: -5px">
                  Hanoi: Suite 1705 – Artex building, 172 Ngoc Khanh, Giang Vo,
                  Ha Noi, Vietnam.
                </p>

                <img
                  style="
                    width: 16px !important;
                    margin: 0 0 -4px 0 !important;
                    display: inline !important;
                  "
                  alt="none"
                  src="https://www.vietnamairlines.com/~/media/Images/icon/typicons_2-0-7_phone-outline_256_0_d9f6ff_none.png"
                />
                +84 24 62514052 &nbsp;&nbsp;&nbsp;&nbsp;
                <img
                  style="
                    width: 16px !important;
                    margin: 0 0 -4px 0 !important;
                    display: inline !important;
                  "
                  alt="none"
                  src="https://www.vietnamairlines.com/~/media/Images/icon/typicons_2-0-7_phone-outline_256_0_d9f6ff_none.png"
                />
                +84 9 3663 1705 &nbsp;&nbsp;&nbsp;&nbsp;
              
                <img
                  style="
                    width: 16px !important;
                    margin: 0 0 -4px 0 !important;
                    display: inline !important;
                  "
                  alt="none"
                  src="https://www.vietnamairlines.com/~/media/Images/icon/typicons_2-0-7_mail_256_0_d9f6ff_none"
                />&nbsp; Email:
                <a href="mailto:info@itsvietnam.com">info@itsvietnam.com</a>
                
              </div>
              <div class="logo-partner" style="display: relative">
                <div
                  style="
                    display: flex;
                    gap: 16px;
                    direction: rtl;
                    margin-bottom: 5px;
                  "
                >
                  <div>
                    <a href="https://vn.linkedin.com/company/vietnamairlines">
                      <img
                        src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/footer-shape.png"
                        style="width: 24px; height: 24px"
                        alt=""
                      />
                    </a>
                  </div>
                  <div>
                    <a
                      data-list-type="Footer"
                      data-content-type="Social Page"
                      href="https://www.instagram.com/vietnamairlines/"
                    >
                      <img
                        class="icon-instagram"
                        src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/footer-instagram.png"
                        alt=""
                    /></a>
                  </div>

                  <div>
                    <a href="https://x.com/vnairlines">
                      <img
                        src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/footer-twitter.png"
                        style="width: 24px; height: 24px"
                        alt=""
                      />
                    </a>
                  </div>
                  <div>
                    <a
                      data-list-type="Footer"
                      data-content-type="Social Page"
                      href="https://www.vietnamairlines.com/facebook"
                    >
                      <img
                        class="icon-facebook"
                        src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/footer-facebook.png"
                        alt=""
                    /></a>
                  </div>
                </div>
                <div style="display: flex; gap: 5.44px; direction: rtl">
                  <div
                    style="
                      border-radius: 5.44px;
                      background-color: white;
                      padding: 3px;
                      width: 83px;
                      height: 39px;
                      align-items: center;
                    "
                  >
                    <img
                      src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/footer-iagto.png"
                      alt=""
                      style="width: 76px; height: 32px"
                    />
                  </div>
                  <div
                    style="
                      width: 102px;
                      height: 39px;
                      border-radius: 5.44px;
                      background-color: white;
                      padding: 0.5px;
                    "
                  >
                    <img
                      src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/footer-vnaairline.png"
                      alt=""
                      style="width: 100px; height: 38px; border-radius: 5.44px"
                    />
                  </div>
                  <div
                    style="
                      width: 125.01px;
                      height: 39px;
                      border-radius: 5.44px;
                      background-color: white;
                      padding: 2.5px;
                      overflow: hidden;
                    "
                  >
                    <img
                      src="https://dkq4hg8r4rfz0.cloudfront.net/cms/vnzamazing-tour/images/footer-ustoa.png"
                      alt=""
                      style="
                        width: 120px;
                        border-radius: 5.44px;
                        position: relative;
                        top: -20px;
                        clip-path: polygon(0px 30%, 100% 30%, 100% 75%, 0 75%);
                      "
                    />
                  </div>
                </div>

               
              </div>
            </div>
      
          </div>
        </div>
       
      </footer>
    </div>
 
  </div>
</template>
<script>
import B2bRegisterDialog from 'src/pages/static/sign-up/create-account'
import { S3_IMAGE_LINK } from 'src/components/constants'
import {useRouter} from "vue-router"

export default {
  components:{
  },
  data() {
    return {
      footer_icon_facebook: S3_IMAGE_LINK + 'facebook.png',
      footer_icon_tiktok: S3_IMAGE_LINK + 'instagram.png',
      footer_icon_twitter: S3_IMAGE_LINK + 'twitter.png',
      footer_icon_youtube: S3_IMAGE_LINK + 'youtube.png',
    };
  },
  setup () {
    const router = useRouter()
    
    const redirect_login_page = () => {
      router.push('/auth')
    }

    return {
        router,
        redirect_login_page
      }
  },
  computed: {
    footer_logo () {
      result = S3_IMAGE_LINK + 'footer-logo-'+ this.language_code +'en-US.png'
      return result
    },
  },
  methods: {
    redirect_page(data){
      let tazoom_link = process.env.FRONTEND_URL
        if(tazoom_link){
          window.location.href = tazoom_link + data
        }else{
          window.location.reload()
        }
    },
    handle_registered () {
      this.$refs.b2b_register_dialog.close()
    },
  }
};
</script>
<style>
.expand_circle {
  position: relative;
  top: -20px;
}
.company-info {
  color: white;
  line-height: 1.5;
  opacity: 0.8;
  position: relative;
  top: 0px;
}

.circle-with-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #c7dcf8;
  background-color: #3284c8;
  position: relative; /* Quan trọng để định vị mũi tên */
  top: -18px;
  right: -50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.arrow {
  position: absolute;
  right: 4px;
  top: -3px;
  font-size: 25px;
  color: white;
}
</style>