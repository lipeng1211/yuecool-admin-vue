<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文件名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入文件名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="后缀" prop="suffix">
        <el-input
          v-model="queryParams.suffix"
          placeholder="请输入后缀"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
          <el-option label="类型1" value="1" />
          <el-option label="类型2" value="2" />
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
          v-hasPermi="['system:music:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:music:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:music:export']"
        >导出</el-button>
      </el-col>
	    <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="musicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文件真实的名称" align="center" prop="realName" />
      <el-table-column label="文件名" align="center" prop="name" />
      <el-table-column label="后缀" align="center" prop="suffix" />
      <el-table-column label="路径" align="center" prop="path" />
      <el-table-column label="图片" align="center">
      	<template slot-scope="scope">
      		<el-image style="width: 100px; height: 100px"  :src="imageUrl+'/file/image/'+musicList[scope.$index].realName" fit="scale-down" @click="watch(scope.row)"></el-image>
      	</template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">类型1</span>
          <span v-if="scope.row.type == 2">类型2</span>
        </template>  
      </el-table-column>
      <el-table-column label="大小" align="center" prop="size" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:music:remove']"
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

    <!-- 添加或修改本地存储对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

				<el-form-item label="上传音乐" prop="addressUrl">
					<el-upload class="music-uploader" :action="uploadPath" :show-file-list="false"
						:http-request="uploadSectionFile" :on-success="handleMusicSuccess"
						:before-upload="beforeMusicUpload">
						<img v-if="imageUrls" :src="imageUrls" class="music">
						<i v-else class="el-icon-plus music-uploader-icon"></i>
					</el-upload>
				</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="图片查看" :visible.sync="imgsVisible" width="40%" :close-on-click-modal="false">
    	<div style="  display: flex;justify-content: center;">
    		<el-image :src="imgs" fit="scale-down" lazy style="margin: 20px auto;">
    			<div slot="error" class="image-slot">
    				<i class="el-icon-picture-outline"></i>
    			</div>
    		</el-image>
    	</div>
    	<div style=" display: flex;justify-content: center;">
    		<el-button @click="imgsVisible = false" type="primary" style="width: 6vw; ">确 定</el-button>
    	</div>
    </el-dialog>
  </div>
</template>

<script>
import { listMusic, getMusic, delMusic, addMusic, updateMusic, exportMusic ,	uploadUrl,getConfig} from "@/api/system/music";

export default {
  name: "Music",
  data() {
    return {
      imageUrl: '',
      imageUrls: '',
      imgs: "",
      imgsVisible: false,
      uploadPath:"/api/storage/uploadMusic",
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
      // 本地存储表格数据
      musicList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        realName: null,
        name: null,
        suffix: null,
        path: null,
        imgUrl: null,
        type: null,
        size: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList()
    this.getCode()
  },
  methods: {
    /** 查询本地存储列表 */
    getList() {
      this.loading = true;
      listMusic(this.queryParams).then(response => {
        this.musicList = response.rows
        this.total = response.total
        this.loading = false
      });

    },
    getCode() {
      getConfig().then(res => {
        this.imageUrl = res.data.fileUrl
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
        storageId: null,
        realName: null,
        name: null,
        suffix: null,
        path: null,
        imgUrl: null,
        type: null,
        size: null,
        createBy: null,
        updateBy: null,
        createTime: null,
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
      this.ids = selection.map(item => item.storageId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加音乐";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const storageId = row.storageId || this.ids
      getMusic(storageId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改音乐";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.storageId != null) {
            updateMusic(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addMusic(this.form).then(response => {
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
      const storageIds = row.storageId || this.ids;
      this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMusic(storageIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有本地存储数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportMusic(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },

    // ----


    uploadSectionFile(param) {
      console.log(param);
      let fileObj = param.file;
      let form = new FormData();
      form.append("file", fileObj);
      uploadUrl(form, this.uploadPath).then(response => {
                this.open = false;
                this.getList();
      });
    },

    handleMusicSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeMusicUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isPNG = file.type === 'image/png';
      // const isLt2M = file.size / 1024 / 1024 < 4;

      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 4MB!');
      // }
      // return isLt2M;
    }
    ,
    watch(data){
      console.log(this.imageUrl+'/file/image/'+ data.realName)
            console.log(data)
      this.imgs  =this. imageUrl+'/file/image/'+ data.realName;
      this.imgsVisible = true
    }

  }
};
</script>

<style scoped>
.music-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.music-uploader .el-upload:hover {
  border-color: #409EFF;
}

.music-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.music {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
