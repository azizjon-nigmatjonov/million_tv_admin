<template>
  <a-card :title="'Самые популярные возрастные группы '">
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
      <template slot="age" slot-scope="text">
        <span>{{ text.age }}</span>
      </template>
      <template slot="count" slot-scope="text">
        <span>{{ text.count }}</span>
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
          title: this.$t('age'),
          scopedSlots: {
            customRender: 'age',
          },
        },
        {
          title: this.$t('count'),
          scopedSlots: {
            customRender: 'count',
          },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 100,
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
      this.$store.dispatch('getMostViewedAgesExcel', this.params).then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    getInfo(params = {}) {
      this.$store
        .dispatch('getMostViewedAges', params)
        .then((res) => {
          // console.log('age', res)
          this.dataTable = res.ages.map((el, i) => ({
            ...el,
            idx: i + (this.number ? this.number - 10 : 1),
          }))
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
      console.log(e)
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
