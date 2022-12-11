<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="标题" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入标题" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="链接地址" prop="addressUrl">
				<el-input v-model="queryParams.addressUrl" placeholder="请输入链接地址" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="图片地址" prop="imgUrl">
				<el-input v-model="queryParams.imgUrl" placeholder="请输入图片地址" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item>
				<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:find:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
					v-hasPermi="['system:find:edit']">修改</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:find:remove']">删除</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:find:export']">导出</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="findList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="id" align="center" prop="id" />
			<el-table-column label="标题" align="center" prop="name" />
			<el-table-column label="链接地址" align="center" prop="addressUrl" />
			<!-- <el-table-column label="图片地址" align="center" prop="imgUrl" /> -->
			<el-table-column label="图片" align="center">
				<template slot-scope="scope">
					<el-image style="width: 100px; height: 100px"  :src="findList[scope.$index].imgUrl" fit="scale-down" @click="watch(scope.row)"></el-image>
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center" prop="remark" />
			<el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:find:edit']">修改</el-button>
					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
						v-hasPermi="['system:find:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改【请填写功能名称】对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="标题" prop="name">
					<el-input v-model="form.name" placeholder="请输入标题" />
				</el-form-item>


				<el-form-item label="上传图片" prop="addressUrl">
					<el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
						:http-request="uploadSectionFile" :on-success="handleAvatarSuccess"
						:before-upload="beforeAvatarUpload">
						<img v-if="imageUrl" :src="imageUrl" class="avatar">
						<i v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>

				<el-form-item label="链接地址" prop="addressUrl">
					<el-input v-model="form.addressUrl" placeholder="请输入链接地址" />
				</el-form-item>
				<el-form-item label="图片地址" prop="imgUrl">
					<el-input v-model="form.imgUrl" disabled placeholder="请输入图片地址" />
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注" />
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
	import {
		listFind,
		getFind,
		delFind,
		addFind,
		updateFind,
		exportFind,
		uploadUrl
	} from "@/api/system/find";
	export default {
		name: "Find",
		data() {
			return {
				 imageUrl: '',
				imgs: "",
				imgsVisible: false,
				uploadPath: "/api/storage/upload",

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
				findList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					name: null,
					addressUrl: null,
					imgUrl: null,
				},
				// 表单参数
				form: {},
				// 表单校验
				rules: {}
			};
		},
		created() {
			this.getList();
			console.log(this.uploadPath)
		},
		methods: {
			/** 查询【请填写功能名称】列表 */
			getList() {
				this.loading = true;
				listFind(this.queryParams).then(response => {
					this.findList = response.rows;
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
					name: null,
					addressUrl: null,
					imgUrl: null,
					remark: null
				};
        this.imageUrl = ''
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
				this.single = selection.length !== 1
				this.multiple = !selection.length
			},
			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
				this.open = true;
				this.title = "添加【请填写功能名称】";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				const id = row.id || this.ids
				getFind(id).then(response => {
					this.form = response.data;
					this.open = true;
					this.title = "修改【请填写功能名称】";
				});
			},
			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						if (this.form.id != null) {
							updateFind(this.form).then(response => {
								if (response.code === 200) {
									this.msgSuccess("修改成功");
									this.open = false;
									this.getList();
								}
							});
						} else {
							addFind(this.form).then(response => {
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
					return delFind(ids);
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
					return exportFind(queryParams);
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

			    this.imageUrl = response.data.imgUrl;
			    this.form.imgUrl = this.imageUrl;
			  });
			},

			handleAvatarSuccess(res, file) {
			  this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
			  const isJPG = file.type === 'image/jpeg';
			  const isPNG = file.type === 'image/png';
			  const isLt2M = file.size / 1024 / 1024 < 4;

			  if (!isLt2M) {
			    this.$message.error('上传头像图片大小不能超过 4MB!');
			  }
			  return isLt2M;
			}
			,
			watch(data){
			  this.imgs  = data.imgUrl;
			  this.imgsVisible = true
			}




		}
	};
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
