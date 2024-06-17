<template>
<div>
  <div>
    <a-row style="padding-bottom: 18px">
      <a-col :span="12">
        <a-form-model layout="horizontal" :form="searchForm" @submit="search">
          <a-row>
            <a-col :span="24" style="padding: 5px">
              <a-form-model-item style="margin: 0">
                <a-input
                  id="inputSearch"
                  :placeholder="$t('search') + '...'"
                  @change="onSearchChange"
                  v-model="searchForm.searchKey"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-col>
      <a-col :span="12">
        <router-link v-if="type !== 'premier'" v-action:add :to="{ path: `/subscription/create`, query: { category_id: $route.params.id, type: type1 } }">
          <a-button style="float: right" class="addBtn" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
         <router-link v-if="type === 'premier'" v-action:add :to="{ path: `/subscription/premier/list`, query: { category_id: $route.params.id, type: type1 } }">
          <a-button style="float: right" class="addBtn" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </a-col>
    </a-row>
    <a-table
      v-action:get
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="getAllSubscriptionsModel"
      :pagination="paginationSubscriptionsModel"
      :loading="loading"
      @change="handleTableChange"
      bordered
    >
      <template slot="action" slot-scope="text, row">
        <router-link v-action:update :to="{ path: `/subscription/update/${row.id}`, query: {type: type1} }">
          <a-tooltip placement="topRight"
            ><template slot="title">{{ $t('update') }}</template>
            <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
          </a-tooltip>
        </router-link>
        <a-popconfirm
          placement="left"
          slot="extra"
          :title="$t('deleteMsg')"
          @confirm="deleteSubscription($event, row.id)"
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
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'
export default {
  props: {
    type1: {
      type: String,
      default: 'common'
    },
  },
  data() {
    return {
      loading: false,
      type: this.$route.query.type,
      action: this.$route.query.action,
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
          title: this.$t('title'),
          dataIndex: 'title_ru'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columnsPremier: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center'
        },
        {
          title: this.$t('title'),
          dataIndex: 'name'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
    }
  },
  computed: {
    ...mapGetters(['subscriptionsModel', 'paginationSubscriptionsModel', 'premierPackets']),
    getAllSubscriptionsModel() {
      console.log('sssss', this.subscriptionsModel)
      return this.subscriptionsModel?.map((sub, index) => {
        return {
          ...sub,
          index: index + 1
        }
      }) ?? []
    },
    getAllPremierPackets() {
      return this.premierPackets?.map((packet, index) => {
        return {
          ...packet,
          index: index + 1
        }
      }) ?? []
    }
  },
  mounted() {
    this.getPremierPackets()
    this.getSubscriptionsModel({ category_id: this.$route.params.id })
  },
  methods: {
    ...mapActions(['getSubscriptionsModel', 'getPremierPackets']),
    handleTableChange(pagination) {
      const paginationNew = {
        ...pagination,
        search: null
      }
      this.getSubscriptionsModel(paginationNew)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    deleteSubscription(e, id) {
      request({
        url: '/subscriptionmodel/' + id,
        method: 'delete'
      })
        .then(res => {
          this.$message.success(this.$t('successfullyDeleted'))
          this.getSubscriptionsModel({ category_id: this.$route.params.id })
        })
        .catch(err => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    onSearchChange() {
      clearTimeout(this.timeOut)

      this.timeOut = setTimeout(() => {
        this.getSubscriptionsModel({
          current: 1,
          pageSize: 10,
          search: this.searchForm.searchKey,
          category_id: this.$route.params.id
        })
      }, 750)
    },
    search(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.getSubscriptionsModel({
            current: 1,
            pageSize: 10,
            search: values['search'],
            category_id: this.$route.params.id
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.addBtn {
  height: 40px;
  border-radius: 5px;
}
</style>
