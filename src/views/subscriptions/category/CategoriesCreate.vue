<template>
  <div>
    <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/subscription/category/list">{{ $t('category') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-if="edit">{{ $t('update') }}</a-breadcrumb-item>
          <a-breadcrumb-item v-else>{{ $t('add') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <!-- Update Category -->
    <div v-if="edit">
      <a-card class="card-back" :title="$t('updateCategory')">
        <template slot="extra">
          <router-link to="/subscription/category/list">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-tabs>
          <a-tab-pane key="1" :tab="$t('category')">
            <a-row>
              <a-tabs type="card" v-model="activeTabKey">
                <a-tab-pane key="1">
                  <span slot="tab">
                    <flag iso="ru" />
                    Русский
                  </span>
                  <v-main :form="form" lang="ru"></v-main>
                </a-tab-pane>
                <a-tab-pane key="2">
                  <span slot="tab">
                    <flag iso="uz" />
                    O'zbekcha
                  </span>
                  <v-main :form="form" lang="uz"></v-main>
                </a-tab-pane>
                <a-tab-pane key="3">
                  <span slot="tab">
                    <flag iso="gb" />
                    English
                  </span>
                  <v-main :form="form" lang="en"></v-main>
                </a-tab-pane>
              </a-tabs>
            </a-row>
          </a-tab-pane>
          <a-tab-pane key="2" :tab="$t('subscription')">
            <subscriptions-list :type1="form.category_type"/>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
    <!-- Create Category -->
    <div v-else-if="!edit">
      <a-card class="card-back" :title="$t('fillIn')">
        <template slot="extra">
          <router-link to="/subscription/category/list">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <v-main :form="form" ref="createForm"></v-main>
        </a-row>
      </a-card>
    </div>
    <!-- <div v-else>
      <a-card class="card-back" :title="$t('fillIn')">
        <template slot="extra">
          <router-link to="/subscription/category/list">
            <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
          </router-link>
        </template>
        <a-row>
          <ul class="premierList" v-for="packet in premierPackets" :key="packet.id">
            <li>
              <router-link :to="{path: `/subscription/update/${packet.id}`, query: { type: 'premier', name: 'premierPacket' } }">
              <span>{{ packet.name }}</span>
              <span>ID: {{ packet.id }}</span>
            </router-link>
            </li>
          </ul>
        </a-row>
      </a-card>
    </div> -->
    <a-row>
      <a-col :span="24" style="padding: 15px 0">
        <a-form-model-item>
          <a-button :loading="isSubmitting" type="primary" html-type="submit" @click.prevent="submit(false)">
            {{ $t('save') }}
          </a-button>
          <a-button v-if="edit" :loading="isSubmitting" type="primary" style="margin-left: 10px;" @click.prevent="submit(true)">
            {{ $t('saveExit') }}
          </a-button>
        </a-form-model-item>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import vMain from './v-main'
import SubscriptionsList from '../SubscriptionsList.vue'
import { mapActions, mapGetters } from 'vuex'
import request from '@/utils/request'


export default {
  data() {
    return {
      Id: this.$route.params.id,
      isSubmitting: false,
      type: this.$route.query.type,
      activeTabKey: '1',
      edit: !!this.$route.params.id,
      editPremier: this.$route.query.type,
      form: {
        imageUrlLogo: '',
        logo_image: '',
        status: false,
        title_ru: '',
        title_uz: '',
        title_en: '',
        description_ru: '',
        description_uz: '',
        description_en: '',
        category_type: '',
        duration_type: 'day',
        number_of_cartoons: 0,
        number_of_channels: 0,
        number_of_mas: 0,
        category_relations: [
          {
            id: '',
            type: 'Category',
            is_all: false,
            keys: []
          },
          {
            id: '',
            type: 'Integration',
            is_all: false,
            keys: ['tv']
          }
        ]
      }
    }
  },
  mounted() {
    this.getPremierPackets()
    console.log('edit', this.editPremier)
  },
  computed: {
    ...mapGetters(['premierPackets']),
     getAllPremierPackets() {
      return this.premierPackets.map((packet, index) => {
        return {
          ...packet,
          index: index + 1
        }
      })
    }
  },
  methods: {
    ...mapActions(['getSubscriptions', 'getPremierPackets']),
    submit(exit) {
      this.isSubmitting = true
      if (this.edit) {
        const header = {
          'Content-Type': 'application/json'
        }
        return new Promise((resolve, reject) => {
        request({
          url: '/subscription/category/' + this.Id,
          method: 'put',
          data: {
            category_image: this.form.category_image?.split('/')?.pop() ?? '',
            status: this.form.status,
            title_ru: this.form.title_ru,
            title_uz: this.form.title_uz,
            title_en: this.form.title_en,
            description_ru: this.form.description_ru,
            description_uz: this.form.description_uz,
            description_en: this.form.description_en,
            category_type: this.form.category_type,
            category_relations: this.form.category_relations,
            number_of_cartoons: this.form.number_of_cartoons,
            number_of_channels: this.form.number_of_channels,
            number_of_mas: this.form.number_of_mas,
            duration_type: this.form.duration_type,
          },
          headers: header
        })
          .then(res => {
            this.$message.success(this.$t('successfullyUpdated'))
            this.getSubscriptions()
            if (exit) {
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
          this.isSubmitting = false
      })
      } else {
        this.$refs.createForm.onSubmit('exit').then({}).catch(err => {
          this.isSubmitting = false
        })
      }
    }
  },
  components: { 'v-main': vMain, 'subscriptions-list': SubscriptionsList }
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
.premierList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.premierList li a {
  border: 1px solid #eee;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  color: #111;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
