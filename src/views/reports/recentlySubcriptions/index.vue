<template>
  <a-card :title="$t('Последние покупки подписок')">
    <div slot="extra" style="display: flex; align-items: center; gap: 20px">
       <a-select @change="handleCategory" v-model="category" style="width: 140px">
        <a-select-option
          v-for="(item, ind) in categories"
          :key="ind"
          :value="item.slug"
        >
          {{ $t(item.slug) }}
        </a-select-option>
      </a-select>
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
      <template slot="price" slot-scope="text">
        <span>{{ text.price }}</span> uzs
      </template>
      <template slot="time" slot-scope="text">
        <span>{{ text.time | moment }}</span>
      </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      dataTable: [],
      category: 'all',
      categories: [
        {
          slug: 'all'
        },
        {
          slug: 'Premier'
        },
        {
          slug: 'Megogo',
        }
      ],
      columns: [
        {
          title: this.$t('customer'),
          dataIndex: 'customer',
        },
        {
          title: this.$t('Стоимость транзакции (сум)'),
          scopedSlots: {
            customRender: 'price',
          },
        },
        {
          title: this.$t('Время транзакции'),
          scopedSlots: {
            customRender: 'time',
          },
        },
        // {
        //     title: this.$t('Название категория'),
        //      dataIndex: 'category_name',
        // },
        {
          title: this.$t('Название подписки'),
          dataIndex: 'subcription_name',
        },
        {
          title: this.$t('Название категории'),
          dataIndex: 'category_name',
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 10,
        },
        end_date: '',
        start_date: '',
      },
    }
  },
  methods: {
    downloadExcel() {
      let params = { ...this.params, category: this.category }
      if (params.category === 'all') params.category = ''
      this.$store
        .dispatch('getRecentlySubscriptionsExcel', params)
        .then(({ url }) => {
          window.open(url, '_blank')
        })
    },
    getInfo(params = {}) {
      params = { ...params, category: this.category }
      if (params.category === 'all') params.category = ''
      this.$store
        .dispatch('getRecentlySubscriptions', params)
        .then((res) => {
          this.dataTable = res.recently_subcriptions
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
    dateReport(e) {
      this.params.start_date = e[0]
      this.params.end_date = e[1]
      this.params.pagination.current = 1
      this.number = null
      this.getInfo(this.params)
    },
    handleCategory (e) {
      this.category = e
      this.getInfo({ ...this.params })
    }
  },
  created() {
    this.getInfo(this.params)
  },
}
</script>

<style></style>
