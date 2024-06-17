<template>
  <div>
      <a-card :title="$t('personal_settings')">
        <template>
            <div>
            <a-form-model
                @submit="onSubmit"
                ref="ruleForm"
                :model="user"
                :rules="rules"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
            >
                <a-row>
                    <a-col :xs="24" :md="12" style="padding: 0 15px">
                        <a-form-model-item :label="$t('full_name')" prop="name">
                            <a-input
                                v-model="user.name"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :md="12" style="padding: 0 15px">
                        <a-form-model-item :label="$t('phone')" prop="phone">
                            <a-input
                                v-model="user.phone"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :md="12" style="padding: 0 15px">
                        <a-form-model-item :label="$t('username')" prop="username">
                            <a-input
                                v-model="user.username"
                            />
                            </a-form-model-item>
                    </a-col>
                    <a-col :xs="24" :md="12" style="padding: 0 15px">
                        <a-form-model-item :label="$t('password')" prop="password">
                            <a-input-password
                                v-model="user.password"
                            />
                        </a-form-model-item>
                    </a-col>
                    <a-col :span="24">
                        <a-button type="primary" @click="onSubmit">
                            {{ $t('save') }}
                        </a-button> 
                    </a-col>
                </a-row>
            </a-form-model>
            </div>
        </template>
      </a-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      user: {
        username: '',
        name: '',
        password: null,
        phone: ''
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        username: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        password: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        phone: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
      }
    }
  },
  mounted () {
    this.GetInfo().then(result => {
        this.user.phone = result.phone
        this.user.name = result.name
        this.user.username = result.username
    })
  },
  methods: {
    ...mapActions(['GetInfo']),
    onSubmit (e) {
			return new Promise((resolve, reject) => {
				this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        request({
                            url: '/admin/profile',
                            method: 'put',
                            data: this.user
                        }).then(() => {
                            this.$message.success(this.$t('successfullyUpdated'))
                        })
                    }
            })
		})
    },
    resetForm () {
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
