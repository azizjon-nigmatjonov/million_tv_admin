<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/promocode/">{{ $t('promocodes') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card class="card-back">
      <template slot="title">
        <router-link to="/promocode/list">
          <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </router-link>
        {{ $t('fillIn') }}
      </template>
      <template slot="extra">
        <a-switch v-model="promocode.status" :checked-children="$t('active')" :un-checked-children="$t('inactive')" />
      </template>

      <template>
        <a-skeleton :loading="loadingSkeleton">
          <a-form-model
            @submit="onSubmit"
            ref="ruleForm"
            :model="promocode"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-row>
              <a-tabs type="card" v-if="promocodeId !== null">
                <a-tab-pane key="1">
                  <span slot="tab">
                    <flag iso="ru" />
                    Русский
                  </span>
                  <forms
                    :fetchingSubScriptions="fetchingSubScriptions"
                    :fetchSubScription="fetchSubScription"
                    :dataSubScriptions="dataSubScriptions"
                    :promocodeId="promocodeId"
                    lang="ru"
                    :promocode="promocode"
                  />
                </a-tab-pane>
                <a-tab-pane key="2">
                  <span slot="tab">
                    <flag iso="uz" />
                    O'zbekcha
                  </span>
                  <forms
                    :fetchingSubScriptions="fetchingSubScriptions"
                    :fetchSubScription="fetchSubScription"
                    :dataSubScriptions="dataSubScriptions"
                    :promocodeId="promocodeId"
                    lang="uz"
                    :promocode="promocode"
                  />
                </a-tab-pane>
                <a-tab-pane key="3">
                  <span slot="tab">
                    <flag iso="gb" />
                    English
                  </span>
                  <forms
                    :fetchingSubScriptions="fetchingSubScriptions"
                    :fetchSubScription="fetchSubScription"
                    :dataSubScriptions="dataSubScriptions"
                    :promocodeId="promocodeId"
                    lang="en"
                    :promocode="promocode"
                  />
                </a-tab-pane>
              </a-tabs>
              <div v-else>
                <forms
                  :fetchingSubScriptions="fetchingSubScriptions"
                  :fetchSubScription="fetchSubScription"
                  :dataSubScriptions="dataSubScriptions"
                  :promocodeId="promocodeId"
                  :promocode="promocode"
                  :generateType="generateType"
                />
              </div>
              <a-col :span="24" style="padding: 0 15px">
                <a-form-model-item>
                  <a-button type="primary" html-type="submit" @click="onSubmit">
                    {{ $t('save') }}
                  </a-button>
                  <a-button style="margin-left: 10px" @click="resetForm">
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
import vMain from './v-main.vue'
export default {
  components: { forms: vMain },
  data() {
    this.lastFetchIdGeo = 0
    this.lastFetchId = 0
    return {
      promocodeId: this.$route.params.id || null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingSkeleton: false,
      description: {},
      dataSubScriptions: [],
      fetchingSubScriptions: { flag: false },
      promocode: {
        type: this.$route.query.type,
        typeValue: this.$route.query.type === 'SUBSCRIPTION' ? 'По подписке' : 'Процентный' || null,
        discount: null,
        period: null,
        subscription_ids: [],
        promo_use: 0,
        description: '',
        promo_limit: null,
        status: true,
        title: '',
      },
      rules: {
        title: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        discount: [{ required: true, message: this.$t('required'), trigger: 'change' }],
      },
    }
  },
  mounted() {
    this.fetchSubScription('')
  },
  computed: {
    ...mapGetters(['promocodes', 'paginationPromocodes']),
    generateType () {
      return this.$route.query.generateType
    }
  },
  created() {
    if (this.promocodeId == null) return
    Promise.all([
      this.getPromocode({ lang: 'ru', id: this.$route.params.id }),
      this.getPromocode({ lang: 'uz', id: this.$route.params.id }),
      this.getPromocode({ lang: 'en', id: this.$route.params.id }),
    ]).then((response) => {
      this.promocode.type = response[0].result[0].type
      this.promocode.typeValue = response[0].result[0].type === 'SUBSCRIPTION' ? 'По подписке' : 'Процентный'
      this.promocode.discount = response[0].result[0].discount
      this.promocode.period = response[0].result[0].period
      this.promocode.status = response[0].result[0].status === 'ACTIVE'
      this.promocode.promo_limit = response[0].result[0].promo_limit
      this.promocode.subscription_ids = response[0].result[0].subscription_ids
      this.promocode.title = response[0].result[0].title
      this.promocode.description = response[0].result[0].description
      // {
      //   ru: response[0].result[0].description,
      //   uz: response[1].result[0].description,
      //   en: response[2].result[0].description,
      // }
    })
  },
  methods: {
    ...mapActions(['getPromocodes']),
    async getPromocode(params) {
      return this.$store.dispatch('getPromocodeById', params)
    },

    fetchSubScription(value) {
      this.lastFetchId = 0
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.dataCategory = []
      this.fetchingSubScriptions.flag = true

      request({
        url: '/subscription/category',
        params: { search: value },
      }).then((body) => {
        if (fetchId !== this.lastFetchId) {
          return
        }
        let data = []
        body.categories.forEach((category) => {
          category.subscriptions.forEach((subscription) => {
            var text = category.title_ru + ' ' + subscription.title_ru
            var value = subscription.id
            data.push({
              text,
              value,
            })
          })
        })
        this.dataSubScriptions = data
        this.fetchingDirectors = false
      })
    },
    onSubmit(e) {
      e.preventDefault()
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = this.promocodeId ? 'promocode/update-promo-code' : '/promocode/create-promo-code'
          if (this.generateType === 'random-generaete') url = 'promocode/create-count-promo-code'
          
          var method = this.promocodeId ? 'put' : 'post'
          const headers = {
            'Content-Type': 'application/json',
          }
          let _promocode = {}
          _promocode = {
            ...this.promocode,
            subscription_ids: [this.promocode.subscription_ids],
            id: this.promocodeId || undefined,
            discount: parseInt(this.promocode.discount) || undefined,
            period: this.promocode.type === 'SUBSCRIPTION' ? undefined : parseInt(this.promocode.period),
            promo_limit: parseInt(this.promocode.promo_limit),
            status: this.promocode.status ? 'ACTIVE' : 'INACTIVE',
          }
          if (this.generateType === 'random-generaete') _promocode.count = _promocode.promo_limit ? _promocode.promo_limit : undefined
          console.log('_promocode', _promocode, url);
          delete _promocode.typeValue
          request({
            url,
            method,
            data: _promocode,
            headers,
          })
            .then((res) => {
              this.getPromocodes()
              this.$router.replace('/promocode/list')
            })
            .catch((err) => {
              if (err) {
                this.$message.error(err.response.data.error)
              }
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
  },
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
