<script>
import draggable from 'vuedraggable'
import request from '@/utils/request'
export default {
  name: 'TvDnDTable',
  props: ['data'],
  components: { draggable },
  data() {
    return {
      enabled: true,
      dragging: false,
      list: [],
    }
  },
  methods: {
    handleRoute: function (id) {
      this.$router.push(`/featured-movies/update/${id}?is_selection=false`)
    },
    sortByOrder: function (a, b) {
      if (a.order_number > b.order_number) {
        return 1
      } else return -1
    },
    checkMove: function (e) {
      this.list.map((item, index) => {
        if (item.id === e.draggedContext.element.id) {
          item.order_number = e.draggedContext.futureIndex + 1
        } else {
          item.order_number = 0
        }
      })
    },
    getList() {
      request({
          url: '/featured-list',
          method: 'get',
          params: { lang: 'ru' }
        })
        .then((res) => {
          this.list = res.featured_lists.sort(this.sortByOrder) ?? []
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err.response.data.message.substr(34))
          }
        })
    },
    updateElements(list) {
      if (!list.length) return
      request({
        url: '/feature-list',
        method: 'put',
        data: {
          order_numbers: list.map((item, index) => ({
            feature_list_id: item.slug,
            order_number: item.slug === 'banner' ? 0 : item.order_number > 0 ? item.order_number : index + 1,
          })),
        },
      })
        .then((res) => {
          this.getList()
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err.response.data.message.substr(34))
          }
        })
    },
    deleteElement(e, id) {
      request({
        url: '/featured-list' + id,
        method: 'delete',
      })
        .then((res) => {
           this.$message.success(this.$t('successfullyDeleted'))
          this.getList()
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err.response.data.message.substr(34))
          }
        })
        .finally(() => this.getList())
    },
  },
  mounted() {
    this.getList()
  },
  computed: {
    draggingInfo() {
      return this.dragging ? 'under drag' : ''
    },
  },
}
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <div class="item">
        <div class="column" style="width: 90px">No</div>
        <div class="column" style="width: 100%">Название</div>
        <div class="column" style="width: 122px">Действя</div>
      </div>
    </div>
   
    <div class="body">
      <draggable
        :list="list"
        :disabled="!enabled"
        ghost-class="ghost"
        :move="checkMove"
        class="list-group"
        handle=".handle"
        @start="dragging = true"
        @end="
          () => {
            dragging = false
            updateElements(list)
          }
        "
      >
        <div class="item list-group-item" v-for="(element, index) in list" :key="element.name">
          <div class="column" style="width: 90px">
            <div class="handle">
                <img src="../../../assets/icons/draggable.png" alt="image" />
            </div>
          
            <div style="margin-left:auto">{{ element.order_number > 1 ? element.order_number : index + 1 }}</div>
          </div>
          <span class="column" style="width: 100%">{{ element.title }}</span>
          <span class="column" style="width: 120px">
             <a-button @click="handleRoute(element.slug)" style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
            <a-popconfirm
              v-action:delete
              placement="left"
              slot="extra"
              :title="$t('deleteMsg')"
              @confirm="deleteElement($event, element.slug)"
              :okText="$t('yes')"
              :cancelText="$t('no')"
              ><a-tooltip placement="topRight"
                ><template slot="title">{{ $t('delete') }}</template>
                <a-button id="buttonDelete" type="danger" icon="delete"></a-button>
              </a-tooltip>
            </a-popconfirm>
          </span>
        </div>
      </draggable>
    </div>
  </div>
</template>

<style lang="less" scoped>
.buttons {
  margin-top: 35px;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.wrapper {
  border: 1px solid #e8e8e8;
}

.header {
  background-color: #fafafa;
  border-bottom: 1px solid #e8e8e8;

  .item {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    &:last-child {
      border: none;
    }

    .column {
      border-right: 1px solid #e8e8e8;
      padding: 20px;
      display: flex;
      align-items: center;

      &:last-child {
        border: none;
      }
    }
  }
}

.body {
  .item {
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    cursor: pointer;
    &:last-child {
      border: none;
    }
    .column {
      border-right: 1px solid #e8e8e8;
      padding: 20px;
      display: flex;
      align-items: center;

      &:last-child {
        border: none;
      }
    }
  }
}
</style>
