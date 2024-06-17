<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-item :label="$t('Заказчик')" prop="orderer">
          <a-input :disabled="true" v-model="order.orderer" :placeholder="$t('Заказчик')" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-item :label="$t('Название фильма')" prop="movieName">
          <a-input :disabled="true" v-model="order.movieName" :placeholder="$t('Название фильма')" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-item :label="$t('Ссылка на фильм')" prop="movieLink">
          <a-input :disabled="true" v-model="order.movieLink" :placeholder="$t('Ссылка на фильм')" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="24" style="padding: 0 15px"> </a-col>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-model-item :label="$t('description')" prop="description">
          <a-textarea
            :disabled="true"
            :placeholder="$t('description')"
            v-model="order.description"
            :auto-size="{ minRows: 5, maxRows: 10 }"
          />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-model-item :label="$t('comment')" prop="comment">
          <a-textarea :placeholder="$t('comment')" v-model="order.comment" :auto-size="{ minRows: 5, maxRows: 10 }" />
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: null,
    },
  },

  mounted() {
    console.log(this.order)
  },
}
</script>

<style>
</style>
