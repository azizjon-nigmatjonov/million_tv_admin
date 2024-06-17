<template>
  <div>
  <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :sm="24" :xs="24">
          <a-card :loading="loading" :title="$t('Количество онлайн абонентов в реальном времени')" :bordered="true">
            <h2 style="margin-left: 15px; color: #5086EC; font-weight: 700;">{{ onlineUsers }}</h2>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <a-card :loading="loading" :bordered="false" :title="$t('view_details')">
      <!-- <a-row slot="extra">
        <a-select v-model="month" style="width: 200px" @change="changeMonth">
          <a-select-option v-for="item in months" :key="item.val" :value="item.val">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-row> -->
      <div class="salesCard">
        <a-row style="padding: 25px">
          <a-col :xl="13" :lg="13" :md="13" :sm="24" :xs="24">
              <transition name="slide-fade">
                <Barchart :title="$t('monthly')" :headTitle="$t('views_count')" :allData="dataDay" :labels="dataLabels"></Barchart>
              </transition>
          </a-col>
          <a-col :xl="11" :lg="11" :md="11" :sm="24" :xs="24">
            <rank-list :title="$t('mostMovies')" :list="rankList"/>
          </a-col>
        </a-row>
      </div>
    </a-card>

    <div class="antd-pro-pages-dashboard-analysis-twoColLayout" :class="!isMobile && 'desktop'">
      <a-row :gutter="24" type="flex" :style="{ marginTop: '24px' }">
        <a-col :sm="24" :xs="24">
          <a-card :loading="loading" :title="$t('lastSubscriptions')" :bordered="true">
            <a-table
              :columns="columns"
              :rowKey="record => record.client_id"
              :dataSource="dataTable"
              :pagination="false"
            ></a-table>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Barchart from '@/utils/barchart'
import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
} from '@/components'
import { baseMixin } from '@/store/app-mixin'
import { mapActions, mapGetters } from 'vuex'

function compareByDate (a, b) {
  if (a.day < b.day) {
    return -1
  }
  if (a.day > b.day) {
    return 1
  }
  return 0;
}
export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Barchart,
    Bar,
  },
  data () {
    return {
      fadeload: false,
      fadeloadCharts: false,
      isloadChart: false,
      onlineUsers: '',
      dataDay: [],
      dataLabels: [],
      dataYear: [],
      yearLabels: [],
      month: null,
      rankList: [],
      dataTable: [],
      columns: [
        {
          title: this.$t('customer_name'),
          dataIndex: 'client_name'
        },
        {
          title: this.$t('amount'),
          dataIndex: 'amount'
        },
        {
          title: this.$t('created_at'),
          dataIndex: 'created_at'
        }
      ],
      loading: true,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  mounted () {
    this.dashBoard()
  },
  computed: {
    ...mapGetters(['dailyViews', 'mostMovies', 'lastSubscriptions'])
  },
  methods: {
    ...mapActions(['getDaily', 'getMostViewed', 'getLastSubscriptions']),
    dashBoard (mon) {
      this.isloadChart = false
      // var date = new Date()
      // var day = date.getDate()
      // var dayCount = 0
      this.dailyViews.sort(compareByDate)
      // var startDate = this.getPrevMonthCount() - (25 - day)
      this.getDaily().then(res => {
        console.log(res)
        this.dataLabels = res.daily_stats.map(el => `${el.day}/${el.month}/${el.year}`)
        this.dataDay = res.daily_stats.map(el => el.view_count)
        // if (day < 25) {
        //   console.log(this.getPrevMonthCount())
        //   for (let i = startDate; i <= this.getPrevMonthCount(); i++) {
        //     var exist = false
        //     if (i === this.dailyViews[dayCount].day) {
        //       exist = true
        //       this.dataDay.push(this.dailyViews[dayCount].view_count)
        //       console.log(this.dailyViews[dayCount].view_count)
        //       this.dataLabels.push(this.dailyViews[dayCount].day + ' ' + this.getMonthName(date.getMonth() - 1))
        //       dayCount++            
        //     }
        //     if (!exist) {
        //       this.dataDay.push(0)
        //       this.dataLabels.push(i + ' ' + this.getMonthName(date.getMonth() - 1))                         
        //     }
        //   }
        // }
        // for (let i = 1; i <= day; i++) {
        //   var exists = false
        //     if (i === this.dailyViews[dayCount].day) {
        //       exists = true
        //       console.log(this.dailyViews[dayCount].view_count)
        //       this.dataDay.push(this.dailyViews[dayCount].view_count)
        //       this.dataLabels.push(this.dailyViews[dayCount].day + ' ' + this.getMonthName(date.getMonth()))
        //       dayCount++
        //     }
        //   if (!exists) {
        //     this.dataDay.push(0)
        //     this.dataLabels.push(i + ' ' + this.getMonthName(date.getMonth()))                         
        //   }
        // }
        console.log(this.dataDay, this.dataLabels)
        this.getMostViewed().then(() => {
          if (this.mostMovies && this.mostMovies.length) {
            this.mostMovies.map(movie => {
              this.rankList.push({
                name: (movie.title ? movie.title : 'Не указано') + (movie.season_key !== '0' ? `, ${movie.season_key} ${this.$t('season')}` : '') + (movie.episode_key !== '0' ? `, ${movie.episode_key} ${this.$t('episode')}` : ''),
                total: movie.view_count
              })
            })
          }
        })
        this.getLastSubscriptions().then(() => {
          if (this.lastSubscriptions && this.lastSubscriptions.length) {
            this.dataTable = this.lastSubscriptions.map(trans => {
              return {
                client_name: trans.client_name,
                created_at: moment(trans.created_at).format('YYYY-MM-DD HH:mm'),
                amount: `${(trans.amount / 100)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            })
          }
        })
      })
    },
    getPrevMonthCount () {
      var now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    },
    getMonthName (num) {
      var month = []
      month[0] = 'Январь'
      month[1] = 'Февраль'
      month[2] = 'Mарт'
      month[3] = 'Aпрель'
      month[4] = 'Mай'
      month[5] = 'Июнь'
      month[6] = 'Июль'
      month[7] = 'Август'
      month[8] = 'Сентябрь'
      month[9] = 'Октябрь'
      month[10] = 'Ноябрь'
      month[11] = 'Декабрь'
      var n
      if (num === -1) {
        n = month[11]
      } else {
        n = month[num]
      }      
      return n
    },
    changeMonth (e) {
      console.log(e)
      this.dashBoard(e)
    },
    getInfo (params = {}) {
      this.$store.dispatch('getOnlineUsersCount', params).then(res => {
        this.onlineUsers = res.count
      })
    },
  },
  created () {
    setInterval(() => {
      this.getInfo()
    }, 10000);
    this.getInfo()
    const date = new Date()
    const nowMonth = parseInt(moment(date).format('MM'))
    this.month = nowMonth
    this.fadeload = true
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  }
}
</script>

<style lang="less" scoped>
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  .antd-pro-pages-dashboard-analysis-twoColLayout {
    position: relative;
    display: flex;
    display: block;
    flex-flow: row wrap;
    margin-bottom: 20px;
  }

  .antd-pro-pages-dashboard-analysis-salesCard {
    height: calc(100% - 24px);
    /deep/ .ant-card-head {
      position: relative;
    }
  }

  .dashboard-analysis-iconGroup {
    i {
      margin-left: 16px;
      color: rgba(0,0,0,.45);
      cursor: pointer;
      transition: color .32s;
      color: black;
    }
  }
  .analysis-salesTypeRadio {
    position: absolute;
    right: 54px;
    bottom: 12px;
  }
</style>
