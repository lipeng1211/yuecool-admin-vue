<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="450px" label-position="left" class="form">
      <el-form-item label="每天提现额度上限" prop="limitNumberDay">
        <el-input v-model="form.limitNumberDay" placeholder="请输入每天提现额度上限" style="width: 30%" />元
      </el-form-item>
      <el-form-item label="每天提现次数上限" prop="limitCountDay">
        <el-input v-model="form.limitCountDay" placeholder="请输入每天提现次数上限" style="width: 30%"/>次
      </el-form-item>
      <el-form-item label="每笔最大金额" prop="limitNumberMax">
        <el-input v-model="form.limitNumberMax" placeholder="请输入每笔最大金额"style="width: 30%" />元
      </el-form-item>
      <el-form-item label="每笔最小金额" prop="limitNumberMin">
        <el-input v-model="form.limitNumberMin" placeholder="请输入每笔最小金额" style="width: 30%"/>元
      </el-form-item>
      <el-form-item label="每笔超过多少元需要审核" prop="overCheckNumber">
        <el-input v-model="form.overCheckNumber" placeholder="请输入每笔超过多少元需要审核" style="width: 30%"/>元
      </el-form-item>
      <el-form-item label="手续费用 %" prop="fee">
        <el-input v-model="form.fee" placeholder="请输入手续费用 %" style="width: 30%"/>%
      </el-form-item>
      <el-form-item label="是否限制提现时间" prop="isLimitDay"style="width: 80%">
        <el-select v-model="form.isLimitDay" placeholder="请选择">
        <el-option
          v-for="item in isLimitDay"
          :key="item.key"
          :label="item.label"
          :value="item.value">
        </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="每月提现开始时间" prop="startDay" v-if="form.isLimitDay === 1">
        <el-input v-model="form.startDay" placeholder="请输入每月提现开始时间" style="width: 30%"/>日
      </el-form-item>
      <el-form-item label="每月提现结束时间 " prop="endDay" v-if="form.isLimitDay === 1">
        <el-input v-model="form.endDay" placeholder="请输入每月提现结束时间 " style="width: 30%"/>日
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import { listRule, getRule, delRule, addRule, updateRule, exportRule } from "@/api/system/rule";

export default {
  name: "Rule",
  data() {
    return {
      //是否限制
      isLimitDay:[{
       value:0,label:"不限制"
      },{
        value:1,label:"限制"
      }],
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
      // 提现规则表格数据
      ruleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        limitNumberDay: null,
        limitCountDay: null,
        limitNumberMax: null,
        limitNumberMin: null,
        overCheckNumber: null,
        fee: null,
        isLimitDay: null,
        startDay: null,
        endDay: null,
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

    /** 查询提现规则列表 */
    getList() {
      this.loading = true;
      listRule(this.queryParams).then(response => {
        this.form = response.rows[0];
        this.total = response.total;
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
        limitNumberDay: null,
        limitCountDay: null,
        limitNumberMax: null,
        limitNumberMin: null,
        overCheckNumber: null,
        fee: null,
        isLimitDay: null,
        startDay: null,
        endDay: null,
        updateTime: null
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
      this.title = "添加提现规则";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getRule(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改提现规则";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.isLimitDay===1){
            if (this.form.startDay === undefined || this.form.startDay === null || this.form.endDay === undefined || this.form.endDay === null ){
              this.msgError("请填写完成提现起止时间")
              return
            }
          }
          if (this.form.id != null) {
            updateRule(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addRule(this.form).then(response => {
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
          return delRule(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有提现规则数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportRule(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
