<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="持卡姓名" prop="yhxingming">
        <el-input
          v-model="queryParams.yhxingming"
          placeholder="请输入持卡人姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行卡号" prop="yinhangkahao">
        <el-input
          v-model="queryParams.yinhangkahao"
          placeholder="请输入银行卡号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="银行名" prop="bankname">
        <el-input
          v-model="queryParams.bankname"
          placeholder="请输入银行名"
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
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:yinhangka:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:yinhangka:edit']"
        >修改</el-button>
      </el-col> -->
      <!-- <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:yinhangka:remove']"
        >删除</el-button>
      </el-col> -->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:yinhangka:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="yinhangkaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <!-- <el-table-column label="用户账号" align="center" prop="usercode" />
      <el-table-column label="手机号" align="center" prop="userphone" /> -->
      <el-table-column label="新生用户ID" align="center" prop="xsuserid" />
      <el-table-column label="持卡人姓名" align="center" prop="yhxingming" />
      <el-table-column label="身份证号" align="center" prop="shenfenzhenghao" />
      <el-table-column label="银行卡号" align="center" prop="yinhangkahao" />
      <el-table-column label="签约手机号" align="center" prop="yhphone" />
      <el-table-column label="签约订单号" align="center" prop="ordercode" />
      <!-- <el-table-column label="银行ID" align="center" prop="bankid" /> -->
      <el-table-column label="银行编码" align="center" prop="bankcode" />
      <!-- <el-table-column label="银行名" align="center" prop="bankname" /> -->
      <el-table-column label="绑卡协议号" align="center" prop="bindcardagrno" />
      <el-table-column label="绑定状态" align="center" prop="state" >
        <template slot-scope="scope">
          <span v-if="scope.row.state == 1">成功绑定</span>
          <span v-if="scope.row.state == 2">绑定失败</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定时间" align="center" prop="createdate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:yinhangka:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:yinhangka:remove']"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="用户账号" prop="usercode">
          <el-input v-model="form.usercode" placeholder="请输入用户账号" />
        </el-form-item>
        <el-form-item label="手机号" prop="userphone">
          <el-input v-model="form.userphone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="新生用户ID" prop="xsuserid">
          <el-input v-model="form.xsuserid" placeholder="请输入新生用户ID" />
        </el-form-item>
        <el-form-item label="持卡人姓名" prop="yhxingming">
          <el-input v-model="form.yhxingming" placeholder="请输入持卡人姓名" />
        </el-form-item>
        <el-form-item label="身份证号" prop="shenfenzhenghao">
          <el-input v-model="form.shenfenzhenghao" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="yinhangkahao">
          <el-input v-model="form.yinhangkahao" placeholder="请输入银行卡号" />
        </el-form-item>
        <el-form-item label="银行签约手机号" prop="yhphone">
          <el-input v-model="form.yhphone" placeholder="请输入银行签约手机号" />
        </el-form-item>
        <el-form-item label="签约订单号" prop="ordercode">
          <el-input v-model="form.ordercode" placeholder="请输入签约订单号" />
        </el-form-item>
        <el-form-item label="银行ID" prop="bankid">
          <el-input v-model="form.bankid" placeholder="请输入银行ID" />
        </el-form-item>
        <el-form-item label="银行编码" prop="bankcode">
          <el-input v-model="form.bankcode" placeholder="请输入银行编码" />
        </el-form-item>
        <el-form-item label="银行名" prop="bankname">
          <el-input v-model="form.bankname" placeholder="请输入银行名" />
        </el-form-item>
        <el-form-item label="绑卡协议号" prop="bindcardagrno">
          <el-input v-model="form.bindcardagrno" placeholder="请输入绑卡协议号" />
        </el-form-item>
        <el-form-item label="绑定状态" prop="state">
          <el-select v-model="form.status" placeholder="请选择绑定状态" clearable size="small">
            <el-option label="成功绑定" :value="1" />
            <el-option label="未绑定成功" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="createdate">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.createdate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择创建时间">
          </el-date-picker>
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
import { listYinhangka, getYinhangka, delYinhangka, addYinhangka, updateYinhangka, exportYinhangka } from "@/api/system/yinhangka";

export default {
  name: "Yinhangka",
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
      // 【请填写功能名称】表格数据
      yinhangkaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        usercode: null,
        userphone: null,
        xsuserid: null,
        yhxingming: null,
        shenfenzhenghao: null,
        yinhangkahao: null,
        yhphone: null,
        ordercode: null,
        bankid: null,
        bankcode: null,
        bankname: null,
        banklogo: null,
        bindcardagrno: null,
        state: null,
        createdate: null,
        updatetime: null
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
      listYinhangka(this.queryParams).then(response => {
        this.yinhangkaList = response.rows;
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
        userId: null,
        usercode: null,
        userphone: null,
        xsuserid: null,
        yhxingming: null,
        shenfenzhenghao: null,
        yinhangkahao: null,
        yhphone: null,
        ordercode: null,
        bankid: null,
        bankcode: null,
        bankname: null,
        banklogo: null,
        bindcardagrno: null,
        state: null,
        createdate: null,
        updatetime: null
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
      this.title = "添加银行卡";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getYinhangka(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改银行卡";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateYinhangka(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addYinhangka(this.form).then(response => {
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
          return delYinhangka(ids);
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
          return exportYinhangka(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
