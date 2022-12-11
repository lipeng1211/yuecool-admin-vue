<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">

      <el-form-item label="发布的用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入发布的用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="审核状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['moments:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="publishsList" @selection-change="handleSelectionChange" class="k_line">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="动态ID" align="center" prop="id" width="150" />
      <el-table-column label="发送人ID" align="center" prop="userId" width="150" />
      <el-table-column label="发送人昵称" align="center" prop="nickname" width="150" />
      <el-table-column label="动态内容" align="center" width="200">
        <template slot-scope="scope" v-if="scope.row.picUrl!==null&&scope.row.picUrl!==''">
          <el-image v-for="item in (scope.row.picUrl || '').split(',')" :key="item" :src="item" :preview-src-list="(scope.row.picUrl || '').split(',')" :lazy="true" style="width: 45px; height: 45px; margin-right: 5px;"/>
        </template>
        <template slot-scope="scope" v-if="scope.row.videoUrl!==null&&scope.row.videoUrl!==''">
          <video style="width: 100px" :src="scope.row.videoUrl" controls="controls">
          </video>
        </template>
        <template slot-scope="scope" v-if="scope.row.content!==null&&scope.row.content!==''" >
          <p @click="imgShow(scope.row)">{{scope.row.content}}</p>
        </template>
      </el-table-column>
      <el-table-column label="可见类型" align="center" prop="noSeeStatus" :formatter="noSeeStatusFormat" />
      <el-table-column label="审核状态" align="center" prop="status" :formatter="statusFormat">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">正常</span>
          <span v-if="scope.row.status == 2">锁定</span>
          <span v-if="scope.row.status == 3">待审核</span>
          <span v-if="scope.row.status == 4">未通过</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain class="input" v-hasPermi="['group:group:edit']" @click="deleteThis(scope.row)">删除</el-button>
          <el-button type="primary" size="small" plain class="input" v-hasPermi="['group:group:edit']"  @click="start()">点赞列表</el-button>
          <el-button type="primary" size="small" plain class="input" v-hasPermi="['group:group:edit']" @click="comment(scope.row)">评论列表</el-button>
          <el-button v-if="scope.row.status === 1" type="primary" size="small" plain class="input" v-hasPermi="['group:group:remove']" @click="lock(scope.row)">锁定</el-button>
          <el-button v-if="scope.row.status === 2" type="primary" size="small" plain class="input" v-hasPermi="['group:group:remove']" @click="unLock(scope.row)">解锁</el-button>
          <el-button v-if="scope.row.status === 3" type="primary" size="small" plain class="input" v-hasPermi="['group:group:remove']" @click="approved(scope.row)">审核通过</el-button>
          <el-button v-if=" scope.row.userStatus === 0" type="primary" size="small" plain class="input" v-hasPermi="['group:group:remove']"  @click="seal(scope.row)">封号</el-button>
          <el-button v-if=" scope.row.userStatus === 1" type="primary" size="small" plain class="input" v-hasPermi="['group:group:remove']"  @click="unseal(scope.row)">解封</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 查看动态 -->
    <el-dialog title="动态详情" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div v-if="publish.content != undefined && publish.content != null">
       {{this.publish.content}}
      </div>


      <div >
        <img v-for="item in (this.publish.picUrl || '').split(',')" :key="item" :src="item"  style="width: 45px; height: 45px; margin-right: 5px;"/>
      </div>


      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>
import {
  listPublishs,
  getPublishs,
  addPublishs,
  updatePublishs,
  delPublishs,
  exportPublishs,
  banUser, unBanUser
} from '@/api/publishs/publishs'
import { delGroup } from '@/api/group/group'

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
        noSeeStatusOptions: [],
        // 1正常  2锁定字典
        statusOptions: [],
        publish: {
          id: 0,
          userId: 0,
          type: 0,
          content:'',
          picUrl: '',
          videoUrl: '',
          videoCoverUrl: '',
          status: '',
          noSeeStatus: '',
          noSeeUserId: '',
          nickname: ''
        },
        // 动态表格数据
        publishsList: [{
          id: 0,
          userId: 0,
          type: 0,
          content:'',
          picUrl: '',
          videoUrl: '',
          videoCoverUrl: '',
          status: '',
          noSeeStatus: '',
          noSeeUserId: '',
          nickname: ''
        }],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态字典
        gStatusOptions: [],
        // 查询参数
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          srcUid: null,
          destUid: null,
          chatType: null,
          msgType: null,
          msgContent: null,
          msgTime: null,
          msgTime2: null,
          onlineCount: null,
          fingerprint: null
        },

        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        dialogVisible: false
      };
    },
    created() {
      // this.getList();
      this.loading = false;

      this.getList();
      this.getDicts("publish_who_can_see").then(response => {
        this.noSeeStatusOptions = response.data;
      });
      this.getDicts("publush_status").then(response => {
        this.statusOptions = response.data;
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

      // 1 全部可见
      noSeeStatusFormat(row, column) {
        return this.selectDictLabel(this.noSeeStatusOptions, row.noSeeStatus);
      },
      // 1正常  2锁定字典翻译
      statusFormat(row, column) {
        return this.selectDictLabel(this.statusOptions, row.status);
      },

      /** 查询群组列表 */
      /** 查询动态列表 */
      getList() {
        this.loading = true;
        listPublishs(this.queryParams).then(response => {
          this.publishsList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      start() {
        this.$router.push({
          path: "/monents/start"
        })
      },
      comment(row) {
        this.$router.push({
          path: "/monents/comment",
          query: row
        })
      },
      deleteThis(row) {
        console.info(row.id)
        this.$confirm('确定删除吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delPublishs( row.id);
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },



      imgShow(row) {
        this.publish = getPublishs(row.id).then(response => {
          this.publish = response.data;
        });
        this.dialogVisible = true
      },
      handleClose(done) {
        done();
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
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

      seal(row) {
        this.$confirm('确定封号？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return banUser(row.userId);
        }).then(() => {
          this.getList();
          this.msgSuccess("封禁成功");
        }).catch(function() {});
      },

      unseal(row) {
        this.$confirm('确定解除封号？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return unBanUser(row.userId);
        }).then(() => {
          this.getList();
          this.msgSuccess("解封成功");
        }).catch(function() {});
      },

      lock(row) {
        this.$confirm('确定禁用该朋友圈？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const  publish = {
            id: row.id,
            status: 2
          }
        return   updatePublishs(publish);
        }).then(() => {
          this.getList();
          this.msgSuccess("锁定成功");
        }).catch(function() {});
      },

      unLock(row) {
        this.$confirm('确定解锁该朋友圈？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const  publish = {
            id: row.id,
            status: 1
          }
          return   updatePublishs(publish);
        }).then(() => {
          this.getList();
          this.msgSuccess("解锁成功");
        }).catch(function() {});
      },

      approved(row) {
        this.$confirm('确定审核通过该朋友圈？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const  publish = {
            id: row.id,
            status: 1
          }
          return   updatePublishs(publish);
        }).then(() => {
          this.getList();
          this.msgSuccess("审核成功");
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
