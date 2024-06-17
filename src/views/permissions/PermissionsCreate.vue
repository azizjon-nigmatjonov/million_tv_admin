<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/permissions/">{{ $t('permissions') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card class="card-back" :title="$t('fillIn')">
      <template slot="extra">
        <router-link to="/permissions/list">
          <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </router-link>
      </template>
      <template>
        <a-form-model
          @submit="onSubmit"
          ref="ruleForm"
          :model="permission"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-row>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item ref="name" :label="$t('name')" prop="name">
                <a-input :placeholder="$t('name')" v-model="permission.name" />
              </a-form-model-item>
            </a-col>
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('key')" prop="key">
                <a-input :placeholder="$t('key')" v-model="permission.key" />
              </a-form-model-item>
            </a-col>
            <a-col :span="24" style="padding: 0 15px">
              <a-form-model-item>
                <a-button type="primary" html-type="submit" @click="onSubmit">
                  {{ $t('save') }}
                </a-button>
                <a-button style="margin-left: 10px" @click="resetForm">
                  {{ $t('reset') }}
                </a-button>
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
      permissionId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      imageUrl: '',
      permission: {
        name: '',
        key: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        key: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted() {
    if (this.permissionId) this.getPermissionAttrs()
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    ...mapActions(['getPermissions']),
    getPermissionAttrs() {
      request({
        url: '/permission/' + this.permissionId,
        method: 'get'
      }).then(response => {
        this.permission.name = response.permission.name
        this.permission.key = response.permission.key
      })
    },
    onSubmit(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/permission'
          var method = 'post'
          const headers = {
            'Content-Type': 'application/json'
          }
          if (this.permissionId) {
            url = '/permission/' + this.permissionId
            method = 'put'
          }
          request({
            url: url,
            method: method,
            data: this.permission,
            headers: headers
          })
            .then(res => {
              this.getPermissions()
              this.$router.replace('/permissions/list')
            })
            .catch(err => {
              if (err) {
                console.log(err)
                this.$message.error(err.response.data.error)
              }
            })
          console.log('valid')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style>
.card-back .ant-card-head-wrapper {
  flex-direction: row-reverse;
  justify-content: flex-end;
  justify-items: flex-end;
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
