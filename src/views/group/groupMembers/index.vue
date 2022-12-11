<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userUid">
        <el-input v-model="queryParams.userUid" placeholder="请输入用户id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="群id" prop="gId">
        <el-input v-model="queryParams.gId" placeholder="请输入群id" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- <el-col :span="1.5">
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['group:groupMembers:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
					v-hasPermi="['group:groupMembers:edit']">修改</el-button>
			</el-col> -->
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['group:groupMembers:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['group:groupMembers:export']">导出</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="generateUser"
          v-hasPermi="['group:groupMembers:export']">生成群成员</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupMembersList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="userRecordId" />
      <el-table-column label="成员id" align="center" prop="userUid" width="120" :show-overflow-tooltip="true" />
      <el-table-column label="成员账号" align="center" prop="userCornet" :show-overflow-tooltip="true" />
      <el-table-column label="成员昵称" align="center" prop="nickname" :show-overflow-tooltip="true" />

      <el-table-column label="群昵称" align="center">
        <template>
          <span>{{gName }}</span>
        </template>
      </el-table-column>


      <el-table-column label="群id" align="center" prop="gId" width="120" />
      <!-- <el-table-column label="群内昵称" align="center"  :show-overflow-tooltip="true"/> -->
      <el-table-column label="入群时间" align="center" prop="joinTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.joinTime }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="入群方式" align="center"  width="180">
       <template slot-scope="scope">
         <div >1  扫码入群 </div>
         <div>
          2 邀请人ID：6666666
         </div>
         <div>
          3 群主邀请
         </div>
       </template>
     </el-table-column> -->



      <!-- <el-table-column label="邀请人id" align="center" prop="beInviteUserId" /> -->
      <!--   <el-table-column label="群创建或转让时间" align="center" prop="beOwnerTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beOwnerTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <!--  <el-table-column label="群时间" align="center" prop="msgTimeStart" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.msgTimeStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['group:groupMembers:edit']"
          >修改</el-button> -->

          <!--  <el-button type="primary" size="small" plain class="input" @click="handleUpdate(scope.row)"  v-hasPermi="['group:groupMembers:edit']">修改资料</el-button> -->

          <!-- <el-button type="primary" size="small" plain class="input" >封ip</el-button> -->
          <!-- <el-button type="primary" size="small" plain class="input" >封号</el-button> -->
          <el-button type="primary" size="small" plain class="input" @click="handleDelete(scope.row)"
            v-hasPermi="['group:groupMembers:remove']">删除</el-button>








        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />




      <!-- <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userUid">
          <el-input v-model="form.userUid" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="群id" prop="gId">
          <el-input v-model="form.gId" placeholder="请输入群id" />
        </el-form-item>
        <el-form-item label="加入时间。" prop="joinTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.joinTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择加入时间。">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邀请人id" prop="beInviteUserId">
          <el-input v-model="form.beInviteUserId" placeholder="请输入邀请人id" />
        </el-form-item>
        <el-form-item label="群创建或转让时间" prop="beOwnerTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.beOwnerTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择群创建或转让时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="群昵称" prop="nicknameIngroup">
          <el-input v-model="form.nicknameIngroup" placeholder="请输入群昵称" />
        </el-form-item>
        <el-form-item label="群昵称" prop="msgTimeStart">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.msgTimeStart"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择群昵称">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div> -->
<!--    </el-dialog>-->


    <!-- 添加或修改群成员对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">


        <el-form-item label="生成人数" prop="nickname">
          <el-input v-model="form.gMemberCount" placeholder="请输入需要生成的人数,并且不能大于当前群上限" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generateUser1">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import {
    listGroupMembers,
    getGroupMembers,
    delGroupMembers,
    addGroupMembers,
    updateGroupMembers,
    exportGroupMembers,
    generateUser
  } from '@/api/group/groupMembers'

  export default {
    name: "GroupMembers",
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
        // 群成员表格数据
        groupMembersList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          userUid: null,
          gId: this.$route.query.gId,
          gMemberCount: this.$route.query.gMemberCount,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        gName: this.$route.query.gName
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询群成员列表 */
      getList() {
        this.loading = true;
        listGroupMembers(this.queryParams).then(response => {
          this.groupMembersList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          userRecordId: null,
          userUid: null,
          gId: null,
          joinTime: null,
          beInviteUserId: null,
          beOwnerTime: null,
          nicknameIngroup: null,
          msgTimeStart: null,
          gMemberCount: null
        };
        this.resetForm("form");
      },
      resetRandom() {
        this.form = {
          gMemberCount: null,
          gId: null,
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
        this.ids = selection.map(item => item.userRecordId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      generateUser() {
        this.resetRandom();
        this.open = true;
        this.title = "生成群成员";
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const userRecordId = row.userRecordId || this.ids
        getGroupMembers(userRecordId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改群成员";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.userRecordId != null) {
              updateGroupMembers(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addGroupMembers(this.form).then(response => {
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
        const userRecordIds = row.userRecordId || this.ids;
        this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGroupMembers(userRecordIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有群成员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGroupMembers(queryParams);
          this.download(response.msg);
        }).catch(function() {});
      },
      /** 导出按钮操作 */
      generateUser1() {
        this.queryParams.gMemberCount = this.form.gMemberCount;
        const queryParams = this.queryParams;
        this.open = false;
        this.$confirm('是否确认生成群成员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return generateUser(queryParams);
        }).then(response => {
          this.open = false;
          this.msgSuccess("生成成功");
          this.getList();
        }).catch(function() {});
      }
    }
  };
</script>
