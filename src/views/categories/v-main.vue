<template>
  <a-skeleton :loading="loading">
    <div>
      <a-form-model
        @submit="onSubmit"
        ref="ruleForm"
        :model="category"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :span="24" style="padding: 0 15px">
            <a-form-model-item :label="$t('logo_image')">
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
                <img v-if="imageUrlLogo && !loadingLogo" :src="imageUrlLogo" alt="avatar" />
                <div v-else>
                  <a-icon :type="loadingLogo ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">
                    {{ $t('upload') }}
                  </div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title">
                <a-input v-model="category.title" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('genres')" prop="genres">
                <a-select
                  id="numberInput"
                  show-search
                  :auto-clear-search-value="false"
                  :show-arrow="false"
                  mode="multiple"
                  v-model="category.genres"
                  :placeholder="$t('genre')"
                  style="width: 100%"
                  :filter-option="false"
                  :not-found-content="fetchingGenres ? undefined : $t('genreNotFound')"
                  @search="fetchGenres"
                >
                  <a-spin v-if="fetchingGenres" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in dataGenres" :key="d.value" :value="d.value">
                    {{ d.text }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :xs="8" style="padding: 0 15px">
              <a-form-model-item :label="$t('status')" prop="status">
                <a-switch
                  v-model="category.active"
                  :checked-children="$t('active')"
                  :un-checked-children="$t('inactive')"
                  default-checked
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-col :xs="8" style="padding: 0 15px">
            <a-form-model-item :label="$t('isOnMenu')" prop="is_on_menu">
              <a-switch
                v-model="category.is_on_menu"
                :checked-children="$t('onMenu')"
                :un-checked-children="$t('notOnMenu')"
                default-checked
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
  </a-skeleton>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data() {
    this.lastFetchId = 0
    this.fetchGenres = debounce(this.fetchGenres, 800)
    return {
      categoryId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      activeTabKey: '1',
      other: '',
      country: 'Uzbekistan',
      loading: false,
      dataGenres: [],
      imageUrlLogo: '',
      loadingLogo: false,
      fetchingGenres: true,
      category: {
        picture: '',
        title: null,
        genres: [],
        active: false,
        is_on_menu: false
      },
      rules: {
        title: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        tariff_id: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.loading = true
    if (this.categoryId) this.getCategoryAttrs()
    this.getGenres({ lang: this.lang }).then(() => {
      this.getGenres({ current: 1, pageSize: this.paginationGenres.total, lang: this.lang }).then(() => {
        this.dataGenres = this.genres.map(genre => ({
          text: genre.title,
          value: genre.id
        }))
        this.loading = false
      })
    })
  },
  props: {
    // eslint-disable-next-line
    lang: String
  },
  computed: {
    ...mapGetters(['genres', 'paginationGenres'])
  },
  methods: {
    ...mapActions(['getCategories', 'getGenres']),
    getCategoryAttrs() {
      request({
        url: '/categories/' + this.categoryId,
        method: 'get',
        params: { lang: this.lang }
      }).then(response => {
        this.category.is_on_menu = response.category.is_on_menu
        this.category.title = response.category.title
        this.category.active = response.category.active
        this.imageUrlLogo = response.category.picture
        this.category.picture = response.category.picture.split('/')[response.category.picture.split('/').length - 1]
        this.category.genres = response.category.genres.map(genre => {
          return genre.id
        })
      })
    },
    handleChangeLogoImage(info, index) {
      if (info.file.status === 'uploading') {
        this.loadingLogo = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrlLogo = imageUrl
          this.loadingLogo = false
          this.category.picture = info.file.response.filename
        })
      }
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
    fetchGenres(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.dataGenres = []
      this.fetchingGenres = true
      this.getGenres({ current: 1, pageSize: 20, search: value, lang: this.lang }).then(() => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return
        }
        const data = this.genres.map(genre => ({
          text: genre.title,
          value: genre.id
        }))
        this.dataGenres = data
      })
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var url = '/categories'
            var method = 'post'
            if (this.categoryId) {
              url = '/categories/' + this.categoryId
              method = 'put'
              request({
                url: url,
                method: method,
                data: {
                  title: this.category.title,
                  lang: this.lang,
                  genres: this.category.genres.join(','),
                  is_on_menu: this.category.is_on_menu,
                  active: this.category.active,
                  picture: this.category.picture
                }
              })
                .then(res => {
                  this.$message.success(this.$t('successfullyUpdated'))
                  if (e) {
                    this.$router.replace('/category/list')
                    this.getCategories()
                  }
                  resolve()
                })
                .catch(err => {
                  if (err) {
                    this.$message.success(this.$t('error'))
                  }
                  reject(err)
                })
            } else {
              request({
                url: url,
                method: method,
                data: {
                  title: this.category.title,
                  lang: this.lang,
                  genres: this.category.genres.join(','),
                  is_on_menu: this.category.is_on_menu,
                  active: this.category.active,
                  picture: this.category.picture
                }
              })
                .then(res => {
                  this.getCategories()
                  this.$router.replace('/category/list')
                  resolve()
                })
                .catch(err => {
                  if (err) {
                    this.$message.success(this.$t('error'))
                  }
                  reject(err)
                })
            }
            console.log('valid')
          } else {
            reject(valid)
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
<style scoped>
.ant-card-head-title {
  margin-left: 30px;
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
