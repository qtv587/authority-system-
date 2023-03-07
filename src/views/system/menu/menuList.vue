<template>
  <el-main>
    <!-- 新增按钮 -->
    <el-button
      type="success"
      size="small"
      @click="openAddWindow()"
      icon="el-icon-plus"
      >新增</el-button
    >
    <!-- 数据表格 -->
    <el-table
      :data="menuList"
      :height="tableHeight"
      style="width: 100%; margin-top: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="label" label="菜单名称"></el-table-column>
      <el-table-column prop="type" label="菜单类型" align="center">
        <template slot-scope="scope">
          <el-tag size="normal" v-if="scope.row.type === 0">目录</el-tag>
          <el-tag type="success" size="normal" v-else-if="scope.row.type === 1"
            >菜单</el-tag
          >
          <el-tag type="warning" size="normal" v-else>按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="菜单图标" align="center">
        <template slot-scope="scope">
          <i
            :class="scope.row.icon"
            v-if="scope.row.icon.includes('el-icon')"
          ></i>
          <svg-icon v-else :icon-class="scope.row.icon"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="路由名称"></el-table-column>
      <el-table-column prop="path" label="理由地址"></el-table-column>
      <el-table-column prop="url" label="组件路径"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit-outline"
            type="primary"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete-solid"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增或修改窗口 -->
    <system-dialog
      :title="menuDialog.title"
      :visible="menuDialog.visible"
      :width="menuDialog.width"
      :height="menuDialog.height"
      @onClose="onClose()"
      @onConfirm="onConfirm()"
    >
      <div slot="content">
        <el-form
          :model="menu"
          ref="menuForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="type">
              <el-radio-group v-model="menu.type">
                <el-radio :label="0">目录</el-radio>
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-form-item label="所属菜单" size="small" prop="parentName">
            <el-input
              v-model="menu.parentName"
              :readonly="true"
              @click.native="selectParentMenu"
            />
          </el-form-item>
          <el-form-item label="菜单名称" size="small" prop="label">
            <el-input v-model="menu.label" />
          </el-form-item>
          <el-form-item
            label="路由名称"
            size="small"
            prop="name"
            v-if="menu.type == 1"
          >
            <el-input v-model="menu.name" />
          </el-form-item>
          <el-form-item
            label="路由地址"
            size="small"
            prop="path"
            v-if="menu.type != 2"
          >
            <el-input v-model="menu.path" />
          </el-form-item>
          <el-form-item
            label="组件路径"
            size="small"
            prop="url"
            v-if="menu.type == 1"
          >
            <el-input v-model="menu.url" />
          </el-form-item>
          <el-form-item label="权限字段" size="small" prop="code">
            <el-input v-model="menu.code" />
          </el-form-item>
          <el-form-item size="small" label="菜单图标">
            <my-icon @selecticon="setIcon" ref="child"></my-icon>
          </el-form-item>
          <el-form-item label="菜单序号" size="small">
            <el-input v-model="menu.orderNum" />
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 选择所属菜单弹框 -->
    <system-dialog
      :title="parentDialog.title"
      :width="parentDialog.width"
      :height="parentDialog.height"
      :visible="parentDialog.visible"
      @onClose="onParentClose"
      @onConfirm="onParentConfirm"
    >
      <div slot="content">
        <el-tree
          style="font-size: 14px"
          ref="parentTree"
          :data="parentMenuList"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="false"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
            <!-- 长度为0说明没有下级 -->
            <span v-if="data.children.length === 0">
              <i class="el-icon-document"></i>
            </span>
            <span v-else @click="changeIcon(data)">
              <span v-if="data.open">
                <i class="el-icon-circle-plus-outline"></i>
              </span>
              <span v-else>
                <i class="el-icon-remove-outline"></i>
              </span>
            </span>
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>
  
  <script>
import menuApi from "@/api/menu";
import SystemDialog from "@/components/system/SystemDialog.vue";
import MyIcon from "@/components/system/MyIcon.vue";

export default {
  name: "menuList",
  components: {
    SystemDialog,
    MyIcon,
  },
  data() {
    return {
      menuList: [], //数据列表
      tableHeight: 0, //表格高度
      menuDialog: {
        title: "",
        visible: false,
        width: 630,
        height: 270,
      },
      menu: {
        id: "",
        type: "",
        parentId: "",
        parentName: "",
        label: "",
        icon: "",
        name: "",
        path: "",
        url: "",
        code: "",
        orderNum: "",
      },
      rules: {
        type: [
          { required: true, trigger: "change", message: "请选择菜单类型" },
        ],
        parentName: [
          { required: true, trigger: "change", message: "请选择所属菜单" },
        ],
        label: [{ required: true, trigger: "blur", message: "请输入菜单名称" }],
        name: [{ required: true, trigger: "blur", message: "请输入路由名称" }],
        path: [{ required: true, trigger: "blur", message: "请输入路由路径" }],
        url: [{ required: true, trigger: "blur", message: "请输入组件路径" }],
        code: [{ required: true, trigger: "blur", message: "请输入权限字段" }],
      },
      parentMenuList: {},
      parentDialog: {
        title: "",
        visible: false,
        width: 280,
        height: 450,
      },
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  //初始化时调用
  created() {
    this.search();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180;
    });
  },
  methods: {
    async search() {
      let res = await menuApi.getMenuList();
      if (res.success) {
        this.menuList = res.data;
      }
    },
    /**
     * 打开新增窗口
     */
    openAddWindow() {
      this.$resetForm("menu", this.menu);
      this.menuDialog.title = "新增菜单";
      this.menuDialog.visible = true;
      this.$nextTick(() => {
        this.$refs["child"].userChooseIcon = ""; //清空菜单图标
      });
    },
    onClose() {
      this.menuDialog.visible = false;
    },
    onParentClose() {
      this.parentDialog.visible = false;
    },
    onConfirm() {
      this.$refs.menuForm.validate(async (vilid) => {
        if (vilid) {
          let res = "";
          if (this.menu.id == "") {
            // 添加
            res = await menuApi.addMenu(this.menu);
          } else {
            //发送修改请求
            res = await menuApi.updateMenu(this.menu);
          }
          if (res.success) {
            this.$message.success(res.message);
            this.menuDialog.visible = false;
            this.search();
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    onParentConfirm() {
      this.parentDialog.visible = false;
    },
    handleNodeClick(data) {
      this.menu.parentId = data.id;
      this.menu.parentName = data.label;
    },
    async selectParentMenu() {
      let res = await menuApi.getParentMenuList();
      this.parentMenuList = res.data;
      this.parentDialog.visible = true;
    },
    handleEdit(row) {
      //把当前要编辑的数据复制到数据域，给表单回显
      this.$objCopy(row, this.menu);
      //设置弹框属性
      this.menuDialog.title = "编辑菜单";
      this.menuDialog.visible = true;
      this.$nextTick(() => {
        this.$refs["child"].userChooseIcon = row.icon; //菜单图标回显
      });
    },
    async handleDelete(row){
        let rescheck = await menuApi.checkPermission({ id: row.id });
      if (!rescheck.success) {
        this.$message.warning(rescheck.message);
      } else {
        let confirm = await this.$myconfirm("确定要删除吗?");
        if (confirm) {
          let res = await menuApi.deleteById({ id: row.id });
          if (res.success) {
            this.$message.success(res.message);
            this.search();
          } else {
            this.$message.error(res.message);
          }
        }
      }
    },
    setIcon(icon) {
      this.menu.icon = icon;
    },
  },
};
</script>
  

<style lang="scss" scoped>
::v-deep .el-tree {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
  }
  .el-tree-node__children {
    padding-left: 20px;
  }
  .el-tree-node :last-child:before {
    height: 40px;
  }
  .el-tree > .el-tree-node:before {
    border-left: none;
  }
  .el-tree > .el-tree-node:after {
    border-top: none;
  }
  .el-tree-node:before,
  .el-tree-node:after {
    content: "";
    left: -4px;
    position: absolute;
    right: auto;
    border-width: 1px;
  }
  .tree :first-child .el-tree-node:before {
    border-left: none;
  }
  .el-tree-node:before {
    border-left: 1px dotted #d9d9d9;
    bottom: 0px;
    height: 100%;
    top: -25px;
    width: 1px;
  }
  .el-tree-node:after {
    border-top: 1px dotted #d9d9d9;
    height: 20px;
    top: 14px;
    width: 24px;
  }
  .el-tree-node__expand-icon.is-leaf {
    width: 8px;
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node__content {
    line-height: 30px;
    height: 30px;
    padding-left: 10px !important;
  }
}
::v-deep .el-tree > div {
  &::before {
    display: none;
  }
  &::after {
    display: none;
  }
}
</style>