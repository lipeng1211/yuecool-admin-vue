<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">

      <el-form-item label="昵称" prop="gName">
        <el-input v-model="queryParams.gName" placeholder="请输入发送人昵称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column label="意见反馈ID" align="center" prop="id" :show-overflow-tooltip="true" />
      <el-table-column label="反馈用户ID" align="center" prop="gName" :show-overflow-tooltip="true" />
      <el-table-column label="反馈用户昵称" align="center" prop="gNotice" :show-overflow-tooltip="true" />
      <el-table-column label="反馈内容" align="center" prop="gMemberCount">
      该消息内容可以是图文信息

      </el-table-column>


      <el-table-column label="反馈时间" align="center" prop="gMemberCount" :show-overflow-tooltip="true" />

      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain class="input" 
            v-hasPermi="['feedback:remove']">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
  import {
    listGroup,
    getGroup,
    delGroup,
    addGroup,
    updateGroup,
    exportGroup
  } from "@/api/group/group";

  export default {
    name: "Group",
    data() {
      return {
        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 群组表格数据
        groupList: [{
          id:1
        }],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态字典
        gStatusOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          gStatus: null,
          gName: null,
          gOwnerUserUid: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      // this.getList();
    },
    methods: {
      groupBan(data, status) {

      },
      /** 查询群组列表 */
      getList() {
        this.loading = true;
        listGroup(this.queryParams).then(response => {
          this.groupList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      start() {
        this.$router.push({
          path: "/monents/start"
        })
      },
      back() {
        this.$router.back(-1)
      },

      // 表单重置
      reset() {
        this.form = {
          gId: null,
          gStatus: null,
          gName: null,
          gOwnerUserUid: null,
          gNotice: null,
          maxMemberCount: null,
          gMemberCount: null,
          createUserUid: null,
          createTime: null,
          forbidUserUid: null,
          forbidTime: null,
          firbidCause: null,
          gNoticeUpdatetime: null,
          gNoticeUpdateuid: null,
          delUserUid: null,
          delTime: null,
          avatarIncludeCnt: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        // this.getList();
        this.loading = false;
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.gId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      }

    }
  };
</script>
<style scoped="scoped">
  .k_img {
    width: 40px;
    border-radius: 4px;
    margin: 4px 4px;
  }
</style>
