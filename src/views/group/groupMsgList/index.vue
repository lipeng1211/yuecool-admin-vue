<!-- <template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">

      <el-form-item label="关键词" prop="gName">
        <el-input v-model="queryParams.gName" placeholder="请输入关键词" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>


      <el-form-item>
        <el-button type="success" icon="el-icon-delete" size="mini" @click="deleteMonthLogs">删除当前全部聊天记录</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteThousandAgoLogs">删除一周前全部聊天记录</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="warning" icon="el-icon-delete" size="mini" @click="deleteThousandAgoLogs">删除一个月前全部聊天记录</el-button>
      </el-form-item>

    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['group:group:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="群组ID" align="center" prop="id" />
      <el-table-column label="消息ID" align="center" prop="gId" />
      <el-table-column label="查看状态" align="center" prop="gId">
        <template slot-scope="scope">
          <span>10人已读</span>
        </template>
      </el-table-column>
      <el-table-column label="发送者ID" align="center" prop="gName" />
      <el-table-column label="发送者昵称" align="center" prop="gNotice" />
      <el-table-column label="消息类型" align="center" prop="gMemberCount">
        <template slot-scope="scope">
          <div>1 文本</div>
          <div>2 图片</div>
          <div>3 文件</div>
          <div>4 音频</div>
          <div>5 视频</div>
          <div>6 名片</div>
          <div>7 位置</div>
          <div>8 录音</div>
          <div>9 结束音频通话</div>
          <div>10 结束视频通话</div>
        </template>
      </el-table-column>
      <el-table-column label="内容" align="center" prop="gMemberCount" width="300">
        <template slot-scope="scope">
          <div>类型 位置 （内容 ：位置经度： ， 纬度:） </div>
          <div>类型 名片 （内容 ：名片用户id：xxxx） </div>

          <div>类型 结束音频通话 (内容：音频通话时长:00:12 ； 未接通音频通话)</div>
          <div>类型 结束视频通话 (内容：视频通话时长:00:12 ； 未接通视频通话)</div>

        </template>
      </el-table-column>


      <el-table-column label="发送时间" align="center" prop="gMemberCount" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <el-button plain size="small" type="primary" class="input" @click="handleUrl(scope.row)" >未读成员列表</el-button>
        </template>
      </el-table-column>

    </el-table>




    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <el-button @click="back" icon="el-icon-back" v-show="showSearch" class="back">返回上一步</el-button>

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
        loading: false,
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
          id: 1
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
        rules: {}
      };
    },
    created() {
      // this.getList();
    },
    methods: {
      handleUrl(){

        this.$router.push({
          path: "/group/groupUnread",
          query: {
            id: 1
          }
        })
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
      back() {
        this.$router.back(-1)
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
        // this.getList();
        this.loading = false;
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
      }

    }
  };
</script>
<style scoped="scoped">
  .k_img {
    width: 40px;
    border-radius: 4px;
    margin: 4px 4px;
  }
</style>
 -->


<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
			<el-form-item label="发送人ID" prop="srcUid">
				<el-input v-model="queryParams.srcUid" placeholder="请输入发送人的ID" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="接收人ID" prop="destUid">
				<el-input v-model="queryParams.destUid" placeholder="请输入接收人的ID" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<!-- <el-form-item label="聊天模式类型：
 0 正式一对一聊天；
 1 临时一对一聊天；
 2 群聊或世界频道聊天" prop="chatType"> -->
			<!-- <el-select v-model="queryParams.chatType" placeholder="请选择聊天模式类型：
 0 正式一对一聊天；
 1 临时一对一聊天；
 2 群聊或世界频道聊天" clearable size="small">
					<el-option label="请选择字典生成" value="" />
				</el-select> -->
			</el-form-item>
			<el-form-item label="聊天消息类型" prop="msgType">
				<el-select v-model="queryParams.msgType" placeholder="请选择聊天消息类型" clearable size="small">
					<el-option label="请选择字典生成" value="" />
				</el-select>
			</el-form-item>
			<el-form-item label="发生时间" prop="msgTime">
				<el-date-picker clearable size="small" style="width: 200px" v-model="queryParams.msgTime" type="date"
					value-format="yyyy-MM-dd" placeholder="选择发生时间">
				</el-date-picker>
			</el-form-item>
			<!-- 		<el-form-item label="发生时间戳" prop="msgTime2">
				<el-input v-model="queryParams.msgTime2" placeholder="请输入发生时间戳" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item> -->
			<!-- <el-form-item label="消息发送时的在线人数：
 数据可助于分析消息推送时的服务端压力等。" prop="onlineCount">
				<el-input v-model="queryParams.onlineCount" placeholder="请输入消息发送时的在线人数：
 数据可助于分析消息推送时的服务端压力等。" clearable size="small" @keyup.enter.native="handleQuery" />
			</el-form-item> -->
			<!-- <el-form-item label="消息指纹码(唯一id)" prop="fingerprint">
				<el-input v-model="queryParams.fingerprint" placeholder="请输入消息指纹码(唯一id)" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item> -->
			<el-form-item>
				<el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<!-- <el-col :span="1.5">
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:archived:add']">新增</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
					v-hasPermi="['system:archived:edit']">修改</el-button>
			</el-col> -->
			<el-col :span="1.5">
				<el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:archived:remove']">删除</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:archived:export']">导出</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="archivedList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="记录ID" align="center" prop="collectId" />
			<el-table-column label="发送人的ID" align="center" prop="srcUid" />
			<el-table-column label="接收人的ID" align="center" prop="destUid" />
			<!-- <el-table-column label="聊天模式类型：
 0 正式一对一聊天；
 1 临时一对一聊天；
 2 群聊或世界频道聊天" align="center" prop="chatType" /> -->
			<el-table-column label="消息类型" align="center" prop="msgType">
				<template slot-scope="scope">
					<span v-for="(it , index) in msgType" :key="index">
						<span v-if="scope.row.msgType== Number(it.dictValue) " style="color: #018EF8;">
							{{it.dictLabel}}
						</span>
					</span>
				</template>
			</el-table-column>

			<el-table-column label="消息内容" align="center" prop="msgContent" width="200" :show-overflow-tooltip="true">
				<template slot-scope="scope">
					<el-image v-if="Number(scope.row.msgType)==1"
						style="height: 100px"
						fit="contain"
						:src="baseUrl + '/yuecoolChat/BinaryDownloader?action=image_d&file_name=' +scope.row.msgContent + '&need_dump=0' "
						:preview-src-list="[`${baseUrl}/yuecoolChat/BinaryDownloader?action=image_d&file_name=${scope.row.msgContent}&need_dump=0`]">
					</el-image>
					<span v-else-if="Number(scope.row.msgType)==2">
						<el-button
						v-if="isPlay"
						style="font-size: 18px;"
						type="text"
						size="mini"
						icon="el-icon-video-pause"
						@click="stopAudio(scope.row)"
						>
						</el-button>
						<el-button
						v-else
						style="font-size: 18px;"
						type="text"
						size="mini"
						icon="el-icon-video-play"
						:loading="audioLoading"
						@click="playAudio(scope.row)"
						>
						</el-button>
						<div style="color: #409EFF;">[语音消息]</div>
					</span>
					<span v-else-if="Number(scope.row.msgType)==3">
						[赠送礼物]
					</span>
					<span v-else-if="Number(scope.row.msgType)==4">
						[索要礼物消息]
					</span>
					<span v-else-if="Number(scope.row.msgType)==5">
						[文件消息]
					</span>
					<span v-else-if="Number(scope.row.msgType)==6">
						<el-button type="text"
									size="mini"
									@click="showVideo(scope.row)">
							[短视频消息]
						</el-button>
					</span>
					<span v-else-if="Number(scope.row.msgType)==7">
						[名片]
					</span>
					<span v-else-if="Number(scope.row.msgType)==8">
						[位置消息]
					</span>
					<span v-else-if="Number(scope.row.msgType)==10">
						[发红包]
					</span>
					<span v-else-if="Number(scope.row.msgType)==11">
						[撤回消息]
					</span>
					<span v-else-if="Number(scope.row.msgType)==12">
						[禁言]
					</span>
					<span v-else-if="Number(scope.row.msgType)==13">
						[抢红包]
					</span>
					<span v-else-if="Number(scope.row.msgType)==14">
						{{'设置'+ JSON.parse(scope.row.msgContent).nicNames +'为管理员'}}
					</span>
					<span v-else-if="Number(scope.row.msgType)==15">
						{{JSON.parse(scope.row.msgContent).content}}
					</span>
					<span v-else-if="Number(scope.row.msgType)==90">
						{{scope.row.msgContent}}
					</span>
					<span v-else>
						{{scope.row.msgContent}}
					</span>
				</template>
			</el-table-column>

			<el-table-column label="发生时间" align="center" prop="msgTime" width="180">
				<template slot-scope="scope">
					<span>{{scope.row.msgTime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="发生时间戳" align="center" prop="msgTime2" />
			<el-table-column label="消息发送时的在线人数" align="center" prop="onlineCount" />
			<el-table-column label="消息指纹码" align="center" prop="fingerprint" width="120"
				:show-overflow-tooltip="true" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:archived:edit']">修改</el-button> -->
					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
						v-hasPermi="['system:archived:remove']">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过

 收集用户消息的目的是有助于分析用户行为，用户消息本身对公司而言没有多大意义且违背用户隐私条款，目前先这样吧，以后或需停止收集。对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="发送人的ID" prop="srcUid">
					<el-input v-model="form.srcUid" placeholder="请输入发送人的ID" />
				</el-form-item>
				<el-form-item label="接收人的ID" prop="destUid">
					<el-input v-model="form.destUid" placeholder="请输入接收人的ID" />
				</el-form-item>
				<el-form-item label="聊天模式类型：
 0 正式一对一聊天；
 1 临时一对一聊天；
 2 群聊或世界频道聊天" prop="chatType">
					<el-select v-model="form.chatType" placeholder="请选择聊天模式类型：
 0 正式一对一聊天；
 1 临时一对一聊天；
 2 群聊或世界频道聊天">
						<el-option label="请选择字典生成" value="" />
					</el-select>
				</el-form-item>
				<el-form-item label="聊天消息类型：
 0 普通文本消息
 1 图片消息
 2 语音留言" prop="msgType">
					<el-select v-model="form.msgType" placeholder="请选择聊天消息类型：
 0 普通文本消息
 1 图片消息
 2 语音留言">
						<el-option label="请选择字典生成" value="" />
					</el-select>
				</el-form-item>
				<el-form-item label="消息内容：
 1）当消息类型是文本消息时，本字段存放的是文本消息内容。
 2）当消息类型是图片消息时，本字段存放的是暂存于服务端的图片原文件">
					<editor v-model="form.msgContent" :min-height="192" />
				</el-form-item>
				<el-form-item label="发生时间" prop="msgTime">
					<el-date-picker clearable size="small" style="width: 200px" v-model="form.msgTime" type="date"
						value-format="yyyy-MM-dd" placeholder="选择发生时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="发生时间戳" prop="msgTime2">
					<el-input v-model="form.msgTime2" placeholder="请输入发生时间戳" />
				</el-form-item>
				<el-form-item label="消息发送时的在线人数：
 数据可助于分析消息推送时的服务端压力等。" prop="onlineCount">
					<el-input v-model="form.onlineCount" placeholder="请输入消息发送时的在线人数：
 数据可助于分析消息推送时的服务端压力等。" />
				</el-form-item>
				<el-form-item label="消息指纹码(唯一id)" prop="fingerprint">
					<el-input v-model="form.fingerprint" placeholder="请输入消息指纹码(唯一id)" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 视频-->
		<el-dialog class="qrcode-dialog" title="视频预览" :visible.sync="videoBox" width="500px" append-to-body>
			<div class="dialog-body" style="text-algin: center;">
				<video :src="videoSrc" controls="controls" autoplay="autoplay" style="width: 100%;"></video>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="videoBox = false">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		listArchived,
		getArchived,
		delArchived,
		addArchived,
		updateArchived,
		exportArchived
	} from "@/api/system/archived";


	import {uploadPath} from "@/api/system/upload.js"

	import Editor from '@/components/Editor';

  	import BenzAMRRecorder from 'benz-amr-recorder';

  	import request from '@/utils/request'

	import {
		getConfig
	} from "@/api/system/appConfig";

	export default {
		name: "Archived",
		components: {
			Editor
		},
		data() {
			return {
				baseUrl: this.BaseUrl,
				videoBox: false,
				videoSrc: '',
				audioSrc: '',
				audioLoading: false,
				isPlay: false,
				messageList:[],
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
				// 用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过
				archivedList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 查询参数
				queryParams: {
					destUid: this.$route.query.destUid,
					// destUid: null,
					pageNum: 1,
					pageSize: 10,
					srcUid: null,
					chatType: null,
					msgType: null,
					msgContent: null,
					msgTime: null,
					msgTime2: null,
					onlineCount: null,
					fingerprint: null
				},
				// 表单参数
				form: {},
				// 表单校验
				rules: {
					srcUid: [{
						required: true,
						message: "发送人的ID不能为空",
						trigger: "blur"
					}],
					chatType: [{
						required: true,
						message: "聊天模式类型：0 正式一对一聊天；1 临时一对一聊天；2 群聊或世界频道聊天不能为空",
						trigger: "change"
					}],
					msgType: [{
						required: true,
						message: "聊天消息类型：0 普通文本消息1 图片消息2 语音留言不能为空",
						trigger: "change"
					}],
					msgTime: [{
						required: true,
						message: "发生时间不能为空",
						trigger: "blur"
					}],
					onlineCount: [{
						required: true,
						message: "消息发送时的在线人数：数据可助于分析消息推送时的服务端压力等。不能为空",
						trigger: "blur"
					}],
				},

				msgType: [],
				uploadPath:uploadPath
			};
		},
		created() {
			getConfig().then(res => {
				this.baseUrl = res.data.imfileUrl;
			});
			console.log(uploadPath)
			this.getList();
			this.getDicts("message_type").then(response => {
				this.msgType = response.data;
			});
		},
		methods: {
			playAudio(row){
				this.audioLoading = true;
				let url = `${this.baseUrl}/yuecoolChat/BinaryDownloader?action=voice_d&file_name=${row.msgContent}`;
				const amr = new BenzAMRRecorder();
				amr.initWithUrl(url).then(_=>{
					this.audioLoading = false;
					this.isPlay = true;
					amr.play();
				});
				amr.onEnded(() => {
					this.isPlay = false;
				})
			},
			showVideo(row){
				this.videoBox = true;
				let url =  this.baseUrl + '/yuecoolChat/ShortVideoDownloader?file_name=' + JSON.parse(row.msgContent).fileName+ '&file_md5=' +JSON.parse(row.msgContent).fileMd5
				this.$nextTick(_=>{
					this.videoSrc = url;
				});
			},
			/** 查询用户聊天记录（存档）。超时后的用户聊天记录，将自动转储到本，防止用户的消息记录热数据过

 收集用户消息的目的是有助于分析用户行为，用户消息本身对公司而言没有多大意义且违背用户隐私条款，目前先这样吧，以后或需停止收集。列表 */
			getList() {
				this.loading = true;
				listArchived(this.queryParams).then(response => {
					this.archivedList = response.rows;
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
					collectId: null,
					srcUid: null,
					destUid: null,
					chatType: null,
					msgType: null,
					msgContent: null,
					msgTime: null,
					msgTime2: null,
					onlineCount: null,
					fingerprint: null
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
				this.ids = selection.map(item => item.collectId)
				this.single = selection.length !== 1
				this.multiple = !selection.length
			},
			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
				this.open = true;
				this.title = "添加用户聊天记";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				const collectId = row.collectId || this.ids
				getArchived(collectId).then(response => {
					this.form = response.data;
					this.open = true;
					this.title = "修改用户聊天记录";
				});
			},
			/** 提交按钮 */
			submitForm() {
				this.$refs["form"].validate(valid => {
					if (valid) {
						if (this.form.collectId != null) {
							updateArchived(this.form).then(response => {
								if (response.code === 200) {
									this.msgSuccess("修改成功");
									this.open = false;
									this.getList();
								}
							});
						} else {
							addArchived(this.form).then(response => {
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
				const collectIds = row.collectId || this.ids;
				this.$confirm('是否确认删除所选的的数据项?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(function() {
					return delArchived(collectIds);
				}).then(() => {
					this.getList();
					this.msgSuccess("删除成功");
				}).catch(function() {});
			},
			/** 导出按钮操作 */
			handleExport() {
				const queryParams = this.queryParams;
				this.$confirm('是否确认导出所有用户聊天记录?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(function() {
					return exportArchived(queryParams);
				}).then(response => {
					this.download(response.msg);
				}).catch(function() {});
			}
		}
	};
</script>
