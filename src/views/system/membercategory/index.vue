<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="kcfltable">
      <el-table-column label="ID" align="center" prop="deptId" />
      <el-table-column label="项目名称" align="center" prop="name">
        <template slot-scope="scope">
          <span v-if="scope.row.deptId == 1">全站会员32</span>
          <span v-else>{{scope.row.deptName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="月付价格" align="center" prop="yfmoney" />
      <el-table-column label="季付价格" align="center" prop="jfmoney" />
      <el-table-column label="年付价格" align="center" prop="nfmoney" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">正常</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="setmealList(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 查看会员列表 -->
    <el-dialog title="查看会员列表" :visible.sync="memberopen" width="80%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['system:category:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['system:category:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:category:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['system:category:export']"
          >导出</el-button>
        </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table v-loading="loading" :data="categoryList">
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="金额" align="center" prop="money" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:category:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:category:remove']"
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
    </el-dialog>
    <!-- 添加或修改会员分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="会员时长" prop="name">
          <el-select v-model="form.name" placeholder="请选择会员时长">
            <el-option value="月付" label="月付" />
            <el-option value="季付" label="季付" />
            <el-option value="年付" label="年付" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
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
import { listCategory, getCategory, delCategory, addCategory, updateCategory, exportCategory, kcCategory } from "@/api/system/category";

export default {
  name: "Category",
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
      kctotal: 0,
      // 会员分类表格数据
      categoryList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        money: null,
        time: null,
        deleted: null,
        status: null,
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        money: null,
        time: null,
        deleted: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      kcflList: [],
      kcfltable: [],
      tabledata: [],
      memberopen: false
    };
  },
  created() {
    this.getkcList()
  },
  methods: {
    /** 查询会员分类列表 */
    getList() {
      this.loading = true;
      listCategory(this.queryParams).then(response => {
        this.categoryList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询课程列表 */
    getkcList() {
      this.loading = true;
      kcCategory().then(response => {
        // this.kcflList = response.rows;
        response.rows.forEach(element => {
          if (element.parentId == 0 || element.parentId == 1) {
            this.kcflList.push(element)
          }
        });
        this.kctotal = response.total;
        for (let i=0; i<this.kcflList.length; i++) {
          this.getpriceList(this.kcflList[i].deptId, i)
        }
        this.loading = false;
      });
    },
    /** 查询分类价格 */
    getpriceList(id, index) {
      this.loading = true;
      listCategory({categoryId: id}).then(response => {
        response.rows.forEach(item => {
          if (item.name === '月付') {
            this.kcflList[index].yfmoney = item.money
          } else if (item.name === '季付') {
            this.kcflList[index].jfmoney = item.money
          } else {
            this.kcflList[index].nfmoney = item.money
          }
        })
        if (index === this.kcflList.length-1) {
          this.kcfltable = this.kcflList
        }
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
        money: null,
        time: null,
        deleted: null,
        status: 1,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    setmealList(row) {
      this.queryParams.categoryId = row.deptId
      this.getList()
      this.memberopen = true
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
      this.form.categoryId = this.queryParams.categoryId
      this.title = "添加会员分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCategory(id).then(response => {
        this.form = response.data;
        this.form.categoryId = this.queryParams.categoryId
        this.open = true;
        this.title = "修改会员分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCategory(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addCategory(this.form).then(response => {
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
          return delCategory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有会员分类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCategory(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
