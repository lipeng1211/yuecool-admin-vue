<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="评论用户名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入评论用户名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评论内容" prop="comment">
        <el-input
          v-model="queryParams.comment"
          placeholder="请输入评论内容"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-table-column label="评论ID" align="center" prop="id" />
      <el-table-column label="课程ID" align="center" prop="courseId" />
      <el-table-column label="讲师ID" align="center" prop="lecturerId" />
      <el-table-column label="评论用户ID" align="center" prop="userId" />
      <el-table-column label="评论用户名" align="center" prop="userName" />
      <!-- <el-table-column label="评论用户头像" align="center" prop="userAvatar">
        <template slot-scope="scope">
          <img :src="scope.row.commentPic" width="120" alt="">
        </template>
      </el-table-column> -->
      <el-table-column label="评论内容" align="center" prop="comment" />
      <!-- <el-table-column label="评论图片" align="center" prop="commentPic">
        <template slot-scope="scope">
          <img :src="scope.row.commentPic" width="120" alt="">
        </template>
      </el-table-column> -->
      <el-table-column label="评论星级" align="center" prop="praiseRate">
        <template slot-scope="scope">
          <span v-if="scope.row.praiseRate == 1">一星</span>
          <span v-if="scope.row.praiseRate == 2">二星</span>
          <span v-if="scope.row.praiseRate == 3">三星</span>
          <span v-if="scope.row.praiseRate == 4">四星</span>
          <span v-if="scope.row.praiseRate == 5">五星</span>
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

    <!-- 添加或修改课程评论对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="讲师ID" prop="lecturerId">
          <el-input v-model="form.lecturerId" placeholder="请输入讲师ID" />
        </el-form-item>
        <el-form-item label="课程ID" prop="courseId">
          <el-input v-model="form.courseId" placeholder="请输入课程ID" />
        </el-form-item>
        <el-form-item label="评论用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入评论用户ID" />
        </el-form-item>
        <el-form-item label="评论用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入评论用户名" />
        </el-form-item>
        <el-form-item label="评论用户头像" prop="userAvatar">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        		:http-request="uploaduserAvatar"
        		:before-upload="beforeAvatarUpload" accept="image/*">
        		<img v-if="form.userAvatar" :src="form.userAvatar" class="avatar">
        		<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	</el-upload>
        </el-form-item>
        <el-form-item label="评论内容" prop="comment">
          <el-input v-model="form.comment" placeholder="请输入评论内容" />
        </el-form-item>
        <el-form-item label="评论图片" prop="commentPic">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        		:http-request="uploadcommentPic"
        		:before-upload="beforeAvatarUpload" accept="image/*">
        		<img v-if="form.commentPic" :src="form.commentPic" class="avatar">
        		<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	</el-upload>
        </el-form-item>
        <el-form-item label="评论星级" prop="praiseRate">
          <el-select v-model="form.praiseRate" placeholder="请选择评论星级">
            <el-option label="一星" value="1"></el-option>
            <el-option label="二星" value="2"></el-option>
            <el-option label="三星" value="3"></el-option>
            <el-option label="四星" value="4"></el-option>
            <el-option label="五星" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看课程评论 -->
    <el-dialog :title="title" :visible.sync="lookopen" width="500px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="讲师ID" prop="lecturerId">
          <span>{{form.lecturerId}}</span>
        </el-form-item>
        <el-form-item label="课程ID" prop="courseId">
          <span>{{form.courseId}}</span>
        </el-form-item>
        <el-form-item label="评论用户ID" prop="userId">
          <span>{{form.userId}}</span>
        </el-form-item>
        <el-form-item label="评论用户名" prop="userName">
          <span>{{form.userName}}</span>
        </el-form-item>
        <el-form-item label="评论用户头像" prop="userAvatar">
          <img width="200" :src="form.userAvatar" class="avatar">
        </el-form-item>
        <el-form-item label="评论内容" prop="comment">
          <div>{{form.comment}}</div>
          <div>
            <img width="200" style="margin-top: 10px" :src="form.commentPic" class="avatar">
          </div>
        </el-form-item>
        <el-form-item label="评论星级" prop="praiseRate">
          <span v-if="form.praiseRate == 1">一星</span>
          <span v-if="form.praiseRate == 2">二星</span>
          <span v-if="form.praiseRate == 3">三星</span>
          <span v-if="form.praiseRate == 4">四星</span>
          <span v-if="form.praiseRate == 5">五星</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl, listComments, getComments, delComments, addComments, updateComments, exportComments } from "@/api/system/courseComments";

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
      // 课程评论表格数据
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
        lecturerId: null,
        courseId: null,
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
      },
      uploadPath:"/api/storage/upload",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询课程评论列表 */
    getList() {
      this.loading = true;
      listComments(this.queryParams).then(response => {
        this.commentsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上传用户头像
    uploaduserAvatar(param) {
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
    // 上传图片前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isLt2M
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.lookopen = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        lecturerId: null,
        courseId: null,
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
      this.title = "添加课程评论";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getComments(id).then(response => {
        this.form = response.data;
        this.lookopen = true;
        this.title = "查看课程评论";
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
      this.$confirm('是否确认导出所有课程评论数据项?', "警告", {
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
