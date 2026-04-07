<template>
  <q-page class="q-pa-lg">
    <div v-if="process.loading" class="row justify-center items-center" style="min-height: 60vh;">
      <div class="text-center">
        <q-spinner color="primary" size="50px" />
        <div class="text-h6 q-mt-md text-grey-7">Loading categories...</div>
      </div>
    </div>
    <div v-else>
      <div class="row items-center q-pb-md justify-between">
        <div class="text-h6 q-pr-sm">
          Categories
        </div>
        <q-btn color="primary" 
               label="Create Category" 
               icon="add"
               @click="$refs.detail_dialog.toggle()"
               style="margin-right: 10px" />
      </div>
      <category-tree ref="tree" 
                     :categoryList="categoryList"
                     :isLoading="process.loading" />
    </div>
  </q-page>
  <create-category ref="detail_dialog"
                   :parentCategories="categoryList"
                   @created="val => handle_category_created(val)" />
</template>
<script>
import {ref, reactive, onBeforeMount} from 'vue'
import {useQuasar} from 'quasar'
import {use_api} from 'src/composibles/api'

import CategoryTree from 'components/category/tree'
import CreateCategory from 'components/category/dialog/create'

export default {
  components: {
    CategoryTree,
    CreateCategory
  },
  setup () {
    const api = use_api()
    const $q = useQuasar()
    const tree = ref(null)
    const categoryList = ref([])
    const process = reactive({
      loading: false
    })

    const list_categories = async () => {
      process.loading = true
      const response = await api.list_categories({})
      if (response.status === 200) {
        categoryList.value = response.data
      } else {
        $q.notify({
          type: 'negative',
          message: response.message || 'Error loading categories'
        })
      }
      process.loading = false
    }

    const handle_category_created = (newCategory) => {
      categoryList.value.push(newCategory)
    }

    onBeforeMount(() => {
      list_categories()
    })

    return {
      tree,
      categoryList,
      process,
      handle_category_created,
    }
  }
}
</script>
