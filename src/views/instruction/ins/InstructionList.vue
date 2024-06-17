<template>
  <div>
    <a-card :title="`${$route.params.name} ${$t('instructionList')}`" style="width: 100%">
      <a-button type="primary" slot="extra" @click="$router.push({ name: 'InstructionCreate', params: { guid: $route.params.guid, name: $route.params.name } })">{{ $t('add') }}</a-button>
      <a-table
        :columns="columns"
        :data-source="allInstruction"
        :loading="loadInstruction"
        :rowKey="item => item.id"
        :pagination="paginationInstruction"
        @change="changePagination"
        bordered
      >
        <template slot="action" slot-scope="item">
          <a-tooltip>
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin: 0 2px" id="buttonUpdate" type="primary" @click="editShipper(item)" icon="edit"></a-button>
          </a-tooltip>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removeShipper(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip>
              <template slot="title">{{ $t('delete') }}</template>
              <a-button
                style="margin: 0 2px"
                type="danger"
                icon="delete"
              ></a-button>
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
      visible: false,
      loading: false,
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'title'
        },
        {
          title: this.$t('action'),
          key: 'action',
          align: 'center',
          width: '20%',
          scopedSlots: { customRender: 'action' },
        },
      ],
      params: {
        pagination: {
          current: 1,
          pageSize: 10,
          total: null,
        },
        guid: this.$route.params.guid,
      }
    }
  },
  methods: {
    ...mapActions(['getAllInstruction', 'deleteInstruction']),
    hide () {
      this.visible = false
      this.$router.push({
        name: 'GuideList'
      })
    },
    editShipper(item) {
      this.$router.push({
        name: 'InstructionEdit',
        params: {
          guid: this.$route.params.guid,
          insid: item.id,
          name: this.$route.params.name
        }
      })
    },
    changePagination(e) {
      this.params.pagination = e
      // this.getAllInstruction(this.params)
    },
    removeShipper (item) {
      console.log(item)
      this.deleteInstruction(item.id).then(res => {
        this.getAllInstruction(this.params)
      })
    },
    addShipper () {
      this.visible = !this.visible
      this.title = {
        uz: '',
        ru: '',
        en: ''
      }
    }
  },
  computed: {
    ...mapGetters(['allInstruction', 'loadInstruction', 'paginationInstruction']),
  },
  mounted() {
    this.getAllInstruction(this.params)
  },
}
</script>
<style>
.ant-table-row:hover {
  cursor: pointer;
}
.imagePreview img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
