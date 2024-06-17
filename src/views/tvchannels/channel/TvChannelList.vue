<template>
  <a-table
    v-action:get
    :columns="columns"
    :rowKey="(record, index) => record.title + index"
    :dataSource="getAllTvPrograms"
    @change="handleTableChange"
    bordered
  >
    <template slot="data" slot-scope="row">
      {{ row.start_time.slice(0, 10) }}
    </template>
    <template slot="period" slot-scope="row">
      {{ row.start_time.slice(11, 16) }} - {{ row.end_time.slice(11, 16) }}
    </template>
  </a-table>
</template>

<script>
export default {
  props: {
    programsInfo: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: true,
      programData: [],
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'title'
        },
        {
          title: this.$t('data'),
          scopedSlots: { customRender: 'data' }
        },
        {
          title: this.$t('period'),
          scopedSlots: { customRender: 'period' }
        }
      ]
    }
  },
  mounted() {},
  methods: {
    handleTableChange(pagination) {
      console.log('pagination', pagination)
      //   const paginationNew = {
      //     ...pagination,
      //     search: null
      //   }
      //   this.getTvPrograms(paginationNew)
      //     .then(res => console.log(res))
      //     .catch(err => this.requestFailed(err))
    }
  },
  computed: {
    getAllTvPrograms() {
      return [
        ...this.programData.concat(
          this.programsInfo[0].programme,
          this.programsInfo[1].programme,
          this.programsInfo[2].programme
        )
      ]
    }
  }
}
</script>
