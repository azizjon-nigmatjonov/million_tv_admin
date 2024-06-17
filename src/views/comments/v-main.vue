<template>
  <div>
    <template>
      <a-form-model @submit="onSubmit" ref="ruleForm" :model="form" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
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
        </a-row>
      </a-form-model>
      <a-form-model v-if="type && !Id" @submit.prevent="addComment">
        <a-row>
          <!-- Status -->
          <a-col :xs="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title">
                <a-input v-model="name.ru" />
                <p v-if="errorValidate" style="color: red">Заполните поле</p>
              </a-form-model-item>
               <a-form-model-item>
                  <a-button type="primary" html-type="submit">
                    {{ $t('save') }}
                 </a-button>
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
      type: this.$route.query.type,
      action: this.$route.path,
      name: {
        en: '',
        ru: '',
        uz: '',
      },
      // rules: {
      //   title: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      // },
      errorValidate: false
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
    if (this.Id) this.getCommentAttrs()
  },
  methods: {
    ...mapActions(['getTvCategories']),
    getCommentAttrs() {
      request({
        url: '/comment/' + this.Id,
        method: 'get',
        params: { id: this.Id }
      }).then(response => {
        console.log('get comment', response.comment.name.ru)
        this.form.title_ru = response.comment.name.ru
        this.form.title_uz = response.comment.name.uz
        this.form.title_en = response.comment.name.en
        // this.form.status = response.status
      })
    },
    onSubmit(e) {
      e.preventDefault()
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var url = '/comment/' + this.Id
            var method = 'post'
            console.log('iddd', this.Id);
            if (this.Id) {
              url = '/comment/' + this.Id
              method = 'put'
              const headers = {
                'Content-Type': 'application/json'
              }
              request({
                url: url,
                method: method,
                data: {
                  name: {
                    en: this.form.title_en,
                    ru: this.form.title_ru,
                    uz: this.form.title_uz
                  },
                  type: this.type
                },
                headers: headers
              })
                .then(res => {
                  console.log('innerRes', res)
                  this.$message.success(this.$t('successfullyUpdated'))
                  // this.getTvCategories()
                  this.$router.replace('/comments/list')
                  if (e === 'exit') {
                    this.$router.replace('/comments/list')
                    // this.getTvCategories()
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
                name: {
                  en: this.form.title_ru,
                  ru: this.form.title_ru,
                  uz: this.form.title_ru
                },
                  type: this.$route.query.type
                },
              })
                .then(res => {
                  this.getTvCategories()
                  this.$router.replace('/comments/list')
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
    addComment() {
       request({
        url: '/comment',
        method: 'post',
        data: {
          name: {
            en: this.name.ru,
            ru: this.name.ru,
            uz: this.name.ru
          },
          type: this.type
        }
      })
      .then(res => {
        this.errorValidate = false
        this.$message.success(this.$t('successfullyUpdated'))
        this.$router.replace('/comments/list')
      })
      .catch((err) => {
        this.errorValidate = true
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
