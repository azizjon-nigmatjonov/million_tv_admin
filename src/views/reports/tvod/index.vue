<template>
  <a-card title="Последние купленные фильмы">
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
      <template slot="time" slot-scope="text">
        <span>{{ text.time | moment }}</span>
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
          dataIndex: 'idx',
          width: '100px',
          align: 'center',
        },
        {
          title: this.$t('Клиент'),
          dataIndex: 'name',
        },
        {
          title: this.$t('Название фильма'),
          dataIndex: 'title',
        },
        {
          title: this.$t('price'),
          dataIndex: 'price',
        },
        {
          title: this.$t('Время транзакции'),
          scopedSlots: {
            customRender: 'time',
          },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 10,
        },
        end_date: '',
        start_date: '',
      },
      number: null,
    }
  },
  methods: {
    downloadExcel() {
      this.$store
        .dispatch('getTvodExcel', this.params)
        .then(({ url }) => {
          window.open(url, '_blank')
        })
    },
    getInfo(params = {}) {
      this.$store
        .dispatch('getTvod', params)
        .then((res) => {
          if (!res.result) {
            this.dataTable = []
            this.params.pagination.total = 10
          } else {
            this.dataTable = res.result.map((el, i) => ({ ...el, idx: i + (this.number ? this.number - 10 : 1) }))
            this.params.pagination.total = res.count
          }
        })
        .catch((error) => {
          if (error.response.data.code === 'DATE_IS_EQUAL') {
            this.$message.error(this.$t('Вы не можете ввести одинаковую дату'))
          } else {
            this.$message.error(this.$t('error'))
          }
        })
    },
    dateReport(e) {
      this.params.start_date = e[0]
      this.params.end_date = e[1]
      this.params.pagination.current = 1
      this.number = null
      this.getInfo(this.params)
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
  },
  created() {
    this.getInfo(this.params)
  },
}
</script>

<style></style>
