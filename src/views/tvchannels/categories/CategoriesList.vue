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
        <router-link v-action:add to="././create">
          <a-button style="float: right" class="addBtn" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </div>
      <a-table
        v-action:get
        :columns="columns"
        :rowKey="(record) => record.id"
        :dataSource="getAllTvCategories"
        :pagination="tvpagination"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="action" slot-scope="text, row" style="z-index: 10">
          <router-link v-action:update :to="'./update/' + row.id">
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
          title: this.$t('title'),
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
    ...mapGetters(['tvcategories', 'tvpagination']),
    getAllTvCategories() {
      return this.tvcategories.map((category, index) => {
        return {
          ...category,
          index: index + 1
        }
      })
    }
  },
  mounted() {
    this.getTvCategories({ page: 10 }).then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions(['getTvCategories']),
    handleTableChange(pagination) {
      const paginationNew = {
        ...pagination,
        search: null
      }
      this.getTvCategories(paginationNew)
        .then(res => console.log(res))
        .catch(err => this.requestFailed(err))
    },
    deleteCategory(e, id) {
      request({
        url: '/tv/category/' + id,
        method: 'delete'
      })
        .then(res => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getTvCategories()
        })
        .catch(err => {
          if (err) {
            console.log('err', err)
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
  }
}
</script>

<style scoped>
.addBtn {
  height: 40px;
}
</style>
