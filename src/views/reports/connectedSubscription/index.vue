<template>
  <a-card :title="$t('Подключённые/ Отключённые подписки')">
    <div slot="extra" style="display: flex; align-items: center; gap: 20px">
      <a-form-model-item prop="status" style="margin: 0">
        <a-switch
          @change="changeStatus"
          v-model="isSwitchAvtive"
          :checked-children="$t('active')"
          :un-checked-children="$t('inactive')"
          default-checked
        />
      </a-form-model-item>
      <a-range-picker
        valueFormat="DD-MM-YYYY"
        format="DD-MM-YYYY"
        :placeholder="[$t('start_time'), $t('end_time')]"
        @change="dateReport"
      />
      <a-button
        @click="downloadExcel"
        icon="dowlond"
        style="background-color: #1890ff; color: white; border: none; display: flex; align-items: center"
      >
        <img src="../../../assets/icons/ExcelIcon.svg" alt="" />
      </a-button>
    </div>

    <a-table
      :data-source="dataTable"
      bordered
      :columns="columns"
      :pagination="params.pagination"
      @change="changePagination"
    >
      <template slot="status" slot-scope="text">
        <a-tag v-if="text.status === 'ACTIVE'" color="green">{{ text.status }}</a-tag>
        <a-tag v-else color="">{{ text.status }}</a-tag>
      </template>
      <template slot="activation_date" slot-scope="text">
        <span>{{ text.activation_date | moment }}</span>
      </template>
      <template slot="end_date" slot-scope="text">
        <span>{{ text.end_date | moment }}</span>
      </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      dataTable: [],
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '60px',
          align: 'center',
        },
        {
          title: this.$t('username'),
          dataIndex: 'username',
        },
        {
          title: this.$t('category_name'),
          dataIndex: 'category_name',
        },
        {
          title: this.$t('subcription_name'),
          dataIndex: 'subcription_name',
        },
        {
          title: this.$t('pay_amount'),
          dataIndex: 'pay_amount',
        },
        {
          title: this.$t('activation_date'),
          scopedSlots: {
            customRender: 'activation_date',
          },
        },
        {
          title: this.$t('end_date'),
          scopedSlots: {
            customRender: 'end_date',
          },
        },
        {
          title: this.$t('status'),
          scopedSlots: {
            customRender: 'status',
          },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 10,
        },
        start_date: '',
        end_date: '',
        status: 'ACTIVE',
      },
      isSwitchAvtive: true,
      number: null,
    }
  },
  methods: {
    downloadExcel() {
      this.$store.dispatch('getConnectedSubscriptionExcel', this.params).then(({ url }) => {
        window.open(url, '_blank')
      })
    },
    getInfo(params = {}) {
      this.$store
        .dispatch('getConnectedSubscription', params)
        .then((res) => {
          if (res.connected_subscription.map((el) => el.status === 'ACTIVE' || el.status === 'active')[0]) {
            this.isSwitchAvtive = true
          } else {
            this.isSwitchAvtive = false
          }
          this.dataTable = res.connected_subscription.map((el, ind) => ({
            ...el,
            index: ind + (this.number ? this.number - 10 : 1),
          }))
          this.params.pagination.total = res.count
        })
        .catch((error) => {
          if (error.response.data.code === 'DATE_IS_EQUAL') {
            this.$message.error(this.$t('Вы не можете ввести одинаковую дату'))
          } else {
            this.$message.error(this.$t('error'))
          }
        })
    },
    changePagination(e) {
      if (e.current > 1) {
        this.number = e.current * 10 + 1
      } else {
        this.number = null
      }
      this.params.pagination = e
      this.getInfo(this.params)
    },
    changeStatus(e) {
      if (e) {
        this.params.status = 'ACTIVE'
      } else {
        this.params.status = 'INACTIVE'
      }
      this.getInfo(this.params)
    },
    dateReport(e) {
      this.params.start_date = e[0]
      this.params.end_date = e[1]
      this.params.pagination.current = 1
      this.number = null
      this.getInfo(this.params)
    },
  },
  created() {
    this.getInfo(this.params)
  },
}
</script>

<style></style>
