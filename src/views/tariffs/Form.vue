<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12" style="padding: 0 15px">
        <a-form-model-item :label="$t('category')" prop="category">
          <a-select
            id="numberInput"
            show-search
            :auto-clear-search-value="false"
            v-model="tariff.categories"
            :placeholder="$t('category')"
            mode="multiple"
            style="width: 100%"
            :filter-option="false"
            :not-found-content="fetchingCategory.flag ? undefined : $t('categoryNotFound')"
            @search="fetchCategory"
          >
            <a-spin v-if="fetchingCategory.flag" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in dataCategory" :key="d.value" :value="d.value">
              {{ d.text }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-col>
      <a-col :md="12" :xs="24" style="padding: 0 15px">
        <a-form-model-item :label="$t('description')" prop="description">
          <a-textarea
            v-if="tarifId == null"
            :placeholder="$t('description')"
            v-model="tariff.description"
            :auto-size="{ minRows: 5, maxRows: 10 }"
          />
          <a-textarea
          v-else
            :placeholder="$t('description')"
            v-model="tariff.description[lang]"
            :auto-size="{ minRows: 5, maxRows: 10 }"
          />
        </a-form-model-item>
      </a-col>
      <a-col :span="24">
        <a-row>
          <div v-for="(k, index) in tariff.prices" :key="index">
            <a-col :xs="24" :md="11" style="padding: 0 15px">
              <a-form-model-item :label="$t('duration') + ' ' + $t('day(s)')" prop="duration">
                <a-input type="number" :placeholder="$t('duration')" v-model="tariff.prices[index].duration" />
              </a-form-model-item>
            </a-col>
            <a-col :xs="24" :md="11">
              <a-form-model-item :label="$t('price')" prop="price">
                <a-input type="number" :placeholder="$t('price')" v-model="tariff.prices[index].price" />
              </a-form-model-item>
            </a-col>
            <a-col :xs="3" :md="2" style="padding: 0 15px">
              <a-icon
                v-if="tariff.prices.length > 1"
                class="dynamic-delete-button"
                type="minus-circle-o"
                @click="() => remove(k, index)"
              />
            </a-col>
          </div>
          <a-col :xs="24" style="padding: 0 15px 0 15px">
            <a-form-item>
              <a-button type="dashed" style="width: 100%" @click="add">
                <a-icon type="plus" /> {{ $t('add') }}
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  props: {
    tariff: {
      type: Object,
      default: null,
    },
    tarifId: {
      type: String,
      default: null,
    },
    lang: {
      type: String,
      default: null,
    },
    fetchingCategory: {
      type: Object,
      required: true,
    },
    fetchCategory: {
      type: Function,
      required: true,
    },
    dataCategory: {
      type: Array,
      required: true,
    },
    remove: {
      type: Function,
      required: true,
    },
    add: {
      type: Function,
      required: true,
    },
  },
}
</script>

<style>
</style>
