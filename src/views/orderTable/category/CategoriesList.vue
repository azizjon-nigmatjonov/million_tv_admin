<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('categories') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
      <!-- <div style="width: 600px" slot="extra">
        <router-link v-action:add :to="{ path: '/orderTable/category/create' }">
          <a-button style="float: right" class="addBtn" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </div> -->
      <a-table
        v-action:get
        :columns="columns"
        :rowKey="(record) => record.id"
        :dataSource="getAllOrders"
        :pagination="paginationOrderTable"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="action" slot-scope="text, row" style="z-index: 10">
          <!-- <router-link v-action:update :to="'./update/' + row.id"> -->
          <router-link v-action:update :to="{ path: `/orderTable/category/update/${row._id}` }">
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            v-action:delete
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteCategory($event, row._id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
           <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
          </a-popconfirm>
        </template>
        <template slot="created_at" slot-scope="created_at">
          {{ moment(created_at).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template slot="comment" slot-scope="comment">
          {{ comment.comment }}
        </template>
        <template slot="status" slot-scope="status">
          <a-tag v-if="status === 'uploaded'" color="green">{{ $t('Принято') }}</a-tag>
          <a-tag v-else-if="status === 'in-process'" color="yellow">{{ $t('В очереди') }}</a-tag>
          <a-tag v-else color="red">{{ $t('Отказано') }}</a-tag>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  name: 'TagsList',
  data() {
    return {
      loading: true,
      tabKey: 1,
      currentPage: 1,
      statusTab: 'common',
      // searchForm: {
      //   searchKey: '',
      // },
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center',
        },
        {
          title: `${this.$t('title')} фильма`,
          dataIndex: 'title',
        },
        {
          title: this.$t('Время заказа'),
          dataIndex: 'created_at',
          scopedSlots: { customRender: 'created_at' },
        },
        {
          title: this.$t('status'),
          dataIndex: 'status',
          width: '100px',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('comment'),
          key: 'comment',
          align: 'center',
          scopedSlots: { customRender: 'comment' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['orderTableDatas', 'paginationOrderTable']),
    getAllOrders() {
      return this.orderTableDatas.map((orderTableData, index) => {
        return {
          ...orderTableData,
          index: index + 1,
        }
      })
    },
  },
  mounted() {
    this.getOrders({ pageSize: 10, current: this.currentPage }).then(() => {
      this.loading = false
    })
  },
  // beforeDestroy() {},
  methods: {
    ...mapActions(['getOrders']),
    moment,
    handleTableChange(pagination) {
      const paginationNew = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        search: null,
        type:
          +this.tabKey === 1
            ? 'common'
            : +this.tabKey === 3
            ? 'quality'
            : +this.tabKey === 4
            ? 'premier'
            : 'live_session_limit,session_limit',
      }
      this.getOrders(paginationNew)
        .then((res) => console.log(res))
        .catch((err) => this.requestFailed(err))
    },
    // callback(key) {
    //   if (key === '1') {
    //     this.statusTab = 'common'
    //   } else if (key === '3') {
    //     this.statusTab = 'megogo'
    //   } else if (key === '4') {
    //     this.statusTab = 'premier'
    //   } else if (key === '5') {
    //     this.statusTab = 'mix'
    //   } else {
    //     this.statusTab = 'live_session_limit,session_limit'
    //   }
    //   console.log('key', key, this.statusTab)
    //   this.tabKey = key
    // },
    deleteCategory(e, id) {
      request({
        url: '/order/delete-order-table/' + id,
        method: 'delete',
      })
        .then((res) => {
          this.$message.success(this.$t('successfullyDeleted'))
          this.getOrders({ pageSize: 10, limit: this.currentPage })
        })
        .catch((err) => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    // onSearchChange() {
    //   clearTimeout(this.timeOut)

    //   this.timeOut = setTimeout(() => {
    //     this.getTags({ current: 1, pageSize: 10, search: this.searchForm.searchKey })
    //   }, 750)
    // },
    // search(e) {
    //   e.preventDefault()
    //   this.form.validateFields((err, values) => {
    //     if (!err) {
    //       this.getTags({ current: 1, pageSize: 10, search: values['search'] })
    //     }
    //   })
    // }
  },
  // watch: {
  //   tabKey(val) {
  //     this.getOrders({
  //       current: this.currentPage,
  //       pageSize: 10,
  //       type: this.statusTab,
  //     }).then(() => {
  //       this.loading = false
  //     })
  //   },
  // },
}
</script>

<style scoped>
.addBtn {
  height: 40px;
}
</style>
