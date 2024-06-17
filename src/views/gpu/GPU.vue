<template>
  <a-card title="GPU Setting">
    <a-row>
      <a-col :span="16">
        <div class="fan">
          <img :style="`animation: fan-spin ${time} ${speed}ms linear; margin-right: 30px; margin-left: 90px`" width="250px" height="250px" :src="fan" alt="" srcset="">
          <img :style="`animation: fan-spin ${time} ${speed}ms linear`" width="250px" height="250px" :src="fan" alt="" srcset="">
        </div>
      </a-col>
      <a-col style="margin-top: 80px; text-align: center" :span="8">
        <h1 style="margin-bottom: 40px; font-size: 24px"> {{ run ? 'Running' : 'Stopped' }}</h1>
        <a-button :disabled="run" size="large" style="margin-right: 20px; background-color: #37f837!important;" @click="starter">Start</a-button>
        <a-button :disabled="!run" size="large" @click="stopper" type="danger">Stop</a-button>
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import request from '@/utils/request'
import fan from '@/assets/fan.png'
export default {
  data () {
    return {
      fan: fan,
      starting: false,
      speed: 2000,
      time: 'forwards',
      run: false
    }
  },
  methods: {
    startGPU() {
      if (this.starting) {
        this.time = 'infinite'
        this.speed = this.speed - 10
        console.log(this.speed)
        if (this.speed <= 10) return
        setTimeout(this.startGPU, 20)
        // eslint-disable-next-line no-useless-return
      } else return
    },
    stopGPU() {
      if (!this.starting) {
        this.speed = this.speed + 10
        console.log(this.speed)
        if (this.speed >= 2000) {
          this.time = 'forwards'
          return
        }
        setTimeout(this.stopGPU, 20)
        // eslint-disable-next-line no-useless-return
      } else return
    },
    starter () {
      request({
        url: '/instance-control/on',
        method: 'post'
      }).then(res => {
        this.starting = true
        this.startGPU()
        this.run = true
      })
    },
    stopper () {
      request({
        url: '/instance-control/off',
        method: 'post'
      }).then(res => {
        this.starting = false
        this.stopGPU()
        this.run = false
      })
    }
  },
  mounted() {
    request({
      url: '/instance-control',
      method: 'get'
    }).then(res => {
      if (res.state === 'running') {
        this.run = true
        this.time = 'infinite'
        this.speed = 10
      } else {
        this.run = false
        this.time = 'forwards'
        this.speed = 2000
      }
    })
  }
}
</script>

<style lang="less">
.fan {
  display: flex;
  text-align: center;
}
@keyframes fan-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
