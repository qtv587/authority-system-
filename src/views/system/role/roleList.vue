<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form
      :model="searchModel"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item>
        <el-input v-model="searchModel.roleName" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search(pageNo, pageSize)"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh-right" @click="resetValue()"
          >重置</el-button
        >
        <el-button type="success" icon="el-icon-plus" @click="openAddWindow()"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table
      :data="roleList"
      :height="tableHeight"
      border
      stripe
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column
        prop="id"
        label="角色编号"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column prop="roleName" label="角色名称"></el-table-column>
      <el-table-column prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column prop="remark" label="角色备注"></el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            >编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
            >删除
          </el-button>
          <el-button
            icon="el-icon-setting"
            type="primary"
            size="small"
            @click="assignRole(scope.row)"
            >分配权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具栏 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加和修改角色窗口 -->
    <system-dialog
      :title="roleDialog.title"
      :visible="roleDialog.visible"
      :width="roleDialog.width"
      :height="roleDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="role"
          ref="roleForm"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="role.roleCode"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="role.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input
              type="textarea"
              v-model="role.remark"
              :rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
    <!-- 分配权限树窗口 -->
    <system-dialog
      :title="assignDialog.title"
      :visible="assignDialog.visible"
      :width="assignDialog.width"
      :height="assignDialog.height"
      @onClose="onAssignClose"
      @onConfirm="onAssignConfirm"
    >
      <div slot="content">
        <el-tree
          ref="assignTree"
          :data="assignTreeData"
          node-key="id"
          :props="defaultProps"
          empty-text="暂无数据"
          :show-checkbox="true"
          :highlight-current="true"
          default-expand-all
        ></el-tree>
      </div>
    </system-dialog>
  </el-main>
</template>
<script>
import {
  getRoles,
  addRole,
  updateRole,
  checkRoleById,
  deleteRole,
  getAssignPermissionTree,
  assignSave,
} from "@/api/role";
import SystemDialog from "@/components/system/SystemDialog.vue";
//导入末级节点脚本
import leafUtils from "@/utils/leaf";

export default {
  name: "roleList",
  components: {
    SystemDialog,
  },
  data() {
    return {
      searchModel: {
        roleName: "",
        pageNo: 1,
        pageSize: 10,
      }, //查询条件
      roleList: [],
      tableHeight: 0,
      pageNo: 1, //当前的页码
      total: 0,
      pageSize: 10,
      roleDialog: {
        title: "",
        visible: false,
        width: 500,
        height: 230,
      },
      rules: {
        roleCode: [
          { required: true, trigger: "blur", message: "请输入角色编码" },
        ],
        roleName: [
          { required: true, trigger: "blur", message: "请输入角色名称" },
        ],
      },

      role: {
        id: "",
        roleCode: "",
        roleName: "",
        remark: "",
      },
      assignDialog: {
        title: "",
        visible: false,
        width: 300,
        height: 450,
      },
      assignTreeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      roleId: "",
    };
  },
  created() {
    this.search();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220;
    });
  },
  methods: {
    async search(pageNo = 1, pageSize = 10) {
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      let res = await getRoles(this.searchModel);
      if (res.success) {
        this.roleList = res.data.records;
        this.total = res.data.total;
      }
    },
    handleEdit(row) {
      //数据回显
      this.$objCopy(row, this.role); //将当前编辑的数据复制到role对象中
      //设置窗口标题
      this.roleDialog.title = "编辑角色";
      //显示编辑角色窗口
      this.roleDialog.visible = true;
    },
    async handleDelete(row) {
      let rescheck = await checkRoleById({ id: row.id });
      if (!rescheck.success) {
        this.$message.warning(rescheck.message);
      } else {
        let confirm = await this.$myconfirm("确定要删除吗?");
        if (confirm) {
          let res = await deleteRole({ id: row.id });
          if (res.success) {
            this.$message.success(res.message);
            this.search(this.pageNo, this.pageSize);
          } else {
            this.$message.error(res.message);
          }
        }
      }
    },
    async assignRole(row) {
      this.roleId = row.id;
      this.assignDialog.visible = true;
      let res = await getAssignPermissionTree({ roleId: row.id });
      if (res.success) {
        let permissionList = res.data.permissionList;
        let checkList = res.data.checkList;
        let { setLeaf } = leafUtils();

        let newPerssionList = setLeaf(permissionList);
        this.assignTreeData = newPerssionList;
        this.$nextTick(() => {
          let nodes = this.$refs.assignTree.children;
          this.setChild(nodes, checkList);
        });
      }
      this.assignDialog.visible = true;
      this.assignDialog.title = `给【${row.roleName}】分配权限`;
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.search(this.pageNo, size);
    },
    handleCurrentChange(page) {
      this.pageNo = page;
      this.search(page, this.pageSize);
    },
    resetValue() {
      this.searchModel.roleName = "";
      this.search(this.pageNo, this.pageSize);
    },
    openAddWindow() {
      //清空表单数据
      this.$resetForm("roleForm", this.role);
      this.roleDialog.title = "新增角色"; //设置窗口标题
      this.roleDialog.visible = true; //显示窗口
    },

    onClose() {
      this.roleDialog.visible = false;
    },
    onAssignClose() {
      this.assignDialog.visible = false;
    },
    onConfirm() {
      this.$refs.roleForm.validate(async (valid) => {
        if (valid) {
          let res = "";
          if (this.role.id == "") {
            //添加
            res = await addRole(this.role);
          } else {
            res = await updateRole(this.role);
          }
          if (res.success) {
            this.$message.success(res.message);
            this.roleDialog.visible = false;
            this.search(this.pageNo, this.pageSize);
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    async onAssignConfirm() {
      let ids = this.$refs.assignTree.getCheckedKeys();
      //获取选中节点的父节点id
      let pids = this.$refs.assignTree.getHalfCheckedKeys();
      //组装选中的节点ID数据
      let listId = ids.concat(pids);
      //组装参数
      let params = {
        roleId: this.roleId,
        list: listId,
      };

      let res = await assignSave(params);
      //判断是否成功
      if (res.success) {
        //关闭窗口
        this.assignDialog.visible = false;
        //提示成功
        this.$message.success(res.message);
      } else {
        //提示失败
        this.$message.error(res.data);
      }
    },
    /**
     * 设置子节点
     */
    setChild(childNodes, checkList) {
      //判断是否存在子节点
      if (childNodes && childNodes.length > 0) {
        //循环所有权限
        for (let i = 0; i < childNodes.length; i++) {
          //根据 data 或者 key 拿到 Tree 组件中的 node
          let node = this.$refs.assignTree.getNode(childNodes[i]);
          //判断是否已经拥有对应的角色数据
          if (checkList && checkList.length > 0) {
            //循环遍历已有的权限集合
            for (let j = 0; j < checkList.length; j++) {
              //找到已经存在的菜单权限节点
              if (checkList[j] == childNodes[i].id) {
                //如果节点是展开状态，则将树节点选中
                if (childNodes[i].open) {
                  this.$refs.assignTree.setChecked(node, true);
                  break;
                }
              }
            }
          }
          //如果存在子节点，则递归选中
          if (childNodes[i].children) {
            this.setChild(childNodes[i].children, checkList);
          }
        }
      }
    },
  },
};
</script>

<style>
</style>