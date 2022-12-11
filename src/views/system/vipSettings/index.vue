<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="隐藏id" prop="hideId">
        <el-select v-model="queryParams.hideId" placeholder="请选择隐藏id" clearable size="small">
          <el-option
            v-for="dict in hideIdOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="隐藏上线时间  0显示 1隐藏" prop="hideTime">
        <el-select v-model="queryParams.hideTime" placeholder="请选择隐藏上线时间  0显示 1隐藏" clearable size="small">
          <el-option
            v-for="dict in hideTimeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消息已读" prop="hideMessageRead">
        <el-select v-model="queryParams.hideMessageRead" placeholder="请选择消息已读" clearable size="small">
          <el-option
            v-for="dict in hideMessageReadOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="客服 " prop="customerService">
        <el-select v-model="queryParams.customerService" placeholder="请选择客服 " clearable size="small">
          <el-option
            v-for="dict in customerServiceOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="广告过滤" prop="advertisingFiltering">
        <el-select v-model="queryParams.advertisingFiltering" placeholder="请选择广告过滤" clearable size="small">
          <el-option
            v-for="dict in advertisingFilteringOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="高速通道 " prop="highSpeedChannel">
        <el-select v-model="queryParams.highSpeedChannel" placeholder="请选择高速通道 " clearable size="small">
          <el-option
            v-for="dict in highSpeedChannelOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
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
          v-hasPermi="['system:vipSettings:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:vipSettings:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:vipSettings:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:vipSettings:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vipSettingsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户id" align="center" prop="userId" />
      <el-table-column label="隐藏id" align="center" prop="hideId" :formatter="hideIdFormat" />
      <el-table-column label="隐藏上线时间  0显示 1隐藏" align="center" prop="hideTime" :formatter="hideTimeFormat" />
      <el-table-column label="消息已读" align="center" prop="hideMessageRead" :formatter="hideMessageReadFormat" />
      <el-table-column label="客服 " align="center" prop="customerService" :formatter="customerServiceFormat" />
      <el-table-column label="广告过滤" align="center" prop="advertisingFiltering" :formatter="advertisingFilteringFormat" />
      <el-table-column label="高速通道 " align="center" prop="highSpeedChannel" :formatter="highSpeedChannelFormat" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:vipSettings:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:vipSettings:remove']"
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

    <!-- 添加或修改个人设置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="隐藏id" prop="hideId">
          <el-select v-model="form.hideId" placeholder="请选择隐藏id">
            <el-option
              v-for="dict in hideIdOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="隐藏上线时间  0显示 1隐藏" prop="hideTime">
          <el-select v-model="form.hideTime" placeholder="请选择隐藏上线时间  0显示 1隐藏">
            <el-option
              v-for="dict in hideTimeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="消息已读" prop="hideMessageRead">
          <el-select v-model="form.hideMessageRead" placeholder="请选择消息已读">
            <el-option
              v-for="dict in hideMessageReadOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服 " prop="customerService">
          <el-select v-model="form.customerService" placeholder="请选择客服 ">
            <el-option
              v-for="dict in customerServiceOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告过滤" prop="advertisingFiltering">
          <el-select v-model="form.advertisingFiltering" placeholder="请选择广告过滤">
            <el-option
              v-for="dict in advertisingFilteringOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="高速通道 " prop="highSpeedChannel">
          <el-select v-model="form.highSpeedChannel" placeholder="请选择高速通道 ">
            <el-option
              v-for="dict in highSpeedChannelOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="parseInt(dict.dictValue)"
            ></el-option>
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
import { listVipSettings, getVipSettings, delVipSettings, addVipSettings, updateVipSettings, exportVipSettings } from "@/api/system/vipSettings";

export default {
  name: "VipSettings",
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
      // 个人设置表格数据
      vipSettingsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 隐藏id字典
      hideIdOptions: [],
      // 隐藏上线时间  0显示 1隐藏字典
      hideTimeOptions: [],
      // 消息已读字典
      hideMessageReadOptions: [],
      // 客服 字典
      customerServiceOptions: [],
      // 广告过滤字典
      advertisingFilteringOptions: [],
      // 高速通道 字典
      highSpeedChannelOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        hideId: null,
        hideTime: null,
        hideMessageRead: null,
        customerService: null,
        advertisingFiltering: null,
        highSpeedChannel: null
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
    this.getDicts("lp_vip_yes_no").then(response => {
      this.hideIdOptions = response.data;
    });
    this.getDicts("lp_vip_yes_no").then(response => {
      this.hideTimeOptions = response.data;
    });
    this.getDicts("lp_vip_yes_no").then(response => {
      this.hideMessageReadOptions = response.data;
    });
    this.getDicts("lp_vip_yes_no").then(response => {
      this.customerServiceOptions = response.data;
    });
    this.getDicts("lp_vip_yes_no").then(response => {
      this.advertisingFilteringOptions = response.data;
    });
    this.getDicts("lp_vip_yes_no").then(response => {
      this.highSpeedChannelOptions = response.data;
    });
  },
  methods: {
    /** 查询个人设置列表 */
    getList() {
      this.loading = true;
      listVipSettings(this.queryParams).then(response => {
        this.vipSettingsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 隐藏id字典翻译
    hideIdFormat(row, column) {
      return this.selectDictLabel(this.hideIdOptions, row.hideId);
    },
    // 隐藏上线时间  0显示 1隐藏字典翻译
    hideTimeFormat(row, column) {
      return this.selectDictLabel(this.hideTimeOptions, row.hideTime);
    },
    // 消息已读字典翻译
    hideMessageReadFormat(row, column) {
      return this.selectDictLabel(this.hideMessageReadOptions, row.hideMessageRead);
    },
    // 客服 字典翻译
    customerServiceFormat(row, column) {
      return this.selectDictLabel(this.customerServiceOptions, row.customerService);
    },
    // 广告过滤字典翻译
    advertisingFilteringFormat(row, column) {
      return this.selectDictLabel(this.advertisingFilteringOptions, row.advertisingFiltering);
    },
    // 高速通道 字典翻译
    highSpeedChannelFormat(row, column) {
      return this.selectDictLabel(this.highSpeedChannelOptions, row.highSpeedChannel);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        hideId: null,
        hideTime: null,
        hideMessageRead: null,
        customerService: null,
        advertisingFiltering: null,
        highSpeedChannel: null
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
      this.ids = selection.map(item => item.userId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加个人设置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids
      getVipSettings(userId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改个人设置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != null) {
            updateVipSettings(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addVipSettings(this.form).then(response => {
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
      const userIds = row.userId || this.ids;
      this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delVipSettings(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有个人设置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportVipSettings(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
