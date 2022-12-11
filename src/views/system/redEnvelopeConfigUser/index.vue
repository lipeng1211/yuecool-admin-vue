<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="包数" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入包数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="雷数" prop="lieutenantGeneralNumber">
        <el-input
          v-model="queryParams.lieutenantGeneralNumber"
          placeholder="请输入雷数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1单雷 2连环雷" prop="numType">
        <el-select v-model="queryParams.numType" placeholder="请选择1单雷 2连环雷" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="金额1" prop="amountOne">
        <el-input
          v-model="queryParams.amountOne"
          placeholder="请输入金额1"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额2" prop="amountTwo">
        <el-input
          v-model="queryParams.amountTwo"
          placeholder="请输入金额2"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额3" prop="amountThree">
        <el-input
          v-model="queryParams.amountThree"
          placeholder="请输入金额3"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额4" prop="amountFour">
        <el-input
          v-model="queryParams.amountFour"
          placeholder="请输入金额4"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额5" prop="amountFive">
        <el-input
          v-model="queryParams.amountFive"
          placeholder="请输入金额5"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额1中奖率" prop="winningRateOne">
        <el-input
          v-model="queryParams.winningRateOne"
          placeholder="请输入金额1中奖率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额2中奖率" prop="winningRateTwo">
        <el-input
          v-model="queryParams.winningRateTwo"
          placeholder="请输入金额2中奖率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额3中奖率" prop="winningRateThree">
        <el-input
          v-model="queryParams.winningRateThree"
          placeholder="请输入金额3中奖率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额4中奖率" prop="winningRateFour">
        <el-input
          v-model="queryParams.winningRateFour"
          placeholder="请输入金额4中奖率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额5中奖率" prop="winningRateFive">
        <el-input
          v-model="queryParams.winningRateFive"
          placeholder="请输入金额5中奖率"
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
          v-hasPermi="['system:redEnvelopeConfigUser:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:redEnvelopeConfigUser:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:redEnvelopeConfigUser:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:redEnvelopeConfigUser:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="redEnvelopeConfigUserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="包数" align="center" prop="num" />
      <el-table-column label="雷数" align="center" prop="lieutenantGeneralNumber" />
      <el-table-column label="1单雷 2连环雷" align="center" prop="numType" />
      <el-table-column label="金额1" align="center" prop="amountOne" />
      <el-table-column label="金额2" align="center" prop="amountTwo" />
      <el-table-column label="金额3" align="center" prop="amountThree" />
      <el-table-column label="金额4" align="center" prop="amountFour" />
      <el-table-column label="金额5" align="center" prop="amountFive" />
      <el-table-column label="金额1中奖率" align="center" prop="winningRateOne" />
      <el-table-column label="金额2中奖率" align="center" prop="winningRateTwo" />
      <el-table-column label="金额3中奖率" align="center" prop="winningRateThree" />
      <el-table-column label="金额4中奖率" align="center" prop="winningRateFour" />
      <el-table-column label="金额5中奖率" align="center" prop="winningRateFive" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:redEnvelopeConfigUser:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:redEnvelopeConfigUser:remove']"
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

    <!-- 添加或修改红包个人配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="包数" prop="num">
          <el-input v-model="form.num" placeholder="请输入包数" />
        </el-form-item>
        <el-form-item label="雷数" prop="lieutenantGeneralNumber">
          <el-input v-model="form.lieutenantGeneralNumber" placeholder="请输入雷数" />
        </el-form-item>
        <el-form-item label="1单雷 2连环雷" prop="numType">
          <el-select v-model="form.numType" placeholder="请选择1单雷 2连环雷">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额1" prop="amountOne">
          <el-input v-model="form.amountOne" placeholder="请输入金额1" />
        </el-form-item>
        <el-form-item label="金额2" prop="amountTwo">
          <el-input v-model="form.amountTwo" placeholder="请输入金额2" />
        </el-form-item>
        <el-form-item label="金额3" prop="amountThree">
          <el-input v-model="form.amountThree" placeholder="请输入金额3" />
        </el-form-item>
        <el-form-item label="金额4" prop="amountFour">
          <el-input v-model="form.amountFour" placeholder="请输入金额4" />
        </el-form-item>
        <el-form-item label="金额5" prop="amountFive">
          <el-input v-model="form.amountFive" placeholder="请输入金额5" />
        </el-form-item>
        <el-form-item label="金额1中奖率" prop="winningRateOne">
          <el-input v-model="form.winningRateOne" placeholder="请输入金额1中奖率" />
        </el-form-item>
        <el-form-item label="金额2中奖率" prop="winningRateTwo">
          <el-input v-model="form.winningRateTwo" placeholder="请输入金额2中奖率" />
        </el-form-item>
        <el-form-item label="金额3中奖率" prop="winningRateThree">
          <el-input v-model="form.winningRateThree" placeholder="请输入金额3中奖率" />
        </el-form-item>
        <el-form-item label="金额4中奖率" prop="winningRateFour">
          <el-input v-model="form.winningRateFour" placeholder="请输入金额4中奖率" />
        </el-form-item>
        <el-form-item label="金额5中奖率" prop="winningRateFive">
          <el-input v-model="form.winningRateFive" placeholder="请输入金额5中奖率" />
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
import { listRedEnvelopeConfigUser, getRedEnvelopeConfigUser, delRedEnvelopeConfigUser, addRedEnvelopeConfigUser, updateRedEnvelopeConfigUser, exportRedEnvelopeConfigUser } from "@/api/system/redEnvelopeConfigUser";

export default {
  name: "RedEnvelopeConfigUser",
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
      // 红包个人配置表格数据
      redEnvelopeConfigUserList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        name: null,
        num: null,
        lieutenantGeneralNumber: null,
        numType: null,
        amountOne: null,
        amountTwo: null,
        amountThree: null,
        amountFour: null,
        amountFive: null,
        winningRateOne: null,
        winningRateTwo: null,
        winningRateThree: null,
        winningRateFour: null,
        winningRateFive: null
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
    /** 查询红包个人配置列表 */
    getList() {
      this.loading = true;
      listRedEnvelopeConfigUser(this.queryParamsV2).then(response => {
        this.redEnvelopeConfigUserList = response.rows;
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
        name: null,
        num: null,
        lieutenantGeneralNumber: null,
        numType: null,
        amountOne: null,
        amountTwo: null,
        amountThree: null,
        amountFour: null,
        amountFive: null,
        winningRateOne: null,
        winningRateTwo: null,
        winningRateThree: null,
        winningRateFour: null,
        winningRateFive: null
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
      this.title = "添加红包个人配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRedEnvelopeConfigUser(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改红包个人配置";
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRedEnvelopeConfigUser(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRedEnvelopeConfigUser(this.form).then(response => {
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
          return delRedEnvelopeConfigUser(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },


    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有红包个人配置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRedEnvelopeConfigUser(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
