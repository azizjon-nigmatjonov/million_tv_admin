<template>
  <div>
    <a-row>
      <a-col :span="12">
        <a-breadcrumb style="margin: 10px 5px">
          <a-breadcrumb-item>{{ $t('tariffs') }}</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>

      <a-col :span="12">
        <router-link to="././create">
          <a-button v-action:add style="float: right" shape="round" type="primary link" icon="plus">{{ $t('add') }}</a-button>
        </router-link>
      </a-col>
    </a-row>

    <a-card :title="$t('list')">
      <!-- <div slot="extra">
        <a-form layout="horizontal" :form="form" @submit="search">
          <a-row>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-input id="inputSearch" :placeholder="$t('search') + '...'" v-decorator="['search']"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" style="padding: 5px">
              <a-form-item style="margin: 0">
                <a-button id="buttonSearch" type="default" html-type="submit" icon="search">{{ $t('search') }}</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div> -->

      <a-table
        :columns="columns"
        :rowKey="record => record.id"
        :dataSource="tariffs"
        :pagination="getPagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="category" slot-scope="text"> {{ `${text.category_objs.map((obj) => { return ` ${obj.category_name} ` })}` }}</span>
        <template slot="action" slot-scope="text, row">
           <router-link v-action:update :to="'./update/'+row.id" >
            <a-tooltip placement="topRight"><template slot="title">{{ $t('update') }}</template>
              <a-button style="margin-right: 5px" id="buttonUpdate" type="default" icon="edit"></a-button>
            </a-tooltip>
          </router-link>
          <a-popconfirm
            placement="left"
            slot="extra"
            :title="$t('deleteMsg')"
            @confirm="deleteTarif($event, row.id)"
            :okText="$t('yes')"
            :cancelText="$t('no')"
          ><a-tooltip placement="topRight"><template slot="title">{{ $t('delete') }}</template>
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
import request from '@/utils/request'
export default {
  data () {
    return {
      value: '',
      data: [],
      loading: true,
      labelCol: { span: 24 },
      wrapperCol: { span: 24 },
      pageButtons: {
        button_ids: []
      },
      pageScopes: {
        scope_ids: []
      },
       columns: [
        {
          title: this.$t('description'),
          dataIndex: 'description'
        },
        {
          title: this.$t('category'),
          scopedSlots: { customRender: 'category' },
          key: 'category'
        },
        {
          title: this.$t('quality'),
          dataIndex: 'quality'
        },
        {
          title: this.$t('action'),
          key: 'action',
          width: '12%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, { name: 'coordinated' }),
      previewVisible: false,
      scopeVisible: false,
      selectedPage: '',
      parentCategory: '',
      filterParams: {},
      rules: {
        button_ids: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        scope_ids: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['paginationTarifs', 'tariffs']),
    getPagination () {
      return this.paginationTarifs
    }
  },
  mounted () {
    this.getTarifs().then(() => {
      this.loading = false
      })
  },
  beforeDestroy () {
  },
  methods: {
    ...mapActions(['getTarifs']),
    handleTableChange (pagination) {
      this.getTarifs(pagination)
    .then((res) => console.log(res))
    .catch(err => this.requestFailed(err))
    },
    deleteTarif (e, id) {
      request({
              url: '/tariff/' + id,
              method: 'delete'
          }).then(res => {
              console.log(res)
              this.$message.success(this.$t('successfullyDeleted'))
              this.getTarifs()
          }).then(err => {
        if (err) {
          this.$message.error(this.$t('error'))
        }
      })
    },
    search (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.filterParams = values
          this.pagination.current = 1
        }
      })
    }
  }
}
</script>
