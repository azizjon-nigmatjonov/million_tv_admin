<template>
  <div>
    <template>
      <a-form-model
        @submit="onSubmit"
        ref="ruleForm"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
      >

        <a-row>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('logo_image')" prop="imageUrlLogo">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  class="avatar-uploader"
                  accept="image/*"
                  :show-upload-list="false"
                  :action="`${VUE_APP_API_BASE_URL}image-upload`"
                  :before-upload="beforeUploadLogo"
                  @change="handleChangeLogoImage"
                >
                  <img v-if="form.imageUrlLogo" :src="form.imageUrlLogo" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loadingLogo ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      {{ $t('upload') }}
                    </div>
                  </div>
                </a-upload>
              </a-form-model-item>
            </a-col>
          </a-row>
      
        <a-row>
          <!-- Title Ru -->
          <a-row v-if="lang === 'ru' || this.$route.name === 'SubscriptionCategoriesCreate'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title_ru">
                <a-input v-model="form.title_ru" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Title Uz -->
          <a-row v-if="lang === 'uz'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title_uz">
                <a-input v-model="form.title_uz" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Title En -->
          <a-row v-if="lang === 'en'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title_en">
                <a-input v-model="form.title_en" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Description Ru -->
          <a-row v-if="lang === 'ru' || this.$route.name === 'SubscriptionCategoriesCreate'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('description')" prop="description_ru">
                <a-input type="textarea" v-model="form.description_ru" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Description Uz -->
          <a-row v-if="lang === 'uz'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('description')" prop="description">
                <a-input type="textarea" v-model="form.description_uz" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Description En -->
          <a-row v-if="lang === 'en'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('description')" prop="description">
                <a-input type="textarea" v-model="form.description_en" />
              </a-form-model-item>
            </a-col>
          </a-row>
         
         <!-- Status -->
          <!-- <a-col :xs="24" style="padding: 0 15px"> -->
            <a-row>
              <a-col :xs="24" style="padding: 0 15px" >
                <a-form-model-item :label="$t('status')" prop="status">
                  <a-switch
                    v-model="form.status"
                    :checked-children="$t('active')"
                    :un-checked-children="$t('inactive')"
                  />
                </a-form-model-item>
            </a-col>
            </a-row>
          <!-- </a-col> -->

          <!-- Category -->
          <a-row v-if="type !== 'megogo' && type !== 'premier' && type !== 'session_limit'" >
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('categories') + ' (кино, сериалы)'" prop="category">
                <a-select
                  :placeholder="$t('category')"
                  v-model="form.category_relations[0].keys"
                  mode="multiple"
                >
                  <a-select-option v-for="category in getAllCategories" :key="category.slug" :value="category.slug">
                    {{ category.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          
           <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('integration')" prop="category">
                <a-input disabled type="text" v-model="form.category_relations[1].keys" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- <a-row v-if="type !== 'session_limit'" >
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('integration')" prop="category">
                <a-select
                  :placeholder="$t('integration')"
                  :value="form.category_relations[1].keys"
                  @change="integrationChangeFunction"
                  mode="multiple"
                  :disabled="type === 'megogo' || type === 'premier'"
                >
                  <a-select-option v-for="integration in integrations" :key="integration" :value="integration">
                    {{ $t(integration) }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->


          <!-- Number of movies -->
          <!-- <a-row v-if="type !== 'session_limit'" >
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('number_of_films')" prop="number_of_mas">
                <a-input-number class="number-input" v-model="form.number_of_mas" />
              </a-form-model-item>
            </a-col>
          </a-row> -->

           <!-- Number of channels -->
          <!-- <a-row v-if="type !== 'megogo' && type !== 'premier' && type !== 'session_limit'" >
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('number_of_channels')" prop="number_of_channels">
                <a-input-number class="number-input" v-model="form.number_of_channels" />
              </a-form-model-item>
            </a-col>
          </a-row> -->


           <!-- Number of cartoons -->
          <!-- <a-row v-if="type !== 'session_limit'" >
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('number_of_cartoons')" prop="number_of_cartoons">
                <a-input-number class="number-input" v-model="form.number_of_cartoons" />
              </a-form-model-item>
            </a-col>
          </a-row> -->


          <!-- Duration Type -->
          <!-- <a-row v-if="type !== 'premier' && type !== 'megogo'">
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('subscription_type') + ' (день, месяц)'" prop="duration_type">
                <a-select v-model="form.duration_type" :placeholder="$t('subscription_type')">
                  <a-select-option
                    v-for="durationType in durationTypes"
                    :key="durationType.value"
                    :value="durationType.value"
                  >
                    {{ durationType.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->

          <!-- Category Type -->
          <!-- <a-row v-if="type !== 'common' && type !== 'megogo' && type !== 'quality' && type !== 'premier'">
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('subscription_type') + ' (Бесплатно, платный)'" prop="categoryTypes">
                <a-select v-model="form.category_type" :placeholder="$t('subscription_type')">
                  <a-select-option
                    v-for="categoryType in categoryTypes"
                    :key="categoryType.value"
                    :value="categoryType.value"
                  >
                    {{ $t(categoryType.name) }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->
        </a-row>
      </a-form-model>
    </template>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data() {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      loadingLogo: false,
      tagId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      type: this.$route.query.type,
      integrations: this.$route.query.type === 'mix' ? ['tv'] : this.$route.query.type === 'common' ? ['tv', 'megogo', 'premier'] : ['all', 'tv', 'megogo', 'premier'],
      durationTypes: [
        { name: 'Day', value: 'day' },
        { name: 'Month', value: 'month' }
      ],
      categoryTypes: [
        { name: 'session_limit', value: 'session_limit' },
        { name: 'online_session_limit', value: 'live_session_limit' },
      ],
      rules: !this.$route.params.id ? {
        title_ru: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        imageUrlLogo: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
      } : {
        title_ru: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        title_uz: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        title_en: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        imageUrlLogo: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
      },
    }
  },
  props: {
    // eslint-disable-next-line
    lang: String,
    // eslint-disable-next-line
    form: Object,
  },
  computed: {
    ...mapGetters(['categories']),
    getAllCategories() {
      return this.categories.filter(category => category.slug !== 'story' && category.slug !== 'integration')
    },
  },
  mounted() {
    if (this.tagId) this.getSubscriptionAttrs()
    this.getCategories()
  },
  methods: {
    ...mapActions(['getSubscriptions', 'getCategories']),
    getSubscriptionAttrs() {
      request({
        url: '/subscription/category/' + this.tagId,
        method: 'get',
        params: { lang: this.lang },
      }).then((response) => {
        const { category } = response
        this.form.imageUrlLogo = category.category_image
        this.form.category_image = category.category_image
        this.form.title_ru = category.title_ru
        this.form.title_uz = category.title_uz
        this.form.title_en = category.title_en
        this.form.status = category.status
        this.form.description_ru = category.description_ru
        this.form.description_uz = category.description_uz
        this.form.description_en = category.description_en
        this.form.category_type = category.category_type
        this.form.duration_type = category.duration_type
        this.form.number_of_cartoons = category.number_of_cartoons
        this.form.number_of_channels = category.number_of_channels
        this.form.number_of_mas = category.number_of_mas
        this.form.category_relations = this.computeCategoryRelation(category.category_relations)
      })
    },
    computeCategoryRelation(relation) {

      const integrationRelation = relation?.find(el => el.type === 'Integration')
      const categoryRelation = relation?.find(el => el.type === 'Category')

      
      return [
        categoryRelation ?? this.form.category_relations[0],
        integrationRelation ?? this.form.category_relations[1],
      ]

    },
    integrationChangeFunction(val) {
      if (val.includes('all')) this.form.category_relations[1].keys = ['all']
      else this.form.category_relations[1].keys = val
    },
    beforeUploadLogo(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('Image must smaller than 5MB!')
      }
      return isJpgOrPng && isLt2M
    },
    handleChangeLogoImage(info, index) {
      if (info.file.status === 'uploading') {
        this.loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.form.imageUrlLogo = imageUrl
          this.loadingLogo = false
          this.form.category_image = info.file.response.filename
        })
      }
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          console.log('form', this.form)
          if (valid) {
            var url = '/subscription/category'
            var method = 'post'
            if (this.tagId) {
              url = '/subscription/category/' + this.tagId
              method = 'put'
              const headers = {
                'Content-Type': 'application/json',
              }
              request({
                url: url,
                method: method,
                data: {
                  category_image: this.form.logo_image,
                  status: this.form.status,
                  title_ru: this.form.title_ru,
                  title_uz: this.form.title_uz,
                  title_en: this.form.title_en,
                  description_ru: this.form.description_ru,
                  description_uz: this.form.description_uz,
                  description_en: this.form.description_en,
                  category_type: this.type
                },
                headers: headers,
              })
                .then((res) => {
                  this.$message.success(this.$t('successfullyUpdated'))
                  this.getSubscriptions()
                  if (e === 'exit') {
                    this.$router.replace('/subscription/category/list')
                    this.getSubscriptions()
                  }
                  resolve()
                })
                .catch((err) => {
                  if (err) {
                    console.log(err)
                    this.$message.error(this.$t('error'))
                  }
                  reject(err)
                })
            } else {
              request({
                url: url,
                method: method,
                data: {
                  category_image: this.form.category_image,
                  status: this.form.status,
                  title_ru: this.form.title_ru,
                  title_uz: this.form.title_ru,
                  title_en: this.form.title_ru,
                  description_ru: this.form.description_ru,
                  description_uz: this.form.description_ru,
                  description_en: this.form.description_ru,
                  category_type: this.type,
                  category_relations: this.form.category_relations,
                  number_of_cartoons: this.form.number_of_cartoons,
                  number_of_channels: this.form.number_of_channels,
                  number_of_mas: this.form.number_of_mas,
                  duration_type: this.form.duration_type,
                },
              })
                .then((res) => {
                  this.$message.success(this.$t('successfullyAdded'))
                  this.getSubscriptions()
                  this.$router.replace('/subscription/category/list')
                  resolve()
                })
                .catch((err) => {
                  if (err) {
                    console.log(err)
                    this.$message.error(this.$t('error'))
                  }
                  reject(err)
                })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
  },
  watch: {
    form(val) {
      console.log('Form ->', val)
    }
  }
}
</script>
<style>
.number-input {
  width: 100% !important;
}

.ant-form-item-control {
  line-height: normal !important;
}
@media (max-width: 760px) {
  .ant-form-item {
    margin: 0;
  }
  .ant-form-item-label {
    padding-bottom: 4px !important;
  }
}
</style>
