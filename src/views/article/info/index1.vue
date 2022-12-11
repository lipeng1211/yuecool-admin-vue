<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="queryParams.category" placeholder="资讯分类" clearable size="small" style="width: 240px">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['group:group:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['group:group:edit']">修改</el-button>
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
      <el-table-column label="文章名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="来源" align="center" prop="keywords" :show-overflow-tooltip="true" />
      <el-table-column label="文章简介" align="center" prop="brief" />
      <el-table-column label="发布时间" align="center" prop="addTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="370">
        <template slot-scope="scope">

          <el-button v-if="scope.row.isTop == 1" size="small" type="primary" plain class="input"
            @click="isTop(scope.row,0)">取消推荐</el-button>
          <el-button v-else size="small" type="primary" plain class="input" @click="isTop(scope.row,1)">推荐</el-button>
          <el-button size="small" type="primary" plain class="input" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button plain size="small" type="primary" class="input" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" zIndex="1"  :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="来源" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="form.brief" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="资讯分类" clearable size="small" style="width: 240px">
            <el-option v-for="dict in statusOptions" :key="dict.dictValue+1" :label="dict.dictLabel"
              :value="dict.dictValue" v-if="dict.dictValue != 0" />
          </el-select>
        </el-form-item>
        <el-form-item label="上传图片" prop="picUrl">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
            :http-request="uploadSectionFile" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
            accept="image/*">
            <img v-if="form.picUrl" :src="form.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详细介绍">
          <editor v-model="form.detail" :init="editorInit" append-to-body />
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
  } from "@/api/article/articleInfo";
  import Editor from '@tinymce/tinymce-vue'
  export default {
    name: "article1",
    components: {
      Editor
    },
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
        imgs: "",
        imgsVisible: false,
        uploadPath: "/api/storage/upload",

        // 是否显示弹出层
        open: false,
        // 状态字典
        statusOptions: [{
          dictLabel: '推荐',
          dictValue: 0
        }, {
          dictLabel: '头条',
          dictValue: 1
        }, {
          dictLabel: '牛人解盘',
          dictValue: 2
        }, {
          dictLabel: '实战干货',
          dictValue: 3
        }, {
          dictLabel: '基金学院',
          dictValue: 4
        }, {
          dictLabel: '服务',
          dictValue: 5
        }],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          addressUrl: null,
          imgUrl: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        editorInit: {
          language: 'zh_CN',
          height: 500,
          convert_urls: false,
          selector: 'textarea',
          deprecation_warnings: false,
          plugins: [
            'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
          ],
          toolbar: [
            'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
            'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
          ],
          images_upload_handler: function(blobInfo, success, failure) {
            const formData = new FormData()
            formData.append('file', blobInfo.blob())
            console.log(blobInfo.filename())
            let url = "/api/storage/upload";
            uploadUrl(formData, url).then(res => {
              success(res.data.imgUrl)
            }).catch(() => {
              failure('上传失败，请重新上传')
            })
          },
          file_picker_types: 'media',
          file_picker_callback: (callback, value, meta)=> {
            if(meta.filetype == 'media'){
              let input = document.createElement('input');//创建一个隐藏的input
              input.setAttribute('type', 'file');
              let that = this;
              input.onchange = function(){
                let file = this.files[0];//选取第一个文件
                console.log(file);
                const formData = new FormData()
                formData.append('file', file)
                // meta('上传失败，请重新上传')
                let url = "/api/storage/upload";
                uploadUrl(formData, url).then(res => {
                  console.log(res)
                  callback(res.data.imgUrl, { title: res.data.imgUrl }) //将url显示在弹框输入框中
                  // success()
                }).catch((data) => {
                  console.log(data)
                  // failure('上传失败，请重新上传')
                })

                // uploadUrl(that.qiniuToken, file, 'video'); // 上传视频拿到url

                // if(that.uploaded){

                // }else{
                //   setTimeout(()=>{
                //     callback(that.resVideo, { title: file.name })
                //   },2000)
                // }
              }
              //触发点击
              input.click();
            }
          }
        }
      };
    },
    created() {
      this.getList();
      this.getDicts("article_category").then(response => {
        this.statusOptions = response.data;
      });

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
          category: null,
          keywords: null,
          brief: null,
          addTime: null,
          detail: '',
          isTop: null
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
          this.imgUrl = this.form.picUrl;
          this.form.addTime = '';
          this.open = true;
          this.title = "修改";
        });
      },
      /** 修改按钮操作 */
      isTop(row, istop) {
        row.isTop = istop;
        updateGroup(row).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          }
        });
        console.log(row)
      },
      /** 提交按钮 */
      submitForm() {
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
      // ----


      uploadSectionFile(param) {
        console.log(param);
        let fileObj = param.file;
        let form = new FormData();
        form.append("file", fileObj);
        uploadUrl(form, this.uploadPath).then(response => {
          this.imageUrl = response.data.imgUrl;
          this.form.picUrl = this.imageUrl
        });
      },

      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 4MB!');
        }
        return isLt2M;
      },
      watch(data) {
        this.imgs = data.imgUrl;
        this.imgsVisible = true
      }
      /** 导出按钮操作 */

    }
  };

</script>
<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag+.el-tag {
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
