<!-- <template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
     <el-form-item label="">
        <el-input v-model="queryParams.gName" placeholder="发送人昵称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column label="红包ID" align="center" prop="id" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="领取流水ID" align="center" prop="gName"  width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="发送者ID" align="center" prop="maxMemberCount"  width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="发送者昵称" align="center" prop="gMemberCount"  width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="领取人ID" align="center" prop="gMemberCount"  width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="领取人昵称" align="center" prop="gMemberCount"  width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="领取金额" align="center" prop="gMemberCount" />
      <el-table-column label="领取时间" align="center" prop="gMemberCount"  width="150" :show-overflow-tooltip="true"/>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
  import {
    listGroup,
    getGroup,
    delGroup,
    addGroup,
    updateGroup,
    exportGroup
  } from "@/api/group/group";

  export default {
    name: "Group",
    data() {
      return {
        // 遮罩层
        loading: true,
        ban: false,
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
        // 群组表格数据
        groupList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态字典
        gStatusOptions: [],
        // 查询参数

        queryParams: {
          pageNum: 1,
          pageSize: 10,
          gStatus: null,
          gName: null,
          gOwnerUserUid: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {},
        dialogVisible: false,
        value1: '',
        options: [{
          value: '选项1',
          label: '请选择充值入口'
        }, {
          value: '选项2',
          label: 'APP充值'
        }, {
          value: '选项3',
          label: '后台充值'
        }],


      };
    },
    created() {
      // this.getList();
      this.loading = false;
      this.getDicts("group_status").then(response => {
        this.gStatusOptions = response.data;
      });
    },
    methods: {
      groupBan(data, status) {

      },
      confirmBan() {
        this.form.gStatus = 0;
        updateGroup(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.ban = false;
            this.getList();
            this.reset();
          }
        });
      },
      /** 查询群组列表 */
      getList() {
        this.loading = true;
        listGroup(this.queryParams).then(response => {
          this.groupList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      start() {
        this.$router.push({
          path: "/monents/start"
        })
      },
      comment() {
        this.$router.push({
          path: "/monents/comment"
        })
      },
      deleteThis() {
        this.$confirm('确定删除吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      deleteMonthLogs() {
        this.$confirm('确定删除吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteThousandAgoLogs() {
        this.$confirm('确定删除吗？, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      // 表单重置
      reset() {
        this.form = {
          gId: null,
          gStatus: null,
          gName: null,
          gOwnerUserUid: null,
          gNotice: null,
          maxMemberCount: null,
          gMemberCount: null,
          createUserUid: null,
          createTime: null,
          forbidUserUid: null,
          forbidTime: null,
          firbidCause: null,
          gNoticeUpdatetime: null,
          gNoticeUpdateuid: null,
          delUserUid: null,
          delTime: null,
          avatarIncludeCnt: null
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
        this.ids = selection.map(item => item.gId)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },


      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.gId != null) {
              updateGroup(this.form).then(response => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                }
              });
            } else {
              addGroup(this.form).then(response => {
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
        const gIds = row.gId || this.ids;
        this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGroup(gIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

    }
  };
</script>
<style scoped="scoped">
  .k_img {
    width: 40px;
    border-radius: 4px;
    margin: 4px 4px;
    cursor: pointer;
  }

  .imgList>img {
    width: 100px;
    cursor: pointer;
    margin: 5px;
    border-radius: 4px;
  }
</style>
 -->
 
 
 
 <template>
 	<div class="app-container">
 		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
 			<el-form-item label="流水单号" prop="tradeNo">
 				<el-input v-model="queryParams.tradeNo" placeholder="请输入流水单号" clearable size="small"
 					@keyup.enter.native="handleQuery" />
 			</el-form-item>
 			<el-form-item label="用户ID" prop="userId">
 				<el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable size="small"
 					@keyup.enter.native="handleQuery" />
 			</el-form-item>
 			<el-form-item label="对方ID" prop="toUserId">
 				<el-input v-model="queryParams.toUserId" placeholder="请输入对方用户Id" clearable size="small"
 					@keyup.enter.native="handleQuery" />
 			</el-form-item>
 			<el-form-item label="金额" prop="money">
 				<el-input v-model="queryParams.money" placeholder="请输入金额" clearable size="small"
 					@keyup.enter.native="handleQuery" />
 			</el-form-item>
 			
 			<!-- <el-form-item label="领取时间" prop="time">
 				<el-date-picker clearable size="small" style="width: 200px" v-model="queryParams.time" type="date"
 					value-format="yyyy-MM-dd" placeholder="选择时间">
 				</el-date-picker>
 			</el-form-item> -->
 	
	<el-form-item label="领取时间" prop="time">
		<el-date-picker clearable size="small" style="width: 200px" v-model="queryParams.time" type="datetime"
			value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择时间">
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
			<el-table-column label="红包记录ID" align="center"  width="150" prop="redPacketId" :show-overflow-tooltip="true"/>
			</el-table-column>
 			<el-table-column label="流水记录ID" align="center" prop="id" width="85" />
 			<el-table-column label="流水单号" align="center" prop="tradeNo" />
 			<el-table-column label="发送者ID" align="center" prop="toUserId" />
			<el-table-column label="发送者昵称" align="center" prop="tonickname" width="85" />
 			<el-table-column label="领取人ID" align="center" prop="userId" />
			<el-table-column label="领取人昵称" align="center" prop="nickname" width="85"/>
 			<el-table-column label="领取金额" align="center" prop="money" />
 			
 			<!--<el-table-column label="支付类型" align="center" prop="payType">
 				<template slot-scope="scope">
 					<span v-for="dict in zhifuType" :key="dict.dictValue">
 						<span style="color:#ff5500"
 							v-if="dict.dictValue*1 == scope.row.payType">{{dict.dictLabel}}</span>
 					</span>
 				</template>
 			</el-table-column>-->
 			
 			<el-table-column label="领取时间" align="center" prop="time" width="180">
 				<template slot-scope="scope">
 					<span>{{ scope.row.time }}</span>
 				</template>
 			</el-table-column>
 			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
 				<template slot-scope="scope">
 					<!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
 						v-hasPermi="['system:record:edit']">修改</el-button> -->
 					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
 						v-hasPermi="['system:record:remove']">删除</el-button>
 				</template>
 			</el-table-column>
 		</el-table>
 
 		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
 			@pagination="getList" />
 
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
 	} from "@/api/system/record";
 
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
 					redPacketId: this.$route.query.orderId,
 					changeType: null,
 					manualPayStatus: null,
 					serviceCharge: null,
 					currentBalance: null,
 					operationAmount: null,
 					time: null,
 					timestamp: null
 				},
 				// 表单参数
 				form: {},
 				// 表单校验
 				rules: {},
 				xiaofeiType: [],
 				zhifuType: [],
 				jiaoyiType: [],
 				shouzhiType: [],
 				shenheType: []
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
 				this.queryParams.type = this.$route.query.type
 				
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
 