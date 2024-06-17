<template>
  <a-card :title="$t('Статистика просмотров по времени суток')">
    <a-button
      slot="extra"
      @click="downloadExcel"
      icon="dowlond"
      style="background-color: #1890ff; color: white; border: none; display: flex; align-items: center"
    >
      <img src="../../../assets/icons/ExcelIcon.svg" alt="" />
    </a-button>
    <a-table :data-source="dataTable" bordered :columns="columns"></a-table>
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
          width: '100px',
          align: 'center',
        },
        {
          title: this.$t('Часовой диапазон'),
          dataIndex: 'hours',
        },
        {
          title: this.$t('viewed_count'),
          dataIndex: 'count',
        },
      ],
    }
  },
  methods: {
    downloadExcel() {
      this.$store.dispatch('getHourlyVisitorsExcel').then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    getInfo(params = {}) {
      this.$store.dispatch('getHourlyVisitors', params).then((res) => {
        this.dataTable = res.viewed_at.map((el, i) => ({ ...el, index: i + 1 }))
      })
    },
  },
  created() {
    this.getInfo()
  },
}
</script>

<style></style>
