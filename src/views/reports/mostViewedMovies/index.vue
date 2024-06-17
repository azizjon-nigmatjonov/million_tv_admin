<template>
  <a-card title="Самые просматриваемые фильмы">
    <div slot="extra" style="display: flex; align-items: center; gap: 20px">
      <a-select v-model="filter" style="width: 200px">
        <a-select-option v-for="(item, index) in filters" :key="index">{{ item.title }}</a-select-option>
      </a-select>
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
    ></a-table>
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
          title: this.$t('name'),
          dataIndex: 'title',
        },
        {
          title: this.$t('Жанр'),
          dataIndex: 'genre',
        },
        {
          title: this.$t('viewed_count'),
          dataIndex: 'view_count',
        },
      ],
      filters: [
        {
          title: this.$t('all')
        },
        {
          title: 'Premier'
        },
        {
          title: 'Megogo'
        },
      ],
      filter: this.$t('all'),
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
      this.$store.dispatch('getMostViewedMoviesExcel', this.params).then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    getInfo(params) {
      this.$store
        .dispatch('getMostViewedMovies', params)
        .then((res) => {
          // console.log('data', res)
          this.dataTable = res.movies.map((el, i) => ({
            ...el,
            index: i + (this.number ? this.number - 10 : 1),
          }))
          this.params.pagination.total = res.count
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
