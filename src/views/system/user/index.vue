<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--科室数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入科室名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="用户名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入用户名称" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable size="small" style="width: 240px" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small" style="width: 240px">
              <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
           <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:user:add']">新增</el-button>
         </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange" class="k_line">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="ID" align="center" prop="userId" />
          <el-table-column label="医生名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="职位名称" align="center" prop="positionId" width="120" />
          <el-table-column label="医生简介" align="center" prop="userDesc" :show-overflow-tooltip="true" />
          <el-table-column label="擅长介绍" align="center" prop="beGoodAt" :show-overflow-tooltip="true" />
          <el-table-column label="是否推荐" align="center" prop="status" width="120" >
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">认证中</span>
              <span v-if="scope.row.status == 2">认证失败</span>
              <span v-if="scope.row.status == 3">认证成功</span>
            </template>
          </el-table-column>
          <el-table-column label="是否开方" align="center" prop="prescription" width="120" >
            <template slot-scope="scope">
              <span v-if="scope.row.prescription == 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="是否推荐" align="center" prop="isRecommend" width="120" >
            <template slot-scope="scope">
              <span v-if="scope.row.isRecommend == 1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:user:edit']">修改</el-button>
              <el-button v-if="scope.row.userId !== 1" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:user:remove']">删除</el-button>
<!--              <el-button size="mini" type="text" icon="el-icon-key" @click="handleResetPwd(scope.row)" v-hasPermi="['system:user:resetPwd']">重置</el-button>-->
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="height: 700px; overflow-y: auto">
        <el-row>
          <el-col :span="24">
<!--            <el-form-item label="归属科室" prop="deptId">-->
<!--              <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属科室" />-->
<!--            </el-form-item>-->

            <el-form-item label="归属科室" prop="deptId">
              <treeselect
                :multiple="true"
                :options="deptOptions"
                v-model="value"
                @select="select"
                @deselect="deselect"
                @close="close"

              />
              <!--          <treeselect-value :value="value" />-->

            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否开方">

              <el-select v-model="form.prescription" placeholder="医生是否能开药方">
                <el-option v-for="dict in prescriptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否推荐">
              <el-select v-model="form.isRecommend" placeholder="请选择是否推荐">
                <el-option v-for="dict in isRecommendOptions" :key="dict.dictValue" :label="dict.dictLabel"
                           :value="dict.dictValue"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="医生名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入医生名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker type="date" placeholder="请选择出生日期" v-model="form.birthday" style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="职位" prop="positionId">
              <el-input v-model="form.positionId" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="就职医院" prop="hospital">
              <el-input v-model="form.hospital" placeholder="请输入就职医院" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option label="男" value="0"></el-option>
                <el-option label="女" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="好评率" prop="favorableRate">
              <el-input v-model="form.favorableRate" placeholder="请输入好评率" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="图文收费" prop="imageText">
              <el-input v-model="form.imageText" placeholder="请输入图文收费" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="音频收费" prop="audio">
              <el-input v-model="form.audio" placeholder="请输入音频收费" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="视频收费" prop="video">
              <el-input v-model="form.video" placeholder="请输入视频收费" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="接诊人数" prop="numberOfPatients">
              <el-input v-model="form.numberOfPatients" placeholder="请输入接诊人数" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="地区" prop="">
              <el-select v-model="form.areaId" @change="getCity" placeholder="请选择省">
                <el-option v-for="area in provinceData"  :key="area.areaCode" :value="area.areaCode" :label="area.name" />
              </el-select>
            </el-form-item>
          </el-col>
         <el-col :span="12">
            <el-form-item prop="">
              <el-select v-model="form.cityId" placeholder="请选择市">
                <el-option v-for="area1 in cityData"  :key="area1.areaCode" :value="area1.areaCode" :label="area1.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="医生照片" prop="doctorPhotos">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        						:http-request="uploaddoctor" :on-success="handleAvatarSuccess"
        						:before-upload="beforeAvatarUpload" accept="image/*">
        						<img v-if="form.doctorPhotos" :src="form.doctorPhotos" class="avatar">
        						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资格证书" prop="qualificationCertificate">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        						:http-request="uploadzgezs" :on-success="handleAvatarSuccess"
        						:before-upload="beforeAvatarUpload" accept="image/*">
        						<img v-if="form.qualificationCertificate" :src="form.qualificationCertificate" class="avatar">
        						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份正面" prop="frontOfIdCard">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        						:http-request="uploadzmCard" :on-success="handleAvatarSuccess"
        						:before-upload="beforeAvatarUpload" accept="image/*">
        						<img v-if="form.frontOfIdCard" :src="form.frontOfIdCard" class="avatar">
        						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份反面" prop="reverseSideOfIdCard">
              <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        						:http-request="uploadfmCard" :on-success="handleAvatarSuccess"
        						:before-upload="beforeAvatarUpload" accept="image/*">
        						<img v-if="form.reverseSideOfIdCard" :src="form.reverseSideOfIdCard" class="avatar">
        						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户简介">
              <el-input v-model="form.userDesc" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="擅长">
              <el-input v-model="form.beGoodAt" type="textarea" placeholder="请输入内容"></el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body :close-on-click-modal="false">
      <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers" :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate,
  uploadUrl
} from "@/api/system/user";

import {listArea, getArea, delArea, addArea, updateArea, exportArea, selectProvince, selectCity}
  from "@/api/area/area";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: { Treeselect },
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
      selectClassEnd:"NONE",
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      city1: undefined,
      city2: undefined,
      city3: undefined,
      // 科室树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      value: [],
      areaId: [],
      // 科室名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 用户状态字典
      prescriptions: [],
      // 用户状态字典
      isRecommendOptions: [],
      provinceData:[],
      cityData:[],
      areaData:[],
      uploadPath:"/api/storage/upload",
      // 用户状态字典
      areaList: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        areaId: undefined,
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' }
        ],
        hospital: [
          { required: true, message: "请输入就职医院", trigger: "blur" },
        ],
        sex: [
          { required: true, message: "请选择性别", trigger: "blur" },
        ],
        positionId: [
          { required: true, message: "职位不能为空", trigger: "blur" },
        ],
        deptId: [
          { required: true, message: "归属科室不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
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
    };
  },
  watch: {
    // 根据名称筛选科室树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then((response) => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });

    this.getDicts("prescription").then(response => {
      this.prescriptions = response.data;
    });

    this.getDicts("is_recommend").then(response => {
      this.isRecommendOptions = response.data;
    });

  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询科室下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
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
        userId: undefined,
        deptId: undefined,
        birthday: undefined,
        name: undefined,
        nickname: undefined,
        hospital: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        status: "1",
        remark: undefined,
        areaId: undefined,
        cityId: undefined,
        doctorPhotos: undefined,
        qualificationCertificate: undefined,
        frontOfIdCard: undefined,
        reverseSideOfIdCard: undefined,
        postIds: [],
        roleIds: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 上传医生照片
    uploaddoctor(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.doctorPhotos = response.data.imgUrl
      })
    },
    // 上传资格证书
    uploadzgezs(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.qualificationCertificate = response.data.imgUrl
      })
    },
    // 上传身份正面
    uploadzmCard(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.frontOfIdCard = response.data.imgUrl
      })
    },
    // 上传身份反面
    uploadfmCard(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.reverseSideOfIdCard = response.data.imgUrl
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getTreeselect()
      this.open = true
      this.title = "添加用户"
      this.getProvince()
      this.form.password = this.initPassword;
      // getUser(this.ids).then((response) => {
      //   this.postOptions = response.posts;
      //   this.roleOptions = response.roles;
      //   this.open = true;
      //   this.title = "添加用户";
      //   this.form.password = this.initPassword;
      // });
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
      if (!this.form.areaId) {
        return false
      }
      selectCity(this.form.areaId).then(response => {
        this.cityData = response.data
        this.loading = false
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      let userId = row.id || this.ids
      getUser(userId).then((response) => {
        this.form = response.data
        this.getProvince()
        this.getCity()
        this.postOptions = response.posts
        this.roleOptions = response.roles
        this.form.postIds = response.postIds
        this.form.roleIds = response.roleIds
        this.open = true;
        this.title = "修改用户";
        this.value = [];
        if (this.form.deptId != null){
          let deptIds = this.form.deptId.split(",")
          for (let i = 0; i < deptIds.length; i++) {
            this.value[i] = parseInt(deptIds[i])
          }
          if (this.value.length > 0){
            this. showRentPrise = true
          }
        }
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功，新密码是：" + value);
            }
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.form.deptId = 1;
      this.form.balance = null;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addUser(this.form).then((response) => {
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
      const userIds = row.id || this.ids;
      this.$confirm(
        '是否确认删除用户编号为"' + userIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportUser(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },

  select(node, instanceId){
    // console.log(this.value)
    // console.log(this.value.length)
    // console.log(node.id)
    // console.log("ddddddddddddddddd")
  }

  ,
  deselect(node, instanceId){
    // console.log(this.value)
    // console.log(this.value.length)
    // console.log(node.id)
    // console.log("ddddddddddddddddd")
  }
  ,
  close(node, instanceId){
    if (this.value.length >0){
      this. showRentPrise = true;
    }
    console.log(this.value)
    console.log(this.value.length)
    console.log(node.id)
    console.log("ddddddddddddddddd")
  },

  },
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
