<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('promocodes') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
      <div style="width: 600px" slot="extra">
        <div style="float: right">
          <a-dropdown>
            <template #overlay>
              <a-menu >
                <a-menu-item key="1">
                  <router-link
                    v-action:add
                    :to="{
                      path: '/promocode/create',
                      query: {
                        type: tabKey == 2 ? 'SUBSCRIPTION' : tabKey == 3 ? 'PERCENT' : 'session_limit',
                        generateType: 'random-generaete'
                      },
                    }"
                  >Рандомная генерация</router-link>
                </a-menu-item>
                <a-menu-item key="2">
                  <router-link
                    v-action:add
                    :to="{
                      path: '/promocode/create',
                      query: {
                        type: tabKey == 2 ? 'SUBSCRIPTION' : tabKey == 3 ? 'PERCENT' : 'session_limit',
                        generateType: 'hand-generaete'
                      },
                    }"
                  >Ручная генерация</router-link>
                </a-menu-item>
              </a-menu>
            </template>
            <a-button class="addBtn" type="primary link">{{ $t('add') }}</a-button>
          </a-dropdown>
        </div>
      </div>
      <a-tabs type="card" @change="callback" style="padding: 1px 8px">
        <!-- <a-tab-pane key="1" :tab="$t('common')">
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="getAllPromocodes"
            :pagination="paginationPromocode"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="action" slot-scope="text, row" style="z-index: 10">
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
        </a-tab-pane> -->
        <a-tab-pane key="2" :tab="$t('По подписке')">
          <a-table
            v-action:get
            :columns="columnsForSubScription"
            :rowKey="(record) => record.id"
            :dataSource="getAllPromocodes"
            :pagination="false"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="created_at" slot-scope="created_at">
              {{ moment(created_at).format('YYYY-MM-DD HH:mm') }}
            </template>
            <template slot="action" slot-scope="text, row" style="z-index: 10">
              <router-link
                v-action:update
                :to="{ path: `/promocode/update/${row.id}`, query: { type: 'SUBSCRIPTION' } }"
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
                  ><template slot="title">{{ $t('deleteMsg') }}</template>
                  <!-- <a-button v-if="row.status === 'INACTIVE'" id="buttonDelete" type="white" icon="eye-invisible"></a-button> -->
                  <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                </a-tooltip>
              </a-popconfirm>
            </template>
            <template slot="subscription_ids" slot-scope="subscription_ids">
              <p v-for="(el, ind) in subscription_ids" :key="ind">
                {{ el }}
              </p>
            </template>
            <template slot="status" slot-scope="status">
              <a-tag v-if="status === 'ACTIVE'" color="green">{{ $t('active') }}</a-tag>
              <a-tag v-else-if="status === 'INACTIVE'" color="yellow">{{ $t('inactive') }}</a-tag>
            </template>
          </a-table>
        </a-tab-pane>
        <!-- <a-tab-pane key="3" :tab="$t('Процентный')">
          <a-table
            v-action:get
            :columns="columnsForPercent"
            :rowKey="(record) => record.id"
            :dataSource="getAllPromocodes"
            :pagination="paginationPromocode"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
            <template slot="created_at" slot-scope="created_at">
              {{ moment(created_at).format('YYYY-MM-DD HH:mm') }}
            </template>
            <template slot="action" slot-scope="text, row" style="z-index: 10">
              <router-link v-action:update :to="{ path: `/promocode/update/${row.id}`, query: { type: 'PERCENT' } }">
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
            <template slot="status" slot-scope="status">
              <a-tag v-if="status === 'ACTIVE'" color="green">{{ $t('active') }}</a-tag>
              <a-tag v-else-if="status === 'INACTIVE'" color="yellow">{{ $t('inactive') }}</a-tag>
            </template>
          </a-table>
        </a-tab-pane> -->
      </a-tabs>
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
      tabKey: 2,
      currentPage: 1,
      statusTab: 'SUBSCRIPTION',
      // searchForm: {
      //   searchKey: '',
      // },
      columnsForSubScription: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center',
        },
        {
          title: `Логин промокода`,
          dataIndex: 'title',
        },
        // {
        //   title: 'Включенные подписки',
        //   dataIndex: 'subscription_ids',
        //   scopedSlots: { customRender: 'subscription_ids' },
        // },
        {
          title: this.$t('period'),
          dataIndex: 'period',
          scopedSlots: { customRender: 'period' },
        },
        {
          title: this.$t('Количество промокода'),
          dataIndex: 'promo_limit',
          scopedSlots: { customRender: 'promo_limit' },
        },
        {
          title: this.$t('Количество использований'),
          dataIndex: 'promo_use',
          scopedSlots: { customRender: 'promo_use' },
        },
        {
          title: this.$t('created_at'),
          dataIndex: 'created_at',
          scopedSlots: { customRender: 'created_at' },
        },
        {
          title: this.$t('status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      columnsForPercent: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center',
        },
        {
          title: `Логин промокода`,
          dataIndex: 'title',
        },
        {
          title: 'Процент скидки, %',
          dataIndex: 'discount',
          scopedSlots: { customRender: 'discount' },
        },
        {
          title: this.$t('period'),
          dataIndex: 'period',
          scopedSlots: { customRender: 'period' },
        },
        {
          title: this.$t('Количество промокода'),
          dataIndex: 'promo_limit',
          scopedSlots: { customRender: 'promo_limit' },
        },
        {
          title: this.$t('Количество использований'),
          dataIndex: 'promo_use',
          scopedSlots: { customRender: 'promo_use' },
        },
        {
          title: this.$t('created_at'),
          dataIndex: 'created_at',
          scopedSlots: { customRender: 'created_at' },
        },
        {
          title: this.$t('status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
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
    ...mapGetters(['promocodes', 'paginationPromocode']),
    getAllPromocodes() {
      return this.promocodes.map((promocode, index) => {
        return {
          ...promocode,
          index: index + 1,
        }
      })
    },
  },
  mounted() {
    this.getPromocodes({ pageSize: 1000, current: this.currentPage, type: 'SUBSCRIPTION' }).then(() => {
      this.loading = false
    })
  },
  // beforeDestroy() {},
  methods: {
    ...mapActions(['getPromocodes']),
    moment,
    handleTableChange(pagination) {
      const paginationNew = {
        current: pagination.current,
        pageSize: 1000,
        search: null,
        type: +this.tabKey === 2 ? 'SUBSCRIPTION' : +this.tabKey === 3 ? 'PERCENT' : 'live_session_limit,session_limit',
      }
      this.getPromocodes(paginationNew)
        .then((res) => console.log(res))
        .catch((err) => this.requestFailed(err))
    },
    callback(key) {
      if (key === '2') {
        this.statusTab = 'SUBSCRIPTION'
      } else if (key === '3') {
        this.statusTab = 'PERCENT'
      } else {
        this.statusTab = 'live_session_limit,session_limit'
      }
      this.tabKey = key
    },
    deleteCategory(e, id) {
      request({
        url: '/promocode/delete-promo-code/' + id,
        method: 'delete',
        data: { id }
      })
        .then((res) => {
          this.$message.success(this.$t('successfullyDeleted'))
          this.getPromocodes({ pageSize: 1000, limit: this.currentPage, type: this.statusTab })
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
  watch: {
    tabKey(val) {
      this.getPromocodes({
        current: this.currentPage,
        pageSize: 1000,
        type: this.statusTab,
      }).then(() => {
        this.loading = false
      })
    },
  },
}
</script>

<style scoped>
.addBtn {
  height: 40px;
}
</style>
