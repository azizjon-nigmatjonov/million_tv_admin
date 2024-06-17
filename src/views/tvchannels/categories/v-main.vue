<template>
  <div>
    <template>
      <a-form-model @submit="onSubmit" ref="ruleForm" :rules="rules" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <!-- Title Ru -->
          <a-row v-if="lang === 'ru' || this.$route.name === 'TvCategoriesCreate'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title">
                <a-input v-model="form.title_ru" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Title Uz -->
          <a-row v-if="lang === 'uz'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title">
                <a-input v-model="form.title_uz" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Title En -->
          <a-row v-if="lang === 'en'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title">
                <a-input v-model="form.title_en" />
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
    </template>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      Id: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      // rules: {
      //   title: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      // }
    }
  },
  props: {
    // eslint-disable-next-line
    lang: String,
    // eslint-disable-next-line
    form: Object
  },
  computed: {
    // ...mapGetters(['paginationSubscription'])
  },
  mounted() {
    if (this.Id) this.getTvCategoriesAttrs()
  },
  methods: {
    ...mapActions(['getTvCategories']),
    getTvCategoriesAttrs() {
      request({
        url: '/tv/category/' + this.Id,
        method: 'get',
        params: { lang: this.lang }
      }).then(response => {
        console.log('getTvCategoriesAttrs', response)
        this.form.title_ru = response.title_ru
        this.form.title_uz = response.title_uz
        this.form.title_en = response.title_en
        this.form.status = response.status
      })
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var url = '/tv/category'
            var method = 'post'
            if (this.tagId) {
              url = '/tv/category/' + this.tagId
              method = 'put'
              const headers = {
                'Content-Type': 'application/json'
              }
              console.log('CATEGORY ====>', this.category)
              request({
                url: url,
                method: method,
                data: {
                  status: this.form.status,
                  title_ru: this.form.title_ru,
                  title_uz: this.form.title_uz,
                  title_en: this.form.title_en
                },
                headers: headers
              })
                .then(res => {
                  console.log('innerRes', res)
                  this.$message.success(this.$t('successfullyUpdated'))
                  this.getTvCategories()
                  if (e === 'exit') {
                    this.$router.replace('/tvcategory/list')
                    this.getTvCategories()
                  }
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
              request({
                url: url,
                method: method,
                data: {
                  status: this.form.status,
                  title_ru: this.form.title_ru,
                  title_uz: this.form.title_ru,
                  title_en: this.form.title_ru
                }
              })
                .then(res => {
                  this.getTvCategories()
                  this.$router.replace('/tvcategory/list')
                  resolve()
                })
                .catch(err => {
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
