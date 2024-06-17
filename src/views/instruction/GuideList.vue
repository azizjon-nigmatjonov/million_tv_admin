<template>
  <div>
    <a-card :title="$t('guideList')" style="width: 100%">
      <a-button type="primary" slot="extra" @click="addShipper">{{ $t('add') }}</a-button>
      <a-table
        :columns="columns"
        :data-source="allGuide"
        :loading="loadGuide"
        :rowKey="item => item.id"
        :pagination="paginationGuide"
        @change="changePagination"
        bordered
      >
        <template slot="action" slot-scope="item">
          <a-tooltip placement="topRight">
            <template slot="title">{{ $t('update') }}</template>
            <a-button style="margin-right: 6px" id="buttonUpdate" type="primary" @click="editShipper(item)" icon="edit"></a-button>
          </a-tooltip>
          <router-link :to="'../'+item.id+'/'+item.title+'/list'" >
            <a-tooltip><template slot="title">{{ $t('instructionCreate') }}</template>
              <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="plus"></a-button>
            </a-tooltip>
          </router-link>
          <router-link :to="'../preview/'+item.id" >
            <a-tooltip><template slot="title">{{ $t('instructionPreview') }}</template>
              <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="eye"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="removeShipper(item)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          >
            <a-tooltip placement="topRight">
              <template slot="title">{{ $t('delete') }}</template>
              <a-button
                type="danger"
                icon="delete"
              ></a-button>
            </a-tooltip>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="visible" :title="$t('guidesCreate')" @cancel="hide" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="hide">
          Cancel
        </a-button>
        <a-button type="primary" :loading="loading" @click="saveGuide">
          Save
        </a-button>
      </template>
      <a-form-model ref="ruleForm" :model="form" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-form-model-item :label="$t('title')" prop="title">
              <a-input v-model="form.title" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    const clickTable = (record, index) => {
        return {
          on: {
            click: (event) => {
              this.enterIns(record)
            }
          }
        }
    }
    return {
      visible: false,
      loading: false,
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'title',
          customCell: clickTable
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
        search: '',
      },
      form: {
        title: ''
      },
      rules: {
        title: [{ required: true, message: this.$t('requiredField'), trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['getAllGuides', 'deleteGuide', 'postGuide', 'updateGuide']),
    hide () {
      this.visible = false
      this.$router.push({
        name: 'GuideList'
      })
    },
    enterIns (item) {
      this.$router.push({
        name: 'InstructionList',
        params: {
          guid: item.id,
          name: item.title
        }
      })
    },
    saveGuide () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.$route.query.id) {
            this.updateGuide({
              id: this.$route.query.id,
              data: {
                title: this.form.title
              }
            }).then(res => {
              this.getAllGuides(this.params)
              this.visible = false
            }).finally(() => { this.loading = false })
          } else {
            this.postGuide({
              title: this.form.title
            }).then(res => {
              this.getAllGuides(this.params)
              this.visible = false
            }).finally(() => { this.loading = false })
          }
        }
      })
    },
    editShipper(item) {
      console.log(item.id)
      this.form = { ...item }
      this.visible = true
      this.$router.push({
        name: 'GuideList',
        query: {
          id: item.id
        }
      })
    },
    changePagination(e) {
      this.params.pagination = e
      // this.getAllGuides(this.params)
    },
    removeShipper (item) {
      this.deleteGuide(item.id).then(res => {
        this.getAllGuides(this.params)
      })
    },
    addShipper () {
      this.visible = !this.visible
      this.form.title = ''
    }
  },
  computed: {
    ...mapGetters(['allGuide', 'loadGuide', 'paginationGuide']),
  },
  mounted() {
    this.getAllGuides(this.params)
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
