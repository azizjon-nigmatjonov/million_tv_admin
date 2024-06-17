<template>
  <a-card :title="$t('Ежедневная динамика абонентов')">
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
    <a-row style="padding: 25px">
      <a-col>
        <transition name="slide-fade">
          <Barchart
            :title="$t('monthly')"
            :headTitle="$t('Ежедневная динамика абонентов (на сум)')"
            :allData="dataDay"
            :labels="dataLabels"
          ></Barchart>
        </transition>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import Barchart from '@/utils/barchartReport'
export default {
  components: {
    Barchart
  },
  data() {
    return {
      // type: 'day',
      dataTable: [],
      dataDay: [],
      dataLabels: [],
      columns: [
        {
          title: this.$t('Время'),
          dataIndex: 'time'
        },
        {
          title: this.$t('Cum (сум)'),
          scopedSlots: {
            customRender: 'amount'
          }
        }
      ],
      params: {
        filter: 'day',
        end_date: '',
        start_date: ''
      }
    }
  },
  methods: {
    downloadExcel() {
      this.$store.dispatch('getUsersActivityPeriodExcel', this.params).then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    timeReport() {
      this.getInfo(this.params)
    },
    getInfo(params) {
      this.$store
        .dispatch('getUsersActivityPeriod', params)
        .then(res => {
          this.dataDay = res.total.map(el => el.count)
          this.dataLabels = res.total.map(el => el.hour)
        //   console.log('dataDay', this.dataDay)
        })
        .catch(error => {
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
      this.getInfo(this.params)
    }
  },
  mounted() {
    this.getInfo(this.params)
  }
}
</script>

<style></style>
