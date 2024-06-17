<script>
import draggable from 'vuedraggable'
import request from '@/utils/request'
export default {
  name: 'DnDTable',
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
    sortByOrder: function (a, b) {
      if (a.order > b.order) {
        return 1
      } else return -1
    },
    checkMove: function (e) {
      this.list.map((item, index) => {
        if (item.id === e.draggedContext.element.id) {
          item.order = e.draggedContext.futureIndex + 1
        } else {
          item.order = 0
        }
      })
    },
    getCategories() {
      request({
        url: '/categories',
        method: 'get',
      })
        .then((res) => {
          console.log('res 1', res)
          this.list = res.categories.sort(this.sortByOrder) ?? []
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err.response.data.message.substr(34))
          }
        })
    },
    updateCategories(list) {
      if (!list.length) return
      request({
        url: '/categories',
        method: 'put',
        data: {
          categories: list.map((item, index) => ({
            ...item,
            order: item.order > 0 ? item.order : index + 1,
          })),
        },
      })
        .then((res) => {
          this.getCategories()
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err.response.data.message.substr(34))
          }
        })
    },
    deleteCategory(e, id) {
      request({
        url: '/categories/' + id,
        method: 'delete',
      })
        .then((res) => {
          this.$refs.getList()
        })
        .catch((err) => {
          if (err) {
            this.$message.error(err.response.data.message.substr(34))
          }
        })
        .finally(() => this.getCategories())
    },
  },
  mounted() {
    this.getCategories()
  },
  computed: {
    draggingInfo() {
      return this.dragging ? 'under drag' : ''
    },
  },
  watch: {
    data(data) {
      this.list = data
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
        class="list-group"
        ghost-class="ghost"
        :move="checkMove"
        handle=".handle"
        @start="dragging = true"
        @end="
          () => {
            dragging = false
            updateCategories(list)
          }
        "
      >
        <div class="item" v-for="(element, index) in list" :key="element.name">
           <div class="column" style="width: 90px">
            <div class="handle">
                <img src="../../../assets/icons/draggable.png" alt="image" />
            </div>
          
            <div style="margin-left:auto">{{ element.order_number > 1 ? element.order_number : index + 1 }}</div>
          </div>
          <span class="column" style="width: 100%">{{ element.title }}</span>
          <span class="column" style="width: 120px">
            <router-link v-action:update :to="'./update/' + element.slug">
              <a-tooltip placement="topRight">
                <a-button style="margin-right: 6px" id="buttonUpdate" type="default" icon="edit"></a-button>
              </a-tooltip>
            </router-link>
            <a-popconfirm
              v-action:delete
              placement="left"
              slot="extra"
              :title="$t('deleteMsg')"
              @confirm="deleteCategory($event, element.slug)"
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
      <!-- {{ data }} -->
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
