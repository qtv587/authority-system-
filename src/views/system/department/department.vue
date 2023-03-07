<template>
  <el-main>
    <el-form ref="searchForm" label-width="80px" :inline="true" size="small">
      <el-form-item label="">
        <el-input
          v-model="searchModel.departmentName"
          placeholder="请输入部门名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search()"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh-right" @click="resetSearch()"
          >重置</el-button
        >
        <el-button type="success" icon="el-icon-plus" @click="openAddWindow()"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      stripe
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <!-- prop属性：填写数据的属性名称 -->
      <!-- label属性：表格表头标题 -->
      <el-table-column prop="departmentName" label="部门名称" />
      <el-table-column prop="parentName" label="所属部门" />
      <el-table-column prop="phone" label="部门电话" />
      <el-table-column prop="address" label="部门地址" />
      <el-table-column label="操作">
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
    <!-- 添加和修改窗口 -->
    <system-dialog
      :title="deptDialog.title"
      :visible="deptDialog.visible"
      :width="deptDialog.width"
      :height="deptDialog.height"
      @onClose="onClose()"
      @onConfirm="onConfirm()"
    >
      <div slot="content">
        <el-form
          :model="dept"
          ref="deptForm"
          :rules="rules"
          label-width="80px"
          :inline="true"
          size="small"
        >
          <el-form-item label="所属部门" prop="parentName">
            <el-input
              v-model="dept.parentName"
              :readonly="true"
              @click.native="openSelectDeptWindow()"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门名称" prop="departmentName">
            <el-input v-model="dept.departmentName"></el-input>
          </el-form-item>
          <el-form-item label="部门电话">
            <el-input v-model="dept.phone"></el-input>
          </el-form-item>
          <el-form-item label="部门地址">
            <el-input v-model="dept.address"></el-input>
          </el-form-item>
          <el-form-item label="序号">
            <el-input v-model="dept.orderNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 选择所属部门弹窗 -->
    <system-dialog
      :title="parentDialog.title"
      :visible="parentDialog.visible"
      :width="parentDialog.width"
      :height="parentDialog.height"
      @onClose="onParentClose()"
      @onConfirm="onParentConfirm()"
    >
      <div slot="content">
        <el-tree
          ref="parentTree"
          :data="treeList"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          @node-click="handleNodeClick"
          :highlight-current="true"
          :default-expand-all="true"
          :expand-on-click-node="false"
        >
          <div class="customer-tree-node" slot-scope="{ node, data }">
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
            <span style="margin-left: 5px">{{ node.label }}</span>
          </div>
        </el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>


<script>
//导入department脚本文件
import department from "@/api/department";
//导入对话框组件
import SystemDialog from "@/components/system/SystemDialog.vue";

export default {
  name: "department",
  components: {
    SystemDialog,
  },
  data() {
    return {
      searchModel: { departmentName: "" },
      tableData: [],
      deptDialog: {
        title: "",
        visible: false,
        width: 575,
        height: 170,
      },
      dept: {
        id: "",
        departmentName: "",
        pid: "",
        parentName: "",
        phone: "",
        address: "",
        orderNum: "",
      },
      rules: {
        parentName: [
          { required: true, message: "请输入所属部门", trigger: "change" },
        ],
        departmentName: [
          { required: true, message: "请输入部门名称", trigger: "change" },
        ],
        treeList: [],
      },
      parentDialog: {
        title: "选择所属部门",
        visible: false,
        width: 300,
        height: 400,
      },
      //树形菜单列表
      treeList: [],
      defaultProps: {
        children: "children",
        label: "departmentName",
      },
    };
  },
  //初始化时调用查询部门列表
  created() {
    this.search();
  },
  methods: {
    async search() {
      let res = await department.getDepartmentList(this.searchModel);
      if (res.success) {
        this.tableData = res.data;
      }
    },
    resetSearch() {
      this.$resetForm("searchForm", this.searchModel);
    },
    async handleDelete(row) {
      let rescheck = await department.checkDepartment({ id: row.id });
      if (!rescheck.success) {
        this.$message.warning(rescheck.message);
      } else {
        let confirm = await this.$myconfirm("确定要删除吗?");
        if (confirm) {
          let res = await department.delete({ id: row.id });
          if (res.success) {
            this.$message.success(res.message);
            this.search();
          } else {
            this.$message.error(res.message);
          }
        }
      }
    },
    async handleEdit(row) {
      //数据回显
      this.$objCopy(row, this.dept);
      this.deptDialog.title = "编辑部门";
      this.deptDialog.visible = true;
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      //清空表单数据
      this.$resetForm("deptForm", this.dept);

      this.deptDialog.title = "新增部门";
      this.deptDialog.visible = true;
    },
    async openSelectDeptWindow() {
      this.parentDialog.visible = true;
      let res = await department.getParentDepartment();
      this.treeList = res.data;
    },
    /**
     * 窗口关闭事件
     */
    onClose() {
      this.deptDialog.visible = false;
    },
    onParentClose() {
      this.parentDialog.visible = false;
    },

    /**
     * 弹窗确认事件
     */
    onConfirm() {
      //表单验证
      this.$refs.deptForm.validate(async (valid) => {
        //如果验证通过
        if (valid) {
          let res = "";
          if (this.dept.id === "") {
            //发送新增请求
            res = await department.addDepartment(this.dept);
          } else {
            //发送修改请求
            res = await department.update(this.dept);
          }

          if (res.success) {
            this.$message.success(res.message);
            this.search();
            //关闭窗口
            this.deptDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    onParentConfirm() {
      this.parentDialog.visible = false;
    },
    /**
     * 树节点点击事件
     */
    handleNodeClick(data) {
      //当点击树节点时，赋予选中的值
      this.dept.pid = data.id;
      this.dept.parentName = data.departmentName;
    },
    changeIcon(data) {
      //修改折叠展开状态
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
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