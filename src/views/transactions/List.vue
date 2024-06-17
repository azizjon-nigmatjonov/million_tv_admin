<template>
  <div>
    <a-card size="small" :title="$t('transactions')" style="width: 100%">
      <div slot="extra" style="display: flex; align-items: center; gap: 20px">
        <a-range-picker
          slot="extra"
          valueFormat="DD-MM-YYYY"
          format="DD-MM-YYYY"
          :placeholder="[$t('start_time'), $t('end_time')]"
          @change="dateReport"
        />
        <a-button
          @click="downloadExcel"
          icon="dowlond"
          style="background-color: #1890ff; color: white; border: none; display: flex; align-items: center"
        >
          <img src="../../assets/icons/ExcelIcon.svg" alt="" />
        </a-button>
      </div>
      <a-table
        :columns="columns"
        :data-source="transactions"
        :loading="loading"
        :rowKey="(item) => item.id"
        :pagination="params.pagination"
        @change="changePagination"
        bordered
      >
        <template slot="status" slot-scope="status">
          <a-tag v-if="status === 'success'" color="green">{{ $t('Успешный') }}</a-tag>
          <a-tag v-else color="red">{{ $t('error') }}</a-tag>
        </template>
        <template slot="created_at" slot-scope="created_at">
          {{ moment(created_at).format('YYYY-MM-DD HH:mm') }}
        </template>
        <template slot="amount" slot-scope="amount">
        {{ amount.toLocaleString('en-US', {maximumFractionDigits: 0}) }}
          <!-- {{ new Intl.NumberFormat().format(parseInt(amount.toString().slice(0, -2))) }} -->
        </template>
        <template slot="type" slot-scope="type">
          {{ type == 'svod' ? 'подписка' : 'покупка' }}
        </template>
        <template slot="nameBuying" slot-scope="item">
          {{ item.subcription_title.ru ? item.subcription_title.ru : item.movie_title.ru }}
        </template>
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
      transactions: [],
      columns: [
        {
          title: this.$t('operator'),
          dataIndex: 'method.operator',
        },
        {
          title: this.$t('Клиент'),
          dataIndex: 'client_name',
        },
        // {
        //   title: this.$t('tariff'),
        //   dataIndex: 'tariffs.duration',
        // },
        {
          title: this.$t('amount'),
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' },
        },
        {
          title: this.$t('Тип покупки'),
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' },
        },
        // {
        //   title: this.$t('Название покупки'),
        //   scopedSlots: { customRender: 'nameBuying' },
        // },
        {
          title: 'Абонент ID',
          dataIndex: 'abonent_id',
        },
        {
          title: 'Транзакции ID',
          dataIndex: 'purchase_id',
        },
        {
          title: this.$t('status'),
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('created_at'),
          dataIndex: 'created_at',
          scopedSlots: { customRender: 'created_at' },
        },
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
          total: 1,
        },
        search: '',
      },
    }
  },
  methods: {
    moment,
    // ...mapActions(['getAllSeHistory', 'updateNotifications']),
    readNotification(item) {
      console.log(item)
    },
    downloadExcel() {
      this.$store.dispatch('getTransactionsExcel', this.params).then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    changePagination(e) {
      this.params.pagination = e
      this.getTransaction()
    },
    search(value) {
      console.log(value)
      this.params.search = value
      this.getTransaction()
    },
    getTransaction() {
      this.loading = true
      request({
        url: '/transactions',
        method: 'GET',
        params: {
          page: this.params.pagination.current,
          limit: this.params.pagination.pageSize,
          search: this.params.search,
        },
      })
        .then((res) => {
          // console.log('transactions', res?.transactions)
          this.transactions = res.transactions
          this.params.pagination.total = res.count
        })
        .finally(() => {
          this.loading = false
        })
    },
    dateReport(e) {
      // this.params.start_date = e[0]
      // this.params.end_date = e[1]
      // this.params.pagination.current = 1
      // this.number = null
      this.getTransaction()
    },
  },
  // computed: {
  //   ...mapGetters(['allSeHistory', 'loadSeHistory', 'paginationSeHistory']),
  // },
  mounted() {
    this.getTransaction()
    // this.getAllSeHistory(this.params)
  },
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
