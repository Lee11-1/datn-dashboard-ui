<template>
  <div class="column items-center justify-center cursor-pointer full-width update-file"
       @click="$refs.file_picker.click()">
    <div class="q-pa-lg">
      <q-btn round icon="file_upload" color="primary" />
    </div>
    <div class="column items-center q-pb-xl">
      <div v-if="caption" class="text-h6">{{ caption }}</div>
      <div>Click to upload</div>
      <div class="text-uppercase">{{ file_accepted.caption }}</div>
      <div>(max 20 MB for file)</div>
    </div>
  </div>
  <input style="display: none"
         :accept="file_accepted.accepted"
         @change="start_upload"
         type="file" ref="file_picker"/>
  <image-upload scope_type="System"
        @uploaded="handle_image_uploaded"
        ref="image_upload_dialog"/>
</template>

<script>
import {computed, ref, onBeforeMount, watch} from 'vue'
import {useStore} from 'vuex'
import {useQuasar} from 'quasar'
import ImageUpload from 'src/components/common/media/images/upload-dialog'
import {LIST_EXTENSION_FILE} from 'src/components/constants'
import debounce from 'lodash/debounce'

export default {
  components: {
    ImageUpload,
  },
  emits: ["files", "uploaded"],
  props: {
    caption: {type: String},
    get_file: {type: Boolean, default: false},
    extension_file: {type: String}
  },
  setup (props, context) {
    const textinput = ref(null)
    const store = useStore()
    const $q = useQuasar()
    const image_upload_dialog = ref(null)

    let file_accepted = {}
    const extension_file_accepted = async () => {
      switch (props.extension_file) {
        case 'image':
          file_accepted = {
            accepted: 'image/*',
            caption: 'png, jpeg, svg, jpg'
          }
          break;
        case 'video':
          file_accepted = {
            accepted: '.mp3, .mp4',
            caption: 'mp3, mp4'
          }
          break;
        case 'pdf':
          file_accepted = {
            accepted: '.doc, .docx, .pdf',
            caption: 'doc, docx, pdf'
          }
          break;
        default:
          file_accepted = {
              accepted: '.mp3, .mp4, image/*',
              caption: 'png, jpg, jpeg, mp3, mp4'
            }
          break;
      }
    }
    extension_file_accepted()

    const start_upload = $event => {
      let files = $event.target.files
      if (!files.length) return

      if (files[0].size > 20 * 1024 * 1024) {
        $q.notify({
          type: 'negative',
          message: 'The size of file more than 20 MB'
        })
        return
      }
      
      if (file_accepted.caption.includes(files[0].name.split(',')[1])) {
        $q.notify({
          type: 'negative',
          message: `Not accept extension ${files[0].name.split(',')[1]}`
        })
        return
      }

      if (props.get_file) context.emit('files', files[0])
      else image_upload_dialog.value.open(files, 'PDF')
    }
    const handle_image_uploaded = (image) => {
      context.emit('uploaded', image)
    }

    return {
      image_upload_dialog,
      start_upload,
      file_accepted,
      handle_image_uploaded,
      extension_file_accepted
    }
  }
}
</script>
