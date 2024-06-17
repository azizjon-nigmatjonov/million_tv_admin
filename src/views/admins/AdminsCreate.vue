<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/admins/">{{ $t('admins') }}</router-link>
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
        <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('basicDetails')">
            <a-form-model
              @submit="onSubmit"
              ref="ruleForm"
              :model="admin"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-row>
                <a-col :md="12" :xs="24" style="padding: 0 15px">
                  <a-form-model-item ref="name" :label="$t('name')" prop="name">
                    <a-input :placeholder="$t('name')" v-model="admin.name" />
                  </a-form-model-item>
                </a-col>
                <a-col :md="12" :xs="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('phone')" prop="phone">
                    <a-input :placeholder="$t('phone')" v-model="admin.phone" />
                  </a-form-model-item>
                </a-col>
                <a-col :md="12" :xs="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('username')" prop="username">
                    <a-input :placeholder="$t('username')" v-model="admin.username" />
                  </a-form-model-item>
                </a-col>
                <a-col :md="12" :xs="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('password')" prop="password">
                    <a-input :placeholder="$t('password')" v-model="admin.password" :autocomplete="false" />
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
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('permissions')">
            <a-table
              :bordered="true"
              :columns="columns"
              :rowKey="(record) => record.id"
              :dataSource="permissions"
              :pagination="paginationPermissions"
              @change="handleTableChange"
            >
              <template slot="action" slot-scope="text, row, index">
                <a-switch
                  v-model="allowedPermissions[index]"
                  @change="onPermissionChange(row.id, index)"
                  default-checked
                />
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
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
      adminId: this.$route.params.id,
      activeTabKey: '1',
      labelCol: { span: 24 },
      rolePermissions: [],
      wrapperCol: { span: 24 },
      other: '',
      allowedPermissions: [],
      loading: false,
      imageUrl: '',
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'name'
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      admin: {
        name: '',
        username: '',
        phone: '',
        password: ''
      },
      rules: {
        name: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        key: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.getPermissions()
    if (this.adminId) this.getAdminAttrs()
  },
  computed: {
    ...mapGetters(['admins', 'permissions', 'paginationPermissions'])
  },
  methods: {
    ...mapActions(['getAdmins', 'getPermissions']),
    getAdminAttrs() {
      request({
        url: '/admin/profile/' + this.adminId,
        method: 'get'
      }).then(response => {
        this.admin.name = response.name
        this.admin.username = response.username
        this.admin.password = response.password
        this.admin.phone = response.phone
        this.rolePermissions = JSON.parse(JSON.stringify(response.permissions))
        this.allowedPermissions = this.permissions.map(per => {
          return (
            response.permissions.filter(pers => {
              return pers.id === per.id
            }).length > 0
          )
        })
      })
    },
    activeTabHandler(_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    handleTableChange(pagination) {
      this.getPermissions(pagination)
        .then(res => {
          console.log(res)
          this.allowedPermissions = this.permissions.map(per => {
            return (
              this.rolePermissions.filter(pers => {
                return pers.id === per.id
              }).length > 0
            )
          })
        })
        .catch(err => this.requestFailed(err))
    },
    onPermissionChange(id, index) {
      console.log(this.allowedPermissions)
      request({
        url: '/admin/update-permission',
        method: 'post',
        data: {
          admin_id: this.adminId,
          permission_id: id
        }
      })
    },
    onSubmit(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/admin'
          var method = 'post'
          const headers = {
            'Content-Type': 'application/json'
          }
          if (this.adminId) {
            url = '/admin/profile/' + this.adminId
            method = 'put'
          }
          request({
            url: url,
            method: method,
            data: this.admin,
            headers: headers
          })
            .then(res => {
              this.getAdmins()
              this.$router.replace('/admins/list')
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
