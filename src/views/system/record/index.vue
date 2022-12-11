<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="交易单号" prop="tradeNo">
        <el-input
          v-model="queryParams.tradeNo"
          placeholder="请输入交易单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户ID" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label=" 对方用户Id：
 接受转账时 为 转账人的ID，
 发送转账时 为 接受放的 ID" prop="toUserId">
        <el-input
          v-model="queryParams.toUserId"
          placeholder="请输入 对方用户Id：
 接受转账时 为 转账人的ID，
 发送转账时 为 接受放的 ID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="金额" prop="money">
        <el-input
          v-model="queryParams.money"
          placeholder="请输入金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型：1.用户消费" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型：1.用户消费" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="消费备注" prop="descs">
        <el-input
          v-model="queryParams.descs"
          placeholder="请输入消费备注"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label=" 1：支付宝支付 , 2：微信支付, 3：余额支付, 4:系统支付，5，推荐钱包  6商家钱包 7 积分钱包" prop="payType">
        <el-select v-model="queryParams.payType" placeholder="请选择 1：支付宝支付 , 2：微信支付, 3：余额支付, 4:系统支付，5，推荐钱包  6商家钱包 7 积分钱包" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型：
1:用户充值, 2" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择类型：
1:用户充值, 2" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型：
1:用户充值, " prop="redPacketId">
        <el-input
          v-model="queryParams.redPacketId"
          placeholder="请输入类型：
1:用户充值, "
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label=" 1 收入  2支出" prop="changeType">
        <el-select v-model="queryParams.changeType" placeholder="请选择 1 收入  2支出" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="超过一定金额需要后台审核：1.审核成功 ，-1.审核失败" prop="manualPayStatus">
        <el-select v-model="queryParams.manualPayStatus" placeholder="请选择超过一定金额需要后台审核：1.审核成功 ，-1.审核失败" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="手续费" prop="serviceCharge">
        <el-input
          v-model="queryParams.serviceCharge"
          placeholder="请输入手续费"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前余额" prop="currentBalance">
        <el-input
          v-model="queryParams.currentBalance"
          placeholder="请输入当前余额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实际操作金额" prop="operationAmount">
        <el-input
          v-model="queryParams.operationAmount"
          placeholder="请输入实际操作金额"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.time"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="到账时间" prop="timestamp">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.timestamp"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择到账时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商品购买优惠" prop="shopServiceCharge">
        <el-input
          v-model="queryParams.shopServiceCharge"
          placeholder="请输入商品购买优惠"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="积分获得率" prop="integralServiceCharge">
        <el-input
          v-model="queryParams.integralServiceCharge"
          placeholder="请输入积分获得率"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推荐抽成" prop="recommendServiceCharge">
        <el-input
          v-model="queryParams.recommendServiceCharge"
          placeholder="请输入推荐抽成"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="平台回报" prop="systemServiceCharge">
        <el-input
          v-model="queryParams.systemServiceCharge"
          placeholder="请输入平台回报"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微信支付单号" prop="transactionId">
        <el-input
          v-model="queryParams.transactionId"
          placeholder="请输入微信支付单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户订单号" prop="outTradeNo">
        <el-input
          v-model="queryParams.outTradeNo"
          placeholder="请输入商户订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商户订单号" prop="bankCardId">
        <el-input
          v-model="queryParams.bankCardId"
          placeholder="请输入商户订单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="测试" prop="ncountOrderId">
        <el-input
          v-model="queryParams.ncountOrderId"
          placeholder="请输入测试"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="群id" prop="gid">
        <el-input
          v-model="queryParams.gid"
          placeholder="请输入群id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理员红包" prop="administratorRedEnvelope">
        <el-input
          v-model="queryParams.administratorRedEnvelope"
          placeholder="请输入管理员红包"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消费记录状态  0：可用  1：已消费" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="请选择消费记录状态  0：可用  1：已消费" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="逻辑删除" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入逻辑删除"
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
          v-hasPermi="['system:record:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:record:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:record:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:record:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="类型：
id" align="center" prop="id" />
      <el-table-column label="交易单号" align="center" prop="tradeNo" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label=" 对方用户Id：
 接受转账时 为 转账人的ID，
 发送转账时 为 接受放的 ID" align="center" prop="toUserId" />
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="类型：1.用户消费" align="center" prop="type" />
      <el-table-column label="消费备注" align="center" prop="descs" />
      <el-table-column label=" 1：支付宝支付 , 2：微信支付, 3：余额支付, 4:系统支付，5，推荐钱包  6商家钱包 7 积分钱包" align="center" prop="payType" />
      <el-table-column label="类型：
1:用户充值, 2" align="center" prop="status" />
      <el-table-column label="类型：
1:用户充值, " align="center" prop="redPacketId" />
      <el-table-column label=" 1 收入  2支出" align="center" prop="changeType" />
      <el-table-column label="超过一定金额需要后台审核：1.审核成功 ，-1.审核失败" align="center" prop="manualPayStatus" />
      <el-table-column label="手续费" align="center" prop="serviceCharge" />
      <el-table-column label="当前余额" align="center" prop="currentBalance" />
      <el-table-column label="实际操作金额" align="center" prop="operationAmount" />
      <el-table-column label="时间" align="center" prop="time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到账时间" align="center" prop="timestamp" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.timestamp, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品购买优惠" align="center" prop="shopServiceCharge" />
      <el-table-column label="积分获得率" align="center" prop="integralServiceCharge" />
      <el-table-column label="推荐抽成" align="center" prop="recommendServiceCharge" />
      <el-table-column label="平台回报" align="center" prop="systemServiceCharge" />
      <el-table-column label="微信支付单号" align="center" prop="transactionId" />
      <el-table-column label="商户订单号" align="center" prop="outTradeNo" />
      <el-table-column label="商户订单号" align="center" prop="bankCardId" />
      <el-table-column label="测试" align="center" prop="ncountOrderId" />
      <el-table-column label="群id" align="center" prop="gid" />
      <el-table-column label="管理员红包" align="center" prop="administratorRedEnvelope" />
      <el-table-column label="消费记录状态  0：可用  1：已消费" align="center" prop="recordStatus" />
      <el-table-column label="逻辑删除" align="center" prop="deleted" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:record:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:record:remove']"
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

    <!-- 添加或修改消费记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="交易单号" prop="tradeNo">
          <el-input v-model="form.tradeNo" placeholder="请输入交易单号" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label=" 对方用户Id：
 接受转账时 为 转账人的ID，
 发送转账时 为 接受放的 ID" prop="toUserId">
          <el-input v-model="form.toUserId" placeholder="请输入 对方用户Id：
 接受转账时 为 转账人的ID，
 发送转账时 为 接受放的 ID" />
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="类型：1.用户消费" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型：1.用户消费">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="消费备注" prop="descs">
          <el-input v-model="form.descs" placeholder="请输入消费备注" />
        </el-form-item>
        <el-form-item label=" 1：支付宝支付 , 2：微信支付, 3：余额支付, 4:系统支付，5，推荐钱包  6商家钱包 7 积分钱包" prop="payType">
          <el-select v-model="form.payType" placeholder="请选择 1：支付宝支付 , 2：微信支付, 3：余额支付, 4:系统支付，5，推荐钱包  6商家钱包 7 积分钱包">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型：
1:用户充值, 2">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型：
1:用户充值, " prop="redPacketId">
          <el-input v-model="form.redPacketId" placeholder="请输入类型：
1:用户充值, " />
        </el-form-item>
        <el-form-item label=" 1 收入  2支出" prop="changeType">
          <el-select v-model="form.changeType" placeholder="请选择 1 收入  2支出">
            <el-option label="请选择字典生成" value="" />
          </el-select>
        </el-form-item>
        <el-form-item label="超过一定金额需要后台审核：1.审核成功 ，-1.审核失败">
          <el-radio-group v-model="form.manualPayStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手续费" prop="serviceCharge">
          <el-input v-model="form.serviceCharge" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="当前余额" prop="currentBalance">
          <el-input v-model="form.currentBalance" placeholder="请输入当前余额" />
        </el-form-item>
        <el-form-item label="实际操作金额" prop="operationAmount">
          <el-input v-model="form.operationAmount" placeholder="请输入实际操作金额" />
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="到账时间" prop="timestamp">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.timestamp"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择到账时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="商品购买优惠" prop="shopServiceCharge">
          <el-input v-model="form.shopServiceCharge" placeholder="请输入商品购买优惠" />
        </el-form-item>
        <el-form-item label="积分获得率" prop="integralServiceCharge">
          <el-input v-model="form.integralServiceCharge" placeholder="请输入积分获得率" />
        </el-form-item>
        <el-form-item label="推荐抽成" prop="recommendServiceCharge">
          <el-input v-model="form.recommendServiceCharge" placeholder="请输入推荐抽成" />
        </el-form-item>
        <el-form-item label="平台回报" prop="systemServiceCharge">
          <el-input v-model="form.systemServiceCharge" placeholder="请输入平台回报" />
        </el-form-item>
        <el-form-item label="微信支付单号" prop="transactionId">
          <el-input v-model="form.transactionId" placeholder="请输入微信支付单号" />
        </el-form-item>
        <el-form-item label="商户订单号" prop="outTradeNo">
          <el-input v-model="form.outTradeNo" placeholder="请输入商户订单号" />
        </el-form-item>
        <el-form-item label="商户订单号" prop="bankCardId">
          <el-input v-model="form.bankCardId" placeholder="请输入商户订单号" />
        </el-form-item>
        <el-form-item label="测试" prop="ncountOrderId">
          <el-input v-model="form.ncountOrderId" placeholder="请输入测试" />
        </el-form-item>
        <el-form-item label="群id" prop="gid">
          <el-input v-model="form.gid" placeholder="请输入群id" />
        </el-form-item>
        <el-form-item label="管理员红包" prop="administratorRedEnvelope">
          <el-input v-model="form.administratorRedEnvelope" placeholder="请输入管理员红包" />
        </el-form-item>
        <el-form-item label="消费记录状态  0：可用  1：已消费">
          <el-radio-group v-model="form.recordStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入逻辑删除" />
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
import { listRecord, getRecord, delRecord, addRecord, updateRecord, exportRecord } from "@/api/system/record";

export default {
  name: "Record",
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
      // 消费记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tradeNo: null,
        userId: null,
        toUserId: null,
        money: null,
        type: null,
        descs: null,
        payType: null,
        status: null,
        redPacketId: null,
        changeType: null,
        manualPayStatus: null,
        serviceCharge: null,
        currentBalance: null,
        operationAmount: null,
        time: null,
        timestamp: null,
        shopServiceCharge: null,
        integralServiceCharge: null,
        recommendServiceCharge: null,
        systemServiceCharge: null,
        transactionId: null,
        outTradeNo: null,
        bankCardId: null,
        ncountOrderId: null,
        gid: null,
        administratorRedEnvelope: null,
        recordStatus: null,
        deleted: null
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
    /** 查询消费记录列表 */
    getList() {
      this.loading = true;
      listRecord(this.queryParams).then(response => {
        this.recordList = response.rows;
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
        tradeNo: null,
        userId: null,
        toUserId: null,
        money: null,
        type: null,
        descs: null,
        payType: null,
        status: 0,
        redPacketId: null,
        changeType: null,
        manualPayStatus: 0,
        serviceCharge: null,
        currentBalance: null,
        operationAmount: null,
        time: null,
        timestamp: null,
        shopServiceCharge: null,
        integralServiceCharge: null,
        recommendServiceCharge: null,
        systemServiceCharge: null,
        transactionId: null,
        outTradeNo: null,
        bankCardId: null,
        ncountOrderId: null,
        gid: null,
        administratorRedEnvelope: null,
        recordStatus: 0,
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
      this.title = "添加消费记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRecord(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改消费记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRecord(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRecord(this.form).then(response => {
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
          return delRecord(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有消费记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRecord(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
