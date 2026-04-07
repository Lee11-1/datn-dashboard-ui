<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="column window-height backgound-profile">
          <div class="row justify-center">
            <div class="col-12 col-sm-12 col-md-12 col-lg-12">
              <q-card class="card-profile">
                <div class="q-py-lg q-px-xl custom-profile">
                    <q-stepper
                        v-model="step"
                        header-nav
                        class="stepper-profile q-pb-sm"
                        ref="stepper"
                        animated
                        >
                        <q-step
                            :name="1"
                            title="Name"
                            class="height-step-profile "
                        >
                            <div class="column col-12 div-height-profile">
                                <div class="col-11">
                                    <div class="col-12 row text-h4">What is the name of your safari/tour business?</div>
                                    <div class="col-12 row text-h6">Please do not include descriptive text such as location or qualifiers ("Best”, “Most Adventurous", etc)</div>
                                    <div class="col-12 row q-pt-md">
                                        <q-input
                                            outlined
                                            v-model="form.values.tour_name"
                                            class="col-5"
                                            placeholder="Example: Golden Ocean Safaris"
                                            :rules="form.rules.text"
                                        ></q-input>
                                    </div>
                                    <div class="col-12 row q-pt-xs">
                                        <div class="col-6 note-profile q-py-sm q-px-sm text-center">Note: You can change the name of your safari & tour any time</div>
                                    </div>
                                </div>

                                <div class="col-1">
                                    <q-stepper-navigation class="col-12 row">
                                        <div class="col-6"></div>
                                        <div class="col-6 row justify-end">
                                            <q-btn @click="() => { done_name = true; step = 2 }" class="col-3 text-capitalize btn-profile" label="Next" />
                                        </div>
                                    </q-stepper-navigation>
                                </div>
                            </div>
                        </q-step>

                        <q-step
                            :name="2"
                            title="General"
                            class="height-step-profile"
                        >
                            <div class="column col-12 div-height-profile">
                                <div class="col-11">
                                    <div class="col-12 row text-h4">What type of safari or tour business do you operate?</div>
                                    <div class="safari-tour-contain row">
                                        <div class="safari-tour-item q-pl-none q-pt-lg q-pr-lg" v-for="item in option_list" :key="item.id">
                                            <q-card class="row justify-center" :class="item.default ? 'safari-tour-card-active' : 'safari-tour-card'" @click="handle_click_safari_tour(item.category_name)">
                                                <div class="text-center q-px-md q-py-md q-my-auto">
                                                    <q-item-label :lines="2" class="safari-tour-title">{{ item.category_name }}</q-item-label>
                                                </div>
                                            </q-card>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-1">
                                    <q-stepper-navigation class="col-12 row">
                                        <div class="col-6">
                                            <q-btn flat @click="step = 1" label="Back" icon="keyboard_backspace" class="col-3 text-capitalize btn-profile-back" /> 
                                        </div>
                                        <div class="col-6 row justify-end">
                                            <q-btn @click="() => { done_general = true; step = 3 }" class="col-3 text-capitalize btn-profile" label="Next" /> 
                                        </div>
                                    </q-stepper-navigation>
                                </div>
                            </div>
                        </q-step>

                        <q-step
                            :name="3"
                            title="Location"
                            class="height-step-profile"
                        >
                            <div class="column col-12 div-height-profile">
                                <div class="col-11">
                                    <div class="col-12 row text-h4">Where is your safari/tour business located?</div>
                                    <div class="col-12 row q-pt-lg">
                                        <div class="col-12 row q-pb-sm text-location-custom">Street, Number</div>
                                        <div class="col-12 row">
                                            <q-input
                                                outlined
                                                v-model="form.values.business_location.street_number"
                                                class="col-6"
                                                :rules="form.rules.text"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-12 row q-pt-sm">
                                        <div class="col-12 row q-pb-sm text-location-custom">Addition Address Line &nbsp;<div class="span-location">(Optional)</div></div>
                                        <div class="col-12 row">
                                            <q-input
                                                outlined
                                                v-model="form.values.business_location.addition_address_line"
                                                class="col-6"
                                                :rules="form.rules.text"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-12 row q-pt-sm">
                                        <div class="col-6 row">
                                            <div class="col-4">
                                                <div class="col-12 row q-pb-sm text-location-custom">Post Code</div>
                                                <div class="col-12 row">
                                                    <q-input
                                                        outlined
                                                        type="number"
                                                        v-model="form.values.business_location.post_code"
                                                        class="col-11"
                                                        :rules="form.rules.text"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="col-12 row q-pb-sm text-location-custom">Town/City</div>
                                                <div class="col-12 row">
                                                    <q-input
                                                        outlined
                                                        v-model="form.values.business_location.town_city"
                                                        class="col-11"
                                                        :rules="form.rules.text"
                                                    />
                                                </div>
                                            </div>
                                            <div class="col-4">
                                                <div class="col-12 row q-pb-sm text-location-custom">Country</div>
                                                <div class="col-12 row">
                                                    <q-input
                                                        outlined
                                                        v-model="form.values.business_location.country"
                                                        class="col-12"
                                                        :rules="form.rules.text"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-1">
                                    <q-stepper-navigation class="col-12 row">
                                        <div class="col-6">
                                            <q-btn flat @click="step = 2" icon="keyboard_backspace" class="col-3 text-capitalize btn-profile-back" label="Back" /> 
                                        </div>
                                        <div class="col-6 row justify-end">
                                            <q-btn @click="() => { done_location = true; step = 4 }" class="col-3 text-capitalize btn-profile" label="Next" />
                                            <!-- <q-btn @click="handle_click_submit()" class="col-3 text-capitalize btn-profile" label="Submit" /> -->
                                        </div>
                                    </q-stepper-navigation>
                                </div>
                            </div>
                        </q-step>

                        <q-step
                            :name="4"
                            title="Legal"
                            class="height-step-profile"
                        >
                            <div class="column col-12 div-height-profile">
                                <div class="col-11">
                                    <div class="col-12 row text-h4">Please provide for a copy of your business registration</div>
                                    <div class="col-12 row q-pt-lg">
                                        <div class="col-6">
                                            <upload-file
                                                :get_file="get_files"
                                                :extension_file="'pdf'"
                                                @files="(file) => handle_file_upload('pdf', file)" />
                                        </div>
                                    </div>
                                    <div class="col-12 row q-pt-lg">
                                        <q-card class="col-9 card-legal-custom">
                                            <q-card-section class="col-12 row">
                                                <div class="col-6 text-left text-h6 q-pl-md">File</div>
                                                <div class="col-6 text-right text-h6 q-pr-sm">Remove</div>
                                            </q-card-section>

                                            <q-separator />

                                            <q-card-actions v-if="form.values.business_registration.pdf.length">
                                                <div class="col-12 row q-py-sm" v-for="item, i in form.values.business_registration.pdf" :key="i">
                                                    <div class="col-11">
                                                        <div class="col-12 row">
                                                            <div class="col-1 text-center q-pl-md"><q-icon name="description" style="font-size: 50px" /></div>
                                                            <div class="col-11 row items-center text-h6 q-px-md"><q-item-label :lines="2">{{ item.name }}</q-item-label></div>
                                                        </div>
                                                    </div>
                                                    <div class="col-1 row items-center justify-end q-pr-md" v-if="form.values.business_registration.pdf.length">
                                                        <q-btn round size="sm" icon="delete" color="red"
                                                            @click="remove_field(i)" />
                                                    </div>
                                                </div>
                                            </q-card-actions>
                                            <q-card-actions v-else>
                                                <br>
                                            </q-card-actions>
                                        </q-card>
                                    </div>
                                </div>

                                <div class="col-1">
                                    <q-stepper-navigation class="col-12 row">
                                        <div class="col-6">
                                            <q-btn flat @click="step = 3" icon="keyboard_backspace" class="col-3 text-capitalize btn-profile-back" label="Back" /> 
                                        </div>
                                        <div class="col-6 row justify-end">
                                            <q-btn @click="handle_click_submit()" class="col-3 text-capitalize btn-profile" label="Submit" :loading="processes.submit_info.in_progress" />
                                        </div>
                                    </q-stepper-navigation>
                                </div>
                            </div>
                        </q-step>
                    </q-stepper>
                </div>
              </q-card>
            </div>
            <div class="col-12" v-if="processes.submit_info.error">
                <q-dialog v-model="processes.submit_info.error" persistent>
                    <div class="swal-overlay swal-overlay--show-modal">
                    <div class="swal-modal warning-center">
                        <div class="swal-title">
                        <span>
                            Invalid Information
                        </span>
                        </div>
                        <div>
                            <q-separator dark />
                            <q-item class="">
                                <q-item-section>
                                <q-item-label style="font-size: 20px" class="swal-text">
                                    <div v-html="processes.submit_info.error_message">
                                    </div>
                                </q-item-label>
                                </q-item-section>
                            </q-item>
                            </div>
                            <div class="q-pa-md q-gutter-sm swal-close" align="right">
                            <q-btn flat color="primary" label="Close" v-close-popup />
                        </div>
                    </div>
                    </div>
                </q-dialog>
            </div>
            <div class="col-12" v-if="processes.session_expired.error">
                <q-dialog v-model="processes.session_expired.error" persistent>
                    <div class="swal-overlay swal-overlay--show-modal">
                    <div class="swal-modal warning-center">
                        <div class="swal-title">
                        <span>
                            Session Expired!
                        </span>
                        </div>
                        <div>
                            <q-separator dark />
                            <q-item class="">
                                <q-item-section>
                                <q-item-label style="font-size: 20px" class="swal-text">
                                    <div v-html="processes.session_expired.error_message">
                                    </div>
                                </q-item-label>
                                </q-item-section>
                            </q-item>
                            </div>
                            <div class="q-pa-md q-gutter-sm swal-close" align="right">
                            <q-btn flat color="primary" label="Back to home" @click="redirect_to_login()" v-close-popup />
                        </div>
                    </div>
                    </div>
                </q-dialog>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>
import {reactive, ref} from 'vue'
import {useRouter, useRoute} from "vue-router"
import {use_api} from 'src/composibles/api'
import {useStore} from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import UploadFile from './update-file'
import { APP_NAME } from 'src/components/constants'

export default {
    components:{
        UploadFile
    },
    data () {
        return {
            processes: {
                submit_info: {
                    in_progress: false,
                    platform_id: null,
                    error: false,
                    error_message: null,
                },
                session_expired: {
                    error: false,
                    error_message: null,
                }
            },
            form: {
                values: {
                    tour_name: '',
                    business_location: {
                        street_number: '',
                        addition_address_line: '',
                        post_code: '',
                        town_city: '',
                        country: ''
                    },
                    business_registration: {
                        pdf: []
                    }
                },
                rules: {
                    text: [
                        v => (!!v && !!v.trim()) || 'Required!'
                    ]
                }
            },
           
            option_list: [],
            api: use_api(),
            default: false,
            get_files: true,
        }
    },
    setup () {
        const router = useRouter()
        const step = ref(1)
        const done_name = ref(false)
        const done_general = ref(false)
        const done_location = ref(false)

        return {
            router,
            step,
            done_name,
            done_general,
            done_location,
        }
    },
    created () { 
        this.check_session_expired()
        this.get_option_list()
    },
    methods: {
        handle_file_upload(src, file) {
            switch (src) {
                case 'pdf':
                    this.form.values.business_registration.pdf.push(file)
                    break;
            }
        },
        remove_field (index) {
            this.form.values.business_registration.pdf.splice(index, 1)
        },
        async check_session_expired() {
            let process = this.processes.session_expired
            process.error = false
            let payload = {}

            if (this.$route.query.active_key){
                payload.active_key = this.$route.query.active_key
            } else {
                process.error = true
                process.error_message = "Couldn't process your selection. Please try again later."
                return
            }

            if (!process.error) {
                const response = await this.api.b2b_active_user(payload)
                if (response.status === 200) {
                    // this.router.push('/thank-you')
                    process.error = false
                } else {
                    process.error = true
                    process.error_message = "Your session has expired. Please try again."
                }
            }
        },
        redirect_to_login () {
            this.router.push('/auth')
        },
        handle_click_safari_tour (data) {
            this.option_list.map(x => {
                if (x.category_name == data) {
                    x.default = !x.default
                }
            })
        }, 
        async handle_click_submit() {
            this.check_session_expired()
            
            let process = this.processes.submit_info
            process.in_progress = true
            process.error = false

            let payload = {
                meta: {
                    ...this.form.values
                },
                active_key: this.$route.query.active_key
            }

            if (this.$route.query.b2b_user_id){
                payload.b2b_user_id = this.$route.query.b2b_user_id
            } else {
                process.error = true
                process.error_message = "Couldn't process your selection. Please try again later."
                return
            }

            payload.meta.tour_type = this.option_list && this.option_list.length > 0 ? this.option_list.filter(x => x.default) : []

            let tour_name = this.form.values.tour_name
            let street_number = this.form.values.business_location.street_number
            let addition_address_line = this.form.values.business_location.addition_address_line
            let post_code = this.form.values.business_location.post_code
            let town_city = this.form.values.business_location.town_city
            let country = this.form.values.business_location.country
            let business_registration = this.form.values.business_registration.pdf

            if (!country || !town_city || !post_code || !addition_address_line || !street_number || !tour_name || business_registration.length == 0) {
                process.error = true
                process.error_message = 'All necessary information, please fill in completely'
            }

            let form_data = new FormData()
            let business_registration_file = business_registration.filter(item => item instanceof File)

            if (business_registration_file.length && country && town_city && post_code && addition_address_line && street_number && tour_name) {
                business_registration_file.forEach(file => {
                    form_data.append('image_list', file)
                })
                form_data.append('folder', 'file')
                form_data.append('app_name', APP_NAME)
                const response_pdf = await this.api.upload_file_to_aws(form_data)
                if (response_pdf.status === 200) {
                    payload.meta.business_registration = response_pdf.data.image_list
                } else {
                    process.error = true
                    process.error_message = 'Update File Failed'
                }

                if (!process.error) {
                    const response = await this.api.update_user(payload)
                    if (response.status === 200) {
                        this.router.push('/thank-you')
                    } else {
                        process.error = true
                    }
                }
            } else {
                process.error = true
            }
            process.in_progress = false
        },
        async get_option_list () {
            let app_id = process.env.APP_ID
            let payload = {
                app_id: app_id
            }
            const response = await this.api.list_categories_b2btour(payload)
            if (response.status === 200) {
                
                this.option_list = cloneDeep(response.data.result)
                if (this.option_list && this.option_list.length > 0) {
                    this.option_list.map(x => 
                    {
                        x.default = this.default
                    })
                }
            }
        }
    }
}
</script>
