<template>
  <div>
    <template>
      <a-form-model
        @submit="onSubmit"
        ref="ruleForm"
        :model="genre"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title">
                <a-input v-model="genre.title" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-col :xs="8" style="padding: 0 15px">
            <a-form-model-item :label="$t('status')" prop="active">
              <a-switch
                v-model="genre.active"
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
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      genreId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      country: 'Uzbekistan',
      loading: false,
      genre: {
        title: '',
        active: true
      },
      rules: {
        alias: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        tariff_id: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  props: {
    // eslint-disable-next-line
    lang: String
  },
  computed: {
    ...mapGetters(['paginationGenres'])
  },
  mounted() {
    if (this.genreId) this.getGenreAttrs()
  },
  methods: {
    ...mapActions(['getGenres']),
    getGenreAttrs() {
      request({
        url: '/genres/' + this.genreId,
        method: 'get',
        params: { lang: this.lang }
      }).then(response => {
        this.genre.title = response.genre.title
        this.genre.active = response.genre.active
      })
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var url = '/genres'
            var method = 'post'
            if (this.genreId) {
              url = '/genres/' + this.genreId
              method = 'put'
              const headers = {
                'Content-Type': 'application/json'
              }
              request({
                url: url,
                method: method,
                data: { title: this.genre.title, active: this.genre.active, lang: this.lang },
                headers: headers
              })
                .then(res => {
                  this.$message.success(this.$t('successfullyUpdated'))
                  if (e === 'exit') {
                    this.$router.replace('/genre/list')
                    this.getGenres({ pageSize: 10, current: 1, search: this.paginationGenres.search })
                  }
                  resolve()
                })
                .catch(err => {
                  if (err) {
                    console.log(err)
                    this.$message.success(this.$t('error'))
                  }
                  reject(err)
                })
            } else {
              request({
                url: url,
                method: method,
                data: { title: this.genre.title, active: this.genre.active, lang: this.lang }
              }).then(res => {
                this.getGenres({ pageSize: 10, current: 1, search: this.paginationGenres.search })
                this.$router.replace('/genre/list')
                resolve()
              }).catch(err => {
                if (err) {
                  console.log(err)
                  this.$message.success(this.$t('error'))
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
