<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-item :label="$t('type')" prop="typeValue">
          <a-input :disabled="true" v-model="promocode.typeValue" :placeholder="$t('type')" />
        </a-form-item>
      </a-col>
      <a-col v-if="generateType !== 'random-generaete'" :xs="24" :md="12" style="padding: 0 15px">
        <a-form-item :label="$t('Логин промокода')" prop="title">
          <a-input v-model="promocode.title" :placeholder="$t('Логин промокода')" />
        </a-form-item>
      </a-col>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-model-item
          v-if="this.promocode.type === 'SUBSCRIPTION'"
          :label="$t('Включенные подписки')"
          prop="subscription_ids"
        >
          <a-select
            id="numberInput"
            show-search
            :auto-clear-search-value="false"
            v-model="promocode.subscription_ids"
            :show-arrow="true"
            :placeholder="$t('subscription')"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetchingSubScriptions.flag ? undefined : $t('subscriptionNotFound')"
            @search="fetchSubScription"
          >
            <a-spin v-if="fetchingSubScriptions.flag" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in dataSubScriptions" :key="d.value" :value="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-else-if="this.promocode.type === 'PERCENT'"
          :label="$t('Процент скидки, %')"
          prop="discount"
        >
          <a-input type="number" :placeholder="$t('Процент')" v-model="promocode.discount" />
        </a-form-model-item>
      </a-col>
      <a-col v-if="promocode.type === 'PERCENT'" :xs="24" :md="12" style="padding: 0 15px">
        <a-form-model-item :label="$t('duration') + ' ' + $t('day(s)')" prop="period">
          <a-input type="number" :placeholder="$t('duration')" v-model="promocode.period" />
        </a-form-model-item>
      </a-col>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-model-item :label="$t('Кол-во промокода')" prop="promo_limit">
          <a-input type="number" :placeholder="$t('limit')" v-model="promocode.promo_limit" />
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :xs="24" style="padding: 0 15px">
        <a-form-model-item :label="$t('description')" prop="description">
          <a-textarea
            v-if="promocodeId == null"
            :placeholder="$t('description')"
            v-model="promocode.description"
            :auto-size="{ minRows: 5, maxRows: 10 }"
          />
          <a-textarea
            v-else
            :placeholder="$t('description')"
            v-model="promocode.description"
            :auto-size="{ minRows: 5, maxRows: 10 }"
          />
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    promocode: {
      type: Object,
      default: null,
    },
    promocodeId: {
      type: String,
      default: null,
    },
    lang: {
      type: String,
      default: null,
    },
    fetchingSubScriptions: {
      type: Object,
      required: true,
    },
    fetchSubScription: {
      type: Function,
      required: true,
    },
    dataSubScriptions: {
      type: Array,
      required: true,
    },
    generateType: {
      type: Function,
      required: true
    }
  },
}
</script>

<style>
</style>
