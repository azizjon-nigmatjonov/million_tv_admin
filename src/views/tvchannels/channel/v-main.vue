<template>
  <div>
    <template>
      <a-tabs type="card">
        <a-tab-pane key="1" :tab="$t('basicDetails')">
          <a-form-model
            @submit="onSubmit"
            :rules="rules"
            ref="ruleForm"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row>
              <a-row>
                <!-- Image -->
                <a-col :span="12" style="padding: 0 15px">
                  <a-form-model-item prop="image" :label="$t('logo_image')">
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
                      <img v-if="form.imgUrl && !loadingLogo" :src="form.imgUrl" alt="avatar" />
                      <div v-else>
                        <a-icon :type="loadingLogo ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                          {{ $t('upload') }}
                        </div>
                      </div>
                    </a-upload>
                  </a-form-model-item>
                </a-col>
                <!-- BackgroundImage -->
                <a-col :span="12" style="padding: 0 15px">
                  <a-form-model-item prop="backgroundImage" :label="$t('backgroundImage')">
                    <a-upload
                      name="file"
                      list-type="picture-card"
                      class="avatar-uploader"
                      accept="image/*"
                      :show-upload-list="false"
                      :action="`${VUE_APP_API_BASE_URL}image-upload`"
                      :before-upload="beforeUploadLogo"
                      @change="handleChangeBLogoImage"
                    >
                      <img v-if="form.background_imgUrl && !loadingLogo" :src="form.background_imgUrl" alt="avatar" />
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
              <!-- Title Ru -->
              <a-row v-if="lang === 'ru' || this.$route.name === 'ChannelCreate'">
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
              <!-- ИД канала -->
              <a-row>
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('Название канала (stream name)')" prop="flusonic_id">
                    <a-input v-model="form.flusonic_id" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- secret key канала -->
               <a-row>
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('Ключ (secret key)')" prop="secret_key">
                    <a-input v-model="form.secret_key" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- XML ID -->
              <a-row>
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('XML ID')" prop="xml_title">
                    <a-input v-model="form.xml_title" />
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- Payment Type -->
              <a-row>
                <a-col :span="12" :md="12" :xs="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('payment_type')" prop="payment_type">
                    <a-select v-model="form.payment_type" :placeholder="$t('payment_type')">
                      <a-select-option value="free"> Бесплатно </a-select-option>
                      <a-select-option value="svod"> Свод </a-select-option>
                      <!-- <a-select-option value="tvod"> Твод </a-select-option> -->
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- Region Type -->
              <a-row>
                <a-col :span="12" :md="12" :xs="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('region_type')" prop="region_type">
                    <a-select v-model="form.region_type" :placeholder="$t('region_type')">
                      <a-select-option value="local"> Местный </a-select-option>
                      <a-select-option value="international"> Международный </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- Categories -->
              <a-row>
                <a-col :span="12" :md="12" :xs="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('categories')" prop="category_id">
                    <a-select v-model="form.category_id" :placeholder="$t('categories')">
                      <a-select-option :key="category.id" v-for="category in tvcategories" :value="category.id">
                        {{ category.title_uz }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <!-- Description Ru -->
              <a-row v-if="lang === 'ru' || this.$route.name === 'ChannelCreate'">
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
              <a-col :xs="4" style="padding: 0 15px">
                <a-form-model-item :label="$t('status')" prop="status">
                  <a-switch
                    v-model="form.status"
                    :checked-children="$t('active')"
                    :un-checked-children="$t('inactive')"
                    default-checked
                  />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-tab-pane>
        <a-tab-pane key="2" :tab="$t('Телепередачи')">
          <tv-channel-list :programsInfo="form.programs_info" />
        </a-tab-pane>
      </a-tabs>
    </template>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import TvChannelList from './TvChannelList.vue'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  components: { TvChannelList },
  data() {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      tagId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      loadingLogo: false,
      rules: {
        image: [{ required: true, message: this.$t('image_required'), trigger: 'submit' }],
        title_ru: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        title_uz: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        title_en: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        flusonic_id: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        secret_key: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        xml_title: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        payment_type: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        region_type: [{ required: true, message: this.$t('required'), trigger: 'submit' }],
        category_id: [{ required: true, message: this.$t('required'), trigger: 'submit' }]
      }
    }
  },
  props: {
    // eslint-disable-next-line
    lang: String,
    // eslint-disable-next-line
    form: Object
  },
  computed: {
    ...mapGetters(['tvcategories'])
  },
  mounted() {
    if (this.tagId) {
      this.getTvChannelAttrs()
    }
    this.getTvCategories()
  },
  methods: {
    ...mapActions(['getTvChannel', 'getTvCategories']),
    getTvChannelAttrs() {
      request({
        url: '/tv/channel/' + this.tagId,
        method: 'get',
        params: { lang: this.lang }
      }).then(response => {
        console.log('getTvChannelAttrs', response)
        this.form.category_id = response.category_id
        this.form.title_ru = response.title_ru
        this.form.title_uz = response.title_uz
        this.form.title_en = response.title_en
        this.form.status = response.status
        this.form.description_ru = response.description_ru
        this.form.description_uz = response.description_uz
        this.form.description_en = response.description_en
        this.form.xml_title = response.xml_title
        this.form.flusonic_id = response.flusonic_id
        this.form.secret_key = response.secret_key
        this.form.payment_type = response.payment_type
        this.form.imgUrl = response.image
        this.form.image = response.image.split('/')[response.image.split('/').length - 1]
        this.form.background_imgUrl = response.background_image
        this.form.background_image = response.background_image.split('/')[response.background_image.split('/').length - 1]
        this.form.region_type = response.region_type
        this.regionType = response.region_type
        this.form.url = response.url
        this.form.programs_info = response.programs_info
      })
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
        getBase64(info.file.originFileObj, imageUrl => {
          this.form.imgUrl = imageUrl
          this.loadingLogo = false
          this.form.image = info.file.response.filename
        })
      }
    },
    handleChangeBLogoImage(info, index) {
      if (info.file.status === 'uploading') {
        this.loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.form.background_imgUrl = imageUrl
          this.loadingLogo = false
          this.form.background_image = info.file.response.filename
        })
      }
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let url = '/tv/channel'
            request({
              url: url,
              method: 'post',
              data: {
                category_id: this.form.category_id,
                status: this.form.status,
                title_ru: this.form.title_ru,
                title_uz: this.form.title_ru,
                title_en: this.form.title_ru,
                description_ru: this.form.description_ru,
                description_uz: this.form.description_ru,
                description_en: this.form.description_ru,
                xml_title: this.form.xml_title,
                flusonic_id: this.form.flusonic_id,
                secret_key: this.form.secret_key,
                payment_type: this.form.payment_type,
                image: this.form.image,
                background_image: this.form.background_image,
                url: this.form.url,
                region_type: this.form.region_type
              }
            })
              .then(res => {
                this.getTvChannel()
                this.$router.replace('/channel/list')
                resolve()
              })
              .catch(err => {
                if (err) {
                  console.log(err)
                  this.$message.error(this.$t('error'))
                }
                reject(err)
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style>
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
