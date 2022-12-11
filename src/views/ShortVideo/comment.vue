<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" >

<!--      <el-form-item label="昵称" prop="gName">-->
<!--        <el-input-->
<!--          v-model="queryParams.gName"-->
<!--          placeholder="请输入发送人昵称"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->

      <el-form-item label="用户id" prop="gName">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入发送人id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>


    <el-table v-loading="loading" :data="commentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="评论记录Id" align="center" prop="publishId" :show-overflow-tooltip="true"/>
      <el-table-column label="所属消息ID" align="center" prop="id" :show-overflow-tooltip="true"/>
      <el-table-column label="评论用户ID" align="center" prop="userId" :show-overflow-tooltip="true"/>
      <el-table-column label="评论用户昵称" align="center" prop="uname" :show-overflow-tooltip="true"/>
      <el-table-column label="评论内容" align="center" prop="comment" :show-overflow-tooltip="true"/>
      <el-table-column label="被回复用户ID" align="center" prop="touserId" :show-overflow-tooltip="true"/>
      <el-table-column label="被回复用户昵称" align="center" prop="touname" :show-overflow-tooltip="true"/>
      <el-table-column label="回复内容" align="center" prop="recomment" :show-overflow-tooltip="true"/>
      <el-table-column label="评论时间" align="center" prop="createDate" :show-overflow-tooltip="true"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
     <el-button @click="back"  icon="el-icon-back" v-show="showSearch" class="back">返回上一步</el-button>

  </div>
</template>

<script>
import { listGroup, getGroup, delGroup, addGroup, updateGroup, exportGroup } from "@/api/group/group";
import {getCommentList} from "@/api/ShortVideo/comments"

export default {
  name: "Group",
  data() {
    return {
      // 遮罩层
      loading: true,
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
      groupList: [],
      commentList:[],
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
        uname: '',
        userId: '',
        publishId: this.$route.query.id
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.loading = false;
  },
  methods: {
    groupBan(data,status){

    },
    /** 查询群组列表 */
    getList() {
      this.loading = true;
      console.log("----------------------------------")
      console.log(this.$route.query)
      getCommentList(this.queryParams).then(response => {
        this.commentList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    start(){
      this.$router.push({path:"/monents/start"})
    },
    back(){
      this.$router.back(-1)
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.gId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const gIds = row.gId || this.ids;
      this.$confirm('是否确认删除所选的的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delGroup(gIds);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    }

  }
};
</script>
<style scoped="scoped">
  .k_img{
    width: 40px;
    border-radius: 4px;
    margin: 4px 4px;
  }
</style>
