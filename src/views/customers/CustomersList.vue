<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('customers') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

      <a-card :title="$t('list')">
        <div style="width: 600px" slot="extra">
          <a-form-model layout="horizontal" :form="searchForm" @submit="search">
            <a-row>
              <a-col :span="24" style="padding: 5px">
                <a-form-model-item style="margin: 0">
                  <a-input id="inputSearch" :placeholder="$t('search') + '...'" @pressEnter="onPressEnter" @change="onSearchChange" v-model="searchForm.searchKey"/>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllCustomers"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="action" slot-scope="text, row">
          <!-- <a-tooltip><template slot="title">{{ $t('read') }}</template>
            <a-button style="margin-right: 6px" id="buttonPreview" type="default" @click="showPreviewModal(row.id)" icon="eye"></a-button>
          </a-tooltip> -->
          <router-link v-action:update :to="'./update/'+row.id" >
            <a-tooltip placement="topRight"><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            v-action:delete
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteCustomer($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip placement="topRight"><template slot="title">{{ $t('delete') }}</template>
              <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="previewVisible" width="800px" :title="$t('previewCategory')">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item :label="$t('title_uz')">
          {{ selectedCustomer.title_uz ? selectedCustomer.title_uz : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('title_ru')">
          {{ selectedCustomer.title_ru ? selectedCustomer.title_ru : '' }}
        </a-descriptions-item>
        <a-descriptions-item :label="$t('tariff')">
          {{ selectedCustomer.title_en ? selectedCustomer.title_en : '' }}
        </a-descriptions-item>
      </a-descriptions>
      <template slot="footer">
        <a-button id="buttonCancel" key="back" @click="handleCancel">
          {{ $t('cancel') }}
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  data () {
    return {
      value: '',
      data: [],
      loading: true,
      searchForm: {
        searchKey: ''
      },
       columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center'
        },
        {
          title: this.$t('full_name'),
          dataIndex: 'full_name'
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      selectedCustomer: { tariff_details: { name: '' } },
      parentCategory: '',
      filterParams: {}
    }
  },
  computed: {
    ...mapGetters(['customers', 'paginationCustomers']),
    getAllCustomers () {
      return this.customers.map((customer, index) => {
        return {
          ...customer,
          full_name: customer.name + ' ' + customer.lastname,
          index: this.paginationCustomers?.current ? index + ((this.paginationCustomers.current - 1) * 10) + 1 : index + 1
        }
      })
    },
    getPagination () {
      return this.paginationCustomers
    }
  },
  mounted () {
    this.getCustomers({ current: this.paginationCustomers.current, pageSize: 10, search: this.searchForm.searchKey }).then(() => {
      this.searchForm.searchKey = this.getPagination.search
      this.loading = false
    })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getCustomers']),
    handleTableChange (pagination) {
      const paginationNew = {
        ...pagination,
        search: this.searchForm.searchKey
      }
      this.getCustomers(paginationNew)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    onPressEnter (e) {
      e.preventDefault()
      this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    },
    showPreviewModal (userId) {
      this.getselectedCustomer(userId)
      this.previewVisible = true
    },
    getselectedCustomer (selectedCustomer) {
      request({
        url: '/customers/' + selectedCustomer,
        method: 'get'
      }).then((response) => {
        this.selectedCustomer = response.category
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    deleteCustomer (e, id) {
      request({
              url: '/customer/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    onSearchChange () {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
        this.getCustomers({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
      }, 750)
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getCustomers({ current: 1, pageSize: 10, search: values['search'] })
        }
      })
    }
  }
}
</script>
