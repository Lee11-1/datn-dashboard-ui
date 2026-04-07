<template>
  <div class="row">
    <div class="col-4 q-pr-md" style="max-height: 70vh; overflow-y: auto;">
      <q-card flat>
        <q-card-section>
          <div class="text-h6">Categories</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="isLoading" class="text-center q-pa-lg">
          <q-spinner color="primary" size="40px" />
          <div class="text-grey-7 q-mt-md">Loading categories...</div>
        </q-card-section>
        <q-card-section v-else-if="categoryList.length === 0" class="text-center q-pa-lg">
          <div class="text-grey-7">No categories found</div>
        </q-card-section>
        <q-card-section v-else>
          <q-tree
            :nodes="categoryTree"
            node-key="id"
            selected-color="primary"
            v-model:selected="selectedCategoryId"
            @update:selected="onCategorySelected"
            label-key="name"
          />
        </q-card-section>
      </q-card>
    </div>
    <div class="col-8">
      <q-card v-if="selectedCategory" flat>
        <q-card-section>
          <div class="text-h6">Edit Category</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pa-none">
          <category-form v-model="selectedCategory"
                         :parentCategories="categoryList"
                         @updated="onCategoryUpdated"
                         ref="form" />
        </q-card-section>
      </q-card>
      <q-card v-else flat>
        <q-card-section class="text-center q-pa-lg">
          <div class="text-h6 text-grey-7">Select a category to view details</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import {ref, computed} from 'vue'
import {useQuasar} from 'quasar'
import CategoryForm from '../dialog/form'

export default {
  components: {
    CategoryForm
  },
  props: {
    categoryList: {type: Array, default: () => []},
    isLoading: {type: Boolean, default: false}
  },
  setup (props, context) {
    const $q = useQuasar()
    const form = ref(null)
    const selectedCategoryId = ref(null)
    const selectedCategory = ref(null)
    const categoryTree = computed(() => {
      const buildTree = (categories, parentId = null) => {
        return categories
          .filter(cat => cat.parentId === parentId)
          .map(cat => ({
            ...cat,
            children: buildTree(categories, cat.id)
          }))
          .sort((a, b) => a.sortOrder - b.sortOrder)
      }
      return buildTree(props.categoryList)
    })

    const onCategorySelected = (categoryId) => {
      const category = props.categoryList.find(cat => cat.id === categoryId)
      selectedCategory.value = category ? {...category} : null
    }

    const onCategoryUpdated = (updatedCategory) => {
      const index = props.categoryList.findIndex(cat => cat.id === updatedCategory.id)
      if (index >= 0) {
        props.categoryList[index] = updatedCategory
        selectedCategory.value = {...updatedCategory}
      }
    }

    return {
      categoryTree,
      selectedCategoryId,
      selectedCategory,
      form,
      onCategorySelected,
      onCategoryUpdated,
    }
  }
}
</script>
