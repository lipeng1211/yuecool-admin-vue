<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['group:group:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['group:group:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['group:group:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="120" />
      <el-table-column label="标题" align="center" prop="title" :show-overflow-tooltip="true" />
      <el-table-column label="名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="执证编号" align="center" prop="licensedNamber" :show-overflow-tooltip="true" />
      <el-table-column label="简介" align="center" prop="brief" />
      <el-table-column label="图片" align="center" prop="picUrl" >
         <template slot-scope="scope">
                  <img :src="scope.row.picUrl" width="40">
         </template>
      </el-table-column>
      <el-table-column label="视频" align="center" prop="videoUrl" >
        <template slot-scope="scope">
          <video :src="scope.row.videoUrl" width="40" :controls="videoOptions.controls"
                 class="video-js vjs-big-play-centered vjs-fluid"
                 webkit-playsinline="true"
                 playsinline="true"
                 x-webkit-airplay="allow"
                 x5-playsinline
                 style="width: 40%;"
                 ref="video"></video>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" prop="addTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="370">
        <template slot-scope="scope">
          <el-button size="small" type="primary" plain class="input" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button plain size="small" type="primary" class="input" @click="handleDelete(scope.row)" >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" zIndex ="1">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="执证编号" prop="keywords">
          <el-input v-model="form.licensedNamber" placeholder="请输入执证编号" />
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="form.brief" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="上传封面" prop="picUrl">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                     :http-request="uploadSectionFile" :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload" accept="image/*">
            <img v-if="form.picUrl" :src="form.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      	<el-form-item label="上传视频" prop="videoUrl">
        	<el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        						:http-request="uploadSectionVideoFile" :on-success="handleAvatarVideoSuccess"
        						:before-upload="beforeAvatarUpload" accept="video/*">
                    <video v-if="form.videoUrl" :src="form.videoUrl" class="avatar"></video>
        						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	</el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    listGroup,
    getGroup,
    delGroup,
    addGroup,
    updateGroup,
    uploadUrl
  } from "@/api/article/investor";
  export default {
    name: "articleInvestor",
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
        groupList: [],
        // 弹出层标题
        title: "",
        imageUrl: '',
        videoUrl: '',
        imgs: "",
        imgsVisible: false,
        uploadPath: "/api/storage/upload",

        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
        	pageNum: 1,
            pageSize: 10,
            name: null,
            category: 1
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        videoOptions: {
          controls:true,
          src: "", // url地址
        },
        player: null,
        playTime:'',
        seekTime:'',
        current:'',
      };
    },
    created() {
      this.getList();
    },

    methods: {

      groupBan(data, status) {
        this.form.id = data.id;
        updateGroup(data).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.getList();
            }
        });

      },
      confirmBan() {

        updateGroup(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.ban = false;
            this.getList();
            this.reset();
          }
        });
      },
      /** 查询列表 */
      getList() {
        this.loading = true;
        listGroup(this.queryParams).then(response => {
          this.groupList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 状态字典翻译
      gStatusFormat(row, column) {
        return this.selectDictLabel(this.gStatusOptions, row.gStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.ban = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          name: null,
          category:1,
          keywords: null,
          brief: null,
          addTime: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.queryParams.category = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.queryParams.category = 1;
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getGroup(id).then(response => {
          this.form = response.data;
          this.imgUrl =  this.form.picUrl;
          this.form.addTime = '';
          this.open = true;
          this.title = "修改";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.form.category = 1;
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
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
       uploadSpecPicUrl: function(response) {
          this.specForm.picUrl = response.data.url
        },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGroup(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      			uploadSectionFile(param) {
      			  console.log(param);
      			  let fileObj = param.file;
      			  let form = new FormData();
      			  form.append("file", fileObj);
      			  uploadUrl(form, this.uploadPath).then(response => {
      			    this.imageUrl = response.data[0].url;
      			    this.form.picUrl = this.imageUrl;
      			  });
      			},

      			handleAvatarSuccess(res, file) {
      			  this.imageUrl = URL.createObjectURL(file.raw);
      			},
            uploadSectionVideoFile(param) {
              console.log(param);
              let fileObj = param.file;
              let form = new FormData();
              form.append("file", fileObj);
              uploadUrl(form, this.uploadPath).then(response => {
                this.videoUrl = response.data[0].url;
                this.form.videoUrl = this.videoUrl;
              });
            },

            handleAvatarVideoSuccess(res, file) {
              this.videoUrl = URL.createObjectURL(file.raw);
            },
      			beforeAvatarUpload(file) {
      			  const isJPG = file.type === 'image/jpg';
      			  const isPNG = file.type === 'image/png';
      			  const isLt2M = file.size / 1024 / 1024 < 5;
      			  if (!isLt2M) {
      			    this.$message.error('上传头像文件大小不能超过 5MB!');
      			  }
              return isLt2M;

      			}
      			,
      			watch(data){
      			  this.imgs  = data.imgUrl;
      			  this.imgsVisible = true
      			},
      /** video */
      initVideo() {
        let myVideo = this.$refs.video;
        //ontimeupdate
        myVideo.ontimeupdate = function() {myFunction()};
        let _this = this;

        function myFunction() {
          let playTime = myVideo.currentTime
          setTimeout(function () {
            localStorage.setItem("cacheTime", playTime)
          }, 500)
          let time = localStorage.getItem("cacheTime")
          if (playTime - Number(time) > 2) {
            myVideo.currentTime = Number(time)
          } else {
          }
        }
      },

    },
  };
</script>
<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

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
    height: 145px;
    display: block;
  }
</style>
