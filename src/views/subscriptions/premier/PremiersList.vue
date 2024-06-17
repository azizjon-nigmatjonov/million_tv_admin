<template>
  <div>
     <a-row>
      <a-col :xs="24" :md="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>
            <router-link to="/subscription/category/list">{{ $t('categories') }}</router-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>{{ $t('Премьер') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
      <a-card class="card-back" :title="$t('updatePremier')">
      <template slot="extra">
        <router-link :to="{ path: `/subscription/category/update/${$route.query.category_id}`, query: { type: 'premier' } }">
          <a-button type="link" icon="arrow-left" style="margin-right: 10px"> </a-button>
        </router-link>
      </template>
      <a-table
        v-action:get
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="getAllPremierPackets"
        :pagination="paginationSubscriptionsModel"
        :loading="loading"
        @change="handleTableChange"
        bordered
      >
        <template slot="action" slot-scope="text, row">
          <router-link v-action:update :to="{ path: `/subscription/create/`, query: { category_id: $route.query.category_id, type: 'premier', id: 6 } }">
            <a-tooltip placement="topRight"
              ><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 6px" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteSubscription($event, row.id)"
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
    </a-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {

  data() {
    return {
      tagId: this.$route.params.id,
      columns: [
        {
          title: this.$t('No'),
          dataIndex: 'index',
          width: '100px',
          align: 'center'
        },
        {
          title: this.$t('title'),
          dataIndex: 'name'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '106px',
          scopedSlots: { customRender: 'action' }
        }
      ],
    }
  },
  props: {
    // eslint-disable-next-line
    lang: String
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
  mounted() {
    this.getPremierPackets()
  },
  methods: {
    ...mapActions(['getPremierPackets']),
  },
}
</script>
<style>
.ant-table-body {
  background: #fff;
}
</style>
