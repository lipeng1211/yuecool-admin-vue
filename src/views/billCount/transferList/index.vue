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

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange" >
      <el-table-column label="红包ID" align="center" prop="id"  width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="发送者ID" align="center" prop="gName" width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="发送者昵称" align="center" prop="maxMemberCount"  width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="红包金额" align="center" prop="gMemberCount" />
      <el-table-column label="红包个数" align="center" prop="gMemberCount" />
      <el-table-column label="已领取金额" align="center" prop="gMemberCount" width="100"/>

      <el-table-column label="红包类型" align="center" prop="" width="120">
        <template slot-scope="scope">
          <div>1个人红包</div>
          <div>2群组红包</div>
        </template>
      </el-table-column>

      <el-table-column label="红包状态" align="center" prop="" width="120">
        <template slot-scope="scope">
          <div>1已领取</div>
          <div>2未领取</div>
          <div>3已退款</div>
        </template>
      </el-table-column>


      <el-table-column label="红包备注" align="center" prop="gMemberCount" width="150"/>
      <el-table-column label="发送时间" align="center" prop="gMemberCount" width="150"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" plain  @click="details(scope.row)" style="padding: 4px 5px;"
            v-hasPermi="['group:group:edit']">领取详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
  import {
    redEnvelope
  } from "@/api/system/redEnvelope";

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
        groupList: [{
          id:1
        }],
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
		console.log(1234)
      this.getList();
      this.loading = false;
      this.getDicts("group_status").then(response => {
        this.gStatusOptions = response.data;
      });
    },
    methods: {
      details(data) {
        this.$router.push({path:"/billCount/redpackList/list"})
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
		  debugger
        this.loading = true;
        redEnvelope(this.queryParams).then(response => {
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
			<el-form-item label="用户id" prop="userId">
				<el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="发送群" prop="groupGid">
				<el-input v-model="queryParams.groupGid" placeholder="请输入发送到那个群" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="发送人" prop="toUserId">
				<el-input v-model="queryParams.toUserId" placeholder="请输入发送给哪个用户" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>

			<el-form-item label="发送时间" prop="sendTime">
				<el-date-picker clearable size="small" style="width: 200px" v-model="queryParams.sendTime" type="date"
					value-format="yyyy-MM-dd" placeholder="选择发送时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="红包类型" prop="type">
				<el-select v-model="queryParams.type" placeholder="红包类型" clearable size="small">
					<el-option v-for="item in redpack_type" :key="item.dictValue" :label="item.dictLabel"
						:value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="领取状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="领取状态" clearable size="small">
					<el-option v-for="item in redpack_status" :key="item.dictValue" :label="item.dictLabel"
						:value="item.dictValue">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<!-- <el-col :span="1.5">
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:packet:add']">新增</el-button>
			</el-col> -->
			<el-col :span="1.5">
				<el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
					v-hasPermi="['system:packet:edit']">修改</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:packet:remove']">删除</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:packet:export']">导出</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="packetList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="序号">
				<template slot-scope="scope">
					{{scope.$index+1}}
				</template>
			</el-table-column>
			<el-table-column label="发送者ID" align="center" prop="userId" />
			<el-table-column label="发送者昵称" align="center" prop="nickname" width="120"  :show-overflow-tooltip="true"/>
			<!--<el-table-column label="发送群组ID" align="center" prop="groupGid" width="120"  :show-overflow-tooltip="true"/>
			<el-table-column label="发送群组名称" align="center" prop="gname" width="200"  :show-overflow-tooltip="true"/>
			<el-table-column label="接收用户ID" align="center" prop="toUserId" width="120"  :show-overflow-tooltip="true"/>
			<el-table-column label="接收用户昵称" align="center" prop="tonickname" width="120"  :show-overflow-tooltip="true"/>-->
      		<el-table-column label="转账备注" align="center" prop="word" />
			<el-table-column label="发送时间" align="center" prop="sendTime" width="180">
				<template slot-scope="scope">
					<span>{{scope.row.sendTime }}</span>
				</template>
			</el-table-column>
      		<el-table-column label="转账金额" align="center" prop="money" />
			<el-table-column label="超时时间" align="center" prop="outTime" width="180">
				<template slot-scope="scope">
					<span>{{ scope.row.outTime}}</span>
				</template>
			</el-table-column>
			<el-table-column label="领取状态" align="center" prop="status">
				<template slot-scope="scope">
					<span v-for="(it,index) in redpack_status" :key="index">
						<span style="color: #018EF8;" v-if="scope.row.type==it.dictValue">{{it.dictLabel}}</span>
					</span>
				</template>
			</el-table-column>
			<!-- <el-table-column label="领取该红包的 userId 字符串" align="center" prop="userIds" /> -->
			<!-- <el-table-column label="红包唯一标识" align="center" prop="orderId" /> -->
			<el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="200">
				<template slot-scope="scope">
					<!--<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['billCount:redpackList:edit']">修改</el-button>-->
					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
						v-hasPermi="['billCount:redpackList:remove']">删除</el-button>
					<el-button size="mini" type="text" icon="el-icon-search"
						v-hasPermi="['billCount:redpackList:child']" @click="details(scope.row)">领取详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改红包对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="用户ID" prop="userId">
					<el-input v-model="form.userId" placeholder="请输入用户ID" />
				</el-form-item>
				<el-form-item label="发送群组" prop="groupGid">
					<el-input v-model="form.groupGid" placeholder="请输入发送到那个群ID" />
				</el-form-item>
				<el-form-item label="发送用户" prop="toUserId">
					<el-input v-model="form.toUserId" placeholder="请输入发送给哪个用户ID" />
				</el-form-item>
				<el-form-item label="祝福语" prop="greetings" >
					<el-input v-model="form.greetings" placeholder="请输入祝福语" />
				</el-form-item>
				<el-form-item label="发送时间" prop="sendTime">
					<el-date-picker clearable size="small" style="width: 200px" v-model="form.sendTime" type="date"
						value-format="yyyy-MM-dd" placeholder="选择发送时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="红包类型" prop="type">
					<el-select v-model="form.type+''" placeholder="请选择红包类型">
						<el-option v-for="item in redpack_type" :key="item.dictValue" :label="item.dictLabel"
							:value="item.dictValue">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="红包个数" prop="count">
					<el-input v-model="form.count" placeholder="请输入红包个数" />
				</el-form-item>
				<el-form-item label="已领个数" prop="receiveCount">
					<el-input v-model="form.receiveCount" placeholder="请输入已领取个数" />
				</el-form-item>
				<el-form-item label="红包金额" prop="money">
					<el-input v-model="form.money" placeholder="请输入红包金额" />
				</el-form-item>
				<el-form-item label="剩余金额" prop="over">
					<el-input v-model="form.over" placeholder="请输入红包剩余金额" disabled />
				</el-form-item>
				<el-form-item label="超时时间" prop="outTime">
					<el-date-picker clearable size="small" style="width: 200px" v-model="form.outTime" type="date"
						value-format="yyyy-MM-dd" placeholder="选择超时时间">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="红包状态" prop="status">
					<el-select v-model="form.type+''" placeholder="请选择红包类型">
						<el-option v-for="item in redpack_status" :key="item.dictValue" :label="item.dictLabel"
							:value="item.dictValue">
						</el-option>
					</el-select>
				</el-form-item>


				<!-- <el-form-item label="领取该红包的 userId 字符串" prop="userIds">
					<el-input v-model="form.userIds" type="textarea" placeholder="请输入内容" />
				</el-form-item> -->
				<!-- <el-form-item label="红包唯一标识" prop="orderId">
					<el-input v-model="form.orderId" placeholder="请输入红包唯一标识" />
				</el-form-item> -->
				<el-form-item label="口令" prop="word">
					<el-input v-model="form.word" placeholder="请输入口令" />
				</el-form-item>
				<el-form-item label="封面地址" prop="coverUrl">
					<el-input v-model="form.coverUrl" placeholder="请输入封面链接地址" />
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
	import {
		listPacket,
		getPacket,
		delPacket,
		addPacket,
		updatePacket,
		exportPacket
	} from "@/api/system/packet";

	export default {
		name: "Packet",
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
				// 红包表格数据
				packetList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					userId: null,
					groupGid: null,
					toUserId: null,
					greetings: null,
					sendTime: null,
					type: null,
					count: null,
					receiveCount: null,
					money: null,
					over: null,
					outTime: null,
					status: null,
					userIds: null,
					orderId: null,
					word: null,
					coverUrl: null
				},
				redpack_type: [],
				redpack_status: [],
				// 表单参数
				form: {},
				// 表单校验
				rules: {}
			};
		},
		created() {
			this.getList();
			this.getDicts("x_redpack_type").then(response => {
				this.redpack_type = response.data;
			});
			this.getDicts("x_redpack_status").then(response => {
				this.redpack_status = response.data;
			});
		},
		methods: {
			details(data) {
				console.log(data)
				const msg = {
					orderId: data.orderId,
					type: '8'
				}
				this.$router.push({
					path: "/billCount/redpackList/list",
					query: msg
				})
			},
			/** 查询红包列表 */
			getList() {
				this.loading = true;
				this.queryParams.type = 4
				listPacket(this.queryParams).then(response => {
					this.packetList = response.rows;
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
					userId: null,
					groupGid: null,
					toUserId: null,
					greetings: null,
					sendTime: null,
					type: null,
					count: null,
					receiveCount: null,
					money: null,
					over: null,
					outTime: null,
					status: 0,
					userIds: null,
					orderId: null,
					word: null,
					coverUrl: null
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
				this.title = "添加红包";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				const id = row.id || this.ids
				getPacket(id).then(response => {
					this.form = response.data;
					this.open = true;
					this.title = "修改红包";
				});
			},
			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						if (this.form.id != null) {
							updatePacket(this.form).then(response => {
								if (response.code === 200) {
									this.msgSuccess("修改成功");
									this.open = false;
									this.getList();
								}
							});
						} else {
							addPacket(this.form).then(response => {
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
					return delPacket(ids);
				}).then(() => {
					this.getList();
					this.msgSuccess("删除成功");
				}).catch(function() {});
			},
			/** 导出按钮操作 */
			handleExport() {
				const queryParams = this.queryParams;
				this.$confirm('是否确认导出所有红包数据项?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(function() {
					return exportPacket(queryParams);
				}).then(response => {
					this.download(response.msg);
				}).catch(function() {});
			}
		}
	};
</script>
