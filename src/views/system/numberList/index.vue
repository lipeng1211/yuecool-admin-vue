<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="是否使用" prop="whetherToUse">
        <el-select v-model="queryParams.whetherToUse" placeholder="请选择" clearable size="small">
          <el-option label="未使用" value="0" />
          <el-option label="已使用" value="1" />
        </el-select>
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
      <el-form-item label="靓号" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择" clearable size="small" @change="liangCh">
          <el-option label="id靓号" value="1" />
          <el-option label="群靓号" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="categoryId">
        <el-select v-model="queryParams.categoryId" placeholder="请选择分类">
          <el-option v-for="(item,index) in cateList" :key="index" :label="item.name" :value="item.id" />
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
          v-hasPermi="['system:numberList:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:numberList:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:numberList:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:numberList:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="numberListList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="保留号码" align="center" prop="number" />
      <el-table-column label="是否使用" align="center" prop="whetherToUse">
        <template slot-scope="scope">
          <span v-if="scope.row.whetherToUse == 0">未使用</span>
          <span v-if="scope.row.whetherToUse == 1">已使用</span>
        </template>
      </el-table-column>  
      <el-table-column label="分类" align="center" prop="categoryId">
        <template slot-scope="scope">
          {{cateTran(scope.row.categoryId)}}
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="靓号" align="center" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">id靓号</span>
          <span v-if="scope.row.type == 2">群靓号</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:numberList:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:numberList:remove']"
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

    <!-- 添加或修改靓号列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="保留号码" prop="number">
          <el-input v-model="form.number" placeholder="请输入保留号码" />
        </el-form-item>
        <el-form-item label="是否使用" prop="whetherToUse">
          <el-select v-model="form.whetherToUse" placeholder="请选择">
            <el-option label="未使用" :value="0" />
            <el-option label="已使用" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="靓号" prop="type">
          <el-select v-model="form.type" placeholder="请选择" @change="liangCh">
            <el-option label="id靓号" :value="1" />
            <el-option label="群靓号" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId" v-if="cateList.length > 0">
          <el-select v-model="form.categoryId" placeholder="请选择分类">
            <el-option v-for="(item,index) in cateList" :key="index" :label="item.name" :value="item.id" />
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
import { listNumberList, getNumberList, delNumberList, addNumberList, updateNumberList, exportNumberList, shortNumberCategory } from "@/api/system/numberList";

export default {
  name: "NumberList",
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
      // 靓号列表表格数据
      numberListList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        number: null,
        whetherToUse: null,
        categoryId: null,
        money: null,
        type: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      cateList: [],
      lianghList: []
    };
  },
  created() {
    this.lianghao()
    this.getList();
  },
  methods: {
    /** 查询靓号列表列表 */
    getList() {
      this.loading = true;
      listNumberList(this.queryParams).then(response => {
        this.numberListList = response.rows;
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
        number: null,
        createTime: null,
        updateTime: null,
        whetherToUse: null,
        categoryId: null,
        money: null,
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
    cateTran(cid) {
      let cname = ''
      this.lianghList.forEach((item,index) => {
        if (cid == item.id) {
          cname = item.name
        }
      })
      return cname
    },
    // 靓号列表
    lianghao() {
      let params = {
        pageNum: 1,
        pageSize: 1000
      }
      shortNumberCategory(params).then(response => {
        this.lianghList = response.rows
      })
    },
    // 靓号选择
    liangCh(val, index) {
      if (val == '') {
        this.cateList = []
        this.form.categoryId = ''
        this.queryParams.categoryId = ''
        return false
      }
      let params = {
        pageNum: 1,
        pageSize: 1000,
        type: val
      }
      shortNumberCategory(params).then(response => {
        this.cateList = response.rows
        if (index != 1) {
          this.form.categoryId = ''
          this.queryParams.categoryId = ''
        }
      })
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加靓号列表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getNumberList(id).then(response => {
        this.form = response.data;
        this.liangCh(this.form.type, 1)
        this.open = true;
        this.title = "修改靓号列表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNumberList(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addNumberList(this.form).then(response => {
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
          return delNumberList(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有靓号列表数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportNumberList(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
