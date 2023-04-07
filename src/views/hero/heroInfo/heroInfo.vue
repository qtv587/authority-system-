<template>
  <el-main height="">
    <!-- 查询条件 -->
    <el-form
      :model="searchModel"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item>
        <el-input v-model="searchModel.name" placeholder="请输入英雄名称" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search()"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh-right" @click="resetValue()"
          >重置</el-button
        >
        <!-- <el-button type="success" icon="el-icon-plus" @click="openAddWindow()"
          >新增</el-button
        > -->
      </el-form-item>
    </el-form>

    <!-- 卡片展示 -->
    <el-row :gutter="10">
      <el-col
        :span="2"
        v-for="(o) in 100"
        :key="o"
      >
        <el-card :body-style="{ padding: '0px',height:'170px'}" shadow="hover">
          <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
          />
          <div style="padding: 14px" align="center">
            <span>好吃的汉堡</span>
            
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  name: "heroInfo",
  data() {
    return {
      searchModel: {
        name: "",
      },
    };
  },
  created() {},
  mounted() {},
  methods: {
    resetValue() {},
    search() {},
  },
};
</script>
<style>

  .el-col {
    border-radius: 6px;
    margin-bottom: 20px;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
