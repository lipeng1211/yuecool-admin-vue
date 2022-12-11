<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="内容名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入内容名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="内容类型" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择类型" clearable size="small">
          <el-option label="图文" value="1" />
          <el-option label="音频" value="2" />
          <el-option label="视频" value="3" />
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
          @click="handleAdd(1)"
          v-hasPermi="['system:curriculum:add']"
        >新增图文</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(2)"
          v-hasPermi="['system:curriculum:add']"
        >新增音频</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd(3)"
          v-hasPermi="['system:curriculum:add']"
        >新增视频</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handbatchvideo(2)"
          v-hasPermi="['system:curriculum:add']"
        >批量音频</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handbatchvideo(1)"
          v-hasPermi="['system:curriculum:add']"
        >批量视频</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:curriculum:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:curriculum:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:curriculum:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="curriculumList" @selection-change="handleSelectionChange" class="tableLimit">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="内容id" align="center" prop="id" /> -->
      <el-table-column label="内容名称" align="center" prop="name" />
      <el-table-column label="内容类型" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">图文</span>
          <span v-if="scope.row.status == 2">音频</span>
          <span v-if="scope.row.status == 3">视频</span>
        </template>
      </el-table-column>
      <el-table-column label="所属课程" align="center" prop="curriculumId">
        <template>{{kcrow.name}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:curriculum:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:curriculum:remove']"
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

    <!-- 添加或修改课程内容列对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="内容名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入内容名称" />
        </el-form-item>
        <el-form-item label="是否上架" prop="putOnTheShelf">
          <el-radio-group v-model="form.putOnTheShelf">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row v-if="form.status == 2">
          <el-form-item label="试看音频" prop="freeVideo">
            <el-input v-model="form.freeVideo" placeholder="请上传试看音频" readonly />
            <el-upload class="avatar-upaudio" :action="uploadPath" :show-file-list="false"
                :http-request="uploadfreeaudio" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" accept="audio/*">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="收费音频" prop="payVideo">
            <el-input v-model="form.payVideo" placeholder="请上传收费音频" readonly />
            <el-upload class="avatar-upaudio" :action="uploadPath" :show-file-list="false"
                :http-request="uploadpayaudio" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" accept="audio/*">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row v-if="form.status == 3">
          <el-form-item label="试看视频" prop="freeVideo">
            <el-input v-model="form.freeVideo" placeholder="请上传试看视频" readonly />
            <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                :http-request="uploadfreeaudio" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" accept="video/*">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p style="line-height: 20px; margin: 0;">支持mp4，avi，wmv，mov，flv，rmvb，3gp，m4v，mkv格式；文件最大不超过5G。</p>
          </el-form-item>
          <el-form-item label="收费视频" prop="payVideo">
            <el-input v-model="form.payVideo" placeholder="请上传收费视频" readonly />
            <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                :http-request="uploadpayaudio" :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload" accept="video/*">
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p style="line-height: 20px; margin: 0;">支持mp4，avi，wmv，mov，flv，rmvb，3gp，m4v，mkv格式；文件最大不超过5G。</p>
          </el-form-item>
        </el-row>
        <el-row v-show="form.status == 1">
          <el-col>
            <el-form-item label="试看内容">
              <editor v-model="form.freeVideo" :min-height="192"/>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="收费内容" prop="content">
              <editor v-model="form.content" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="批量上传"
      :visible.sync="dialogvideo"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-upload style="margin-bottom: 15px" class="avatar-upaudio" :action="uploadPath" :show-file-list="false"
        multiple
        :limit="10"
        :file-list="videolist"
        :http-request="uploadbatch"
        :on-change="upbatchange"
        :accept="batchstatus == 1 ? 'video/*' : 'audio/*'">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-table v-loading="loading" :data="videolist" class="tableLimit">
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column :label="batchstatus == 1 ? '视频预览' : '音频预览'" align="center" prop="url">
          <template slot-scope="scope">
            <video v-if="batchstatus == 1" style="width: 150px" :src="scope.row.url" controls></video>
            <audio v-if="batchstatus == 2" style="width: 150px" :src="scope.row.url" controls></audio>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" align="center" prop="name" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="removevideo(scope.$index)"
              v-hasPermi="['system:curriculum:edit']"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-form label-width="80px" style="margin-top: 15px">
        <el-form-item label="是否上架">
          <el-radio-group v-model="midputOnTheShelf">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="upvideoSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCurriculum, getCurriculum, delCurriculum, addCurriculum, updateCurriculum, exportCurriculum, uploadUrl, batchvideo,VideoUploadsByURl } from "@/api/system/curriculum";
import Editor from '@/components/Editor';
import { put,put2 } from '@/api/app'

export default {
  name: "Curriculum",
  components: { Editor },
  props: {
    kcrow: {
      default: {},
      type: Object
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      isUpload: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 课程内容列表格数据
      curriculumList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        orderNum: null,
        status: null,
        layer: null,
        freeVideo: null,
        payVideo: null,
        chargeOrNot: null,
        putOnTheShelf: null,
        content: null,
        chapterId: null,
        curriculumId: null,
        categoryId: null,
        deleted: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "请输入内容名称", trigger: "blur" },
        ],
        chapterId: [
          { required: true, message: "请输入章节id", trigger: "blur" },
        ],
        curriculumId: [
          { required: true, message: "请输入内容id", trigger: "blur" },
        ],
        putOnTheShelf: [
          { required: true, message: "请选择是否上架", trigger: "blur" },
        ],
        payVideo: [
          { required: true, message: "请上传收费音频/视频", trigger: "blur" },
        ],
        content: [
          { required: false, message: "请填写收费内容", trigger: "blur" },
        ]
      },
      addstate: '',
      uploadPath:"/api/storage/upload",
      dialogvideo: false,
      videolist: [],
      midputOnTheShelf: 1,
      batchstatus: '' // 1视频 2音频
    };
  },
  created() {
    localStorage.setItem('userId',this.kcrow.userId)
    this.getList()
  },
  methods: {
    /** 查询课程内容列列表 */
    getList() {
      this.loading = true;
      this.queryParams.curriculumId = this.kcrow.id
      listCurriculum(this.queryParams).then(response => {
        this.curriculumList = response.rows
        this.total = response.total
        this.loading = false
      });
    },
    // 批量上传视频按钮
    handbatchvideo(index) {
      this.batchstatus = index
      this.dialogvideo = true
    },
    // 移除视频
    removevideo(index) {
      this.$confirm('确定移除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.videolist.splice(index, 1)
      })
    },
    // 选择批量上传文件
    uploadbatch(file) {
    console.log("------选择批量上传文件------------")
    },
    upbatchange(file, filelist) {
      filelist.forEach((item) => {
        var URL = null
        if (window.createObjectURL != undefined) {
          URL = window.createObjectURL(item.raw)
        } else if (window.URL != undefined) {
          URL = window.URL.createObjectURL(item.raw)
        } else if (window.webkitURL != undefined) {
          URL = window.webkitURL.createObjectURL(item.raw)
        }
        item.url = URL
      })
      this.videolist = filelist
      console.log(this.videolist)
      console.log("------选择批量上传文件2222222222------------")
    },
    // 批量上传视频提交
    upvideoSubmit() {

      let url = '/api/storage/VideoUploadsByURl'
      if (this.videolist.length == 0) {
        this.$message.error('请选择上传文件！')
        return false
      }

      this.$loading({
        lock: true,
        text: "文件上传中，请耐心等待",
        spinner: "el-icon-loading",
        background: "rgba(219,218,218,0.7)"
      });

      this.videolist.forEach((item) => {
        // fd.append('multipartFiles', item.raw) // 因为要上传多个文件，所以需要遍历一下才行 不要直接使用我们的文件数组进行上传，你会发现传给后台的是Object
        console.log("------选择批量上传文件111111111111111------------"+item.raw)
        const that = this;
        put(item.raw).then(response => {
          console.info("这是回调的1111")
          console.info(response.name)
          console.info()
          let fd = new FormData
          fd.append('userId', this.kcrow.userId)
          fd.append('status', this.batchstatus == 1 ? 3 : 2)
          fd.append('curriculumId', this.kcrow.id)
          fd.append('categoryId', this.kcrow.categoryId)
          fd.append('chargeOrNotId', 0)
          fd.append('putOnTheShelf', this.midputOnTheShelf)
          fd.append('url', response.url)
          fd.append('urlName', item.raw.name)
          VideoUploadsByURl(fd, url).then((res) => {
            this.dialogvideo = false
            this.msgSuccess("上传成功！")
            // this.$loading().close();
            this.videolist = []
            this.getList()
          })

          console.info("这是回调的1111")
          // this.imageUrl = response.data[0].url;
          // this.form.imgUrl = this.imageUrl
        });


        console.log("------选择批量上传文件2222222222------------"+item.raw)
      })
      this.dialogvideo = false
      this.videolist = []
      console.info("执行到这里了嘛")

      this.$loading().close();

      this.isUpload = false;

      console.log("")
    },
    // 批量上传音频按钮
    handbatchaudio() {

    },
    // 移除音频
    removeaudio(index, rows) {
      rows.splice(index, 1)
    },
    // 上传试看音频/视频
    uploadfreeaudio(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.freeVideo = response.data.imgUrl
      })
    },
    // 上传付费音频/视频
    uploadpayaudio(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)

      put(fileObj).then(response => {
        console.info("这是回调的1111")
        console.info(response)
        console.info()
        this.form.payVideo =  response.url
        console.info("这是回调的1111")
        // this.imageUrl = response.data[0].url;
        // this.form.imgUrl = this.imageUrl
      });

      //   uploadUrl(form, this.uploadPath).then(response => {
      //   this.form.payVideo = response.data.imgUrl
      // })
    },
    handleAvatarSuccess(res, file) {

    },
    // 上传前
    beforeAvatarUpload(file) {

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
        name: null,
        orderNum: null,
        status: this.addstate,
        layer: null,
        freeVideo: null,
        payVideo: null,
        putOnTheShelf: 1,
        chargeOrNot: null,
        content: null,
        chapterId: null,
        curriculumId: null,
        categoryId: null,
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
    handleAdd(index) {
      this.addstate = index
      this.reset();
      this.open = true;
      this.title = "添加课程内容列";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCurriculum(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改课程内容列";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCurriculum(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            this.form.curriculumId = this.kcrow.id
            addCurriculum(this.form).then(response => {
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
          return delCurriculum(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有课程内容列数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCurriculum(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .tableLimit tr td .cell{
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;      /*可以显示的行数，超出部分用...表示 */
    -webkit-box-orient: vertical;
  }
  .avatar-upaudio{
    width: 100px;
    margin-top: 10px;
  }
  .avatar-uploader{
    margin-top: 10px;
  }
</style>
