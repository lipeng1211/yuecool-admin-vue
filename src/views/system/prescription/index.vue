<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="订单编号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择订单状态" clearable size="small">
          <el-option label="待审核" value="1" />
          <el-option label="待支付" value="2" />
          <el-option label="已完成" value="3" />
          <el-option label="已取消" value="4" />
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
          v-hasPermi="['system:prescription:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:prescription:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:prescription:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:prescription:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="prescriptionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单编号" align="center" prop="orderId" />
      <el-table-column label="收货地址" align="center" prop="addressId" />
      <el-table-column label="处方照片" align="center" prop="imagaUrl">
        <template slot-scope="scope">
          <img :src="scope.row.imagaUrl" width="120" alt="">
        </template>
      </el-table-column>
      <el-table-column label="补充" align="center" prop="supplement" />
      <el-table-column label="病情描述" align="center" prop="desc" />
      <el-table-column label="开药价格" align="center" prop="money" />
      <el-table-column label="订单状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row == '1'">待审核</span>
          <span v-if="scope.row == '2'">待支付</span>
          <span v-if="scope.row == '3'">已完成</span>
          <span v-if="scope.row == '4'">已取消</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:prescription:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:prescription:remove']"
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

    <!-- 添加或修改按药开方对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="收货地址" prop="addressId">
          <el-input v-model="form.addressId" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="补充" prop="supplement">
          <el-input v-model="form.supplement" placeholder="请输入补充" />
        </el-form-item>
        <el-form-item label="开药价格" prop="money">
          <el-input v-model="form.money" placeholder="请输入开药价格" />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="1">待审核</el-radio>
            <el-radio label="2">待支付</el-radio>
            <el-radio label="3">已完成</el-radio>
            <el-radio label="4">已取消</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处方照片" prop="imagaUrl">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
        						:http-request="uploadblimg" :on-success="handleAvatarSuccess"
        						:before-upload="beforeAvatarUpload" accept="image/*">
        						<img v-if="form.imagaUrl" :src="form.imagaUrl" class="avatar">
        						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
        	    </el-upload>
        </el-form-item>
        <el-form-item label="病情描述" prop="desc">
          <el-input type="textarea" v-model="form.desc" placeholder="请输入病情描述" />
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
import { listPrescription, getPrescription, delPrescription, addPrescription, updatePrescription, exportPrescription, uploadUrl } from "@/api/system/prescription";

export default {
  name: "Prescription",
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
      // 按药开方表格数据
      prescriptionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        desc: null,
        addressId: null,
        imagaUrl: null,
        supplement: null,
        deleted: null,
        orderId: null,
        money: null,
        status: null,
        userId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        addressId: [
          { required: true, message: "请输入收货地址", trigger: "blur" },
        ],
        supplement: [
          { required: true, message: "请输入补充", trigger: "blur" },
        ],
        money: [
          { required: true, message: "请输入开药价格", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择订单状态", trigger: "change" },
        ],
        imagaUrl: [
          { required: true, message: "请上传处方照片", trigger: "blur" },
        ],
        desc: [
          { required: true, message: "请输入病情描述", trigger: "blur" },
        ]
      },
      uploadPath:"/api/storage/upload"
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询按药开方列表 */
    getList() {
      this.loading = true;
      listPrescription(this.queryParams).then(response => {
        this.prescriptionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 上传病例照片
    uploadblimg(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.imagaUrl = response.data.imgUrl
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        desc: null,
        addressId: null,
        imagaUrl: null,
        supplement: null,
        deleted: null,
        createTime: null,
        orderId: null,
        money: null,
        status: "0",
        userId: null
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
      this.title = "添加按药开方";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getPrescription(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改按药开方";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePrescription(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addPrescription(this.form).then(response => {
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
          return delPrescription(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有按药开方数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPrescription(queryParams);
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
