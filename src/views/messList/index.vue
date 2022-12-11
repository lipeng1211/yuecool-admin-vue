<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">

      <el-form-item label="发送人" prop="gName">
        <el-input v-model="queryParams.srcUid" placeholder="发送人ID" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="接收人" prop="gName">
        <el-input v-model="queryParams.destUid" placeholder="接收人ID" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="关键词" prop="gName">
        <el-input v-model="queryParams.msgContent" placeholder="关键词内容" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>

     <el-form-item>
       <el-button type="success" icon="el-icon-delete" size="mini" @click="deleteByTime('all')"  v-hasPermi="['messageList:message:remove']">删除当前全部聊天记录</el-button>
     </el-form-item>

     <el-form-item>
       <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteByTime('week') "  v-hasPermi="['messageList:message:remove']">删除一周前全部聊天记录</el-button>
     </el-form-item>

     <el-form-item>
       <el-button type="warning" icon="el-icon-delete" size="mini" @click="deleteByTime('moth')"   v-hasPermi="['messageList:message:remove']">删除一个月前全部聊天记录</el-button>
     </el-form-item>

    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['messageList:message:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
<!-- class="k_line" -->
    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="消息ID" align="center" prop="collectId" width="120" />
      <el-table-column label="发送人ID " align="center" prop="srcUid" width="120" />
      <el-table-column label="接收人ID" align="center" prop="destUid" width="120" />
      <el-table-column label="消息类型" align="center" prop="msgType" :formatter="msgTypeFormat" >
<!--        <template slot-scope="scope">-->
<!--          <div>1 文本</div>-->
<!--          <div>2 图片</div>-->
<!--          <div>3 文件</div>-->
<!--          <div>4 音频</div>-->
<!--          <div>5 视频</div>-->
<!--          <div>6 名片</div>-->
<!--          <div>7 位置</div>-->
<!--          <div>8 录音</div>-->
<!--          <div>9 结束音频通话</div>-->
<!--          <div>10 结束视频通话</div>-->
<!--        </template>-->
      </el-table-column>
      <el-table-column label="发送时间" align="center" prop="msgTime" width="150" />
      <el-table-column label="查看状态" align="center" prop="gMemberCount">

        <template slot-scope="scope">
          <div>已读</div>
        </template>
      </el-table-column>

      <el-table-column label="内容" align="center"  width="300">

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
          <!-- <el-image v-else-if="Number(scope.row.msgType)==6"
            style="height: 100px"
            :src="baseUrl + '/yuecoolChat/ShortVideoDownloader?file_name=' + JSON.parse(scope.row.msgContent).fileName"
            :preview-src-list="srcList">
          </el-image> -->
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
          <span v-else-if="Number(scope.row.msgType)==90">
            {{scope.row.msgContent}}
          </span>
          <span v-else>
            {{scope.row.msgContent}}
          </span>
        </template>

      </el-table-column>
    <!--  <el-table-column label="内容" align="center" width="300">
        <img src="../../assets/image/profile.jpg" class="k_img" @click="imgShow()" />
        <img src="../../assets/image/profile.jpg" class="k_img" @click="imgShow()" />
        <img src="../../assets/image/profile.jpg" class="k_img" @click="imgShow()" />
        <img src="../../assets/image/profile.jpg" class="k_img" @click="imgShow()" />
        <img src="../../assets/image/profile.jpg" class="k_img" @click="imgShow()" />
        <img src="../../assets/image/profile.jpg" class="k_img" @click="imgShow()" />
      </el-table-column> -->

      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['messageList:message:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 查看动态 -->
    <el-dialog title="动态详情" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div>
        这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容这是内容
      </div>

      <div class="imgList">
        <img src="../../assets/image/profile.jpg" />
        <img src="../../assets/image/profile.jpg" />
        <img src="../../assets/image/profile.jpg" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
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
    listGroup,
    getGroup,
    delGroup,
    addGroup,
    updateGroup,
    exportGroup
  } from "@/api/group/group";

  import {
    listMessage,
    getMessage,
    addMessage,
    updateMessage,
    delMessage,
    exportMessage,
    delMessageByTime
  } from "@/api/messageList/message";

  import BenzAMRRecorder from 'benz-amr-recorder';

  import request from '@/utils/request'
	import {
		getConfig
	} from "@/api/system/appConfig";

  export default {
    name: "Group",
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
          id: 1
        }],
        // 弹出层标题
        title: "",
        // 聊天消息类型：0 普通文本消息1 图片消息2 语音留言字典
        msgTypeOptions: [],
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

      };
    },
    created() {
      getConfig().then(res => {
        this.baseUrl = res.data.fileUrl;
      });
      this.getList();
      this.loading = false;
      this.getDicts("message_type").then(response => {
        this.msgTypeOptions = response.data;
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
        // request({
        //   url: url,
        //   method: 'get',
        //   responseType: 'blob'
        // }).then(res=>{
        //   console.log("playAudio>>>>>",res);
        //   const audioContext = new AudioContext();
        //   const reader = new FileReader();
        //   reader.readAsArrayBuffer(res);
        //   reader.onload = (result)=>{
        //     console.log("reader>>>>>",result.currentTarget.result);
        //     audioContext.decodeAudioData(result.currentTarget.result,buffer=>{
        //       const source = audioContext.createBufferSource();
        //       source.buffer = buffer;
        //       source.connect(audioContext.destination);
        //       source.start(0);
        //     });
        //   }

        //   // const ablob = new Blob([res], {type:'audio/amr'});
        //   // this.audioSrc = window.URL.createObjectURL(ablob);
        //   // console.log("audioSrc>>>>>",this.audioSrc);

        // });
      },
      showVideo(row){
        this.videoBox = true;
        let url =  this.baseUrl + '/yuecoolChat/ShortVideoDownloader?file_name=' + JSON.parse(row.msgContent).fileName+ '&file_md5=' +JSON.parse(row.msgContent).fileMd5
        this.$nextTick(_=>{
          this.videoSrc = url;
        });
      },
      groupBan(data, status) {

      },
      imgShow() {
        this.dialogVisible = true
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
        listMessage(this.queryParams).then(response => {
          this.messageList = response.rows;
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

      // 聊天消息类型：0 普通文本消息1 图片消息2 语音留言字典翻译
      msgTypeFormat(row, column) {
        return this.selectDictLabel(this.msgTypeOptions, row.msgType);
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
        const collectIds = row.collectId || this.ids;
        this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMessage(collectIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      deleteByTime(type){
        this.$confirm('是否确认删除?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMessageByTime(type);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      }

    }
  };
</script>
<style scoped="scoped">
  .k_img {
    width: 35px;
    border-radius: 4px;
    /* margin: 2px; */
    margin-right: 4px;
    margin-top: 2px;
    cursor: pointer;
  }

  .imgList>img {
    width: 90px;
    cursor: pointer;
    margin: 5px;
    border-radius: 4px;
  }
</style>
