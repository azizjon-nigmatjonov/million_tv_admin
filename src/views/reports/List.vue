<template>
  <div>
    <a-card size="small" :title="$t('reports.movie')" style="width: 100%">
      <a-range-picker
        slot="extra"
        valueFormat="DD-MM-YYYY"
        format="DD-MM-YYYY"
        :placeholder="[$t('start_time'), $t('end_time')]"
        @change="dateReport"
      />
      <a-table
        :columns="columns"
        :data-source="reports"
        :loading="loading"
        :rowKey="(item) => item.movie_key"
        :pagination="params.pagination"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="status">
          <a-tag v-if="status" color="green">{{ $t('success') }}</a-tag>
          <a-tag v-else color="red">{{ $t('error') }}</a-tag>
        </template>
        <!--        <template slot="created_at" slot-scope="created_at">-->
        <!--          {{ moment(created_at).format('YYYY-MM-DD HH:mm') }}-->
        <!--        </template>-->
        <!--        <template slot="amount" slot-scope="amount">-->
        <!--          {{ new Intl.NumberFormat().format(parseInt(amount.toString().slice(0, 5))) }}-->
        <!--        </template>-->
        <!--        <template slot="action" slot-scope="item">-->
        <!--          <a-tooltip>-->
        <!--            <template slot="title">{{ $t('view') }}</template>-->
        <!--            <a-button size="small" style="margin: 0 2px" type="default" @click="readNotification(item)" icon="eye"></a-button>-->
        <!--          </a-tooltip>-->
        <!--        </template>-->
      </a-table>
    </a-card>
  </div>
</template>
<script>
// import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import request from '@/utils/request'

export default {
  data() {
    return {
      loading: false,
      reports: [],
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'title'
        },
        // {
        //   title: this.$t('key'),
        //   dataIndex: 'movie_key',
        // },
        {
          title: this.$t('season_key'),
          dataIndex: 'season_key',
          align: 'center'
        },
        {
          title: this.$t('episode_key'),
          dataIndex: 'episode_key',
          align: 'center'
        },
        {
          title: this.$t('view_count'),
          dataIndex: 'view_count',
          align: 'center'
        }
        // {
        //   title: this.$t('status'),
        //   dataIndex: 'active',
        //   scopedSlots: { customRender: 'status' }
        // },
        // {
        //   title: this.$t('created_at'),
        //   dataIndex: 'created_at',
        //   scopedSlots: { customRender: 'created_at' }
        // },
        // {
        //   title: this.$t('action'),
        //   key: 'action',
        //   align: 'center',
        //   width: '12%',
        //   scopedSlots: { customRender: 'action' },
        // },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 1
        },
        start: undefined,
        end: undefined
      }
    }
  },
  methods: {
    moment,
    changePagination(e) {
      this.params.pagination = e
      this.getData()
    },
    getData() {
      this.loading = true
      request({
        url: '/most-viewed-movies',
        method: 'GET',
        params: {
          page: this.params.pagination.current,
          limit: this.params.pagination.pageSize,
          'start-date': this.params.start,
          'end-date': this.params.end
        }
      })
        .then(res => {
          this.reports = res.movies
          this.params.pagination.total = res.count
        })
        .finally(() => {
          this.loading = false
        })
    },
    dateReport(e) {
      console.log(e)
      this.params.start = e[0]
      this.params.end = e[1]
      this.getData()
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style>
.ant-table-row:hover {
  cursor: pointer;
}
.imagePreview img {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
</style>
