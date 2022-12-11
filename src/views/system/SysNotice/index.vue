<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input
          v-model="queryParams.desc"
          placeholder="请输入描述"
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
          v-hasPermi="['system:SysNotice:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:SysNotice:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:SysNotice:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:SysNotice:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="SysNoticeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="Id" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="描述" align="center" prop="desc" />
      <el-table-column label="内容" align="center" prop="content" />
      <el-table-column label="操作" align="center" prop="isTop"  >
        <template slot-scope="scope">
        <el-button type="success" @click="systemNotification(scope.row)" v-if="scope.row.isTop != 1">发送系统通知</el-button>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:SysNotice:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:SysNotice:remove']"
            v-if="scope.row.isTop != 1"
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

    <!-- 添加或修改公告对话框 -->
<!--    //    <el-dialog :title="title" :visible.sync="open" width="1000px" >-->
    <el-dialog :title="title" :visible.sync="open" width="500px" zIndex="1"  :close-on-click-modal="false" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="请输入描述" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content"   :init="editorInit" append-to-body/>
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
  listSysNotice,
  getSysNotice,
  delSysNotice,
  addSysNotice,
  updateSysNotice,
  exportSysNotice,
  sendOutSysNotice
} from '@/api/system/SysNotice'
import Editor from '@tinymce/tinymce-vue';
import { uploadUrl } from '@/api/article/articleInfo'

export default {
  name: "SysNotice",
  components: { Editor },
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
      // 公告表格数据
      SysNoticeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否删除字典
      deletedOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        desc: null,
        content: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
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
    this.getDicts("sys_yes_no").then(response => {
      this.deletedOptions = response.data;
    });
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listSysNotice(this.queryParams).then(response => {
        this.SysNoticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 是否删除字典翻译
    deletedFormat(row, column) {
      return this.selectDictLabel(this.deletedOptions, row.deleted);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        desc: null,
        content: null,
        createTime: null,
        updateTime: null,
        deleted: null
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
      this.title = "添加公告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSysNotice(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSysNotice(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addSysNotice(this.form).then(response => {
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
          return delSysNotice(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有公告数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportSysNotice(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    systemNotification(row){
      const systemNotification =  Object.assign({}, row)
      console.info(this.form);
      this.$confirm('是否确认发送系统通知?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        sendOutSysNotice(systemNotification).then(response => {
          if (response.code === 200) {
            this.msgSuccess("发送系统通知成功");
          }
        });
      }).then(() => {
        this.getList();
        this.msgSuccess("发送系统通知成功");
      }).catch(function() {
        // this.msgSuccess("发送系统通知失败");
      });


    }
  }
};
</script>
