<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">

      <el-form-item label="转账用户ID">
        <el-input v-model="queryParams.userId" placeholder="转账用户ID" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="收取用户ID">
        <el-input v-model="queryParams.toUserId" placeholder="收取用户ID" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="转账时间范围">
        <div class="block">
          <el-date-picker v-model="value1" type="monthrange" range-separator="至" start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" class="k_line">
      <el-table-column label="转账ID" align="center" prop="id" />
      <el-table-column label="转账用户ID" align="center" prop="userId" />
      <el-table-column label="转账用户昵称" align="center" prop="nickname" />
      <el-table-column label="收取用户ID" align="center" prop="toUserId" />
      <el-table-column label="收取用户昵称" align="center" prop="tonickname" />
      <el-table-column label="转账金额" align="center" prop="money" />
      <el-table-column label="转账备注" align="center" prop="descs" />
      <el-table-column label="转账状态" align="center" prop="status" width="180">
       <template slot-scope="scope">
					<span v-if="scope.row.status==-1">交易关闭</span>
					<span v-else-if="scope.row.status==0">创建</span>
					<span v-else-if="scope.row.status==1">支付完成</span>
					<span v-else-if="scope.row.status==2">交易完成</span>
					<span v-else-if="scope.row.status==3">提现成功</span>
					<span v-else-if="scope.row.status==4">提现失败</span>
       </template>
      </el-table-column>

      <el-table-column label="转账时间" align="center" prop="time" width="150" />
      <el-table-column label="收取时间" align="center" prop="timestamp" width="150" />
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

	import {
		listRecord,
		getRecord,
		delRecord,
		addRecord,
		updateRecord,
		exportRecord
	} from "@/api/system/record";

  export default {
    name: "Group",
    data() {
      return {
        // 遮罩层
        loading: true,
        ban: false,
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
        recordList: [
          {
            id:1
            }
        ],
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
        rules: {},
        dialogVisible: false,
        value1: ''


      };
    },
    created() {
      this.getList();
      this.loading = false;
      this.getDicts("group_status").then(response => {
        this.gStatusOptions = response.data;
      });
    },
    methods: {
      groupBan(data, status) {

      },
      confirmBan() {
        this.form.gStatus = 0;
        updateGroup(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.ban = false;
            this.getList();
            this.reset();
          }
        });
      },
      /** 查询群组列表 */
      /*
      getList() {
        this.loading = true;
        listGroup(this.queryParams).then(response => {
          this.recordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },*/
			/** 查询转账记录列表 */
			getList() {
        console.log("getList>>>");
				this.loading = true;
				
				//用户提现
				this.queryParams.type = 7
				
				listRecord(this.queryParams).then(response => {
					this.recordList = response.rows;
					this.total = response.total;
					this.loading = false;
				});
			},
      start() {
        this.$router.push({
          path: "/monents/start"
        })
      },
      comment() {
        this.$router.push({
          path: "/monents/comment"
        })
      },
      deleteThis() {
        this.$confirm('确定删除吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      deleteMonthLogs() {
        this.$confirm('确定删除吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteThousandAgoLogs() {
        this.$confirm('确定删除吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
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
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },


      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.gId != null) {
              updateGroup(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addGroup(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                }
              });
            }
          }
        });
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
      },

    }
  };
</script>
<style scoped="scoped">
  .k_img {
    width: 40px;
    border-radius: 4px;
    margin: 4px 4px;
    cursor: pointer;
  }

  .imgList>img {
    width: 100px;
    cursor: pointer;
    margin: 5px;
    border-radius: 4px;
  }
</style>
