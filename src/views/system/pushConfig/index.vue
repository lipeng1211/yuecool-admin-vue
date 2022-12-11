<template>
  <div class="app-container">
  <!--
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="1表示开启推送、0表示关闭推送" prop="pushOpen">
        <el-input
          v-model="queryParams.pushOpen"
          placeholder="请输入1表示开启推送、0表示关闭推送"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推送模式：0表示开发环境下的APNs推送、1 表示生产环境下的APNs推送，设置" prop="pushMode">
        <el-input
          v-model="queryParams.pushMode"
          placeholder="请输入推送模式：0表示开发环境下的APNs推送、1 表示生产环境下的APNs推送，设置"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用于开发环境的APNs推送证书(本配置项请使用严格的绝对路径)" prop="pushCerPathDev">
        <el-input
          v-model="queryParams.pushCerPathDev"
          placeholder="请输入用于开发环境的APNs推送证书(本配置项请使用严格的绝对路径)"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="生产环境" prop="pushCerPathDistribution">
        <el-input
          v-model="queryParams.pushCerPathDistribution"
          placeholder="请输入生产环境"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="APNs推送证书密码" prop="pushCerPassword">
        <el-input
          v-model="queryParams.pushCerPassword"
          placeholder="请输入APNs推送证书密码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="你的iOS客户端的Boundle Identifier" prop="pushMyIosAppBundleId">
        <el-input
          v-model="queryParams.pushMyIosAppBundleId"
          placeholder="请输入你的iOS客户端的Boundle Identifier"
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
  -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:config:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:config:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:config:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:config:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="你的iOS客户端的Boundle Identifier" align="center" prop="id" />
      <el-table-column label="是否推送" align="center" prop="pushOpen">
        <template slot-scope="scope">
          <span v-if="scope.row.pushOpen == 1">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="推送模式" align="center" prop="pushMode">
        <template slot-scope="scope">
          <span v-if="scope.row.pushMode == 1">生产环境下的APNs推送</span>
          <span v-else>开发环境下的APNs推送</span>
        </template>
      </el-table-column>
      <el-table-column label="用于开发环境的APNs推送证书(本配置项请使用严格的绝对路径)" align="center" prop="pushCerPathDev" />
      <el-table-column label="生产环境" align="center" prop="pushCerPathDistribution" />
      <el-table-column label="APNs推送证书密码" align="center" prop="pushCerPassword" />
      <el-table-column label="你的iOS客户端的Boundle Identifier" align="center" prop="pushMyIosAppBundleId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:config:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
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

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="是否开启推送" prop="pushOpen">
          <el-input v-model="form.pushOpen" placeholder="请输入1表示开启推送、0表示关闭推送" />
        </el-form-item>
        <el-form-item label="推送模式" prop="pushMode">
          <el-input v-model="form.pushMode" placeholder="请输入推送模式：0表示开发环境下的APNs推送、1 表示生产环境下的APNs推送，设置" />
        </el-form-item>
				<el-form-item label="用于开发环境的APNs推送证书" prop="pushCerPathDev">
					<el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
						:http-request="uploadSectionFile" :on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
						<img v-if="fileUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-input v-model="form.pushCerPathDev" placeholder="请输入用于开发环境的APNs推送证书(本配置项请使用严格的绝对路径)" />
					</el-upload>
				</el-form-item>
				<el-form-item label="用于生产环境的APNs推送证书" prop="pushCerPathDistribution">
					<el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
						:http-request="uploadSectionFile_1" :on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
						<img v-if="fileUrl_1" :src="imageUrl_1" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <el-input v-model="form.pushCerPathDistribution" placeholder="请输入用于开发环境的APNs推送证书(本配置项请使用严格的绝对路径)" />
					</el-upload>
				</el-form-item>
        <el-form-item label="APNs推送证书密码" prop="pushCerPassword">
          <el-input v-model="form.pushCerPassword" placeholder="请输入APNs推送证书密码" />
        </el-form-item>
        <el-form-item label="你的iOS客户端的Boundle Identifier" prop="pushMyIosAppBundleId">
          <el-input v-model="form.pushMyIosAppBundleId" placeholder="请输入你的iOS客户端的Boundle Identifier" />
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
import { listConfig, getConfig, delConfig, addConfig, updateConfig, exportConfig } from "@/api/system/pushConfig";
	import {
		uploadUrl
	} from "@/api/system/find";

export default {
  name: "Config",
  data() {
    return {
      fileUrl: "",
      fileUrl_1: "",
      imageUrl: "",
      imageUrl_1: "",
			uploadPath: "/api/storage/upload",
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
      // 【请填写功能名称】表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pushOpen: null,
        pushMode: null,
        pushCerPathDev: null,
        pushCerPathDistribution: null,
        pushCerPassword: null,
        pushMyIosAppBundleId: null
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
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then(response => {
        this.configList = response.rows;
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
        pushOpen: null,
        pushMode: null,
        pushCerPathDev: null,
        pushCerPathDistribution: null,
        pushCerPassword: null,
        pushMyIosAppBundleId: null
      };
      this.fileUrl = "";
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
      this.title = "添加【请填写功能名称】";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改【请填写功能名称】";
      });
    },
    //开发环境证书上传
    uploadSectionFile(param) {
      console.log(param);
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      uploadUrl(form, this.uploadPath).then(response => {
        this.fileUrl = response.data.path;
        this.imageUrl = response.data.imgUrl;
        this.form.pushCerPathDev = this.fileUrl
      });
    },
    //生产环境证书上传
    uploadSectionFile_1(param) {
      console.log(param);
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      uploadUrl(form, this.uploadPath).then(response => {
        this.fileUrl_1 = response.data.path;
        this.imageUrl_1 = response.data.imgUrl;
        this.form.pushCerPathDistribution = this.fileUrl_1
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addConfig(this.form).then(response => {
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
          return delConfig(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有【请填写功能名称】数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportConfig(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>