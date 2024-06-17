<template>
  <div>
    <template>
      <div>
        <a-tabs type="card" @change="activeTabHandler" v-model="activeTabKey">
          <a-tab-pane key="1" :tab="$t('basicDetails')">
            <a-form-model
              @submit="onSubmit"
              ref="ruleForm"
              :model="customer"
              :rules="rules"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
            >
              <a-row>
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('full_name')" prop="full_name">
                    <a-input :disabled="true" v-model="customer.name" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('phone')" prop="phone">
                    <a-input :disabled="true" v-model="customer.phone" />
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-form-model-item :label="$t('email')" prop="email">
                    <a-input :disabled="true" v-model="customer.email" />
                  </a-form-model-item>
                </a-col>
                <a-col :md="6" :xs="24" style="padding: 0 15px">
                  <a-form-model-item :label="$t('gender')" prop="gender">
                    <a-select :disabled="true" v-model="customer.gender" :placeholder="$t('gender')">
                      <a-select-option key="male" value="male">
                        {{ $t('male') }}
                      </a-select-option>
                      <a-select-option key="female" value="female">
                        {{ $t('female') }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col :xs="24" :md="6" style="padding: 0 15px">
                  <a-form-model-item ref="name" :label="$t('birthday')" prop="birth_day">
                    <a-date-picker
                      :disabled="true"
                      value-format="YYYY-MM-DD"
                      format="YYYY-MM-DD"
                      placeholder="birthday"
                      v-model="customer.birth_day"
                      style="width: 100%"
                    />
                  </a-form-model-item>
                </a-col>
                <!-- Balance change inputs  --->
                <a-col :xs="24" :md="12" style="padding: 0 15px">
                  <a-col :xs="24" :md="12" style="display: flex; align-items: center; gap: 2rem; width: 100%">
                    <a-form-model-item style="flex: 1 1 70%; max-width: 70%" :label="$t('Баланс')" prop="balance">
                      <a-input :disabled="balanceEditDisabled" type="number" v-model="customer.balance" />
                    </a-form-model-item>
                    <a-tooltip placement="topRight">
                      <a-button
                        style="margin: 2px 6px 0 0"
                        id="buttonUpdate"
                        type="default"
                        icon="edit"
                        @click="handleEditButtonClick('balance')"
                      ></a-button>
                      <a-button
                        style="margin: 2px 6px 0 0"
                        id="buttonUpdate"
                        type="primary"
                        icon="save"
                        @click="handleBalanceChange"
                      ></a-button>
                    </a-tooltip>
                  </a-col>
                  <a-col :xs="24" :md="12" style="display: flex; align-items: center; gap: 2rem; width: 100%">
                    <a-form-model-item style="flex: 1 1 70%; max-width: 70%" :label="$t('Лицевой счёт')" prop="balance">
                      <a-input :disabled="balanceIdEditDisabled" type="number" v-model="customer.balance_id" />
                    </a-form-model-item>
                    <a-tooltip placement="topRight">
                      <a-button
                        style="margin: 2px 6px 0 0"
                        id="buttonUpdate"
                        type="default"
                        icon="edit"
                        @click="handleEditButtonClick('balance_id')"
                      ></a-button>
                      <a-button
                        style="margin: 2px 6px 0 0"
                        id="buttonUpdate"
                        type="primary"
                        icon="save"
                        @click="handleBalanceIdChange"
                      ></a-button>
                    </a-tooltip>
                  </a-col>
                </a-col>

                <a-col :xs="24" :md="6" style="padding: 0 15px">
                  <a-form-model-item :label="$t('avatar')">
                    <a-upload
                      :disabled="true"
                      name="file"
                      list-type="picture-card"
                      class="avatar-uploader"
                      :show-upload-list="false"
                      :action="`${VUE_APP_API_BASE_URL}image-upload`"
                      :before-upload="beforeUploadAvatar"
                      @change="handleChangeAvatarImage"
                    >
                      <img v-if="imageUrlAvatar" :src="imageUrlAvatar" alt="avatar" />
                      <div v-else>
                        <a-icon :type="loadingAvatar ? 'loading' : 'plus'" />
                        <div class="ant-upload-text">
                          {{ $t('upload') }}
                        </div>
                      </div>
                    </a-upload>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('subscription')">
            <a-table
              :columns="columns"
              :rowKey="(record) => record.id"
              :dataSource="subscription"
              :pagination="false"
              :loading="loading"
            >
              <template slot="status" slot-scope="text, row">
                <a-tag :color="row.active ? 'green' : 'red'">{{ $t(row.status) }}</a-tag>
              </template>
              <template slot="duration" slot-scope="text, row">
                {{ `${text} ${$t(`subscribe.${row.duration_type}`)}` }}
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="3" :tab="$t('purchased_movies')">
            <a-table
              :columns="columnsPurchases"
              :rowKey="(record) => record.id"
              :dataSource="purchases"
              :pagination="paginationPurchases"
              :loading="loading"
            >
              <template slot="status" slot-scope="text, row">
                <a-tag :color="row.active ? 'green' : 'red'">{{ row.active ? $t('active') : $t('inactive') }}</a-tag>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="4" :tab="$t('transactions')">
            <a-table
              :columns="columnsTransaction"
              :rowKey="(record) => record.id"
              :dataSource="transactions"
              :pagination="paginationTransaction"
              @change="handleTableChangeTransaction"
            >
              <template slot="status" slot-scope="text, row">
                <a-tag :color="getStatusColor(row.status)">{{ $t(row.status.toUpperCase()) }}</a-tag>
              </template>
              <template slot="payment_type" slot-scope="text">
                <div v-if="text === 'Payme'">
                  <img src="@/assets/icons/payme.png" width="112px" alt="Payme" />
                </div>
                <div v-else>
                  <img src="@/assets/icons/click.png" width="112px" alt="Click" />
                </div>
              </template>
            </a-table>
          </a-tab-pane>
          <a-tab-pane key="5" :tab="$t('sessions')">
            <a-table
              :columns="columnsSessions"
              :rowKey="(record) => record.id"
              :dataSource="sessions"
              :pagination="false"
            >
              <template slot="action" slot-scope="text, row">
                <a-popconfirm
                  v-action:delete
                  placement="left"
                  slot="extra"
                  :title="$t('deleteMsg')"
                  @confirm="deleteSession($event, row.id)"
                  :okText="$t('yes')"
                  :cancelText="$t('no')"
                >
                  <a-tooltip placement="topRight"
                    ><template slot="title">{{ $t('delete') }}</template>
                    <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
                  </a-tooltip>
                </a-popconfirm>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </div>
    </template>
  </div>
</template>
<script>
import request from '@/utils/request'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'

function getBase64(img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

export default {
  data() {
    return {
      VUE_APP_API_BASE_URL: process.env.VUE_APP_API_BASE_URL,
      customerId: this.$route.params.id,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      activeTabKey: '1',
      imageUrlAvatar: '',
      paginationTransaction: {},
      loadingAvatar: false,
      other: '',
      country: 'Uzbekistan',
      loading: false,
      subscription: [],
      transactions: [],
      sessions: [],
      purchases: [],
      paginationPurchases: {},
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'title',
        },
        {
          title: this.$t('category'),
          dataIndex: 'category_name',
        },
        {
          title: this.$t('activated_at'),
          dataIndex: 'activated_at',
        },
        {
          title: this.$t('duration'),
          dataIndex: 'duration',
          scopedSlots: { customRender: 'duration' },
        },
        {
          title: this.$t('end_time'),
          dataIndex: 'end_date',
        },
        {
          title: this.$t('price'),
          dataIndex: 'price',
        },
        {
          title: this.$t('status'),
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
      ],
      columnsPurchases: [
        {
          title: this.$t('title'),
          dataIndex: 'title',
        },
        {
          title: this.$t('purchased_at'),
          dataIndex: 'active_date',
        },
        {
          title: this.$t('sum'),
          dataIndex: 'price',
        },
      ],
      columnsTransaction: [
        {
          title: this.$t('created_at'),
          dataIndex: 'created_at',
        },
        {
          title: this.$t('amount'),
          dataIndex: 'amount',
        },
        {
          title: this.$t('type'),
          dataIndex: 'type',
        },
        {
          title: this.$t('status'),
          key: 'status',
          scopedSlots: { customRender: 'status' },
        },
        {
          title: this.$t('payment_type'),
          dataIndex: 'payment_type',
          scopedSlots: { customRender: 'payment_type' },
        },
      ],
      columnsSessions: [
        {
          title: this.$t('platform_name'),
          dataIndex: 'platform_name',
        },
        {
          title: this.$t('activated_at'),
          dataIndex: 'created_at',
        },
        {
          title: this.$t('ip_address'),
          dataIndex: 'ip_address',
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      balanceEditDisabled: true,
      balanceIdEditDisabled: true,
      customer: {
        name: null,
        lastname: '',
        address: '',
        email: '',
        phone: '',
        birth_day: '',
        gender: '',
        avatar: '',
        balance: '',
        balance_id: '',
      },
      rules: {
        title: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        description: [{ required: true, message: this.$t('required'), trigger: 'change' }],
        tariff_id: [{ required: true, message: this.$t('required'), trigger: 'change' }],
      },
    }
  },
  mounted() {
    if (this.customerId) this.getCustomerAttrs()
    this.getSubscription(this.customerId)
    this.getTransaction({ id: this.customerId, pageSize: 10, current: 1 })
    this.getSession(this.customerId)
    this.getGenres({ lang: this.lang })
    this.getCustomerPurchases({ pageSize: 10, current: 1 })
  },
  props: {
    // eslint-disable-next-line
    lang: String,
  },
  computed: {
    ...mapGetters(['genres']),
  },
  methods: {
    ...mapActions(['getCustomers', 'getGenres']),
    getCustomerAttrs() {
      request({
        url: '/customer/' + this.customerId,
        method: 'get',
      }).then((response) => {
        this.customer.name = response.name
        this.customer.lastname = response.lastname
        this.customer.birth_day = response.date_of_birth
        this.customer.address = response.address
        this.customer.email = response.email
        this.customer.phone = response.phone
        this.customer.gender = response.gender
        this.customer.avatar = response
        this.customer.balance = response.balance
        this.customer.balance_id = response.balance_id
        this.imageUrlAvatar = response.avatar
      })
    },
    handleEditButtonClick(button) {
      if (button === 'balance') {
        this.balanceEditDisabled = false
      } else if (button === 'balance_id') {
        this.balanceIdEditDisabled = false
      }
    },
    handleBalanceChange() {
      request({
        url: '/change-balance',
        method: 'put',
        data: {
          balance: parseFloat(this.customer.balance),
          user_id: this.customerId,
        },
      }).then((response) => {
        this.balanceEditDisabled = true
        this.$message.success(this.$t('Успешно изменено'))
      })
    },
    handleBalanceIdChange() {
      if (this.customer.balance_id.length < 7) {
        this.$message.error(this.$t('Лицевой счёт должен быть не менее 7 символов'))
      } else {
        request({
          url: '/change-balance_id',
          method: 'put',
          data: {
            balance_id: parseFloat(this.customer.balance_id),
            user_id: this.customerId,
          },
        })
          .then((response) => {
            this.balanceIdEditDisabled = true
            this.$message.success(this.$t('Успешно изменено'))
          })
          .catch((err) => {
            this.$message.error(this.$t('Такой лицевой счёт уже существует'))
          })
      }
    },
    handleTableChangeTransaction(pagination) {
      const newPagination = {
        ...pagination,
        id: this.customerId,
      }
      this.getTransaction(newPagination)
        .then((res) => console.log(res))
        .catch((err) => this.requestFailed(err))
    },
    getStatusColor(status) {
      switch (status) {
        case 'initial':
          return 'blue'
        case 'success':
          return 'green'
        case 'pending':
          return 'orange'
        case 'failed':
          return 'red'
        case 'fail':
          return 'red'
        default:
          return 'purple'
      }
    },
    getSubscription(id) {
      request({
        url: '/get-all-categories/' + id,
        method: 'get',
      }).then((res) => {
        const purchases = res.result.purchased
          .map((item) => {
            const subscriptions = item.subscriptions.map((sub) => ({
              category_title_ru: item.title_ru,
              category_title_uz: item.title_uz,
              category_title_en: item.title_en,
              ...sub,
              subscriptions: [],
            }))
            return subscriptions
          })
          .flat()
        this.subscription = purchases.map((subs) => {
          return {
            category_name: subs.category_title_ru,
            activated_at: moment(subs.start_date).format('YYYY-MM-DD HH:mm'),
            duration: subs.status === 'ACTIVE' ? subs.duration : subs.free_trial,
            price: `${subs.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сум',
            status: subs.status,
            active: subs.is_active,
            duration_type: subs.duration_type,
            id: subs.id,
            end_date: moment(subs.end_date).format('YYYY-MM-DD HH:mm'),
            title: subs.title_ru,
          }
        })
        console.log('this.SUBSCR', this.subscription)
      })
    },
    getTransaction(object) {
      request({
        url: '/client/' + object.id + '/transactions',
        method: 'get',
        params: { limit: object.pageSize, page: object.current },
      }).then((res) => {
        this.paginationTransaction = {
          ...object,
          total: res.count,
        }
        this.transactions = res.transactions.map((subs) => {
          return {
            ...subs,
            amount: `${subs.amount / 100}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' сум',
            created_at: moment(subs.created_at).format('YYYY-MM-DD HH:mm'),
            payment_type: subs.method.operator,
          }
        })
      })
    },
    getSession(id) {
      request({
        url: '/session/' + id,
        method: 'get',
        params: { page: 1, limit: 1 },
      }).then((resp) => {
        request({
          url: '/session/' + id,
          method: 'get',
          params: { page: 1, limit: resp.count },
        }).then((res) => {
          this.sessions = res.sessions.map((subs) => {
            return {
              ...subs,
              created_at: moment(subs.created_at).format('YYYY-MM-DD HH:mm'),
            }
          })
        })
      })
    },
    getCustomerPurchases(object) {
      request({
        url: '/customer/' + this.customerId + '/tvod',
        method: 'get',
        params: { limit: object.pageSize, page: object.current },
      }).then((res) => {
        this.paginationPurchases = {
          ...object,
          total: res.count,
        }
        this.purchases = res.purchases.map((subs) => {
          return {
            ...subs,
            price: `${subs.price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' сум',
            active_date: moment(subs.active_date).format('YYYY-MM-DD HH:mm'),
          }
        })
      })
    },
    beforeUploadAvatar(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('Image must smaller than 5MB!')
      }
      return isJpgOrPng && isLt2M
    },
    handleChangeAvatarImage(info) {
      if (info.file.status === 'uploading') {
        this.loadingAvatar = true
        return
      }
      if (info.file.status === 'done') {
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.imageUrlAvatar = imageUrl
          this.loadingAvatar = false
          this.customer.avatar = info.file.response.filename
        })
      }
    },
    deleteSession(e, id) {
      request({
        url: '/session/' + id,
        method: 'delete',
      })
        .then((res) => {
          console.log(res)
          this.$message.success(this.$t('successfullyDeleted'))
          this.getSession(this.customerId)
        })
        .then((err) => {
          if (err) {
            this.$message.error(this.$t('error'))
          }
        })
    },
    onSubmit(e) {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            request({
              url: '/customer/' + this.customerId,
              method: 'put',
              data: this.customer,
            })
              .then((res) => {
                this.$message.success(this.$t('successfullyUpdated'))
                this.getCustomers()
                this.$router.replace('/customers/list')
                resolve()
              })
              .catch((err) => {
                if (err) {
                  this.$message.success(this.$t('error'))
                }
                reject(err)
              })
          } else {
            reject(valid)
          }
        })
      })
    },
    activeTabHandler(_activeTabKey) {
      this.activeTabKey = _activeTabKey
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
  },
}
</script>
<style>
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
