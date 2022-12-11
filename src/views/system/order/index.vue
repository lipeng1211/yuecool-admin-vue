<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="消费者id" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          placeholder="请输入消费者id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消费者名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入消费者名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否可抢 0：否  1：是" prop="isMugged">
        <el-input
          v-model="queryParams.isMugged"
          placeholder="请输入是否可抢 0：否  1：是"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主播id" prop="anchorId">
        <el-input
          v-model="queryParams.anchorId"
          placeholder="请输入主播id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态 0:创建 1：通话中 2: 已完成" prop="orderStatus">
        <el-select v-model="queryParams.orderStatus" placeholder="请选择订单状态 0:创建 1：通话中 2: 已完成" clearable size="small">
          <el-option label="请选择字典生成" value="" />
        </el-select>
      </el-form-item>
      <el-form-item label="消费者经度" prop="customerLot">
        <el-input
          v-model="queryParams.customerLot"
          placeholder="请输入消费者经度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消费者纬度" prop="customerLat">
        <el-input
          v-model="queryParams.customerLat"
          placeholder="请输入消费者纬度"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消费者头像地址" prop="customerAvatar">
        <el-input
          v-model="queryParams.customerAvatar"
          placeholder="请输入消费者头像地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主播分类id" prop="lqCategory">
        <el-input
          v-model="queryParams.lqCategory"
          placeholder="请输入主播分类id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加时间" prop="addTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.addTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择添加时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="逻辑删除 0：否 1： 是" prop="deleted">
        <el-input
          v-model="queryParams.deleted"
          placeholder="请输入逻辑删除 0：否 1： 是"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通话开始时间" prop="callBeginTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.callBeginTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择通话开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="通话结束时间" prop="callEndTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.callEndTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择通话结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="token" prop="token">
        <el-input
          v-model="queryParams.token"
          placeholder="请输入token"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="1:匹配 2单聊" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择1:匹配 2单聊" clearable size="small">
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
          v-hasPermi="['system:order:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:order:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="消费者id" align="center" prop="customerId" />
      <el-table-column label="消费者名称" align="center" prop="customerName" />
      <el-table-column label="是否可抢 0：否  1：是" align="center" prop="isMugged" />
      <el-table-column label="主播id" align="center" prop="anchorId" />
      <el-table-column label="订单状态 0:创建 1：通话中 2: 已完成" align="center" prop="orderStatus" />
      <el-table-column label="消费者经度" align="center" prop="customerLot" />
      <el-table-column label="消费者纬度" align="center" prop="customerLat" />
      <el-table-column label="消费者头像地址" align="center" prop="customerAvatar" />
      <el-table-column label="主播分类id" align="center" prop="lqCategory" />
      <el-table-column label="添加时间" align="center" prop="addTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="逻辑删除 0：否 1： 是" align="center" prop="deleted" />
      <el-table-column label="通话开始时间" align="center" prop="callBeginTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.callBeginTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="通话结束时间" align="center" prop="callEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.callEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="token" align="center" prop="token" />
      <el-table-column label="1:匹配 2单聊" align="center" prop="type" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:order:remove']"
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

    <!-- 添加或修改伊语订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="消费者id" prop="customerId">
          <el-input v-model="form.customerId" placeholder="请输入消费者id" />
        </el-form-item>
        <el-form-item label="消费者名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入消费者名称" />
        </el-form-item>
        <el-form-item label="是否可抢 0：否  1：是" prop="isMugged">
          <el-input v-model="form.isMugged" placeholder="请输入是否可抢 0：否  1：是" />
        </el-form-item>
        <el-form-item label="主播id" prop="anchorId">
          <el-input v-model="form.anchorId" placeholder="请输入主播id" />
        </el-form-item>
        <el-form-item label="订单状态 0:创建 1：通话中 2: 已完成">
          <el-radio-group v-model="form.orderStatus">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消费者经度" prop="customerLot">
          <el-input v-model="form.customerLot" placeholder="请输入消费者经度" />
        </el-form-item>
        <el-form-item label="消费者纬度" prop="customerLat">
          <el-input v-model="form.customerLat" placeholder="请输入消费者纬度" />
        </el-form-item>
        <el-form-item label="消费者头像地址" prop="customerAvatar">
          <el-input v-model="form.customerAvatar" placeholder="请输入消费者头像地址" />
        </el-form-item>
        <el-form-item label="主播分类id" prop="lqCategory">
          <el-input v-model="form.lqCategory" placeholder="请输入主播分类id" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.addTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="逻辑删除 0：否 1： 是" prop="deleted">
          <el-input v-model="form.deleted" placeholder="请输入逻辑删除 0：否 1： 是" />
        </el-form-item>
        <el-form-item label="通话开始时间" prop="callBeginTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.callBeginTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择通话开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="通话结束时间" prop="callEndTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.callEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择通话结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="token" prop="token">
          <el-input v-model="form.token" placeholder="请输入token" />
        </el-form-item>
        <el-form-item label="1:匹配 2单聊" prop="type">
          <el-select v-model="form.type" placeholder="请选择1:匹配 2单聊">
            <el-option label="请选择字典生成" value="" />
          </el-select>
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder, exportOrder } from "@/api/system/order";

export default {
  name: "Order",
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
      // 伊语订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        customerId: null,
        customerName: null,
        isMugged: null,
        anchorId: null,
        orderStatus: null,
        customerLot: null,
        customerLat: null,
        customerAvatar: null,
        lqCategory: null,
        addTime: null,
        deleted: null,
        callBeginTime: null,
        callEndTime: null,
        token: null,
        type: null
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
    /** 查询伊语订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
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
        customerId: null,
        customerName: null,
        isMugged: null,
        anchorId: null,
        orderStatus: 0,
        customerLot: null,
        customerLat: null,
        customerAvatar: null,
        lqCategory: null,
        addTime: null,
        updateTime: null,
        deleted: null,
        callBeginTime: null,
        callEndTime: null,
        token: null,
        type: null
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
      this.title = "添加伊语订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改伊语订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addOrder(this.form).then(response => {
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
          return delOrder(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有伊语订单数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportOrder(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
