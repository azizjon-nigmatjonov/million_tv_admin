<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('admins') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button v-action:add style="float: right" shape="round" type="primary link" icon="plus">{{
            $t('add')
          }}</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
      <!-- <div slot="extra">
        <a-form layout="horizontal" :form="form" @submit="search">
          <a-row>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-input id="inputSearch" :placeholder="$t('search') + '...'" v-decorator="['search']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-button id="buttonSearch" type="default" html-type="submit" icon="search">{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div> -->

      <a-table
        :columns="columns"
        :rowKey="(record) => record.id"
        :dataSource="admins"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="status" slot-scope="text, row">
          <a-tag :color="row.active ? 'green' : 'red'">{{ row.active ? $t('active') : $t('inactive') }}</a-tag>
        </template>
        <template slot="action" slot-scope="text, row">
          <router-link v-action:update :to="'./update/' + row.id">
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 5px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteAdmin($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
            ><a-tooltip placement="topRight"
              ><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  data() {
    return {
      value: '',
      data: [],
      loading: true,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      pageButtons: {
        button_ids: []
      },
      pageScopes: {
        scope_ids: []
      },
      columns: [
        {
          title: this.$t('username'),
          dataIndex: 'username'
        },
        {
          title: this.$t('name'),
          dataIndex: 'name'
        },
        {
          title: this.$t('status'),
          key: 'active',
          width: '10%',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '108px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      scopeVisible: false,
      selectedPage: '',
      parentCategory: '',
      filterParams: {},
      rules: {
        button_ids: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        scope_ids: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters(['paginationAdmins', 'admins']),
    getPagination() {
      return this.paginationAdmins
    }
  },
  mounted() {
    this.getAdmins().then(() => {
      this.loading = false
    })
  },
  beforeDestroy() {},
  methods: {
    ...mapActions(['getAdmins']),
    handleTableChange(pagination) {
      this.getAdmins(pagination)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    deleteAdmin(e, id) {
      request({
        url: '/admin/' + id,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getAdmins()
        })
        .then(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    search(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.filterParams = values
          this.pagination.current = 1
        }
      })
    }
  }
}
</script>
