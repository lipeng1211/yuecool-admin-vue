<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="医师名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入医师名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属医院" prop="hospital">
        <el-input
          v-model="queryParams.hospital"
          placeholder="请输入所属医院"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="0:男 1：女" prop="sex">
        <el-select v-model="queryParams.sex" placeholder="请选择0:男 1：女" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-input
          v-model="queryParams.birthday"
          placeholder="请输入生日"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="简介" prop="userDesc">
        <el-input
          v-model="queryParams.userDesc"
          placeholder="请输入简介"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="职位id" prop="positionId">
        <el-input
          v-model="queryParams.positionId"
          placeholder="请输入职位id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="擅长" prop="beGoodAt">
        <el-input
          v-model="queryParams.beGoodAt"
          placeholder="请输入擅长"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="科室id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入科室id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图文收费" prop="imageText">
        <el-input
          v-model="queryParams.imageText"
          placeholder="请输入图文收费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图文收费" prop="imageTextTime">
        <el-input
          v-model="queryParams.imageTextTime"
          placeholder="请输入图文收费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="音频收费" prop="audio">
        <el-input
          v-model="queryParams.audio"
          placeholder="请输入音频收费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="音频收费" prop="audioTime">
        <el-input
          v-model="queryParams.audioTime"
          placeholder="请输入音频收费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频收费" prop="video">
        <el-input
          v-model="queryParams.video"
          placeholder="请输入视频收费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="视频收费" prop="videoTime">
        <el-input
          v-model="queryParams.videoTime"
          placeholder="请输入视频收费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="响应时间" prop="responseTime">
        <el-input
          v-model="queryParams.responseTime"
          placeholder="请输入响应时间"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否开方" prop="prescription">
        <el-input
          v-model="queryParams.prescription"
          placeholder="请输入是否开方"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医院等级" prop="hospitalLevel">
        <el-input
          v-model="queryParams.hospitalLevel"
          placeholder="请输入医院等级"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="接诊人数" prop="numberOfPatients">
        <el-input
          v-model="queryParams.numberOfPatients"
          placeholder="请输入接诊人数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="好评率" prop="favorableRate">
        <el-input
          v-model="queryParams.favorableRate"
          placeholder="请输入好评率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否推荐医师" prop="isRecommend">
        <el-input
          v-model="queryParams.isRecommend"
          placeholder="请输入是否推荐医师"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区id" prop="areaId">
        <el-input
          v-model="queryParams.areaId"
          placeholder="请输入地区id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区id 市" prop="cityId">
        <el-input
          v-model="queryParams.cityId"
          placeholder="请输入地区id 市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医生照片" prop="doctorPhotos">
        <el-input
          v-model="queryParams.doctorPhotos"
          placeholder="请输入医生照片"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资格证书" prop="qualificationCertificate">
        <el-input
          v-model="queryParams.qualificationCertificate"
          placeholder="请输入资格证书"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证正面" prop="frontOfIdCard">
        <el-input
          v-model="queryParams.frontOfIdCard"
          placeholder="请输入身份证正面"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证反面" prop="reverseSideOfIdCard">
        <el-input
          v-model="queryParams.reverseSideOfIdCard"
          placeholder="请输入身份证反面"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约管理 0关闭 1：开启" prop="appointmentManagement">
        <el-input
          v-model="queryParams.appointmentManagement"
          placeholder="请输入预约管理 0关闭 1：开启"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="问诊管理 0关闭 1：开启" prop="inquiryManagement">
        <el-input
          v-model="queryParams.inquiryManagement"
          placeholder="请输入问诊管理 0关闭 1：开启"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="医生状态1： 认证中  2认证失败 3 认证成功" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择医生状态1： 认证中  2认证失败 3 认证成功" clearable size="small">
          <el-option label="请选择字典生成" value="" />
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
          v-hasPermi="['system:doctor:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:doctor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:doctor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:doctor:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="doctorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="医生状态1： 认证中  2认证失败 3 认证成功" align="center" prop="id" />
      <el-table-column label="医师名称" align="center" prop="name" />
      <el-table-column label="所属医院" align="center" prop="hospital" />
      <el-table-column label="0:男 1：女" align="center" prop="sex" />
      <el-table-column label="生日" align="center" prop="birthday" />
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="简介" align="center" prop="userDesc" />
      <el-table-column label="职位id" align="center" prop="positionId" />
      <el-table-column label="擅长" align="center" prop="beGoodAt" />
      <el-table-column label="科室id" align="center" prop="deptId" />
      <el-table-column label="图文收费" align="center" prop="imageText" />
      <el-table-column label="图文收费" align="center" prop="imageTextTime" />
      <el-table-column label="音频收费" align="center" prop="audio" />
      <el-table-column label="音频收费" align="center" prop="audioTime" />
      <el-table-column label="视频收费" align="center" prop="video" />
      <el-table-column label="视频收费" align="center" prop="videoTime" />
      <el-table-column label="响应时间" align="center" prop="responseTime" />
      <el-table-column label="是否开方" align="center" prop="prescription" />
      <el-table-column label="医院等级" align="center" prop="hospitalLevel" />
      <el-table-column label="接诊人数" align="center" prop="numberOfPatients" />
      <el-table-column label="好评率" align="center" prop="favorableRate" />
      <el-table-column label="是否推荐医师" align="center" prop="isRecommend" />
      <el-table-column label="地区id" align="center" prop="areaId" />
      <el-table-column label="地区id 市" align="center" prop="cityId" />
      <el-table-column label="医生照片" align="center" prop="doctorPhotos" />
      <el-table-column label="资格证书" align="center" prop="qualificationCertificate" />
      <el-table-column label="身份证正面" align="center" prop="frontOfIdCard" />
      <el-table-column label="身份证反面" align="center" prop="reverseSideOfIdCard" />
      <el-table-column label="预约管理 0关闭 1：开启" align="center" prop="appointmentManagement" />
      <el-table-column label="问诊管理 0关闭 1：开启" align="center" prop="inquiryManagement" />
      <el-table-column label="医生状态1： 认证中  2认证失败 3 认证成功" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:doctor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:doctor:remove']"
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

    <!-- 添加或修改医生信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="医师名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入医师名称" />
        </el-form-item>
        <el-form-item label="所属医院" prop="hospital">
          <el-input v-model="form.hospital" placeholder="请输入所属医院" />
        </el-form-item>
        <el-form-item label="0:男 1：女" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择0:男 1：女">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-input v-model="form.birthday" placeholder="请输入生日" />
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="简介" prop="userDesc">
          <el-input v-model="form.userDesc" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="职位id" prop="positionId">
          <el-input v-model="form.positionId" placeholder="请输入职位id" />
        </el-form-item>
        <el-form-item label="擅长" prop="beGoodAt">
          <el-input v-model="form.beGoodAt" placeholder="请输入擅长" />
        </el-form-item>
        <el-form-item label="科室id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入科室id" />
        </el-form-item>
        <el-form-item label="图文收费" prop="imageText">
          <el-input v-model="form.imageText" placeholder="请输入图文收费" />
        </el-form-item>
        <el-form-item label="图文收费" prop="imageTextTime">
          <el-input v-model="form.imageTextTime" placeholder="请输入图文收费" />
        </el-form-item>
        <el-form-item label="音频收费" prop="audio">
          <el-input v-model="form.audio" placeholder="请输入音频收费" />
        </el-form-item>
        <el-form-item label="音频收费" prop="audioTime">
          <el-input v-model="form.audioTime" placeholder="请输入音频收费" />
        </el-form-item>
        <el-form-item label="视频收费" prop="video">
          <el-input v-model="form.video" placeholder="请输入视频收费" />
        </el-form-item>
        <el-form-item label="视频收费" prop="videoTime">
          <el-input v-model="form.videoTime" placeholder="请输入视频收费" />
        </el-form-item>
        <el-form-item label="响应时间" prop="responseTime">
          <el-input v-model="form.responseTime" placeholder="请输入响应时间" />
        </el-form-item>
        <el-form-item label="是否开方" prop="prescription">
          <el-input v-model="form.prescription" placeholder="请输入是否开方" />
        </el-form-item>
        <el-form-item label="医院等级" prop="hospitalLevel">
          <el-input v-model="form.hospitalLevel" placeholder="请输入医院等级" />
        </el-form-item>
        <el-form-item label="接诊人数" prop="numberOfPatients">
          <el-input v-model="form.numberOfPatients" placeholder="请输入接诊人数" />
        </el-form-item>
        <el-form-item label="好评率" prop="favorableRate">
          <el-input v-model="form.favorableRate" placeholder="请输入好评率" />
        </el-form-item>
        <el-form-item label="是否推荐医师" prop="isRecommend">
          <el-input v-model="form.isRecommend" placeholder="请输入是否推荐医师" />
        </el-form-item>
        <el-form-item label="地区id" prop="areaId">
          <el-input v-model="form.areaId" placeholder="请输入地区id" />
        </el-form-item>
        <el-form-item label="地区id 市" prop="cityId">
          <el-input v-model="form.cityId" placeholder="请输入地区id 市" />
        </el-form-item>
        <el-form-item label="医生照片" prop="doctorPhotos">
          <el-input v-model="form.doctorPhotos" placeholder="请输入医生照片" />
        </el-form-item>
        <el-form-item label="资格证书" prop="qualificationCertificate">
          <el-input v-model="form.qualificationCertificate" placeholder="请输入资格证书" />
        </el-form-item>
        <el-form-item label="身份证正面" prop="frontOfIdCard">
          <el-input v-model="form.frontOfIdCard" placeholder="请输入身份证正面" />
        </el-form-item>
        <el-form-item label="身份证反面" prop="reverseSideOfIdCard">
          <el-input v-model="form.reverseSideOfIdCard" placeholder="请输入身份证反面" />
        </el-form-item>
        <el-form-item label="预约管理 0关闭 1：开启" prop="appointmentManagement">
          <el-input v-model="form.appointmentManagement" placeholder="请输入预约管理 0关闭 1：开启" />
        </el-form-item>
        <el-form-item label="问诊管理 0关闭 1：开启" prop="inquiryManagement">
          <el-input v-model="form.inquiryManagement" placeholder="请输入问诊管理 0关闭 1：开启" />
        </el-form-item>
        <el-form-item label="医生状态1： 认证中  2认证失败 3 认证成功">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
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
import { listDoctor, getDoctor, delDoctor, addDoctor, updateDoctor, exportDoctor } from "@/api/system/doctor";

export default {
  name: "Doctor",
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
      // 医生信息表格数据
      doctorList: [],
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
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询医生信息列表 */
    getList() {
      this.loading = true;
      listDoctor(this.queryParams).then(response => {
        this.doctorList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        createTime: null,
        isRecommend: null,
        areaId: null,
        cityId: null,
        doctorPhotos: null,
        qualificationCertificate: null,
        frontOfIdCard: null,
        reverseSideOfIdCard: null,
        appointmentManagement: null,
        inquiryManagement: null,
        status: "0"
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
      this.title = "添加医生信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDoctor(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改医生信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDoctor(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addDoctor(this.form).then(response => {
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
          return delDoctor(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有医生信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDoctor(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
