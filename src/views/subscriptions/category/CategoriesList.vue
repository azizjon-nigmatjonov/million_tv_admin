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
      <div style="width: 600px" slot="extra">
        <router-link v-action:add :to="{ path: '/subscription/category/create', query: { type: tabKey == 1 ? 'common' : tabKey == 3 ? 'megogo' : tabKey == 4 ? 'premier' : tabKey == 5 ? 'mix' : 'session_limit' } }">
          <a-button style="float: right" class="addBtn" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </div>
      <a-tabs type="card" @change="callback" style="padding: 1px 8px">
        <a-tab-pane key="1" :tab="$t('common')">
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="getAllSubscriptions"
            :pagination="paginationSubscription"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="action" slot-scope="text, row" style="z-index: 10">
              <!-- <router-link v-action:update :to="'./update/' + row.id"> -->
              <router-link
                v-action:update
                :to="{ path: `/subscription/category/update/${row.id}`, query: { type: 'common' } }"
              >
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
                @confirm="deleteCategory($event, row.id)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"
                  ><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
        </a-tab-pane>
        <!-- <a-tab-pane key="3" :tab="$t('Megogo')">
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="getAllSubscriptions"
            :pagination="paginationSubscription"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="action" slot-scope="text, row" style="z-index: 10">
              <router-link
                v-action:update
                :to="{ path: `/subscription/category/update/${row.id}`, query: { type: 'megogo' } }"
              >
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
                @confirm="deleteCategory($event, row.id)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"
                ><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
        </a-tab-pane> -->
      
        <!-- <a-tab-pane key="2" :tab="$t('session_limit')">
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="getAllSubscriptions"
            :pagination="paginationSubscription"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="action" slot-scope="text, row" style="z-index: 10">
              <router-link
                v-action:update
                :to="{ path: `/subscription/category/update/${row.id}`, query: { type: 'session_limit' } }"
              >
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
                @confirm="deleteCategory($event, row.id)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"
                  ><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
        </a-tab-pane> -->
        
         <!-- <a-tab-pane key="4" :tab="$t('Премьер')">
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="getAllSubscriptions"
            :pagination="paginationSubscription"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="action" slot-scope="text, row" style="z-index: 10">
              <router-link
                v-action:update
                :to="{ path: `/subscription/category/update/${row.id}`, query: { type: 'premier' } }"
              >
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
                @confirm="deleteCategory($event, row.id)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"
                ><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
        </a-tab-pane> -->

        <!-- <a-tab-pane key="5" :tab="$t('Mix')">
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="getAllSubscriptions"
            :pagination="paginationSubscription"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="action" slot-scope="text, row" style="z-index: 10">
              <router-link
                v-action:update
                :to="{ path: `/subscription/category/update/${row.id}`, query: { type: 'mix' } }"
              >
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
                @confirm="deleteCategory($event, row.id)"
                :okText="$t('yes')"
                :cancelText="$t('no')"
              >
                <a-tooltip placement="topRight"
                ><template slot="title">{{ $t('delete') }}</template>
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
          </a-table>
        </a-tab-pane> -->
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
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
          align: 'center'
        },
        {
          title: `${this.$t('title')} категории`,
          dataIndex: 'title_ru'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['subscriptions', 'paginationSubscription', 'premiers']),
    getAllSubscriptions() {
      return this.subscriptions.map((subscription, index) => {
        return {
          ...subscription,
          index: index + 1
        }
      })
    }
  },
  mounted() {
    this.getSubscriptions({ pageSize: 10, current: this.currentPage, type: 'common' }).then(() => {
      this.loading = false
    })
  },
  // beforeDestroy() {},
  methods: {
    ...mapActions(['getSubscriptions']),
    handleTableChange(pagination) {
      console.log('pagination', pagination)
      const paginationNew = {
        current: pagination.current,
        pageSize: pagination.pageSize,
        search: null,
        type: +this.tabKey === 1 ? 'common' : +this.tabKey === 3 ? 'quality' : +this.tabKey === 4 ? 'premier' : 'live_session_limit,session_limit'
      }
      this.getSubscriptions(paginationNew)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    callback(key) {
      if (key === '1') {
        this.statusTab = 'common'
      } else if (key === '3') {
        this.statusTab = 'megogo'
      } else if (key === '4') {
        this.statusTab = 'premier'
      } else if (key === '5') {
        this.statusTab = 'mix'
      } else {
        this.statusTab = 'live_session_limit,session_limit'
      }
      console.log('key', key, this.statusTab)
      this.tabKey = key
    },
    deleteCategory(e, id) {
      request({
        url: '/subscription/category/' + id,
        method: 'delete'
      })
        .then(res => {
          this.$message.success(this.$t('successfullyDeleted'))
          this.getSubscriptions({ pageSize: 10, current: this.currentPage, type: this.statusTab })
        })
        .catch(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    }
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
  watch: {
    tabKey(val) {
      this.getSubscriptions({
        current: this.currentPage,
        pageSize: 10,
        type: this.statusTab
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
.addBtn {
  height: 40px;
}
</style>
