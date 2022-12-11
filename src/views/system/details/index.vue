<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属用户" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入课程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程分类" prop="categoryId">
        <el-select v-model="queryParams.categoryId" placeholder="请选择课程分类" clearable>
          <el-option v-for="(item,index) in categoryList" :key="index" :label="item.deptName" :value="item.deptId" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否推荐" prop="isRecommend">
        <el-select v-model="queryParams.isRecommend" placeholder="请选择是否推荐">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程类型" prop="status">
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
          @click="handleAdd"
          v-hasPermi="['system:details:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:details:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:details:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:details:export']"
        >导出</el-button>
      </el-col>
	    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="detailsList" @selection-change="handleSelectionChange" class="tableLimit">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="课程名称" align="center" prop="name" />
      <el-table-column label="讲师名称" align="center" prop="author" />
      <el-table-column label="课程价格" align="center" prop="presentPrice" />
      <el-table-column label="会员价格" align="center" prop="concessionalPrice" />
      <el-table-column label="封面" align="center" prop="cover">
        <template slot-scope="scope">
          <img width="100" :src="scope.row.cover" alt="">
        </template>  
      </el-table-column>
      <el-table-column label="是否上架" align="center" prop="showOrNot">
        <template slot-scope="scope">
          <span v-if="scope.row.showOrNot == 1">是</span>
          <span v-if="scope.row.showOrNot == 0">否</span>
        </template>  
      </el-table-column>
      <el-table-column label="课程分类" align="center" prop="categoryId">
        <template slot-scope="scope">
          {{getclassitem(scope.row.categoryId)}}
        </template>  
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template slot-scope="scope">
          <span v-if="scope.row.isRecommend == 1">是</span>
          <span v-if="scope.row.isRecommend == 0">否</span>
        </template>  
      </el-table-column>
      <el-table-column label="销量" align="center" prop="salesVolume" />
      <el-table-column label="课程类型" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">图文</span>
          <span v-if="scope.row.status == 2">音频</span>
          <span v-if="scope.row.status == 3">视频</span>
        </template>  
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handlelist(scope.row)"
          >内容列表</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:details:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:details:remove']"
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
    <!-- 添加或修改课程详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属用户" prop="userId">
              <el-input v-model="form.userId" placeholder="请输入用户ID" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入课程名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="讲师名称" prop="author">
              <el-input v-model="form.author" placeholder="请输入讲师名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否上架" prop="showOrNot">
              <el-select v-model="form.showOrNot" placeholder="请选择是否上架">
                <el-option label="上架" value="1" />
                <el-option label="下架" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否收费" prop="chargeOrNot">
              <el-select v-model="form.chargeOrNot" placeholder="请选择是否收费">
                <el-option label="免费" :value="0" />
                <el-option label="收费" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            
          </el-col>
        </el-row>
        <el-row v-if="form.chargeOrNot == 1">
          <el-col :span="12">
            <el-form-item label="课程价格" prop="presentPrice">
              <el-input v-model="form.presentPrice" placeholder="请输入课程价格" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员价格" prop="concessionalPrice">
              <el-input v-model="form.concessionalPrice" placeholder="请输入会员价格" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程分类" prop="categoryId">
              <el-select v-model="form.categoryId" placeholder="请选择课程分类">
                <el-option v-for="(item,index) in categoryList" :key="index" :label="item.deptName" :value="item.deptId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="status">
              <el-select v-model="form.status" placeholder="请选择课程类型">
                <el-option label="图文" :value="1" />
                <el-option label="音频" :value="2" />
                <el-option label="视频" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="课程销量" prop="salesVolume">
              <el-input v-model="form.salesVolume" placeholder="请输入课程销量" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推荐" prop="isRecommend">
              <el-select v-model="form.isRecommend" placeholder="请选择是否推荐">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="封面" prop="cover">
            <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                  :http-request="uploadcover" :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload" accept="image/*">
                  <img v-if="form.cover" :src="form.cover" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="简介内容" prop="content">
            <editor v-model="form.content" :min-height="192"/>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="内容列表" :visible.sync="listopen" width="80%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <centlist v-if="listopen" :kcrow="kcrow"></centlist>
    </el-dialog>
  </div>
</template>

<script>
import { listDetails, getDetails, delDetails, addDetails, updateDetails, exportDetails, uploadUrl, listCategory } from "@/api/system/details";
import Editor from '@/components/Editor';
import centlist from '@/views/system/curriculum/index'

export default {
  name: "Details",
  components: { Editor,centlist },
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
      // 课程详情表格数据
      detailsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      listopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        name: null,
        content: null,
        author: null,
        presentPrice: null,
        concessionalPrice: null,
        chargeOrNot: null,
        cover: null,
        videoIntroduction: null,
        showOrNot: null,
        deleted: null,
        categoryId: null,
        isRecommend: null,
        salesVolume: null,
        status: null
      },
      // 表单参数
      form: {},
      kcrow: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "请输入用户id", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
        ],
        author: [
          { required: true, message: "请输入讲师名称", trigger: "blur" },
        ],
        showOrNot: [
          { required: true, message: "请选择是否上架", trigger: "blur" },
        ],
        chargeOrNot: [
          { required: true, message: "请选择是否收费", trigger: "blur" },
        ],
        presentPrice: [
          { required: true, message: "请输入课程价格", trigger: "blur" },
        ],
        concessionalPrice: [
          { required: true, message: "请输入会员价格", trigger: "blur" },
        ],
        categoryId: [
          { required: true, message: "请选择课程分类", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择课程类型", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "请输入用户id", trigger: "blur" },
        ],
        cover: [
          { required: true, message: "请上传封面", trigger: "blur" },
        ],
        content: [
          { required: true, message: "请输入简介内容", trigger: "blur" },
        ],
      },
      uploadPath:"/api/storage/upload",
      categoryList: []
    };
  },
  created() {
    this.getList();
    this.getclassList()
  },
  methods: {
    /** 查询课程详情列表 */
    getList() {
      this.loading = true;
      listDetails(this.queryParams).then(response => {
        this.detailsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询课程分类列表 */
    getclassList() {
      this.loading = true;
      listCategory().then(response => {
        this.categoryList = response.rows
      });
    },
    getclassitem(id) {
      let name = ''
      this.categoryList.forEach((item,index) => {
        if (item.deptId == id) {
          name = item.deptName
        }
      })
      return name == '' ? id : name
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
        userId: null,
        name: null,
        content: null,
        author: null,
        presentPrice: null,
        concessionalPrice: null,
        chargeOrNot: null,
        cover: null,
        videoIntroduction: null,
        showOrNot: null,
        deleted: null,
        categoryId: null,
        isRecommend: null,
        createTime: null,
        salesVolume: null,
        status: ''
      };
      this.resetForm("form");
    },
    // 上传封面
    uploadcover(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.cover = response.data.imgUrl
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
      this.title = "添加课程详情";
    },
    // 跳转内容列表
    handlelist(row) {
      this.kcrow = row
      this.listopen = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDetails(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改课程详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDetails(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDetails(this.form).then(response => {
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
          return delDetails(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有课程详情数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDetails(queryParams);
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
    -webkit-line-clamp: 3;      /*可以显示的行数，超出部分用...表示 */
    -webkit-box-orient: vertical; 
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
    height: auto;
    display: block;
  }
</style>
