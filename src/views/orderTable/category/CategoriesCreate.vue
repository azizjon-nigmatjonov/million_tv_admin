<template>
  <div>
    <a-row>
      <a-col :md="12" :xs="24">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/orderTable/category/list">{{ $t('Стол заказов') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('action') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <a-card class="card-back">
      <template slot="title">
        <router-link to="/orderTable/category/list">
          <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </router-link>
        {{ $t('fillIn') }}
      </template>
      <template slot="extra">
        <a-tag v-if="this.order.status === 'uploaded'" color="green">{{ $t('Принято') }}</a-tag>
        <a-tag v-else-if="this.order.status === 'in-process'" color="yellow">{{ $t('В очереди') }}</a-tag>
        <a-tag v-else color="red">{{ $t('Отказано') }}</a-tag>
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
              <forms :order="order" />
              <a-col v-if="this.order.status === 'in-process'" :span="24" style="padding: 0 15px">
                <a-form-model-item>
                  <a-button type="primary" @click="handleAction('accept')">
                    {{ $t('Принять') }}
                  </a-button>
                  <a-button type="danger" style="margin-left: 10px" @click="handleAction('reject')">
                    {{ $t('Отказать') }}
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
import { mapActions } from 'vuex'
import vMain from './v-main.vue'
export default {
  components: { forms: vMain },
  data() {
    this.lastFetchIdGeo = 0
    this.lastFetchId = 0
    return {
      orderId: this.$route.params.id || null,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      other: '',
      loading: false,
      loadingSkeleton: false,
      order: {
        orderer: '',
        movieName: '',
        movieLink: '',
        comment: '',
        status: '',
        description: '',
      },
    }
  },
  mounted() {},
  computed: {},
  created() {
    if (this.orderId == null) return
    Promise.all([this.getOrder({ object_id: this.$route.params.id })]).then((response) => {
      console.log(response)
      this.order.movieName = response[0].title
      this.order.comment = response[0].comment
      this.order.description = response[0].description
      this.order.orderer = response[0].orderer
      this.order.movieLink = response[0].link
      this.order.status = response[0].status
    })
  },
  methods: {
    ...mapActions(['getOrderById']),
    async getOrder(params) {
      return this.$store.dispatch('getOrderById', params)
    },
    handleAction(action) {
      console.log(this.order)
      if (action === 'accept') {
        request({
          url: '/order/update-order/{object_id}',
          method: 'put',
          params: {
            status: 'uploaded',
            object_id: this.orderId,
            comment: this.order.comment,
          },
        }).then((response) => {
          this.$message.success('Заказ принят')
          this.$router.push('/orderTable/category/list')
        })
      } else if (action === 'reject') {
        if (this.order.comment === undefined || this.order.comment.length < 1) {
          this.$message.error('Введите комментарий')
        } else {
          request({
            url: '/order/update-order/{object_id}',
            method: 'put',
            params: {
              status: 'rejected',
              object_id: this.orderId,
              comment: this.order.comment,
            },
          }).then((response) => {
            this.$message.success('Заказ отклонен')
            this.$router.push('/orderTable/category/list')
          })
        }
      }
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
