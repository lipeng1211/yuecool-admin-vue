<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="讲师名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入讲师名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable size="small">
          <el-option label="男" value="0"></el-option>
          <el-option label="女" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择身份" prop="sex">
        <el-select v-model="queryParams.inquiryManagement" placeholder="请选择身份" clearable size="small">
          <el-option label="个人" value="1"></el-option>
          <el-option label="企业" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="认证状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择认证状态" clearable size="small">
          <el-option label="认证中" value="1"></el-option>
          <el-option label="认证失败" value="2"></el-option>
          <el-option label="认证成功" value="3"></el-option>
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
          v-hasPermi="['system:lecturer:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:lecturer:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:lecturer:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:lecturer:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="lecturerList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="userId" />
      <el-table-column label="讲师名称" align="center" prop="name" />
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == 0">男</span>
          <span v-if="scope.row.sex == 1">女</span>
        </template>  
      </el-table-column>
      <el-table-column label="生日" align="center" prop="birthday" />
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template slot-scope="scope">
          <span v-if="scope.row.isRecommend == 1">是</span>
          <span v-if="scope.row.isRecommend == 0">否</span>
        </template>  
      </el-table-column>
      <el-table-column label="个人/企业" align="center" prop="inquiryManagement">
        <template slot-scope="scope">
          <span v-if="scope.row.inquiryManagement == 1">个人</span>
          <span v-if="scope.row.inquiryManagement == 2">企业</span>
        </template>  
      </el-table-column>
      <el-table-column label="认证状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">认证中</span>
          <span v-if="scope.row.status == 2">认证失败</span>
          <span v-if="scope.row.status == 3">认证成功</span>
        </template>  
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:lecturer:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:lecturer:remove']"
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

    <!-- 添加或修改讲师对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="650px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="讲师名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入讲师名称" />
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item label="所属分类" prop="deptId">
              <el-select v-model="form.deptId" placeholder="请选择所属分类">
                <el-option v-for="item in categoryList"  :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item label="用户ID" prop="userId">
              <el-input v-model="form.userId" placeholder="请输入用户ID" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位ID" prop="positionId">
              <el-input v-model="form.positionId" placeholder="请输入职位ID" />
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item label="是否推荐" prop="isRecommend">
              <el-radio-group v-model="form.isRecommend">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区" prop="areaId">
              <el-select v-model="form.areaId" @change="getCity" placeholder="请选择省">
                <el-option v-for="area in provinceData"  :key="area.areaCode" :value="area.areaCode" :label="area.name" />
              </el-select>
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item prop="cityId">
              <el-select v-model="form.cityId" placeholder="请选择市">
                <el-option v-for="area1 in cityData"  :key="area1.areaCode" :value="area1.areaCode" :label="area1.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择身份" prop="inquiryManagement">
              <el-radio-group v-model="form.inquiryManagement">
                <el-radio label="1">个人</el-radio>
                <el-radio label="2">企业</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item label="预约管理" prop="appointmentManagement">
              <el-radio-group v-model="form.appointmentManagement">
                <el-radio label="0">关闭</el-radio>
                <el-radio label="1">开启</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="讲师照片" prop="doctorPhotos">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                :http-request="uploaddoctor"
                :before-upload="beforeAvatarUpload" accept="image/*">
                <img v-if="form.doctorPhotos" :src="form.doctorPhotos" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
         <el-col :span="12" v-if="form.inquiryManagement == 2">
            <el-form-item label="营业执照" prop="qualificationCertificate">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                :http-request="uploadyyzz"
                :before-upload="beforeAvatarUpload" accept="image/*">
                <img v-if="form.qualificationCertificate" :src="form.qualificationCertificate" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证正面" prop="frontOfIdCard">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                :http-request="uploadzmcard"
                :before-upload="beforeAvatarUpload" accept="image/*">
                <img v-if="form.frontOfIdCard" :src="form.frontOfIdCard" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item label="身份证反面" prop="reverseSideOfIdCard">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                :http-request="uploadfmcard"
                :before-upload="beforeAvatarUpload" accept="image/*">
                <img v-if="form.reverseSideOfIdCard" :src="form.reverseSideOfIdCard" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="认证状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio label="1">认证中</el-radio>
              <el-radio label="2">认证失败</el-radio>
              <el-radio label="3">认证成功</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="个人简介" prop="userDesc">
            <el-input type="textarea" v-model="form.userDesc" placeholder="请输入个人简介" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLecturer, getLecturer, delLecturer, addLecturer, updateLecturer, exportLecturer, uploadUrl, listCategory } from "@/api/system/lecturer";
import {selectProvince, selectCity} from "@/api/area/area"
export default {
  name: "Lecturer",
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
      // 讲师表格数据
      lecturerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        hospital: null,
        sex: null,
        birthday: null,
        phone: null,
        userId: null,
        userDesc: null,
        positionId: null,
        beGoodAt: null,
        deptId: null,
        imageText: null,
        imageTextTime: null,
        audio: null,
        audioTime: null,
        video: null,
        videoTime: null,
        responseTime: null,
        prescription: null,
        hospitalLevel: null,
        numberOfPatients: null,
        favorableRate: null,
        isRecommend: null,
        areaId: null,
        cityId: null,
        doctorPhotos: null,
        qualificationCertificate: null,
        frontOfIdCard: null,
        reverseSideOfIdCard: null,
        appointmentManagement: null,
        inquiryManagement: null,
        status: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "请输入讲师名称", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "请选择所属分类", trigger: "blur" },
        ],
        sex: [
          { required: true, message: "请选择性别", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "请输入用户ID", trigger: "blur" },
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' }
        ],
        positionId: [
          { required: true, message: "请输入职位ID", trigger: "blur" },
        ],
        isRecommend: [
          { required: true, message: "请选择是否推荐", trigger: "blur" },
        ],
        areaId: [
          { required: true, message: "请选择省", trigger: "blur" },
        ],
        cityId: [
          { required: true, message: "请选择市", trigger: "blur" },
        ],
        inquiryManagement: [
          { required: true, message: "请选择身份", trigger: "blur" },
        ],
        appointmentManagement: [
          { required: true, message: "请选择预约管理", trigger: "blur" },
        ],
        doctorPhotos: [
          { required: true, message: "请上传讲师照片", trigger: "blur" },
        ],
        qualificationCertificate: [
          { required: true, message: "请上传营业执照", trigger: "blur" },
        ],
        frontOfIdCard: [
          { required: true, message: "请上传身份证正面", trigger: "blur" },
        ],
        reverseSideOfIdCard: [
          { required: true, message: "请上传身份证反面", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择认证状态", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ]
      },
      provinceData:[],
      cityData:[],
      areaData:[],
      uploadPath:"/api/storage/upload",
      categoryList: []
    };
  },
  created() {
    this.getList();
    this.getProvince()
    this.getcateList()
  },
  methods: {
    /** 查询讲师列表 */
    getList() {
      this.loading = true;
      listLecturer(this.queryParams).then(response => {
        this.lecturerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询讲师分类列表 */
    getcateList() {
      this.loading = true;
      listCategory().then(response => {
        this.categoryList = response.rows;
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
        id: null,
        name: null,
        hospital: null,
        sex: '0',
        birthday: null,
        phone: null,
        userId: null,
        userDesc: null,
        positionId: null,
        beGoodAt: null,
        deptId: null,
        imageText: null,
        imageTextTime: null,
        audio: null,
        audioTime: null,
        video: null,
        videoTime: null,
        responseTime: null,
        prescription: null,
        hospitalLevel: null,
        numberOfPatients: null,
        favorableRate: null,
        createTime: null,
        isRecommend: '0',
        areaId: null,
        cityId: null,
        doctorPhotos: null,
        qualificationCertificate: null,
        frontOfIdCard: null,
        reverseSideOfIdCard: null,
        appointmentManagement: '1',
        inquiryManagement: '1',
        status: '1'
      };
      this.resetForm("form");
    },
    // 获取省数据
    getProvince() {
      selectProvince().then(response => {
        this.provinceData = response.data
        this.loading = false
      })
    },
    // 获取市数据
    getCity() {
      this.form.cityId = ''
      selectCity(this.form.areaId).then(response => {
        this.cityData = response.data
        this.loading = false
      })
    },
    // 上传讲师照片
    uploaddoctor(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.doctorPhotos = response.data.imgUrl
      })
    },
    // 上传营业执照
    uploadyyzz(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.qualificationCertificate = response.data.imgUrl
      })
    },
    // 上传身份证正面
    uploadzmcard(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.frontOfIdCard = response.data.imgUrl
      })
    },
    // 上传身份证反面
    uploadfmcard(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.reverseSideOfIdCard = response.data.imgUrl
      })
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
      this.title = "添加讲师";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLecturer(id).then(response => {
        response.data.deptId = Number(response.data.deptId)
        response.data.sex = response.data.sex ? response.data.sex.toString() : '0'
        response.data.isRecommend = response.data.isRecommend ? response.data.isRecommend.toString() : '0'
        response.data.appointmentManagement = response.data.appointmentManagement ? response.data.appointmentManagement.toString() : '1'
        response.data.inquiryManagement = response.data.inquiryManagement ? response.data.inquiryManagement.toString() : '1'
        response.data.status = response.data.status ? response.data.status.toString() : '1'
        this.form = response.data;
        this.open = true;
        this.title = "修改讲师";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLecturer(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addLecturer(this.form).then(response => {
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
          return delLecturer(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有讲师数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLecturer(queryParams);
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
