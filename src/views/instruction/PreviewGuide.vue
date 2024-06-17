<template>
  <a-card>
    <template slot="title">
      <router-link to="/instruction">
        <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
      </router-link>
    </template>
    <a-skeleton :loading="loadingSkeleton">
      <a-row>
        <a-col :sm="24" :md="5" style="padding-right: 20px">
          <a-affix :offset-top="top">
              <a-menu
                  :default-selected-keys="[0]"
                  style="padding: 8px; margin-bottom: 5px"
                  mode="vertical">
                  <a-menu-item v-for="(instruction, index) in instructions" :key="index"><a :href="'#'+instruction.id">{{ instruction.title }}</a></a-menu-item>
              </a-menu>
          </a-affix>
        </a-col>
        <a-col :sm="24" :md="19">
          <div v-for="instruction in instructions" :key="instruction.id" :id="instruction.id" style="padding-top: 60px">
              <h1>{{ instruction.title }}</h1>
              <div v-html="instruction.body"></div>
              <a-divider/>
          </div>
        </a-col>
      </a-row>
    </a-skeleton>
  </a-card>
</template>
<script>
import request from '@/utils/request'
import { Affix } from 'ant-design-vue'

export default {
  data () {
    return {
      guideId: this.$route.params.guid,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      top: 70,
      instructions: [],
      loadingSkeleton: false
    }
  },
  mounted () {
    this.loadingSkeleton = true
    if (this.guideId) {
        this.getGuideList()
        .then(res => { this.loadingSkeleton = false })
        .catch(err => {
          this.$message.error(err)
          this.loadingSkeleton = false
        })
    }
  },
  components: {
      'a-affix': Affix
  },
  methods: {
    getGuideList () {
      return new Promise((resolve, reject) => {
        request({
          url: '/instructions/' + this.guideId,
          method: 'get'
        }).then((response) => {
          this.instructions = response.instructions
          resolve(response)
        }).catch(err => {
          reject(err)
        })
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style>
    .card-back .ant-card-head-wrapper {
      flex-direction: row-reverse;
      justify-content: flex-end;
      justify-items: flex-end;
    }
    h1 {
        text-align: center !important;
        font-size: 40px !important;
    }
  .dynamic-delete-button {
    cursor: pointer;
    position: relative;
    top: 35px;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
  }
  .dynamic-delete-button:hover {
    color: #777;
  }
  .dynamic-delete-button[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
  @media (max-width: 760px) {
    .ant-form-item {
      margin: 0;
    }
  .ant-form-item-label {
    padding-bottom: 4px !important;
  }
  }
</style>
