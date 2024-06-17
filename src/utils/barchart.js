import { Bar } from 'vue-chartjs'
export default {
  extends: Bar,
  props: ['allData', 'labels', 'title', 'headTitle'],
  mounted () {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: this.headTitle,
            data: this.allData,
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
}
