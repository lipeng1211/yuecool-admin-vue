<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
			<el-form-item label="交易单号" prop="tradeNo">
				<el-input v-model="queryParams.tradeNo" placeholder="请输入交易单号" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="用户Id" prop="userId">
				<el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="金额" prop="money">
				<el-input v-model="queryParams.money" placeholder="请输入金额" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<!-- <el-form-item label="消费类型" prop="type">
				<el-select v-model="queryParams.type" placeholder="请选择类型" clearable size="small">
					<el-option v-for="dict in xiaofeiType" :key="dict.dictValue" :label="dict.dictLabel"
						:value="dict.dictValue" />
				</el-select>
			</el-form-item> 
			<el-form-item label="消费备注" prop="descs">
				<el-input v-model="queryParams.descs" placeholder="请输入消费备注" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item> -->
			<el-form-item label="支付类型" prop="payType">
				<el-select v-model="queryParams.payType" placeholder="请选择支付类型" clearable size="small">
					<el-option v-for="dict in zhifuType" :key="dict.dictValue" :label="dict.dictLabel"
						:value="dict.dictValue" />
				</el-select>
			</el-form-item>
			<el-form-item label="交易状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="请选择交易状态" clearable size="small">
					<!-- <el-option label="请选择字典生成" value="" /> -->
					<el-option v-for="dict in jiaoyiType" :key="dict.dictValue" :label="dict.dictLabel"
						:value="dict.dictValue" />
				</el-select>
			</el-form-item>

			<!-- <el-form-item label="审核状态" prop="manualPayStatus">
				<el-select v-model="queryParams.manualPayStatus" placeholder="请选择审核状态" clearable size="small">
					<el-option v-for="dict in shenheType" :key="dict.dictValue" :label="dict.dictLabel"
						:value="dict.dictValue" />
				</el-select>
			</el-form-item>
			<el-form-item label="手续费" prop="serviceCharge">
				<el-input v-model="queryParams.serviceCharge" placeholder="请输入手续费" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>-->
			<el-form-item label="当前余额" prop="currentBalance">
				<el-input v-model="queryParams.currentBalance" placeholder="请输入当前余额" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="实操金额" prop="operationAmount">
				<el-input v-model="queryParams.operationAmount" placeholder="请输入实际操作金额" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="充值时间" prop="time">
				<el-date-picker clearable size="small" style="width: 200px" v-model="queryParams.time" type="date"
					value-format="yyyy-MM-dd" placeholder="选择时间">
				</el-date-picker>
			</el-form-item>
			<br>
			<el-form-item>
				<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:record:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
					v-hasPermi="['system:record:edit']">修改</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:record:remove']">删除</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:record:export']">导出</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="记录ID" align="center" prop="id" width="100"  :show-overflow-tooltip="true"/>
			<el-table-column label="交易单号" align="center" prop="tradeNo" width="130" :show-overflow-tooltip="true"/>
			<el-table-column label="用户ID" align="center" prop="userId" />
			<el-table-column label="用户昵称" align="center" prop="nickname" />
			<!-- <el-table-column label="对方Id" align="center" prop="toUserId" />-->
			<el-table-column label="充值金额" align="center" prop="money" />
			<!-- <el-table-column label="消费类型" align="center" prop="type">
				<template slot-scope="scope">
					<span v-for="dict in xiaofeiType" :key="dict.dictValue">
						<span style="color:#ff007f" v-if="dict.dictValue*1 == scope.row.type">{{dict.dictLabel}}</span>
					</span>
				</template>
			</el-table-column>
			<el-table-column label="消费备注" align="center" prop="descs" /> -->
			<el-table-column label="支付类型" align="center" prop="payType">
				<template slot-scope="scope">
					<span v-for="dict in zhifuType" :key="dict.dictValue">
						<span style="color:#ffaa00"
							v-if="dict.dictValue*1 == scope.row.payType">{{dict.dictLabel}}</span>
					</span>
				</template>
			</el-table-column>
			<el-table-column label="交易状态" align="center" prop="status">
				<template slot-scope="scope">
					<span v-for="dict in jiaoyiType" :key="dict.dictValue">
						<span style="color:#4eeb73"
							v-if="dict.dictValue*1 == scope.row.status">{{dict.dictLabel}}</span>
					</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="红包id" align="center" prop="redPacketId" /> -->

			<!-- <el-table-column label="审核状态" align="center" prop="manualPayStatus">
				<template slot-scope="scope">
					<span v-for="dict in shenheType" :key="dict.dictValue">
						<span style="color:#7f4953"
							v-if="dict.dictValue*1 == scope.row.manualPayStatus">{{dict.dictLabel}}</span>
					</span>
				</template>
			</el-table-column>
			<el-table-column label="手续费" align="center" prop="serviceCharge" /> -->
			<el-table-column label="当前余额" align="center" prop="currentBalance" />
			<!-- <el-table-column label="实操金额" align="center" prop="operationAmount" /> -->
			<el-table-column label="充值时间" align="center" prop="time" width="180">
				<template slot-scope="scope">
					<span>{{scope.row.time}}</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="到账时间" align="center" prop="timestamp" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.timestamp }}</span>
				</template>
			</el-table-column> -->
			<el-table-column fixed="right" label="操作" width="120" align="center" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button v-if="scope.row.status == 0" size="mini" type="text" icon="el-icon-edit" @click="examineBtn(scope.row)"
						v-hasPermi="['system:record:edit']">审 核</el-button>
					<!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:record:edit']">修改</el-button>-->
					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
						v-hasPermi="['system:record:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改消费记录对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="交易单号" prop="tradeNo">
					<el-input v-model="form.tradeNo" placeholder="请输入交易单号" />
				</el-form-item>
				<el-form-item label="用户Id" prop="userId">
					<el-input v-model="form.userId" placeholder="请输入用户Id" />
				</el-form-item>
				<!-- <el-form-item label="对方Id" prop="toUserId">
					<el-input v-model="form.toUserId" placeholder="请输入对方用户Id" />
				</el-form-item>-->
				<el-form-item label="金额" prop="money">
					<el-input v-model="form.money" placeholder="请输入金额" />
				</el-form-item>
				<!-- <el-form-item label="消费类型" prop="type">
					<el-select v-model="form.type" placeholder="消费类型">
						<el-option v-for="dict in xiaofeiType" :key="dict.dictValue" :label="dict.dictLabel"
							:value="dict.dictValue*1" />
					</el-select>
				</el-form-item>
				<el-form-item label="消费备注" prop="descs">
					<el-input v-model="form.descs" placeholder="请输入消费备注" />
				</el-form-item> -->
				<el-form-item label="支付类型" prop="payType">
					<el-select v-model="form.payType" placeholder="请选择支付类型" clearable size="small">
						<el-option v-for="dict in zhifuType" :key="dict.dictValue" :label="dict.dictLabel"
							:value="dict.dictValue*1" />
					</el-select>
				</el-form-item>
				<el-form-item label="交易状态">
					<el-select v-model="form.status" placeholder="请选择交易状态" clearable size="small">
						<el-option v-for="dict in jiaoyiType" :key="dict.dictValue" :label="dict.dictLabel"
							:value="dict.dictValue*1" />
					</el-select>
				</el-form-item>
				<el-form-item label="红包id" prop="redPacketId">
					<el-input v-model="form.redPacketId" placeholder="请输入红包id" />
				</el-form-item>
				<!-- <el-form-item label="收支" prop="changeType">
					<el-select v-model="form.changeType" placeholder="请选择支付类型" clearable size="small">
						<el-option v-for="dict in shouzhiType" :key="dict.dictValue" :label="dict.dictLabel"
							:value="dict.dictValue*1" />
					</el-select>
				</el-form-item>
				<el-form-item label="审核状态">
					<el-select v-model="form.manualPayStatus" placeholder="请选择审核状态" clearable size="small">
						<el-option v-for="dict in shenheType" :key="dict.dictValue" :label="dict.dictLabel"
							:value="dict.dictValue*1" />
					</el-select>
				</el-form-item>
				<el-form-item label="手续费" prop="serviceCharge">
					<el-input v-model="form.serviceCharge" placeholder="请输入手续费" />
				</el-form-item> -->
				<el-form-item label="当前余额" prop="currentBalance">
					<el-input v-model="form.currentBalance" placeholder="请输入当前余额" />
				</el-form-item>
				<el-form-item label="时间" prop="time">
					<el-date-picker clearable size="small" style="width: 200px" v-model="form.time" type="date"
						value-format="yyyy-MM-dd" placeholder="选择时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="到账时间" prop="timestamp">
					<el-date-picker clearable size="small" style="width: 200px" v-model="form.timestamp" type="date"
						value-format="yyyy-MM-dd" placeholder="选择到账时间">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
		
		<!-- 提现审核 -->
		<el-dialog title="提现审核" :visible.sync="examineBox" width="30%" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="审核" prop="status">
					<el-select v-model="form.status" placeholder="">
						<el-option :key="5" label="审核通过"
							:value="5"></el-option>
						<el-option :key="6" label="审核不通过"
							:value="6"></el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitExamineForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		listRecord,
		getRecord,
		delRecord,
		addRecord,
		updateRecord,
		exportRecord
	} from "@/api/system/subscribeBack";

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
					timestamp: null
				},
				// 表单参数
				form: {
					status: ""
				},
				// 表单校验
				rules: {},
				xiaofeiType: [],
				zhifuType: [],
				jiaoyiType: [],
				shouzhiType: [],
				shenheType: [],
				examineBox: false,
				examineInfo: []
			};
		},
		created() {
			this.getList();

			this.getDicts("x_account_type").then(response => {
				this.xiaofeiType = response.data;
			});
			this.getDicts("x_pay_type").then(response => {
				this.zhifuType = response.data;
			});
			this.getDicts("x_transaction_type").then(response => {
				this.jiaoyiType = response.data;
			});
			this.getDicts("x_income_type").then(response => {
				this.shouzhiType = response.data;
			});
			this.getDicts("x_reviewed_type").then(response => {
				this.shenheType = response.data;
			});


		},
		methods: {
			/** 查询消费记录列表 */
			getList() {
				this.loading = true;
				
				// 111 只显示后台 充值
				this.queryParams.type = 11
				
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
					status: null,
					redPacketId: null,
					changeType: null,
					manualPayStatus: null,
					serviceCharge: null,
					currentBalance: null,
					operationAmount: null,
					time: null,
					timestamp: null
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
				this.single = selection.length !== 1
				this.multiple = !selection.length
			},
			// 审核按钮
			examineBtn(row){
				this.examineBox = true;
				this.examineInfo = row;
			},
			/** 提交按钮 */
			submitExamineForm() {
				this.$refs["form"].validate(valid => {
					console.log("submitExamineForm>>>");
				if (valid) {
					console.log("submitExamineForm>>>",valid,this.form.status);
					this.examineInfo.status = this.form.status
					updateRecord(this.examineInfo).then(res=>{
					this.msgSuccess("审核成功");
					this.examineBox = false;
					this.getList();
					});
				}
				});
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
