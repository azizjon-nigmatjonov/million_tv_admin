<template>
  <div>
    <a-card>
      <template>
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="setting"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('options')" prop="options">
                <a-input :disabled="true" v-model="settingId" />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="name">
                <a-input v-model="setting.name" />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('value')" prop="value">
                <a-input v-model="setting.value" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </template>
    </a-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      settingId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      country: 'Uzbekistan',
      loading: false,
      setting: {
        name: '',
        value: '',
        options: null,
        lang: this.lang
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
    ...mapGetters(['paginationSettings'])
  },
  mounted() {
    if (this.settingId) this.getSettingAttrs()
  },
  methods: {
    ...mapActions(['getSettings']),
    getSettingAttrs() {
      request({
        url: '/settings/' + this.settingId,
        method: 'get'
      }).then(response => {
        this.setting.name = response.setting.name
        this.setting.value = response.setting.value
        this.setting.options = response.setting.options
      })
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            var url = '/settings'
            var method = 'post'
            if (this.settingId) {
              url = '/settings/' + this.settingId
              method = 'put'
              const headers = {
                'Content-Type': 'application/json'
              }
              request({
                url: url,
                method: method,
                data: this.setting,
                headers: headers
              })
                .then(res => {
                  this.$message.success(this.$t('successfullyUpdated'))
                  if (e === 'exit') {
                    this.$router.replace('/settings/list')
                    this.getSettings({ pageSize: 10, current: 1, search: this.paginationSettings.search })
                    resolve(res)
                  }
                })
                .catch(err => {
                  if (err) {
                    this.$message.success(this.$t('error'))
                    reject(err)
                  }
                })
            } else {
              request({
                url: url,
                method: method,
                data: { name: this.setting.name, value: this.setting.value, lang: this.lang, options: this.setting.options }
              }).then(res => {
                this.getSettings({ pageSize: 10, current: 1, search: this.paginationSettings.search })
                this.$router.replace('/settings/list')
                resolve(res)
              }).catch(err => {
                if (err) {
                  this.$message.success(this.$t('error'))
                  reject(err)
                }
              })
            }
          } else {
            console.log('error submit!!')
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
