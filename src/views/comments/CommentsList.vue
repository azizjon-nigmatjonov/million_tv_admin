<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('comment') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
       <a-tabs type="card" @change="callback" style="padding: 1px 8px">
        <a-tab-pane key="1" :tab="$t('likes')">
          <a-row a-row style="padding-bottom: 18px">
              <a-col>
                <router-link v-action:add :to="{ path: '/like/create', query: { type: 'like' } }">
                  <a-button style="height: 40px; float: right" type="primary link" icon="plus">{{ $t('add') }}</a-button>
                </router-link>
              </a-col>
          </a-row>
          <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="getAllLikeComments"
            :pagination="tvpagination"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
        <template slot="action" slot-scope="text, row" style="z-index: 10">
          <router-link v-action:update :to="{ path: './update/' + row.id, query: { type: 'like' } }">
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="" type="default" icon="edit"></a-button>
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

        <a-tab-pane key="2" :tab="$t('dislike')">
          <a-row style="padding-bottom: 18px">
              <a-col>
                <router-link v-action:add :to="{ path: '/dislike/create', query: { type: 'dislike' } }">
                  <a-button style="height: 40px; float: right" type="primary link" icon="plus">{{ $t('add') }}</a-button>
                </router-link>
              </a-col>
          </a-row>
               <a-table
        v-action:get
        :columns="columns"
        :rowKey="(record) => record.id"
        :dataSource="getAllDislikeComments"
        :pagination="tvpagination"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="action" slot-scope="text, row" style="z-index: 10">
          <router-link v-action:update :to="{ path: './update/' + row.id, query: { type: 'dislike' } }">
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="" type="default" icon="edit"></a-button>
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
          dataIndex: 'name.ru'
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
    ...mapGetters(['comments', 'commentsDislike']),
    getAllLikeComments() {
      return this.comments.map((comment, index) => {
        return {
          ...comment,
          index: index + 1
        }
      })
    },
    getAllDislikeComments() {
      return this.commentsDislike.map((comment, index) => {
        return {
          ...comment,
          index: index + 1
        }
      })
    }
  },
  mounted() {
    this.getComments({ current: 1, pageSize: 10, type: 'like' }).then(() => {
      this.loading = false
    })
     this.getDislikeComments({ current: 1, pageSize: 10, type: 'dislike' }).then(() => {
      this.loading = false
    })
  },
  methods: {
    ...mapActions(['getComments', 'getDislikeComments']),
    handleTableChange(pagination) {
      const paginationNew = {
        ...pagination
      }
    
      this.getComments(paginationNew)
        .then(res => console.log('111', res))
        .catch(err => this.requestFailed(err))

        this.getDislikeComments(paginationNew)
        .then(res => console.log('111', res))
        .catch(err => this.requestFailed(err))
    },
    deleteCategory(e, id) {
      request({
        url: '/comment/' + id,
        method: 'delete',
        params: { id: id }
      })
        .then(res => {
          this.$message.success(this.$t('successfullyDeleted'))
          this.getComments()
          this.getDislikeComments()
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
