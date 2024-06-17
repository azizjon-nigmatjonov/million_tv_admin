<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/tariffs/">{{ $t('tariffs') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card :title="$t('fillIn')">
      <template slot="extra">
        <a-switch v-model="tariff.active" :checked-children="$t('active')" :un-checked-children="$t('inactive')" default-checked />
      </template>
      <template>
        <a-skeleton :loading="loadingSkeleton">
          <a-form-model
            @submit="onSubmit"
            ref="ruleForm"
            :model="tariff"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row>
              <a-tabs type="card" v-if="tarifId !== null">
                <a-tab-pane key="1">
                  <span slot="tab">
                    <flag iso="ru" />
                    Русский
                  </span>
                  <forms :tarifId="tarifId" lang="ru" :fetchingCategory="fetchingCategory" :tariff="tariff" :add="add" :remove="remove" :dataCategory="dataCategory" :fetchCategory="fetchCategory" />
                </a-tab-pane>
                <a-tab-pane key="2">
                  <span slot="tab">
                    <flag iso="uz" />
                    O'zbekcha
                  </span>
                  <forms :tarifId="tarifId" lang="uz" :fetchingCategory="fetchingCategory" :tariff="tariff" :add="add" :remove="remove" :dataCategory="dataCategory" :fetchCategory="fetchCategory" />
                </a-tab-pane>
                <a-tab-pane key="3">
                  <span slot="tab">
                    <flag iso="gb" />
                    English
                  </span>
                  <forms :tarifId="tarifId" lang="en" :fetchingCategory="fetchingCategory" :tariff="tariff" :add="add" :remove="remove" :dataCategory="dataCategory" :fetchCategory="fetchCategory" />
                </a-tab-pane>
              </a-tabs>
              <div v-else>
                <forms :tarifId="tarifId" :fetchingCategory="fetchingCategory" :tariff="tariff" :add="add" :remove="remove" :dataCategory="dataCategory" :fetchCategory="fetchCategory" />
              </div>
              <a-col :span="24" style="padding: 0 15px">
                <a-form-model-item>
                  <a-button type="primary" html-type="submit" @click="onSubmit">
                    {{ $t('save') }}
                  </a-button>
                  <a-button style="margin-left: 10px;" @click="resetForm">
                    {{ $t('reset') }}
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </a-skeleton>
      </template>
    </a-card>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import Forms from './Form'
export default {
  components: { forms: Forms },
  data () {
    this.lastFetchIdGeo = 0
    this.lastFetchId = 0
    this.fetchCategory = debounce(this.fetchCategory, 800)
    return {
      tarifId: this.$route.params.id || null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingSkeleton: false,
      imageUrl: '',
      dataCategory: [],
      fetchingCategory: { flag: false },
      description: {},
      tariff: {
        active: false,
        categories: [],
        description: '',
        quality: '4k',
        lang: 'ru',
        prices: [{
          duration: null,
          price: null
        }]
      },
      rules: {
        name: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        key: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.loadingSkeleton = true
    if (this.tarifId) {
      // this.getTarifAttrs()
      this.getCategories({ lang: this.lang }).then(() => {
        this.getCategories({ current: 1, pageSize: this.paginationCategories.total, lang: this.lang }).then(() => {
          this.categories.map(category => {
            this.dataCategory.push({
              text: category.title,
              value: category.slug
            })
          })
          this.loadingSkeleton = false
        })
      })
    } else {
      this.getCategories({ lang: this.lang }).then(() => {
        this.getCategories({ current: 1, pageSize: this.paginationCategories.total, lang: this.lang }).then(() => {
          this.categories.map(category => {
            this.dataCategory.push({
              text: category.title,
              value: category.slug
            })
          })
          this.loadingSkeleton = false
        })
      })
    }
  },
  computed: {
    ...mapGetters(['tariffs', 'categories', 'paginationCategories'])
  },
  created () {
    if (this.tarifId == null) return
    Promise.all([ 
      this.getTariff({ lang: 'ru', id: this.$route.params.id }), 
      this.getTariff({ lang: 'uz', id: this.$route.params.id }),
      this.getTariff({ lang: 'en', id: this.$route.params.id })
      
      ]).then(response => {
        this.tariff.categories = response[0].categories
        this.tariff.quality = response[0].quality
        this.tariff.prices = response[0].prices.map(e => ({ duration: e.duration, price: e.price.toString().slice(0, -2) }))
        this.tariff.active = response[0].active
        this.tariff.description = { ru: response[0].description, uz: response[1].description, en: response[2].description }
    })
  },
  methods: {
    ...mapActions(['getTarifs', 'getCategories']),
    getTarifAttrs () {
      request({
        url: '/tariff/' + this.tarifId,
        method: 'get',
        params: { lang: 'ru' }
      }).then((response) => {
        // console.log(response)
        this.tariff.description = response.description

      })
    },
    async getTariff (params) {
      return this.$store.dispatch('getTariffById', params)
    },
    remove (k, index) {
      this.tariff.prices.splice(index, 1)
    },

    add () {
      this.tariff.prices.push({
        duration: null,
        price: null
      })
    },
    fetchCategory (value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.dataCategory = []
      this.fetchingCategory.flag = true

      request({
        url: '/categories',
        params: { search: value }
        })
        .then(body => {
          if (fetchId !== this.lastFetchId) {
            return
          }
          const data = body.categories.map(category => ({
            text: category.title,
            value: category.slug
          }))
          this.dataCategory = data
          this.fetchingDirectors = false
        })
    },
    onSubmit (e) {
      e.preventDefault()
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          var url = '/tariff'
          var method = 'post'
          const headers = {
            'Content-Type': 'application/json'
          }
          if (this.tarifId) {
            url = '/tariff/' + this.tarifId
            method = 'put'
          }
          const _tariff = { ...this.tariff }
          _tariff.prices = this.tariff.prices.map(e => {
            return {
              duration: e.duration,
              price: parseInt(e.price + '00')
            }
          })
          // console.log(_tariff, url, method, headers)
          request({
              url: url,
              method: method,
              data: _tariff,
              headers: headers
          }).then(res => {
            this.getTarifs()
            this.$router.replace('/tariffs/list')
          }).catch(err => {
            if (err) {
              console.log(err)
              this.$message.error(err.response.data.error)
            }
          })
          console.log('valid')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
<style>
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
