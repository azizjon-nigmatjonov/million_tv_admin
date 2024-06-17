<template>
  <div>
    <template>
      <a-form-model
        @submit="onSubmit"
        ref="ruleForm"
        :model="subscription"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <!-- Title Ru -->
          <a-row v-if="this.lang === 'ru' || this.$route.name === 'SubscriptionCreate'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title_ru">
                <a-input v-model="subscription.title_ru" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Title Uz -->
          <a-row v-if="this.lang === 'uz'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title_uz">
                <a-input v-model="subscription.title_uz" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Title En -->
          <a-row v-if="this.lang === 'en'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('title')" prop="title_en">
                <a-input v-model="subscription.title_en" />
              </a-form-model-item>
            </a-col>
          </a-row>

          <!-- Category -->
          <!-- <a-row v-if="type === 'common'">
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('categories') + ' (кино, сериалы)'" prop="category">
                <a-select
                  :placeholder="$t('category')"
                  v-model="subscription.subscription_relations[0].keys"
                  mode="multiple"
                >
                  <a-select-option v-for="category in getAllCategories" :key="category.slug" :value="category.slug">
                    {{ category.title }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!--
          <a-row v-if="type === 'premier' || type === 'megogo'">
          
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item
                :label="$t('categories') + ` ${subscription.duration_type === 'day' ? '(день)' : '(месяц)'}`"
                prop="duration"
              >
                <a-input
                  class="number-input"
                  disabled
                  v-for="category in getCategoryIntegration"
                  :key="category.slug"
                  :value="category.slug"
                />
              </a-form-model-item>
            </a-col>
           
          </a-row>
          -->
          <!--  <a-row v-if="type === 'common' || type === 'premier'">
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('quality') + ' (360p, 720p.)'" prop="category">
                <a-select
                  :placeholder="$t('quality')"
                  :value="subscription.subscription_relations[1].keys"
                  @change="qualityChangeFunction"
                  mode="multiple"
                >
                  <a-select-option v-for="quality in qualities" :key="quality" :value="quality">
                    {{ quality }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!-- Integration -->
          <!-- <a-row v-if="type === 'common'">
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('integration') + ' (мегаго, амедиатека)'" prop="category">
                <a-select
                  :placeholder="$t('integration')"
                  :value="subscription.subscription_relations[2].keys"
                  @change="integrationChangeFunction"
                  mode="multiple"
                >
                  <a-select-option v-for="integration in integrations" :key="integration" :value="integration">
                    {{ $t(integration) }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!-- Integration premier -->
          <!-- <a-row v-if="type === 'premier' || type === 'megogo'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('integration')">
                <a-input class="number-input" disabled v-model="subscription.integration" />
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!-- Duration Type -->
          <!-- <a-row v-if="type !== 'premier' && type !== 'megogo'">
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('subscription_type') + ' (день, месяц)'" prop="duration_type">
                <a-select v-model="subscription.duration_type" :placeholder="$t('subscription_type')">
                  <a-select-option
                    v-for="durationType in durationTypes"
                    :key="durationType.value"
                    :value="durationType.value"
                  >
                    {{ durationType.name }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!-- Duration Type Premier -->
          <!-- <a-row v-if="type === 'premier' || type === 'megogo'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('subscription_type')">
                <a-input class="number-input" disabled v-model="subscription.duration_type" />
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!-- Subscription Duration -->
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item
                :label="$t('subscription_duration') + ` ${subscription.duration_type === 'day' ? '(день)' : '(месяц)'}`"
                prop="duration"
              >
                <a-input-number
                  class="number-input"
                  v-model="subscription.duration"
                  @change="isNumber"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Free Trial -->
          <a-row v-if="type === 'mix'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('free_trial')" prop="title">
                <a-input-number class="number-input" v-model="subscription.free_trial" @change="isNumber" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Subscription Type -->
          <!-- <a-row v-if="type !== 'common'">
            <a-col :md="12" :xs="24" style="padding: 0 15px">
              <a-form-model-item :label="$t('subscription_type') + ' (Бесплатно, платный)'" prop="subscription_type">
                <a-select v-model="subscription.subscription_type" :placeholder="$t('subscription_type')">
                  <a-select-option
                    v-for="subscriptionType in subscriptionTypes"
                    :key="subscriptionType.value"
                    :value="subscriptionType.value"
                  >
                    {{ $t(subscriptionType.name) }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row> -->
          <!-- Price -->
          <a-row>
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('sum')" prop="price">
                <a-input-number class="number-input" v-model="subscription.price" @change="isNumber" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Limit -->
          <a-row v-if="type === 'session_limit'">
            <a-col :xs="24" :md="12" style="padding: 0 15px">
              <a-form-model-item :label="$t('limit')" prop="session_limit">
                <a-input v-model.number="subscription.session_limit" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <!-- Status -->
          <a-col :xs="4" style="padding: 0 15px" >
            <a-form-model-item :label="$t('status')" prop="active">
              <a-switch
                v-model="subscription.is_active"
                :checked-children="$t('active')"
                :un-checked-children="$t('inactive')"
                default-checked
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </template>
  </div>
</template>
<script>
import request from '@/utils/request'
import { mapActions, mapGetters } from 'vuex'

let debounce = setTimeout(() => {}, 0)

export default {
  data() {
    return {
      tagId: this.$route.params.id,
      type: this.$route.query.type,
      premierId: this.$route.query.id,
      loadingLogo: false,
      isPrice: true,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      loading: false,
      durationTypes: [
        { name: 'Day', value: 'day' },
        { name: 'Month', value: 'month' }
      ],
      subscriptionTypes: [
        { name: 'session_limit', value: 'session_limit' },
        { name: 'online_session_limit', value: 'online_session_limit' }
      ],
      isFree: [
        { name: 'free', value: 'true' },
        { name: 'notFree', value: 'false' }
      ],
      qualities: ['all', '360p', '480p', '720p', '1080p', '4k'],
      integrations: ['all', 'tv'],
      subscription: {
        title_ru: '',
        title_uz: '',
        title_en: '',
        price: '',
        duration: this.$route.query.type === 'megogo' || this.$route.query.type === 'common' ? 30 : 0,
        duration_type: 'day',
        category_id: '',
        free_trial: 0,
        is_free: null,
        id: '',
        is_active: true,
        alimit: 0,
        online_session_limit: 0,
        session_limit: 0,
        integration: this.$route.query.type === 'premier' ? 'premier' : 'megogo',
        subscription_type:
          this.$route.query.type === 'live_session_limit' ? 'online_session_limit' : this.$route.query.type,
        subscription_relations: [
          {
            id: '',
            type: 'Category',
            is_all: false,
            keys: []
          },
          {
            id: '',
            type: 'Quality',
            is_all: false,
            keys: []
          },
          {
            id: '',
            type: 'Integration',
            is_all: false,
            keys: []
          }
        ]
      },
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center'
        },
        {
          title: this.$t('title'),
          dataIndex: 'name'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      rules: {
        title_ru: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        is_free: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        price: [{ required: true, message: this.$t('required'), trigger: 'change' }]
      }
    }
  },
  props: {
    // eslint-disable-next-line
    lang: String
  },
  computed: {
    ...mapGetters(['paginationTags', 'subscriptions', 'categories']),
    getAllCategories() {
      return this.categories.filter(category => category.slug !== 'story' && category.slug !== 'integration')
    },
    getCategoryIntegration() {
      return this.categories.filter(category => category.slug === 'integration')
    }
  },
  mounted() {
    if (this.action) this.getPremierPackets()
    if (this.tagId) this.getTagAttrs()
    if (this.premierId) this.getPremierAttr()
    this.getSubscriptions()
    this.getCategories()
    if (this.type === 'common') {
      this.isPrice = false
    }
    if (this.$route.query.type === 'premier') {
      this.subscription.subscription_relations[2].keys = ['premier']
    }
    if (this.$route.query.type === 'megogo') {
      this.subscription.subscription_relations[2].keys = ['megogo']
    }
  },
  methods: {
    ...mapActions(['getSubscriptions', 'getCategories', 'getPremierPackets']),
    isNumber(val) {
      clearTimeout(debounce)
      if (typeof val !== 'number' && val !== '') {
        debounce = setTimeout(() => {
          this.$message.warn('Please enter the number')
        }, 700)
      }
    },
    getTagAttrs() {
      request({
        url: '/subscriptionmodel/' + this.tagId,
        method: 'get'
        // params: { lang: this.lang },
      }).then(response => {
        this.subscription.title_ru = response.title_ru
        this.subscription.title_uz = response.title_uz
        this.subscription.title_en = response.title_en
        this.subscription.price = response.price
        this.subscription.duration = response.duration
        this.subscription.duration_type = 'day'
        this.subscription.category_id = response.category_id
        this.subscription.free_trial = response.free_trial
        this.subscription.is_free = response.is_free.toString()
        this.subscription.id = response.id
        this.subscription.is_active = response.is_active
        this.subscription.session_limit =
          response.subscription_type === 'session_limit' ? response.session_limit : response.online_session_limit
        // this.subscription.session_limit = response.session_limit
        this.subscription.subscription_type = response.subscription_type
        this.subscription.subscription_relations[0].id = response.subscription_relations.find(
          s => s.type === 'Category'
        ).id
        this.subscription.subscription_relations[1].id = response.subscription_relations.find(
          s => s.type === 'Quality'
        ).id
        this.subscription.subscription_relations[2].id = response.subscription_relations.find(
          s => s.type === 'Integration'
        ).id
        this.subscription.subscription_relations[0].keys = response.subscription_relations.find(
          s => s.type === 'Category'
        ).keys
        this.subscription.subscription_relations[1].keys = response.subscription_relations.find(
          s => s.type === 'Quality'
        ).keys
        this.subscription.subscription_relations[2].keys = response.subscription_relations.find(
          s => s.type === 'Integration'
        ).keys
      })
    },
    getPremierAttr() {
      request({
        url: `/premier/packets/${this.premierId}`,
        method: 'get'
      }).then(response => {
        this.subscription.duration_type = response.duration_type
        this.subscription.duration = response.duration
        // console.log('resss attrr', response)
      })
    },
    qualityChangeFunction(val) {
      if (val.includes('all')) this.subscription.subscription_relations[1].keys = ['all']
      else this.subscription.subscription_relations[1].keys = val
    },
    integrationChangeFunction(val) {
      if (val.includes('all')) this.subscription.subscription_relations[2].keys = ['all']
      else this.subscription.subscription_relations[2].keys = val
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            if (this.type) {
              var url = '/subscriptionmodel'
              var method = 'post'
              if (this.tagId) {
                url = '/subscriptionmodel/' + this.tagId
                method = 'put'
                const headers = {
                  'Content-Type': 'application/json'
                }
                request({
                  url: url,
                  method: method,
                  data: {
                    title_ru: this.subscription.title_ru,
                    title_uz: this.subscription.title_uz,
                    title_en: this.subscription.title_en,
                    price: parseInt(this.subscription.price),
                    duration: parseInt(this.subscription.duration),
                    duration_type: 'day',
                    category_id: this.subscription.category_id,
                    free_trial: parseInt(this.subscription.free_trial),
                    is_free: false,
                    id: this.tagId,
                    is_active: this.subscription.is_active,
                    online_session_limit:
                      this.subscription.subscription_type === 'online_session_limit'
                        ? parseInt(this.subscription.alimit)
                        : 0,
                    session_limit:
                      this.type === 'session_limit' ? parseInt(this.subscription.session_limit) : 0,
                    subscription_type: this.subscription.subscription_type,
                    subscription_relations: [
                      {
                        id: this.subscription.subscription_relations[0].id,
                        type: 'Category',
                        is_all: this.subscription.subscription_relations
                          .find(s => s.type === 'Category')
                          .keys.includes('all'),
                        keys: this.subscription.subscription_relations.find(s => s.type === 'Category').keys
                      },
                      {
                        id: this.subscription.subscription_relations[1].id,
                        type: 'Quality',
                        is_all: this.subscription.subscription_relations
                          .find(s => s.type === 'Quality')
                          .keys.includes('all'),
                        keys: this.subscription.subscription_relations
                          .find(s => s.type === 'Quality')
                          .keys.includes('all')
                          ? this.qualities.slice(1, this.qualities.length)
                          : this.subscription.subscription_relations.find(s => s.type === 'Quality').keys
                      },
                      {
                        id: this.subscription.subscription_relations[2].id,
                        type: 'Integration',
                        is_all: this.subscription.subscription_relations
                          .find(s => s.type === 'Integration')
                          .keys.includes('all'),
                        keys: this.subscription.subscription_relations
                          .find(s => s.type === 'Integration')
                          .keys.includes('all')
                          ? this.integrations.slice(1, this.integrations.length)
                          : this.subscription.subscription_relations.find(s => s.type === 'Integration').keys
                      }
                    ]
                  },
                  headers: headers
                })
                  .then(res => {
                    this.$message.success(this.$t('successfullyUpdated'))
                    if (e === 'exit') {
                      this.$router.replace('/subscription/category/list')
                      this.getSubscriptions()
                    }
                    resolve()
                  })
                  .catch(err => {
                    if (err) {
                      console.log(err)
                      this.$message.error(this.$t('error'))
                    }
                    reject(err)
                  })
              } else {
                request({
                  url: url,
                  method: method,
                  data: {
                    title_ru: this.subscription.title_ru,
                    title_uz: this.subscription.title_ru,
                    title_en: this.subscription.title_ru,
                    price: parseInt(this.subscription.price),
                    duration: parseInt(this.subscription.duration),
                    duration_type: 'day',
                    category_id: this.$route.query.category_id,
                    free_trial: parseInt(this.subscription.free_trial),
                    is_free: false,
                    id: this.tagId,
                    is_active: this.subscription.is_active,
                    online_session_limit:
                      this.subscription.subscription_type === 'online_session_limit'
                        ? parseInt(this.subscription.alimit)
                        : 0,
                    session_limit:
                      this.type === 'session_limit' ? parseInt(this.subscription.session_limit) : 0,
                    subscription_type: this.subscription.subscription_type,
                    subscription_relations: [
                      {
                        id: this.subscription.subscription_relations[0].id,
                        type: 'Category',
                        is_all: this.subscription.subscription_relations
                          .find(s => s.type === 'Category')
                          .keys.includes('all'),
                        keys: this.subscription.subscription_relations.find(s => s.type === 'Category').keys
                      },
                      {
                        id: this.subscription.subscription_relations[1].id,
                        type: 'Quality',
                        is_all: this.subscription.subscription_relations
                          .find(s => s.type === 'Quality')
                          .keys.includes('all'),
                        keys: this.subscription.subscription_relations
                          .find(s => s.type === 'Quality')
                          .keys.includes('all')
                          ? this.qualities.slice(1, this.qualities.length)
                          : this.subscription.subscription_relations.find(s => s.type === 'Quality').keys
                      },
                      {
                        id: this.subscription.subscription_relations[2].id,
                        type: 'Integration',
                        is_all: this.subscription.subscription_relations
                          .find(s => s.type === 'Integration')
                          .keys.includes('all'),
                        keys: this.subscription.subscription_relations
                          .find(s => s.type === 'Integration')
                          .keys.includes('all')
                          ? this.integrations.slice(1, this.integrations.length)
                          : this.subscription.subscription_relations.find(s => s.type === 'Integration').keys
                      }
                    ]
                  }
                })
                  .then(res => {
                    this.$message.success(this.$t('successfullyAdded'))
                    this.getSubscriptions()
                    this.$router.replace('/subscription/category/list')
                    resolve()
                  })
                  .catch(err => {
                    if (err) {
                      console.log(err)
                      this.$message.error(this.$t('error'))
                    }
                    reject(err)
                  })
              }
            } else {
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      })
    }
  }
}
</script>
<style>
.number-input {
  width: 100% !important;
}
.ant-form-item-control {
  line-height: normal !important;
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
