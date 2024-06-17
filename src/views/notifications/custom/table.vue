<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('customNotifications') }}</a-breadcrumb-item>
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

    <a-card :title="$t('notifications')">
      <a-table
        :columns="columns"
        :rowKey="(record) => record.id"
        :dataSource="notificationList"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="status" slot-scope="text, row">
          <a-tag :color="row.status !== 'Unsend' ? '#DFEEFF' : '#BBF6F4'">
            <span :style="{ color: row.status !== 'Unsend' ? '#0E73F6' : '#1AC19D' }">{{ $t(row.status) }}</span>
          </a-tag>
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
            @confirm="deleteNotification($event, row.id)"
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
      params: {
        page: this.$route.query.current || 1,
        limit: 10,
        is_custom: true
      },
      pageScopes: {
        scope_ids: []
      },
      notificationList: [],
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'title_ru',
          width: '20%'
        },
        {
          title: this.$t('Text'),
          dataIndex: 'text_ru',
          key: 'text',
          width: '55%'
        },
        {
          title: this.$t('status'),
          dataIndex: 'status',
          key: 'status',
          width: '15%',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '10%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {
        current: 1,
        total: 0
      },
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
  watch: {
    $route: {
      handler(newValue, oldValue) {
        let params = {
          page: this.$route.query.current || 1,
          limit: 10
        }
        this.getNotifications(params)
      },
      deep: true
    }
  },
  mounted() {
    let params = {
      page: this.$route.query.current || 1,
      limit: 10,
      is_custom: true
    }
    this.getNotifications(params)
  },
  methods: {
    getNotifications(params) {
      this.loading = true
      this.$store
        .dispatch('getNotifications', params)
        .then(res => {
          this.notificationList = res.notifications
          this.pagination.total = res.count
          this.pagination.current = params.page || 1
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleTableChange(pagination) {
      let params1 = {
        page: (pagination && pagination.current) || 1,
        is_custom: true
      }
      this.getNotifications(params1)
      // this.$router.push({ query: params1 })
    },
    deleteNotification(e, id) {
      this.$store
        .dispatch('deleteNotification', id)
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getNotifications(this.params)
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
