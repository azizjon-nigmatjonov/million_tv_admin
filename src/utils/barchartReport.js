import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
  props: ['allData', 'labels', 'title', 'headTitle'],
  watch: {
    allData(val) {
      this.renderChart(
        {
          labels: this.labels,
          datasets: [
            {
              label: this.headTitle,
              data: val,
              backgroundColor: 'rgb(107,148,210)'
            }
          ]
        },
        {
          responsive: true,
          maintainAspectRatio: false
        }
      )
    }
  },
}
