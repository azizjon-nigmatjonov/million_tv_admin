<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/customers/">{{ $t('customers') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="edit">{{ $t('update') }}</a-breadcrumb-item>
          <a-breadcrumb-item v-else>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>

    <div>
      <a-card class="card-back" :title="$t('updateCustomer')">
        <template slot="extra">
          <router-link to="/customers">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <v-main ref="editForm" lang="ru"></v-main>
        </a-row>
      </a-card>
    </div>
    <!-- <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button type="primary" html-type="submit" @click.prevent="submit">
            {{ $t('save') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row> -->
  </div>
</template>
<script>
import vMain from './v-main.vue'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      isSubmitting: false,
      activeTabKey: '1',
      edit: !!this.$route.params.id,
    }
  },
  mounted() {
    console.log('this.$refs', this.$refs)
  },
  updated() {
    console.warn('this.$refs', this.$refs)
  },

  methods: {
    ...mapActions(['getCustomers']),
    submit() {
      this.$refs.editForm.onSubmit()
    },
    resetForm() {
      this.$refs.editForm.resetForm()
    },
  },
  components: { 'v-main': vMain },
}
</script>
<style>
.card-back .ant-card-head-wrapper {
  flex-direction: row-reverse;
  justify-content: flex-end;
  justify-items: flex-end;
}
.ant-select-selection__choice {
  width: 100%;
}
.ant-upload img {
  width: 100%;
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
