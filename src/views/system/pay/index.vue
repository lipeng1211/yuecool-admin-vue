<template>
  <div class="app-container">
    <el-table :data="tableData" border>
      <el-table-column label="参数说明">
        <template slot-scope="scope">
          <span>{{ scope.row.host }}</span>
        </template>
      </el-table-column>


      <el-table-column label="参数值">
        <template slot-scope="scope">

          <span v-if="!scope.row.status&&!scope.row.withdraw&&!scope.row.isImg">
            <el-input v-model="scope.row.key" placeholder="请输入内容"></el-input>
          </span>



          <span v-else-if="scope.row.status">
            <el-select v-model="scope.row.key" placeholder="请选择是否开启" style="width: 100%;">
              <el-option value="是"> 是 </el-option>
              <el-option value=" 否"> 否 </el-option>
            </el-select>
          </span>


          <span v-if="scope.row.withdraw">
            <el-select v-model="scope.row.key" placeholder="请选择提现方式" style="width: 100%;">
              <!-- <el-option value="自动提现到账">自动提现到账</el-option> -->
              <el-option value="1" label="人工提现到账"></el-option>
            </el-select>
          </span>

          <div v-if="scope.row.isImg" style="display: flex;flex-wrap: nowrap;">
            <el-image style="height: 60px;"
                      :src="scope.row.key"
                      fit="scale-down"
                      :preview-src-list="[scope.row.key]">
            </el-image>
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :http-request="uploadFile"
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus avatar-uploader-icon" @click="uploadKey = scope.row.name"></i>
            </el-upload>
          </div>

        </template>

      </el-table-column>

      <el-table-column label="变量名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>


      <el-table-column label="参数说明">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>



    </el-table>

    <div class=" k_mtp">
      <el-button type="primary" @click="submit">确定提交</el-button>
    </div>



  </div>



</template>

<script>
	import {
		getConfig,
		updateConfig
	} from "@/api/system/appConfig";
	import {
		uploadUrl
	} from "@/api/system/find";

  export default {
    data() {
      return {
        uploadKey: '',
				uploadPath: "/api/storage/upload",
        tableData: [
					// {
     //        host: '红包功能',
     //        key: '',
     //        name: 'isOpenRedpacket',
     //        status: "select",
     //        type: '是否开启  1是开启 2是关闭'
     //      },
     //      {
     //        host: '钱包功能',
     //        key: '',
     //        name: 'isOpenWallet',
     //        status: "select",
     //        type: '是否开启  1是开启 2是关闭'
     //      },

          {
            host: '单笔最大转账金额',
            key: '',
            name: 'maxTransferAmount	',
            type: ''
          },
          {
            host: '单日最大转账总额',
            key: '',
            name: 'maxTransferAmountCount	',
            type: ''
          },

          {
            host: '单笔最大充值金额',
            key: '',
            name: 'dayMaxRechargeAmount		',
            type: ''
          },
          {
            host: '单日最大充值总额',
            key: '',
            name: 'dayMaxRechargeAmountCount		',
            type: ''
          },
          {
            host: '单笔最大提现金额		',
            key: '',
            name: 'singleMaximumWithdrawalAmount',
            type: ''
          },
          {
            host: '单笔最小提现金额		',
            key: '',
            name: 'singleMinimumWithdrawalAmount',
            type: ''
          },
          {
            host: '单日最大提现总额		',
            key: '',
            name: 'dayMaxWithdrawAmount',
            type: ''
          },
          {
            host: '用户提现方式		',
            key: 1,
            withdraw:"withdraw",
            name: 'withdrawCode',
            type: ''
          },
          {
            host: '单日提现最大次数		',
            key: '',
            name: 'dayMaxWithdrawAmountCount',
            type: ''
          },
          {
            host: '单笔红包最大金额	',
            key: '',
            name: 'maximumAmountOfASingleRedEnvelope',
            type: ''
          },
          {
            host: '单日红包最大金额',
            key: '',
            name: 'maximumAmountOfRedEnvelopesInASingleDay',
            type: ''
          },
          {
            host: '微信收款码',
            key: '',
            name: 'wxpayImg',
            isImg: true,
            type: ''
          },
          {
            host: '支付宝收款码',
            key: '',
            name: 'alipayImg',
            isImg: true,
            type: ''
          },
          {
            host: '提现手续费',
            key: '',
            name: 'serviceCharge',
            type: '费率按照百分比计算，例如填写0.06，费率就是6%'
          },
          // {
          //   host: '零钱提现费率		',
          //   key: '',
          //   name: 'myChangeWithdrawRate		',
          //   type: ''
          // },

          // {
          //   host: '单日转账最大金额	',
          //   key: '',
          //   name: 'dayMaxTransferAmount		',
          //   type: ''
          // },

          // {
          //   host: '单笔最大红包金额',
          //   key: '',
          //   name: 'maxRedpacktAmount	',
          //   type: ''
          // }, {
          //   host: '单笔群红包最大发送个数',
          //   key: '',
          //   name: 'maxRedpacktNumber	',
          //   type: ''
          // }, {
          //   host: '单笔最大提现金额',
          //   key: '',
          //   name: 'maxWithdrawAmount	',
          //   type: ''
          // }, {
          //   host: '单笔最大充值金额	',
          //   key: '',
          //   name: 'maxRechargeAmount',
          //   type: ''
          // },



          // {
          //   host: '单笔付款码支付最大金额	',
          //   key: '',
          //   name: 'maxCodePaymentAmount		',
          //   type: ''
          // },
          // {
          //   host: '单笔二维码收款最大金额	',
          //   key: '',
          //   name: 'maxCodeReceiptAmount	',
          //   type: ''
          // }, {
          //   host: '单日转账最大金额	',
          //   key: '',
          //   name: 'dayMaxTransferAmount		',
          //   type: ''
          // }, {
          //   host: '单日红包最大金额	',
          //   key: '',
          //   name: 'dayMaxRedpacktAmount	',
          //   type: ''
          // }, {
          //   host: '单日提现最大金额		',
          //   key: '',
          //   name: 'dayMaxWithdrawAmount',
          //   type: ''
          // },




          // {
          //   host: '单日充值最大金额		',
          //   key: '',
          //   name: 'dayMaxRechargeAmount		',
          //   type: ''
          // },
          // {
          //   host: '单日付款码支付最大金额		',
          //   key: '',
          //   name: 'dayMaxCodePayAmount		',
          //   type: ''
          // }, {
          //   host: '单日二维码收款最大金额		',
          //   key: '',
          //   name: 'dayMaxCodeReceiptAmount			',
          //   type: ''
          // }, {
          //   host: '零钱提现费率		',
          //   key: '',
          //   name: 'myChangeWithdrawRate		',
          //   type: ''
          // },



          // {
          //   host: '是否开启扫码手动充值		',
          //   key: '1',
          //   name: 'isOpenManualPay',
          //   status: "select",
          //   type: ''
          // },
          // {
          //   host: '是否开启云钱包		',
          //   key: '2',
          //   name: 'isOpenCloudWallet',
          //   status: "select",
          //   type: ''
          // },
          // {
          //   host: '云钱包开户是否默认正常使用		',
          //   key: '1',
          //   status: "select",
          //   name: 'isDefaultFreeze		',
          //   type: ''
          // },
          // {
          //   host: '云钱包新开户充值多少小时后可交易		',
          //   key: '',
          //   name: 'newYopUserRechargeTime		',
          //   type: ''
          // }, {
          //   host: '云钱包新开户第一笔充值限额			',
          //   key: '',
          //   name: 'newYopUserFirstRecharge			',
          //   type: ''
          // }, {
          //   host: '后台管理中单笔最大充值金额			',
          //   key: '',
          //   name: 'consoleMaxRechargeAmount		',
          //   type: ''
          // }, {
          //   host: '后台管理中单笔最大手工提现金额				',
          //   key: '',
          //   name: 'consoleMaxCodePaymentAmount		',
          //   type: ''
          // }



        ],
        value: 1
      }
    },
		created() {
			this.getList();
		},
    methods: {
			getList() {
				getConfig().then(response => {
					for (var i = 0; i < this.tableData.length; i++) {
						if (i === 0) {
							this.tableData[i].key = response.data.maxTransferAmount + '';
						}
						if (i === 1) {
							this.tableData[i].key = response.data.maxTransferAmountCount + '';
						}if (i === 2) {
							this.tableData[i].key = response.data.dayMaxRechargeAmount + '';
						}if (i === 3) {
							this.tableData[i].key = response.data.dayMaxRechargeAmountCount + '';
						}
						if (i === 4) {
							this.tableData[i].key = response.data.singleMaximumWithdrawalAmount + '';
						}
						if (i === 5) {
							this.tableData[i].key = response.data.singleMinimumWithdrawalAmount + '';
						}
						if (i === 6) {
							this.tableData[i].key = response.data.dayMaxWithdrawAmount + '';
						}
						if (i === 7) {
							this.tableData[i].key = response.data.withdrawCode + '';
						}
						if (i === 8) {
							this.tableData[i].key = response.data.dayMaxWithdrawAmountCount + '';
						}
						if (i === 9) {
							this.tableData[i].key = response.data.maximumAmountOfASingleRedEnvelope + '';
						}
						if (i === 10) {
							this.tableData[i].key = response.data.maximumAmountOfRedEnvelopesInASingleDay + '';
						}
            if (i === 11) {
            	this.tableData[i].key = response.data.wxpayImg + '';
            }
            if (i === 12) {
            	this.tableData[i].key = response.data.alipayImg + '';
            }
            if (i === 13) {
            	this.tableData[i].key = response.data.serviceCharge + '';
            }
					}
					console.log(this.tableData);
					this.loading = false;
					this.$forceUpdate();
				});
			},
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      ji() {
        console.log(this.value)
      },
      uploadFile(param){
        console.log("uploadFile>>>>>",param,this.uploadKey);
			  let fileObj = param.file;
			  let form = new FormData();
			  form.append("file", fileObj);
			  uploadUrl(form, this.uploadPath).then(response => {
          for(let i = 0,len = this.tableData.length; i < len; i++){
            if(this.tableData[i].name == this.uploadKey){
              this.tableData[i].key = response.data.imgUrl;
            }
          }
						this.$message.success("上传成功，请提交！")
			  });
      },
      // uploadSuccess(res,file,fileList){
      //   console.log("uploadSuccess>>>>>",res);
      // },
      submit(){
        console.log("submit>>>>>",this.tableData);
        let baseConfig = {
          maxTransferAmount: '',
          maxTransferAmountCount: '',
          dayMaxRechargeAmount: '',
          dayMaxRechargeAmountCount: '',
          singleMaximumWithdrawalAmount: '',
          singleMinimumWithdrawalAmount: '',
          dayMaxWithdrawAmount: '',
          withdrawCode: '',
          dayMaxWithdrawAmountCount: '',
          maximumAmountOfASingleRedEnvelope: '',
          maximumAmountOfRedEnvelopesInASingleDay: '',
          wxpayImg:"",
          alipayImg:"",
          serviceCharge: "",
        }
        for (var i = 0; i < this.tableData.length; i++) {
					if (i === 0) {
						baseConfig.maxTransferAmount = this.tableData[i].key
					}
					if (i ===1) {
						baseConfig.maxTransferAmountCount = this.tableData[i].key
					}
					if (i ===2) {
						baseConfig.dayMaxRechargeAmount = this.tableData[i].key
					}
					if (i ===3) {
						baseConfig.dayMaxRechargeAmountCount = this.tableData[i].key
					}
					if (i === 4) {
						baseConfig.singleMaximumWithdrawalAmount = this.tableData[i].key
					}
					if (i === 5) {
						baseConfig.singleMinimumWithdrawalAmount = this.tableData[i].key
					}
					if (i === 6) {
						baseConfig.dayMaxWithdrawAmount = this.tableData[i].key
					}
					if (i === 7) {
						baseConfig.withdrawCode = this.tableData[i].key
					}
					if (i === 8) {
						baseConfig.dayMaxWithdrawAmountCount = this.tableData[i].key
					}
					if (i === 9) {
						baseConfig.maximumAmountOfASingleRedEnvelope = this.tableData[i].key
					}
					if (i === 10) {
						baseConfig.maximumAmountOfRedEnvelopesInASingleDay = this.tableData[i].key
					}
          if (i === 11) {
          		baseConfig.wxpayImg = this.tableData[i].key
          	}

          if (i === 12) {
          		baseConfig.alipayImg = this.tableData[i].key
          	}

          if (i === 13) {
          		baseConfig.serviceCharge = this.tableData[i].key
          	}

				}

				updateConfig(baseConfig).then(response => {
					if (response.code === 200) {
						this.$message.success("更新成功")
						this.getList()
					} else {
						this.$message.error("未更新")
					}
				})
      }
    }
  }
</script>

<style scoped="scoped">
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
</style>
