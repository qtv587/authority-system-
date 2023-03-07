<template>
  <el-container :style="{ height: containerHeight + 'px' }">
    <!-- 左侧部门树形菜单列表 -->
    <el-aside
      style="
        padding: 10px 0px 0px 0px;
        background: #fff;
        border-right: 1px solid #dfe6ec;
      "
      width="220px"
    >
      <el-tree
        style="font-size: 14px"
        ref="leftTree"
        :data="deptList"
        node-key="id"
        :props="defaultProps"
        default-expand-all
        empty-text="暂无数据"
        :show-checkbox="false"
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <div>
            <span v-if="data.children.length == 0">
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
            <!-- 名称 -->
            <span style="margin-left: 3px">{{ node.label }}</span>
          </div>
        </div>
      </el-tree>
    </el-aside>
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
          <el-input v-model="searchModel.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchModel.realName"
            placeholder="请输入真实姓名"
          />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchModel.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item>
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search(departmentId, pageNo, pageSize)"
            >查询</el-button
          >
          <el-button icon="el-icon-delete" @click="resetValue()"
            >重置</el-button
          >
          <el-button
            icon="el-icon-plus"
            size="small"
            type="success"
            @click="openAddWindow()"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
      <!-- 用户表格数据 -->
      <el-table
        :height="tableHeight"
        :data="userList"
        border
        stripe
        style="width: 100%; margin-bottom: 10px"
      >
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="姓名"></el-table-column>
        <el-table-column
          prop="departmentName"
          label="所属部门"
        ></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" width="290" label="操作">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
              v-if="hasPermission('sys:user:delete')"
              >删除</el-button
            >
            <el-button
              icon="el-icon-setting"
              type="primary"
              size="mini"
              @click="assignRole(scope.row)"
              >分配角色</el-button
            >
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
      <!-- 添加和编辑用户窗口 -->
      <system-dialog
        :title="userDialog.title"
        :height="userDialog.height"
        :width="userDialog.width"
        :visible="userDialog.visible"
        @onClose="onClose"
        @onConfirm="onConfirm"
      >
        <div slot="content">
          <el-form
            :model="user"
            ref="userForm"
            :rules="rules"
            label-width="80px"
            :inline="true"
            size="small"
          >
            <el-form-item prop="username" label="用户名">
              <el-input v-model="user.username"></el-input>
            </el-form-item>
            <el-form-item prop="password" v-if="user.id === ''" label="密码">
              <el-input type="password" v-model="user.password"></el-input>
            </el-form-item>
            <el-form-item prop="departmentName" label="所属部门">
              <el-input
                v-model="user.departmentName"
                :readonly="true"
                @click.native="selectDepartment()"
              ></el-input>
            </el-form-item>
            <el-form-item prop="realName" label="姓名">
              <el-input v-model="user.realName"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="电话">
              <el-input v-model="user.phone"></el-input>
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="user.nickName"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item prop="gender" label="性别">
              <el-radio-group v-model="user.gender">
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <br />
            <!-- 用户头像 -->
            <el-form-item label="头像">
              <el-upload
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                class="avatar-uploader"
                :data="uploadHeader"
                action="http://localhost:9999/api/oss/file/upload?module=avatar"
              >
                <img v-if="user.avatar" :src="user.avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </system-dialog>
      <!-- 所属部门弹框 -->
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
            ref="parentTree"
            :data="parentList"
            default-expand-all
            node-key="id"
            :props="parentProps"
            :show-checkbox="false"
            :highlight-current="true"
            :expand-on-click-node="false"
            @node-click="parentClick"
          >
            <div class="customer-tree-node" slot-scope="{ node, data }">
              <span v-if="data.children.length == 0">
                <i class="el-icon-document" />
              </span>
              <span v-else @click="changeParentIcon(data)">
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
      <!-- 分配角色窗口 -->
      <system-dialog
        :title="assignDialog.title"
        :height="assignDialog.height"
        :width="assignDialog.width"
        :visible="assignDialog.visible"
        @onClose="onAssignClose"
        @onConfirm="onAssignConfirm"
      >
        <div slot="content">
          <!-- 分配角色数据列表 -->
          <el-table
            ref="assignRoleTable"
            :data="assignRoleList"
            border
            stripe
            :height="assignHeight"
            style="width: 100%; margin-bottom: 10px"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <el-table-column prop="roleCode" label="角色编码" />
            <el-table-column prop="roleName" label="角色名称" />
            <el-table-column prop="remark" label="角色备注" />
          </el-table>
          <!-- 分页工具栏 -->
          <el-pagination
            @size-change="assignSizeChange"
            @current-change="assignCurrentChange"
            :current-page.sync="roleVo.pageNo"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="roleVo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="roleVo.total"
            background
          >
          </el-pagination>
        </div>
      </system-dialog>
    </el-main>
  </el-container>
</template>
<script>
import departmentApi from "@/api/department";
import userApi from "@/api/user";
import SystemDialog from "@/components/system/SystemDialog.vue";
//导入token
import { getToken } from "@/utils/auth";

export default {
  name: "userList",
  components: {
    SystemDialog,
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号码"));
        //使用正则表达式进行验证手机号码
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    return {
      containerHeight: 0, //容器高度
      deptList: [], //左侧部门树形菜单列表
      //树节点属性
      defaultProps: {
        children: "children",
        label: "departmentName",
      },
      searchModel: {
        username: "",
        realName: "",
        phone: "",
        departmentId: "",
        pageNo: 1,
        pageSize: 10,
      },
      tableHeight: 0,
      userList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      departmentId: "",
      userDialog: {
        title: "",
        height: 410,
        width: 610,
        visible: false,
      },
      user: {
        id: "",
        departmentId: "",
        departmentName: "",
        email: "",
        realName: "",
        phone: "",
        nickName: "",
        password: "",
        username: "",
        gender: "",
        avatar: "",
      },
      rules: {
        departmentName: [
          { required: true, trigger: "change", message: "请选择所属部门" },
        ],
        realName: [{ required: true, trigger: "blur", message: "请填写姓名" }],
        phone: [{ trigger: "blur", validator: validatePhone }],
        username: [
          { required: true, trigger: "blur", message: "请填写登录名" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请填写登录密码" },
        ],
        gender: [{ required: true, trigger: "change", message: "请选择性别" }],
      },
      //选择所属部门窗口属性
      parentDialog: {
        title: "选择所属部门",
        width: 300,
        height: 450,
        visible: false,
      },
      //树节点属性
      parentProps: {
        children: "children",
        label: "departmentName",
      },
      parentList: [], //所属部门节点数
      uploadHeader: {
        token: getToken(),
      },
      //分配角色窗口属性
      assignDialog: {
        title: "",
        visible: false,
        width: 800,
        height: 410,
      },
      //角色对象
      roleVo: {
        pageNo: 1,
        pageSize: 10,
        userId: "",
        total: 0,
      },
      assignRoleList: [], //角色列表
      assignHeight: 0, //分配角色表格高度
      selectedIds: [], //被选中的角色id
      selectedUserId: "", //被分配角色的用户ID
    };
  },
  created() {
    this.getDeptList(this.departmentId);
  },
  mounted() {
    this.$nextTick(() => {
      //内容高度
      this.containerHeight = window.innerHeight - 85;
      //表格高度
      this.tableHeight = window.innerHeight - 220;
      //角色表格高度
      this.assignHeight = window.innerHeight - 350;
    });
  },
  methods: {
    /**
     * 查询部门列表
     */
    async getDeptList() {
      //发送查询请求
      let res = await departmentApi.getDepartmentList(null);
      //判断是否成功
      if (res.success) {
        this.deptList = res.data;
        //树加载完成后，默认点击第一个节点
        this.$nextTick(() => {
          const firstNode = document.querySelector(".el-tree-node");
          firstNode.click();
        });
      }
    },

    /**
     * 树节点点击事件
     */
    handleNodeClick(data) {
      //给部门编号赋值
      this.departmentId = data.id;
      //查询数据
      this.search(this.departmentId);
    },
    changeIcon(data) {
      //修改折叠展开状态
      data.open = !data.open;
      this.$refs.leftTree.store.nodesMap[data.id].expanded = !data.open;
    },
    changeParentIcon(data) {
      data.open = !data.open;
      this.$refs.parentTree.store.nodesMap[data.id].expanded = !data.open;
    },
    async search(departmentId, pageNo = 1, pageSize = 10) {
      this.searchModel.pageNo = pageNo;
      this.searchModel.pageSize = pageSize;
      this.searchModel.departmentId = departmentId;
      //发送查询请求
      let res = await userApi.getUserList(this.searchModel);
      if (res.success) {
        this.userList = res.data.records;
        this.total = res.data.total;
      }
    },
    resetValue() {
      (this.searchModel.username = ""),
        (this.searchModel.realName = ""),
        (this.searchModel.pageNo = 1);
      this.searchModel.pageSize = this.pageSize;
      this.search(this.departmentId, this.pageNo, this.pageSize);
    },
    openAddWindow() {
      this.$resetForm("userForm", this.user); //清空表单
      this.userDialog.visible = true; //显示窗口
      this.userDialog.title = "新增用户"; //设置标题
    },
    /**
     * 编辑用户
     */
    handleEdit(row) {
      //设置弹框属性
      this.userDialog.title = "编辑用户";
      this.userDialog.visible = true;
      //把当前编辑的数据复制到表单数据域，供回显使用
      this.$objCopy(row, this.user);
    },

    async handleDelete(row) {
      let confirm = await this.$myconfirm("确定要删除该数据吗?");
      if (confirm) {
        //封装条件
        let params = { id: row.id };
        //发送删除请求
        let res = await userApi.deleteUser(params);
        //判断是否成功
        if (res.success) {
          this.$message.success(res.message);
          //刷新
          this.search(this.departmentId, this.pageNo, this.pageSize);
        } else {
          this.$message.error(res.message);
        }
      }
    },
    assignRole() {},
    handleSizeChange(size) {
      this.pageSize = size; //将每页显示的数量交给成员变量
      this.search(this.departmentId, this.pageNo, size);
    },
    handleCurrentChange(page) {
      this.pageNo = page;
      //调用查询方法
      this.search(this.departmentId, page, this.pageSize);
    },
    onClose() {
      this.userDialog.visible = false;
    },
    onConfirm() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          let res = null;
          //判断用户ID是否为空
          if (this.user.id === "") {
            //新增
            //发送添加请求
            res = await userApi.addUser(this.user);
          } else {
            //发送修改请求
            res = await userApi.updateUser(this.user);
          }
          //判断是否成功
          if (res.success) {
            this.$message.success(res.message);
            //刷新
            this.search(this.departmentId, this.pageNo, this.pageSize);
            //关闭窗口
            this.userDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    /**
     * 选择上级部门取消事件
     */
    onParentClose() {
      this.parentDialog.visible = false; //关闭窗口
    },
    /**
     * 选择上级部门确认事件
     */
    onParentConfirm() {
      this.parentDialog.visible = false;
    },
    parentClick(data) {
      this.user.departmentId = data.id;
      this.user.departmentName = data.departmentName;
    },
    /**
     * 选择所属部门
     */

    async selectDepartment() {
      //显示窗口
      this.parentDialog.visible = true;
      //设置窗口标题
      this.parentDialog.title = "选择所属部门";
      //查询部门列表
      let res = await departmentApi.getParentDepartment();
      //判断是否成功
      if (res.success) {
        //赋值
        this.parentList = res.data;
      }
    },
    /**
     * 上传成功回调
     * @param res
     * @param file
     */
    handleAvatarSuccess(res, file) {
      this.user.avatar = res.data;
      // 强制重新渲染
      this.$forceUpdate();
    },
    /**
     * 上传校验
     * @param file
     * @returns {boolean}
     */
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    /**
     * 打开分配角色
     */
    async assignRole(row) {
      //防止回显出现问题
      this.selectedIds = [];
      this.selectedUserId = "";
      //被分配用户的id
      this.selectedUserId = row.id;
      //显示窗口
      this.assignDialog.visible = true;
      //设置标题
      this.assignDialog.title = `给【${row.realName}】分配角色`;
      //查询当前登录用户的所有角色信息
      await this.getAssignRoleList();
      //获取当前被分配用户的ID
      let params = {
        userId: row.id,
      };
      //发送根据用户ID查询角色列表的请求
      let res = await userApi.getRoleIdByUserId(params);
      //如果存在数据
      if (res.success && res.data) {
        //将查询到的角色ID列表交给选中角色数组
        this.selectedIds = res.data;
        //循环遍历
        this.selectedIds.forEach((key) => {
          this.assignRoleList.forEach((item) => {
            if (item.id === key) {
              this.$refs.assignRoleTable.toggleRowSelection(item, true);
            }
          });
        });
      }
    },
    /**
     * 查询当前登录用户的所有角色信息
     */
    async getAssignRoleList(pageNo = 1, pageSize = 10) {
      //给用户ID赋值
      this.roleVo.userId = this.$store.getters.userId;
      this.roleVo.pageNo = pageNo;
      this.roleVo.pageSize = pageSize;
      //发送查询请求
      let res = await userApi.getAssignRoleList(this.roleVo);
      //判断是否成功
      if (res.success) {
        //角色列表赋值
        this.assignRoleList = res.data.records;
        //角色总数量赋值
        this.roleVo.total = res.data.total;
      }
    },
    /**
     * 分配角色取消事件
     */
    onAssignClose() {
      //隐藏窗口
      this.assignDialog.visible = false;
    },
    /**
     * 分配角色确认事件
     */
    async onAssignConfirm() {
      //判断用户是否有选中角色
      if (this.selectedIds.length === 0) {
        this.$message.warning("请选择要分配的角色！");
        return;
      }
      let params = {
        userId: this.selectedUserId,
        roleIds: this.selectedIds,
      };
      //发送请求
      let res = await userApi.assignRoleSave(params);
      //判断是否成功
      if (res.success) {
        this.$message.success(res.message);
        //关闭窗口
        this.assignDialog.visible = false;
      } else {
        this.$message.error(res.message);
      }
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    assignSizeChange(size) {
      this.roleVo.pageSize = size; //将每页显示的数量交给成员变量
      this.getAssignRoleList(this.roleVo.pageNo, size);
    },
    /**
     * 当页码发生变化时触发该事件
     */
    assignCurrentChange(page) {
      this.roleVo.pageNo = page;
      //调用查询方法
      this.getAssignRoleList(page, this.roleVo.pageSize);
    },
    /**
     * 当点击多选框时触发该事件
     */
    handleSelectionChange(rows) {
      let roleIds = [];
      //循环遍历选中的角色ID
      for (let i = 0; i < rows.length; i++) {
        //将当前选中的角色ID放到数组中
        roleIds.push(rows[i].id);
      }
      //将选中的角色ID交给成员变量
      this.selectedIds = roleIds;
      // this.selectedIds = rows.map(item => item.id);//等同于上述代码
    },
  },
};
</script>


<style lang="scss">
//用户头像
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader img {
  width: 178px;
  height: 178px;
  display: block;
}
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