<template>
  <a-card :title="$t('Динамика роста продаж')">
    <div slot="extra" style="display: flex; align-items: center; gap: 20px;">
      <a-range-picker
        v-if="params.filter === 'day'"
        valueFormat="DD-MM-YYYY"
        format="DD-MM-YYYY"
        :placeholder="[$t('start_time'), $t('end_time')]"
        @change="dateReport"
      />
      <a-select @change="timeReport" v-model="params.filter" style="width: 140px">
        <a-select-option value="day">
          {{ $t('День') }}
        </a-select-option>
        <a-select-option value="month">
          {{ $t('Mесяц') }}
        </a-select-option>
        <a-select-option value="year">
          {{ $t('Год') }}
        </a-select-option>
      </a-select>
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
            :headTitle="$t('Динамика роста продаж (на сум)')"
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
      this.$store.dispatch('getProfitReportExcel', this.params).then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    timeReport() {
      this.getInfo(this.params)
    },
    getInfo(params) {
      this.$store
        .dispatch('getProfitReport', params)
        .then(res => {
          this.dataDay = res.total.map(el => el.amount)
          this.dataLabels = res.total.map(el => el.created_at)
          // console.log('dataDay', this.dataDay)
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
