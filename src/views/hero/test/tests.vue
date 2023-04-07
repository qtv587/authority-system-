<template>
  <div class="address-container">
    <div class="address-list">
      <h3>已有收货地址</h3>
      <el-table :data="addressList" style="width: 70%">
        <el-table-column prop="name" label="收货人"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index)"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="handleDelete(scope.$index)"
              :disabled="scope.row.default"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="address-form">
      <h3>新增收货地址</h3>
      <el-form
        :model="form"
        :rules="rules"
        ref="addressForm"
        label-width="100px"
      >
        <el-form-item label="地址信息" required>
          <div class="block">
            <el-cascader
              v-model="value"
              placeholder="试试搜索：余杭"
              :options="options"
              :props="{
                expandTrigger: 'hover',
                value: 'addressId',
                label: 'addressName',
                children: 'children',
              }"
              filterable
            ></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="详细地址" required>
          <el-input v-model="form.detailAddress"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" required>
          <el-input v-model="form.zipCode"></el-input>
        </el-form-item>
        <el-form-item label="收货人姓名" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" required>
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  <script>
//导入address脚本文件
import address from "@/api/address";
import md5 from 'blueimp-md5'
export default {
  data() {
    return {
      value: [],
      addressList: [
        {
          name: "张三",
          address: "北京市海淀区上地十街国富通大厦B座501",
          default: true,
        },
        {
          name: "李四",
          address: "上海市徐汇区宜山路888号中银大厦9楼",
          default: false,
        },
        {
          name: "王五",
          address: "广州市天河区体育西路222号保利克洛维中心1705室",
          default: false,
        },
      ],
      form: {
        address: [],
        detailAddress: "",
        zipCode: "",
        name: "",
        phone: "",
      },
      rules: {
        address: [
          { required: false, message: "请选择地址信息", trigger: "change" },
        ],
        detailAddress: [
          { required: true, message: "请填写详细地址", trigger: "change" },
        ],
        zipCode: [
          { required: true, message: "请填写邮政编码", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请填写收货人姓名", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请填写手机号", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
      },
      options: [
        {
          value: "110000",
          label: "北京市",
          children: [
            {
              code: "110100",
              name: "市辖区",
              cities: [
                {
                  code: "110101",
                  name: "东城区",
                },
                {
                  code: "110102",
                  name: "西城区",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.findAddressTree();
    this.xiaocan();
  },
  methods: {
    async findAddressTree() {
      var res = await address.getAddressTree();
      if (res.success) {
        // console.log(res.data);
        this.options = this.getTreeData(res.data);
      }
    },
    getTreeData(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // 最后一级没有数据将children变成undefined
          data[i].children = undefined;
        } else {
          // children不为空时继续调用该方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    handleEdit(index) {
      // 编辑操作
    },
    handleDelete(index) {
      // 删除操作
    },
    submitForm() {
      this.$refs.addressForm.validate((valid) => {
        if (valid) {
          alert(1);
          // 提交表单
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.addressForm.resetFields();
    },
    xiaocan() {
      let v = (new Date).getTime()  ;
      let k = '1a920e2e25f30418'
      // let y = md5(md5(("Silkworm" + "." +"SilkwormService.GrabPromotionQuota").toLowerCase())+v+k)
      // let y = md5(md5(("Silkworm" + "." +"SilkwormService.GetStorePromotionList").toLowerCase())+v+k)
      let y = md5(md5(("MpGatewayBailu" + "." +"MpGateway.WebOAuth").toLowerCase())+v+k)
      // console.log(md5(("MpGatewayBailu" + "." +"SilkwormService.GrabPromotionQuota").toLowerCase())+v+k)
      console.log("X-Garen: " + v+"\n"+"X-Nami: "+k+"\n"+"X-Ashe: "+y);
    },
  },
};
</script>

  <style>
/* .address-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 20px 0;
} */
/* .address-list {
  width: calc(70% - 40px);
  margin-right: 40px;
}
.address-form {
  width: 30%;
} */
</style>
  