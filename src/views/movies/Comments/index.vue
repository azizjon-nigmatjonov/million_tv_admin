<template>
    <div>
        <a-table
            v-action:get
            :columns="columns"
            :rowKey="(record) => record.id"
            :dataSource="list"
            :pagination="false"
            :loading="loading"
            @change="handleTableChange"
            bordered
          >
        <template slot="action" slot-scope="text, row" style="z-index: 10">
          <!-- <router-link v-action:update :to="{ path: './update/' + row.id, query: { type: 'like' } }">
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" id="" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link> -->
          <a-popconfirm
            v-action:delete
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteElement(row.id)"
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
</template>

<script>
import request from '@/utils/request'
export default {
    name: 'Comments',
    props: {
        // eslint-disable-next-line
        lang: String,
    },
    data () {
        return {
            list: [],
            loading: false,
            pagination: 1,
            columns: [
                {
                    title: this.$t('No'),
                    dataIndex: 'index',
                    width: '100px',
                    align: 'center'
                },
                {
                    title: this.$t('title'),
                    dataIndex: 'comment'
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
    lang: {
      handler: (val, oldVal) => {
        console.log('ssses', val, oldVal)
      },
    },
    mounted () {
        this.getList()
    },
    methods: {
        handleTableChange(pagination) {

        },
       getList() {
            this.loading = true
            request({
                url: '/movie-comment',
                method: 'get',
                params: { movie_key: this.$route.params.id }
            }).then(response => {
                this.list = response.movie_comments?.map((item, index) => ({
                    ...item,
                    index: index + 1
                }))
            })
            .finally(() => {
                this.loading = false
            })
        },
        deleteElement (id) {
            this.loading = true
            request({
                url: `/movie-comment/${id}`,
                method: 'delete',
            }).then(response => {
                this.list = []
                this.getList()
            })
            .finally(() => {
                this.loading = false
            })
        }
    }
}
</script>
