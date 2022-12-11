<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="医生id" prop="doctorId">
        <el-input
          v-model="queryParams.doctorId"
          placeholder="请输入医生id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论用户" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入评论用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="好评" prop="praiseRate">
        <el-select v-model="queryParams.praiseRate" placeholder="请选择评价等级" @keyup.enter.native="handleQuery">
          <el-option label="一星" value="1"></el-option>
          <el-option label="二星" value="2"></el-option>
          <el-option label="三星" value="3"></el-option>
          <el-option label="四星" value="4"></el-option>
          <el-option label="五星" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:comments:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:comments:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:comments:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:comments:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="commentsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="订单ID" align="center" prop="orderId" />
      <el-table-column label="评论用户ID" align="center" prop="userId" />
      <el-table-column label="评论用户名" align="center" prop="userName" />
      <el-table-column label="医生ID" align="center" prop="doctorId" />
      <el-table-column label="医生名称" align="center" prop="doctorName" />
      <el-table-column label="评论星级" align="center" prop="praiseRate">
        <template slot-scope="scope">
          <span v-if="scope.row.praiseRate == '1'">一星</span>
          <span v-if="scope.row.praiseRate == '2'">二星</span>
          <span v-if="scope.row.praiseRate == '3'">三星</span>
          <span v-if="scope.row.praiseRate == '4'">四星</span>
          <span v-if="scope.row.praiseRate == '5'">五星</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:comments:edit']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:comments:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改动态评论对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="评论ID" prop="orderId">
              <el-input v-model="form.orderId" placeholder="请输入评论ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评论用户ID" prop="userId">
              <el-input v-model="form.userId" placeholder="请输入评论用户ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="医生ID" prop="doctorId">
              <el-input v-model="form.doctorId" placeholder="请输入医生id" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医生名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入医生名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="评论星级" prop="praiseRate">
              <el-select v-model="form.praiseRate" placeholder="请选择评论星级" @keyup.enter.native="handleQuery">
                <el-option label="一星" value="1"></el-option>
                <el-option label="二星" value="2"></el-option>
                <el-option label="三星" value="3"></el-option>
                <el-option label="四星" value="4"></el-option>
                <el-option label="五星" value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片名称" prop="commentPicName">
              <el-input v-model="form.commentPicName" placeholder="请输入评论图片名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="评论内容" prop="comment">
              <el-input v-model="form.comment" type="textarea" placeholder="请输入评论内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 查看动态评论对话框 -->
    <el-dialog :title="title" :visible.sync="lookopen" width="650px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="评论ID" prop="orderId">
              {{form.orderId}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评论用户ID" prop="userId">
              {{form.userId}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="医生ID" prop="doctorId">
              {{form.doctorId}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="医生名称" prop="userName">
              {{form.userName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="评论星级" prop="praiseRate">
              <span v-if="form.praiseRate == 1">一星</span>
              <span v-if="form.praiseRate == 2">二星</span>
              <span v-if="form.praiseRate == 3">三星</span>
              <span v-if="form.praiseRate == 4">四星</span>
              <span v-if="form.praiseRate == 5">五星</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片名称" prop="commentPicName">
              {{form.commentPicName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="评论内容" prop="comment">
              {{form.comment}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listComments, getComments, delComments, addComments, updateComments, exportComments, uploadUrl } from "@/api/system/comments";

export default {
  name: "Comments",
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
      // 动态评论表格数据
      commentsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      lookopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        doctorId: null,
        orderId: null,
        userId: null,
        userName: null,
        userAvatar: null,
        comment: null,
        commentPic: null,
        commentPicName: null,
        praiseRate: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        doctorId: [
          { required: true, message: "请输入医生id", trigger: "blur" },
        ],
        orderId: [
          { required: true, message: "请输入订单id", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "请输入评论用户id", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入评论用户名", trigger: "blur" },
        ],
        userAvatar: [
          { required: true, message: "请上传用户头像", trigger: "blur" },
        ],
        comment: [
          { required: true, message: "请输入评论内容", trigger: "blur" },
        ],
        commentPic: [
          { required: true, message: "请上传评论图片", trigger: "blur" },
        ],
        commentPicName: [
          { required: true, message: "请输入评论图片名称", trigger: "blur" },
        ],
        praiseRate: [
          { required: true, message: "请选择评价等级", trigger: "blur" },
        ]
      },
      uploadPath:"/api/storage/upload"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询动态评论列表 */
    getList() {
      this.loading = true;
      listComments(this.queryParams).then(response => {
        this.commentsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上传用户照片
    uploaduseravatar(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.userAvatar = response.data.imgUrl
      })
    },
    // 上传评论图片
    uploadcommentPic(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.commentPic = response.data.imgUrl
      })
    },
    handleAvatarSuccess(res, file) {
      
    },
    // 上传图片前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 4MB!');
      }
      return isLt2M;
    },
    // 取消按钮
    cancel() {
      this.lookopen = false
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        doctorId: null,
        orderId: null,
        userId: null,
        userName: null,
        userAvatar: null,
        comment: null,
        commentPic: null,
        commentPicName: null,
        createTime: null,
        praiseRate: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加动态评论";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getComments(id).then(response => {
        this.form = response.data;
        this.lookopen = true;
        this.title = "查看动态评论";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateComments(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addComments(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delComments(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有动态评论数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportComments(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>

<style>
  .avatar-uploader .el-upload {
    width: 145px;
    height: 145px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 145px;
    height: auto;
    display: block;
  }
</style>
