<template>
	<div class="app-container">
		<el-table v-loading="loading" :data="tableData" border>
			<el-table-column label="参数说明">
				<template slot-scope="scope">
					<span>{{ scope.row.host }}</span>
				</template>
			</el-table-column>


			<el-table-column label="参数值">
				<template slot-scope="scope">

					<span v-if="scope.row.status==1">
						<el-select v-model="scope.row.key" placeholder="请选择" style="width: 100%;">
							<el-option v-for="dict in options2" :key="dict.value" :label="dict.label"
								:value="dict.value">
							</el-option>
						</el-select>
					</span>
					<span v-if="scope.row.status==2">
						<el-select v-model="scope.row.key" placeholder="请选择" style="width: 100%;" @change="(val)=>selectChange(val,scope.row)">
							<el-option v-for="dict in options" :key="dict.value" :label="dict.label"
								:value="dict.value">
							</el-option>
						</el-select>
					</span>
					<span v-if="scope.row.status==3">
						<el-input v-model="scope.row.key" placeholder="请输入..."></el-input>
					</span>
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
			<el-button type="primary" @click="handleEdit">确定提交</el-button>
		</div>

		<!-- 生成Google二维码-->
		<el-dialog class="qrcode-dialog" title="Google验证码" :visible.sync="qrCodeBox" width="500px" append-to-body>
		<div class="dialog-body" style="text-algin: center;">
			<div ref="qrcode" id="qrcode" style="display: inline-block"></div>
			<div style="margin-top: 15px;">请使用谷歌身份验证器扫码绑定</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" @click="qrCodeBox = false">关 闭</el-button>
		</div>
		</el-dialog>
	</div>
</template>
<script>
	import {
		getConfig,
		updateConfig
	} from "@/api/system/appConfig";
	import QRCode from 'qrcodejs2';

	export default {
		data() {
			return {
				loading: true,
				options: [{
					value: "1",
					label: '开启'
				}, {
					value: "2",
					label: '关闭'
				}],
				options2: [{
					value: '0',
					label: '账号注册'
				}, {
					value: '1',
					label: '手机号码注册'
				}],
				tableData: [{
						host: '账号注册方式',
						key: '',
						status: 1,
						name: 'registerType',
						type: 'value 0：用户名注册   1：手机号注册'
					},
					{
						host: '手机号添加好友',
						key: '',
						status: 2,
						name: 'searchPhone',
						type: 'value 开启1 关闭2'
					}, {
						host: '账号添加好友',
						key: '',
						status: 2,
						name: 'searchName',
						type: 'value 开启1 关闭2'
					}, {
						host: 'ID号添加好友',
						key: '',
						status: 2,
						name: 'searchCornet',
						type: 'value 开启1 关闭2'
					},
					{
						host: '注册图形验证码',
						key: '',
						status: 2,
						name: 'verificationCode	',
						type: 'value 开启1 关闭2'
					}, {
						host: '添加好友',
						key: '',
						status: 2,
						name: 'addFriends',
						type: 'value 开启1 关闭2'
					}, {
						host: '只允许认证商家建群',
						key: '',
						status: 2,
						name: 'createGroup	',
						type: 'value 开启1 关闭2'
					}, {
						host: '定位服务	',
						key: '',
						status: 2,
						name: 'locationServices',
						type: 'value 开启1 关闭2'
					}, {
						host: '语音通话',
						key: '',
						status: 2,
						name: 'voiceCall	',
						type: 'value 开启1 关闭2'
					}, {
						host: '视频通话	',
						key: '',
						status: 2,
						name: 'videoCall',
						type: 'value 开启1 关闭2'
					}, {
						host: '动态/朋友圈功能	',
						key: '',
						status: 2,
						name: 'momentsFunction ',
						type: 'value 开启1 关闭2'
					}, {
						host: '邀请码注册',
						key: '',
						status: 2,
						name: 'invitationCode',
						type: 'value 开启1 关闭2'
					}, {
						host: '红包功能',
						key: '',
						status: 2,
						name: 'isOpenRedpacket ',
						type: 'value 开启1 关闭2'
					}, {
						host: '钱包功能',
						key: '',
						status: 2,
						name: 'isOpenWallet',
						type: 'value 开启1 关闭2'
					}, {
						host: '发消息间隔',
						key: '',
						status: 3,
						name: 'msgInterval',
						type: '请输入间隔时间'
					}, {
						host: '群昵称开关',
						key: '',
						status: 2,
						name: 'groupNickname',
						type: 'value 开启1 关闭2'
					}, {
						host: '群视频开关',
						key: '',
						status: 2,
						name: 'groupVideo',
						type: 'value 开启1 关闭2'
					}, {
						host: '菜单',
						key: '',
						status: 2,
						name: 'isMenu',
						type: ''
					}, {
						host: '日历',
						key: '',
						status: 2,
						name: 'isCalendar',
						type: ''
					}, {
						host: '群踢人拉人撤回禁言不通知普通群员',
						key: '',
						status: 2,
						name: 'groupNotice',
						type: 'value 开启1 关闭2'
					}, {
						host: '位置功能',
						key: '',
						status: 2,
						name: 'position',
						type: 'value 开启1 关闭2'
					}, {
						host: '群踢人后是否删除消息',
						key: '',
						status: 2,
						name: 'isDelGroupMsg',
						type: 'value 开启1 关闭2'
					}, {
						host: 'Google验证码	',
						key: '',
						status: 2,
						name: 'isGoogleCode',
						type: 'value 开启1 关闭2'
					},{
						host: 'IP白名单',
						key: '',
						status: 3,
						name: 'ipList',
						type: '多个ip用 # 号隔开'
					},{
						host: '默认添加群号',
						key: '',
						status: 3,
						name: 'groupNumber',
						type: '请输入群号'
					},{
						host: '默认添加账号',
						key: '',
						status: 3,
						name: 'customerServiceNumber',
						type: '请输入账号id'
					},{
						host: '微信快捷登录',
						key: '',
						status: 2,
						name: 'isWxLogin',
						type: 'value 开启1 关闭2'
					},{
						host: '获取手机通讯录',
						key: '',
						status: 2,
						name: 'isUserPhone',
						type: 'value 开启1 关闭2'
					},{
						host: '微信AppID',
						key: '',
						status: 3,
						name: 'appId',
						type: '请输入微信AppID'
					},{
						host: '微信appSecret',
						key: '',
						status: 3,
						name: 'appSecret',
						type: '请输入微信AppSecret'
					},{
            host: '文件基础路径',
            key: '',
            status: 3,
            name: 'fileUrl',
            type: '请输入文件请求基础路径（如：http://file.xxx.xxx）'
          },{
            host: '聊天文件基础路径',
            key: '',
            status: 3,
            name: 'imfileUrl',
            type: '请输入聊天文件请求基础路径（如：http://im.xxx.xxx）'
          },{
            host: '消息漫游是否开启',
            key: '',
            status: 2,
            name: 'roamingMsg',
            type: 'value 是1 否2'
          },{
            host: '禁止充值开始日期',
            key: '',
            status: 3,
            name: 'prohibitRechargeWithdrawalStart',
            type: '禁止充值开始日期'
          },{
            host: '禁止充值开始日期',
            key: '',
            status: 3,
            name: 'prohibitRechargeWithdrawalEnd',
            type: '禁止充值结束日期'
          },{
            host: '好友请求每日阀值',
            key: '',
            status: 3,
            name: 'friendRequestNum',
            type: '好友请求每日阀值'
          },{
            host: '好友搜锁间隔秒数阀值',
            key: '',
            status: 3,
            name: 'searchUserNum',
            type: '好友搜锁间隔秒数阀值'
          }

				],
				value: 1,
      			qrCodeBox: false,
				qrcode: null,
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
							this.tableData[i].key = response.data.registerType + '';
						}
						if (i === 1) {
							this.tableData[i].key = response.data.searchPhone + '';
						}if (i === 2) {
							this.tableData[i].key = response.data.searchName + '';
						}if (i === 3) {
							this.tableData[i].key = response.data.searchCornet + '';
						}
						if (i === 4) {
							this.tableData[i].key = response.data.verificationCode + '';
						}
						if (i === 5) {
							this.tableData[i].key = response.data.addFriends + '';
						}
						if (i === 6) {
							this.tableData[i].key = response.data.createGroup + '';
						}
						if (i === 7) {
							this.tableData[i].key = response.data.locationServices + '';
						}
						if (i === 8) {
							this.tableData[i].key = response.data.voiceCall + '';
						}
						if (i === 9) {
							this.tableData[i].key = response.data.videoCall + '';
						}
						if (i === 10) {
							this.tableData[i].key = response.data.momentsFunction + '';
						}
						if (i ===11) {
							this.tableData[i].key = response.data.invitationCode + '';
						}
						if (i === 12) {
							this.tableData[i].key = response.data.isOpenRedpacket + '';
						}
						if (i ===13) {
							this.tableData[i].key = response.data.isOpenWallet + '';
						}
						if (i ===14) {
							this.tableData[i].key = response.data.msgInterval + '';
						}
						if (i ===15) {
							this.tableData[i].key = response.data.groupNickname + '';
						}
						if (i ===16) {
							this.tableData[i].key = response.data.groupVideo + '';
						}
						if (i ===17) {
							this.tableData[i].key = response.data.isMenu + '';
						}
						if (i ===18) {
							this.tableData[i].key = response.data.isCalendar + '';
						}
						if (i ===19) {
							this.tableData[i].key = response.data.groupNotice + '';
						}
						if (i ===20) {
							this.tableData[i].key = response.data.position + '';
						}
						if (i ===21) {
							this.tableData[i].key = response.data.isDelGroupMsg + '';
						}
						if (i ===22) {
							this.tableData[i].key = response.data.isGoogleCode + '';
						}
						if (i ===23) {
							this.tableData[i].key = response.data.ipList + '';
						}
						if (i ===24) {
							this.tableData[i].key = response.data.groupNumber + '';
						}
						if (i ===25) {
							this.tableData[i].key = response.data.customerServiceNumber + '';
						}
						if (i ===26) {
							this.tableData[i].key = response.data.isWxLogin + '';
						}
						if (i ===27) {
							this.tableData[i].key = response.data.isUserPhone + '';
						}
						if (i ===28) {
							this.tableData[i].key = response.data.appId + '';
						}
						if (i ===29) {
							this.tableData[i].key = response.data.appSecret + '';
						}
						if (i ===30) {
							this.tableData[i].key = response.data.fileUrl + '';
						}
            if (i ===31) {
              this.tableData[i].key = response.data.imfileUrl + '';
            }

            if (i ===32) {
              this.tableData[i].key = response.data.roamingMsg + '';
            }
            if (i ===33) {
              this.tableData[i].key = response.data.prohibitRechargeWithdrawalStart + '';
            }
            if (i ===34) {
              this.tableData[i].key = response.data.prohibitRechargeWithdrawalEnd+ '';
            }
            if (i ===35) {
              this.tableData[i].key = response.data.friendRequestNum + '';
            }
            if (i ===36) {
              this.tableData[i].key = response.data.searchUserNum + '';
            }
					}
					console.log(this.tableData);
					this.loading = false;
					this.$forceUpdate();
				});
			},
			handleEdit() {
				console.log("------------------------------------")
				var baseConfig = {
					registerType: '',
					searchPhone:'',
					searchName:"",
					searchCornet:"",
					verificationCode: '',
					addFriends: '',
					createGroup: '',
					locationServices: '',
					voiceCall: '',
					videoCall: '',
					momentsFunction: '',
					invitationCode:'',
					isOpenRedpacket: '',
					isOpenWallet:'',
					msgInterval: '',
					groupNickname: '',
					groupVideo: '',
					isMenu: '',
					isCalendar: '',
					groupNotice: '',
					position: '',
					isDelGroupMsg: '',
					isGoogleCode: '',
					ipList: '',
					groupNumber: '',
					customerServiceNumber: '',
					isWxLogin: '',
					isUserPhone: '',
					appId: '',
					appSecret: '',
					fileUrl: '',
          roamingMsg: '',
          prohibitRechargeWithdrawalEnd: '',
          prohibitRechargeWithdrawalStart: '',
					imfileUrl: '',
          friendRequestNum: '',
          searchUserNum: ''
				}

				for (var i = 0; i < this.tableData.length; i++) {
					if (i === 0) {
						baseConfig.registerType = this.tableData[i].key
					}
					if (i ===1) {
						baseConfig.searchPhone = this.tableData[i].key
					}
					if (i ===2) {
						baseConfig.searchName = this.tableData[i].key
					}
					if (i ===3) {
						baseConfig.searchCornet = this.tableData[i].key
					}

					if (i === 4) {
						baseConfig.verificationCode = this.tableData[i].key
					}
					if (i === 5) {
						baseConfig.addFriends = this.tableData[i].key
					}
					if (i === 6) {
						baseConfig.createGroup = this.tableData[i].key
					}
					if (i === 7) {
						baseConfig.locationServices = this.tableData[i].key
					}
					if (i === 8) {
						baseConfig.voiceCall = this.tableData[i].key
					}
					if (i === 9) {
						baseConfig.videoCall = this.tableData[i].key
					}
					if (i === 10) {
						baseConfig.momentsFunction = this.tableData[i].key
					}
					if (i ===11) {
						baseConfig.invitationCode = this.tableData[i].key
					}
					if (i === 12) {
						baseConfig.isOpenRedpacket = this.tableData[i].key
					}
					if (i ===13) {
						baseConfig.isOpenWallet = this.tableData[i].key
					}
					if (i ===14) {
						baseConfig.msgInterval = this.tableData[i].key
					}
					if (i ===15) {
						baseConfig.groupNickname = this.tableData[i].key
					}
					if (i ===16) {
						baseConfig.groupVideo = this.tableData[i].key
					}
					if (i ===17) {
						baseConfig.isMenu = this.tableData[i].key
					}
					if (i ===18) {
						baseConfig.isCalendar = this.tableData[i].key
					}
					if (i ===19) {
						baseConfig.groupNotice = this.tableData[i].key
					}
					if (i ===20) {
						baseConfig.position = this.tableData[i].key
					}
					if (i ===21) {
						baseConfig.isDelGroupMsg = this.tableData[i].key
					}
					if (i ===22) {
						baseConfig.isGoogleCode = this.tableData[i].key
					}
          if (i ===23) {
            baseConfig.ipList = this.tableData[i].key
          }

					if (i ===24) {
						baseConfig.groupNumber = this.tableData[i].key
					}
					if (i ===25) {
						baseConfig.customerServiceNumber = this.tableData[i].key
					}
					if (i ===26) {
						baseConfig.isWxLogin = this.tableData[i].key
					}
					if (i ===27) {
						baseConfig.isUserPhone = this.tableData[i].key
					}
					if (i ===28) {
						baseConfig.appId = this.tableData[i].key
					}
					if (i ===29) {
						baseConfig.appSecret = this.tableData[i].key
					}
					if (i ===30) {
						baseConfig.fileUrl = this.tableData[i].key
					}
          if (i ===31) {
            baseConfig.imfileUrl = this.tableData[i].key
          }
          if (i ===32) {
            baseConfig.roamingMsg = this.tableData[i].key
          }
          if (i ===33) {
            baseConfig.prohibitRechargeWithdrawalStart = this.tableData[i].key
          }
          if (i ===34) {
            baseConfig.prohibitRechargeWithdrawalEnd = this.tableData[i].key
          }
          if (i ===35) {
            baseConfig.friendRequestNum = this.tableData[i].key
          }
          if (i ===36) {
            baseConfig.searchUserNum = this.tableData[i].key
          }

				}

				console.log(baseConfig)
				updateConfig(baseConfig).then(response => {
					if (response.code === 200) {
						this.$message.success("更新成功")
						this.getList()
					} else {
						this.$message.error("未更新")
					}
				})
			},
			selectChange(val,row){
				if (row.name == 'isGoogleCode' && val == 1) {
					console.log("selectChange>>>>>",val,row);
					this.getGoogleCode();
				}
			},
			getGoogleCode(){
			this.qrCodeBox = true;
			this.$nextTick(_=>{
				const qrcodeDemo = this.$refs.qrcode;
				if(this.qrcode) {
					qrcodeDemo.innerHTML = '';
				}
				console.log("getGoogleCode>>>>>",this.$store.state);
				let str = `otpauth://totp/${this.$store.state.user.userMail}?secret=${this.$store.state.user.googleSecret}`
				this.qrcode = new QRCode(qrcodeDemo, {
					width: 200,
					height: 200, // 高度
					text: str, // 二维码内容
					// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					// background: '#f0f'
					// foreground: '#ff0'
				});
			});

			}
		}
	}
</script>

<style lang="scss" scoped="scoped">

.qrcode-dialog{
  .dialog-body{
    text-align: center;
  }
}
</style>
