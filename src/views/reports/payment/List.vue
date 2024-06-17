<template>
  <a-card size="small" :title="$t('consolidated_payment_raiser')" style="width: 100%">
    <div slot="extra" style="display: flex; gap: 20px">
      <a-select v-model="payment" placeholder="select" style="width: 140px">
        <a-select-option v-for="(item, ind) in payments" :key="ind" :value="item.title">
          {{ item.title }}</a-select-option
        >
      </a-select>
      <a-button icon="download"></a-button>
    </div>
    <a-table
      :columns="columns"
      :data-source="[]"
      :loading="loading"
      :rowKey="(item) => item.id"
      :pagination="params.pagination"
      @change="changePagination"
      bordered
    ></a-table>
  </a-card>
</template>

<script>
export default {
  data() {
    return {
      payments: [
        {
          title: 'Payme',
        },
      ],
      payment: 'Payme',
      loading: false,
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: 1,
        },
      },
    }
  },
  methods: {
    changePagination() {},
  },
}
</script>
