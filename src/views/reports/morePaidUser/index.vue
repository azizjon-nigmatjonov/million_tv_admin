<template>
  <a-card title="Список абонентов оплативших за 2 месяца и более">
     <div slot="extra" style="display: flex; align-items: center; gap: 20px">
      <a-range-picker
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
        <img src="../../../assets/icons/ExcelIcon.svg" alt="" />
      </a-button>
    </div>
    <a-table
      :data-source="dataTable"
      bordered
      :columns="columns"
      :pagination="params.pagination"
      @change="changePagination"
    >
      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status === 'ACTIVE'" color="green">{{ text.status }}</a-tag>
        <a-tag v-else color="">{{ text.status }}</a-tag>
      </template>
      <template slot="activation_date" slot-scope="text">
        <span>{{ text.activation_date | moment }}</span>
      </template>
      <template slot="end_date" slot-scope="text">
        <span>{{ text.end_date | moment }}</span>
      </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      dataTable: [],
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '60px',
          align: 'center',
        },
        {
          title: this.$t('Полное имя клиента'),
          dataIndex: 'username',
        },
        {
          title: this.$t('phone'),
          dataIndex: 'phone_number',
        },
        {
          title: this.$t('subcription_name'),
          dataIndex: 'subcription_name',
        },
        {
          title: this.$t('Категория подписки'),
          dataIndex: 'category_name',
        },
        {
          title: this.$t('duration'),
          dataIndex: 'duration',
          width: '110px',
        },
        {
          title: this.$t('Дата активации'),
          scopedSlots: {
            customRender: 'activation_date',
          },
        },
        {
          title: this.$t('Дата окончание'),
          scopedSlots: {
            customRender: 'end_date',
          },
        },
        {
          title: this.$t('Цена (сум)'),
          dataIndex: 'payment_amount',
        },
        {
          title: this.$t('status'),
          scopedSlots: {
            customRender: 'status',
          },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 10,
        },
      },
      number: null,
    }
  },
  methods: {
    downloadExcel() {
      this.$store.dispatch('getMorePaidUsersExcel', this.params).then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    getInfo(params = {}) {
      this.$store.dispatch('getMorePaidUsers', params).then((res) => {
        this.dataTable = res.more_paid_users.map((el, i) => ({
          ...el,
          index: i + (this.number ? this.number - 10 : 1),
        }))
        this.params.pagination.total = res.count
      })
    },
    changePagination(e) {
      if (e.current > 1) {
        this.number = e.current * 10 + 1
      } else {
        this.number = null
      }
      this.params.pagination = e
      this.getInfo(this.params)
    },
    dateReport(e) {
      this.params.start_date = e[0]
      this.params.end_date = e[1]
      this.params.pagination.current = 1
      this.number = null
      this.getInfo(this.params)
    }
  },
  created() {
    this.getInfo(this.params)
  },
}
</script>

<style></style>
