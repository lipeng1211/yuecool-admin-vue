<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">

      <el-form-item label="">
        <el-input v-model="queryParams.gName" placeholder="提现用户名" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="提现的时间范围">
<!--        <div class="block">-->
<!--          <el-date-picker v-model="value1" type="monthrange" range-separator="至" start-placeholder="开始月份"-->
<!--            end-placeholder="结束月份">-->
<!--          </el-date-picker>-->
<!--        </div>-->

        <div class="block">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="value1"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-tag type="success" effect="dark">当前提现：{{this.withdrawalMap.currentWithdrawal}}</el-tag> <el-tag type="danger" effect="dark">当日提现：{{this.withdrawalMap.cashWithdrawalOnTheSameDay}}</el-tag> <el-tag type="warning" effect="dark">昨日提现：{{this.withdrawalMap.withdrawalYesterday}}</el-tag>
    <el-table v-loading="loading" :data="recordList" @selection-change="handleSelectionChange" class="k_line">
      <el-table-column label="提现记录ID" align="center" prop="id" />
      <el-table-column label="交易单号" align="center" prop="tradeNo" width="120" />
<!--      <el-table-column label="支付宝账号" align="center" prop="bankaccount" />-->
<!--      <el-table-column label="支付宝手机号" align="center" prop="tel" width="180" />-->
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="用户昵称" align="center" prop="nickname" />
      <el-table-column label="提现金额" align="center" prop="money" />
      <el-table-column label="手续费" align="center" prop="systemServiceCharge" />
      <!-- <el-table-column label="手续费" align="center" prop="serviceCharge" /> -->
      <el-table-column label="到账金额" align="center" prop="operationAmount">
				<!--<template slot-scope="scope">
          <div>{{scope.row.operationAmount - scope.row.serviceCharge}}</div>
        </template>-->
      </el-table-column>
      <el-table-column label="账户余额" align="center" prop="currentBalance" />

     <el-table-column label="提现状态" align="center" prop="status">
       <template slot-scope="scope">
					<span v-if="scope.row.status==3">提现成功</span>
					<span v-else-if="scope.row.status==4">提现驳回</span>
					<span v-else-if="scope.row.status==5">打款中</span>
					<span v-else>正在审核</span>
       </template>
     </el-table-column>

     <el-table-column label="提现方式" align="center" prop="">
       <template slot-scope="scope">
					<span v-if="scope.row.payType == 1">银行卡</span>
					<span v-else-if="scope.row.payType == 2">支付宝</span>
					<span v-else-if="scope.row.payType == 3">微信</span>
					<span v-else-if="scope.row.payType == 4">其他</span>
          <span v-else-if="scope.row.payType == 5">推荐钱包</span>
					<span v-else-if="scope.row.payType == 6">商家钱包</span>
					<span v-else-if="scope.row.payType == 7">积分钱包</span>
          <span v-else-if="scope.row.payType == 8">银行卡</span>
       </template>
     </el-table-column>

      <el-table-column label="提现时间" align="center" prop="time" width="160" />
      <el-table-column label="到账时间" align="center" prop="timestamp" width="200">
        <template slot-scope="scope" >
          <div v-if="scope.row.timestamp">{{scope.row.timestamp}}</div>
          <div v-else>{{scope.row.timestamp}}</div>
        </template>
      </el-table-column>

        <el-table-column fixed="right" label="操作" align="center" width="120" class-name="small-padding fixed-width">
          <template slot-scope="scope">

            <span v-if="!scope.row.timestamp">


<!--                    <span v-if="scope.row.status==3">提现成功</span>-->
<!--                    <span v-else-if="scope.row.status==4">提现驳回</span>-->
<!--                    <span v-else-if="scope.row.status==5">打款中</span>-->
<!--                    <span v-else>正在审核</span>-->
                    <el-button v-if="scope.row.status==0" size="mini" type="text" @click="submitForm(scope.row,3)">通过</el-button>
                    <el-button v-if="scope.row.status==0" size="mini" type="text" @click="rejepop(scope.row)">驳回</el-button>

            </span>
          </template>
        </el-table-column>
    </el-table>

    <!-- 驳回原因 -->
		<el-dialog title="驳回原因" :visible.sync="diarejec" width="30%" append-to-body :close-on-click-modal="false">
			<el-form ref="form" label-width="100px">
				<el-form-item label="驳回原因" prop="status">
					<el-input type="textarea" v-model="rejedesc" placeholder="请输入驳回原因"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm(rejeRow,4)">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 提现审核 -->
		<el-dialog title="提现审核" :visible.sync="examineBox" width="30%" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-form-item label="审核" prop="status">
					<el-select v-model="form.status" placeholder="">
						<el-option :key="3" label="审核通过"
							:value="3"></el-option>
						<el-option :key="4" label="审核不通过"
							:value="4"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

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

	import {
		listRecord,
		getRecord,
		delRecord,
		addRecord,
		updateRecord,
		exportRecord
	} from "@/api/system/record";

  export default {
    name: "Group",
    data() {
      return {
        // 遮罩层
        loading: false,
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
        recordList: [{
          id:1
        }],
        withdrawalMap:{},
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 状态字典
        gStatusOptions: [],
        // 查询参数
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          gStatus: null,
          gName: null,
          gOwnerUserUid: null,
        },
        // 表单参数
        form: {
          status: ""
        },
        // 表单校验
        rules: {
					status: [{
						required: true,
						message: "审核状态不能为空",
						trigger: "blur"
					}],
        },
        dialogVisible: false,
        value1: '',
        examineBox: false,
        examineInfo: [],
        diarejec: false,
        rejedesc: '',
        rejeRow: {}
      };
    },
    created() {
      this.getList();
      this.loading = false;
      this.getDicts("group_status").then(response => {
        this.gStatusOptions = response.data;
      });
    },
    methods: {
      cancel() {
        this.diarejec = false
        this.examineBox = false
      },
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
      /*
      getList() {
        this.loading = true;
        listGroup(this.queryParams).then(response => {
          this.recordList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },*/
			/** 查询提现记录列表 */
			getList() {
        console.log("getList>>>");

        // debugger;
				this.loading = true;
				//用户提现
				this.queryParams.type = 2
        if (this.value1 !=null){
          this.queryParams.beginTime = this.value1[0];
          this.queryParams.endTime = this.value1[1];
        }

				listRecord(this.queryParams).then(response => {
					this.recordList = response.rows;
					this.withdrawalMap = response.map;
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
      // 表单重置
      reset() {
        this.form = {
          status: null
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
      // 审核按钮
      examineBtn(row){
        this.examineBox = true;
        this.examineInfo = row;
      },
      examineSub(){

      },
      rejepop(row) {
        this.rejeRow = row
        this.diarejec = true
      },
      /** 提交按钮 */
      submitForm(row,status) {
        if (status == 4) {
          if (this.rejedesc == '') {
            this.$message({
              type: 'error',
              message: '请输入驳回内容'
            })
            return false
          }
          row.descs = this.rejedesc
        }
        this.examineInfo = row;
        this.examineInfo.status = status
        updateRecord(this.examineInfo).then(res=>{
          this.msgSuccess("操作成功");
          this.cancel()
          this.examineBox = false;
          this.getList();
        });
        // this.$refs["form"].validate(valid => {
        //     console.log("submitForm>>>");
        //   if (valid) {
        //     console.log("submitForm>>>",valid,status);
        //     this.examineInfo.status = status
        //     updateRecord(this.examineInfo).then(res=>{
        //       this.msgSuccess("操作成功");
        //       this.examineBox = false;
        //       this.getList();
        //     });
        //   }
        // });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const gIds = row.id || this.ids;
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
