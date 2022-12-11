<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="群名称" prop="gName">
        <el-input v-model="queryParams.gName" placeholder="请输入群名称" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="群主" prop="gOwnerUserUid">
        <el-input v-model="queryParams.gOwnerUserUid" placeholder="请输入群主" clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="gStatus">
        <el-select v-model="queryParams.gStatus" placeholder="请选择状态" clearable size="small">
          <el-option v-for="dict in gStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['group:group:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['group:group:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['group:group:remove']">删除</el-button>
      </el-col>
	  <el-col :span="1.5">
	    <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleRemove"
	      v-hasPermi="['group:group:delete']">销毁</el-button>
	  </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['group:group:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column label="群组ID" align="center" prop="gId" width="120" />
      <el-table-column label="群组状态" align="center" prop="gStatus" :formatter="gStatusFormat" />
      <el-table-column label="群组名称" align="center"  width="120" prop="gName" :show-overflow-tooltip="true" />
      <el-table-column label="群组公告" align="center"  width="120" prop="gNotice" :show-overflow-tooltip="true" />

      <el-table-column label="群主ID" align="center" prop="gOwnerUserUid" />
      <el-table-column label="群主账号" align="center" prop="gOwnerUserUid" />
      <el-table-column label="最高人数" align="center" prop="maxMemberCount" />
      <el-table-column label="群组人数" align="center" prop="gMemberCount" />

      <el-table-column label="创建者ID" align="center" prop="createUserUid" />

      <el-table-column label="创建时间" align="center" prop="createTime" width="200" />

      <el-table-column label="群过期时间" align="center" prop="expirationTime" width="200" />

      <!-- <el-table-column label="封禁群后台id" align="center" prop="forbidUserUid" width="100" /> -->
      <el-table-column label="封禁群时间" align="center" prop="forbidTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.forbidTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封禁群理由" align="center" prop="firbidCause" width="120" />
      <!--<el-table-column label="公告更新时间" align="center" prop="gNoticeUpdatetime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.gNoticeUpdatetime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告更新用户id" align="center" prop="gNoticeUpdateuid" />-->
      <!-- <el-table-column label="删除群后台id" align="center" prop="delUserUid" width="120" /> -->
      <el-table-column label="删除群时间" align="center" prop="delTime" width="120">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.delTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="删除群时间" align="center" prop="avatarIncludeCnt" /> -->
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="370">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small" plain class="input" @click="handleUpdate(scope.row)" v-hasPermi="['system:missuUsers:edit']">修改资料</el-button> -->


          <el-button v-if="scope.row.gStatus===1" plain class="input" size="small" type="primary" @click="groupBan(scope.row,0)"
            v-hasPermi="['group:group:edit']">封禁</el-button>
          <el-button v-if="scope.row.gStatus===0" plain class="input" size="small" type="primary" @click="groupBan(scope.row,1)"
            v-hasPermi="['group:group:edit']">解封</el-button>
          <el-button size="small" type="primary" plain class="input" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button plain size="small" type="primary"  v-hasPermi="['group:group:remove']" class="input" @click="handleDelete(scope.row)" >删除</el-button>
		  <el-button plain size="small" type="primary"  v-hasPermi="['group:group:delete']" class="input" @click="handleRemove(scope.row)" >销毁</el-button>
          <el-button plain size="small" type="primary" class="input" @click="handleUrl(scope.row)" >聊天记录</el-button>

          <el-button plain size="small" type="primary" class="input" @click="handleMember(scope.row)" >成员管理</el-button>
          <el-button plain size="small" type="primary" class="input" @click="redEnvelopeConfiguration(scope.row)" >红包配置</el-button>


        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改群组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="状态" prop="gStatus">
          <el-select v-model="form.gStatus" placeholder="请选择状态">
            <el-option v-for="dict in gStatusOptions" :key="dict.dictValue" :label="dict.dictLabel" :value="parseInt(dict.dictValue)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="群名称" prop="gName">
          <el-input v-model="form.gName" placeholder="请输入群名称" />
        </el-form-item>
        <el-form-item label="群主" prop="gOwnerUserUid">
          <el-input v-model="form.gOwnerUserUid" placeholder="请输入群主" />
        </el-form-item>
        <el-form-item label="群公告" prop="gNotice">
          <el-input v-model="form.gNotice" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="最大群人数" prop="maxMemberCount">
          <el-input v-model="form.maxMemberCount" placeholder="请输入最大群人数" />
        </el-form-item>
        <el-form-item label="群人数" prop="gMemberCount">
          <el-input v-model="form.gMemberCount" placeholder="请输入群人数" />
        </el-form-item>
        <el-form-item label="建立者id" prop="createUserUid">
          <el-input v-model="form.createUserUid" placeholder="请输入建立者id" />
        </el-form-item>
        <el-form-item label="封禁群后台id" prop="forbidUserUid">
          <el-input v-model="form.forbidUserUid" placeholder="请输入封禁群后台id" />
        </el-form-item>
        <el-form-item label="封禁群时间" prop="forbidTime">
          <el-date-picker clearable size="small" style="width: 200px" v-model="form.forbidTime" type="date"
            value-format="yyyy-MM-dd" placeholder="选择封禁群时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="封禁群理由" prop="firbidCause">
          <el-input v-model="form.firbidCause" placeholder="请输入封禁群理由" />
        </el-form-item>
        <el-form-item label="公告更新时间" prop="gNoticeUpdatetime">
          <el-date-picker clearable size="small" style="width: 200px" v-model="form.gNoticeUpdatetime" type="date"
            value-format="yyyy-MM-dd" placeholder="选择公告更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公告更新用户id" prop="gNoticeUpdateuid">
          <el-input v-model="form.gNoticeUpdateuid" placeholder="请输入公告更新用户id" />
        </el-form-item>
        <el-form-item label="删除群后台id" prop="delUserUid">
          <el-input v-model="form.delUserUid" placeholder="请输入删除群后台id" />
        </el-form-item>
        <el-form-item label="删除群时间" prop="delTime">
          <el-date-picker clearable size="small" style="width: 200px" v-model="form.delTime" type="date" value-format="yyyy-MM-dd"
            placeholder="选择删除群时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="删除群时间" prop="avatarIncludeCnt">
          <el-input v-model="form.avatarIncludeCnt" placeholder="请输入删除群时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="title" :visible.sync="ban" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="封禁群理由" prop="firbidCause">
          <el-input v-model="form.firbidCause" placeholder="请输入封禁群理由" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmBan">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>



    <el-dialog title="红包配置详情" :visible.sync="loadingRedv1" width="80%" append-to-body :close-on-click-modal="false">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="buildTheConfiguration"
            v-hasPermi="['system:redEnvelopeConfigUser:add']"
          >生成红包配置</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multipleV2"
            @click="handleDeleteV2"
            v-hasPermi="['system:redEnvelopeConfigUser:remove']"
          >删除红包配置</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <!--    红包配置-->
      <el-table v-loading="loadingRedv2" :data="redEnvelopeConfigGroupList"  append-to-body @selection-change="handleSelectionChangeV2">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" />
        <el-table-column label="用户id" align="center" prop="gId" :disabled="true"/>
        <el-table-column label="名称" align="center" prop="name" :disabled="true"/>
        <el-table-column label="包数" align="center" prop="num" :disabled="true"/>
        <el-table-column label="雷数" align="center" prop="lieutenantGeneralNumber" :disabled="true"/>
        <el-table-column label="1单雷 2连环雷" align="center" prop="numType" :disabled="true"/>
        <el-table-column label="金额1" align="center" prop="amountOne" :disabled="true"/>
        <el-table-column label="金额2" align="center" prop="amountTwo" :disabled="true"/>
        <el-table-column label="金额3" align="center" prop="amountThree" :disabled="true"/>
        <el-table-column label="金额4" align="center" prop="amountFour" :disabled="true"/>
        <el-table-column label="金额5" align="center" prop="amountFive" :disabled="true"/>
        <el-table-column label="金额1中奖率" align="center" prop="winningRateOne" />
        <el-table-column label="金额2中奖率" align="center" prop="winningRateTwo" />
        <el-table-column label="金额3中奖率" align="center" prop="winningRateThree" />
        <el-table-column label="金额4中奖率" align="center" prop="winningRateFour" />
        <el-table-column label="金额5中奖率" align="center" prop="winningRateFive" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdateV2(scope.row)"
              v-hasPermi="['system:redEnvelopeConfigUser:edit']"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>


    <!-- 红包配置添加或修改红包个人配置对话框 -->
    <el-dialog :title="titleV2" :visible.sync="openV2" width="500px" append-to-body>
      <el-form ref="form" :model="formV2" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="formV2.gId" placeholder="请输入用户id" :disabled="true"/>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formV2.name" placeholder="请输入名称" :disabled="true"/>
        </el-form-item>
        <el-form-item label="包数" prop="num">
          <el-input v-model="formV2.num" placeholder="请输入包数" :disabled="true"/>
        </el-form-item>
        <el-form-item label="雷数" prop="lieutenantGeneralNumber" >
          <el-input v-model="formV2.lieutenantGeneralNumber" placeholder="请输入雷数" :disabled="true"/>
        </el-form-item>
        <el-form-item label="1单雷 2连环雷" prop="numType">
          <el-select v-model="formV2.numType" placeholder="请选择1单雷 2连环雷" :disabled="true">
            <el-option label="请选择字典生成" value="" :disabled="true"/>
          </el-select>
        </el-form-item>
        <el-form-item label="金额1" prop="amountOne">
          <el-input v-model="formV2.amountOne" placeholder="请输入金额1" :disabled="true"/>
        </el-form-item>
        <el-form-item label="金额2" prop="amountTwo">
          <el-input v-model="formV2.amountTwo" placeholder="请输入金额2" :disabled="true"/>
        </el-form-item>
        <el-form-item label="金额3" prop="amountThree">
          <el-input v-model="formV2.amountThree" placeholder="请输入金额3" :disabled="true"/>
        </el-form-item>
        <el-form-item label="金额4" prop="amountFour">
          <el-input v-model="formV2.amountFour" placeholder="请输入金额4" :disabled="true"/>
        </el-form-item>
        <el-form-item label="金额5" prop="amountFive">
          <el-input v-model="formV2.amountFive" placeholder="请输入金额5" :disabled="true"/>
        </el-form-item>
        <el-form-item label="金额1中奖率" prop="winningRateOne">
          <el-input v-model="formV2.winningRateOne" placeholder="请输入金额1中奖率" />
        </el-form-item>
        <el-form-item label="金额2中奖率" prop="winningRateTwo">
          <el-input v-model="formV2.winningRateTwo" placeholder="请输入金额2中奖率" />
        </el-form-item>
        <el-form-item label="金额3中奖率" prop="winningRateThree">
          <el-input v-model="formV2.winningRateThree" placeholder="请输入金额3中奖率" />
        </el-form-item>
        <el-form-item label="金额4中奖率" prop="winningRateFour">
          <el-input v-model="formV2.winningRateFour" placeholder="请输入金额4中奖率" />
        </el-form-item>
        <el-form-item label="金额5中奖率" prop="winningRateFive">
          <el-input v-model="formV2.winningRateFive" placeholder="请输入金额5中奖率" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormV2">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
	removeGroup,
    exportGroup
  } from "@/api/group/group";
  import { listRedEnvelopeConfigGroup, getRedEnvelopeConfigGroup, delRedEnvelopeConfigGroup, addRedEnvelopeConfigGroup, updateRedEnvelopeConfigGroup, exportRedEnvelopeConfigGroup } from "@/api/system/redEnvelopeConfigGroup";
  import {
    addRedEnvelopeConfigUser, delRedEnvelopeConfigUser,
    getRedEnvelopeConfigUser,
    updateRedEnvelopeConfigUser
  } from '@/api/system/redEnvelopeConfigUser'
  export default {
    name: "Group",
    data() {
      return {
        // 遮罩层
        loading: true,
        loadingRedv1: false,
        loadingRedv2: true,
        ban: false,
        // 选中数组
        ids: [],
        idsV2: [],
        // 非单个禁用
        single: true,
        singleV2: true,
        // 非多个禁用
        multiple: true,
        multipleV2: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 群组表格数据
        groupList: [],
        // 弹出层标题
        title: "",
        titleV2: "",
        // 是否显示弹出层
        open: false,
        openV2: false,
        open2: false,
        redEnvelopeConfigGroupList: [],
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
        queryParamsV2: {
          pageNum: 1,
          pageSize: 50,
          userMail: null,
          id: null,
          nickname: null,
          userSex: null,
          userStatus: null,
          isOnline: null,
          userType: null,
          ipType: null,
          reCommunicationNumber: null,
          generationNumberSegment: null
        },

        // 表单参数
        form: {},
        formV2: {},
        // 表单校验
        rules: {}
      };
    },
    created() {
      this.getList();
      this.getDicts("group_status").then(response => {
        this.gStatusOptions = response.data;
      });
    },
    methods: {
      handleUrl(e) {
        this.$router.push({
          path: "/group/groupMsgList",
          query: {
            destUid:e.gId
          }
        })
      },
      handleMember(e) {
        this.$router.push({
          path: "/group/groupMembers",
          query: {
            gId:e.gId,
						gName:e.gName
          }
        })
      },
      // 红包配置
      redEnvelopeConfiguration(row) {
        console.log(row)
        this.loadingRedv1 = true;
        this.loadingRedv2 = true;
        if (row != undefined){
          this.queryParamsV2.gId = row.gId;
        }

        listRedEnvelopeConfigGroup(this.queryParamsV2).then(response => {
          this.redEnvelopeConfigGroupList = response.rows;
          // this.total = response.total;
          this.loadingRedv2 = false;
        });

        // this.packList = []
        // this.rechargeRow = row
        // this.getpackList()
        // setTimeout(() => {
        // 	this.infodilog = true
        // },500)
      },

      // 生成红包配置
      buildTheConfiguration(row) {
        console.log(row)
        console.log(this.queryParamsV2.userId)
        this.loadingRedv1 = true;
        this.loadingRedv2 = true;
        // if (row != undefined){
        //   this.queryParamsV2.userId = row.userUid;
        // }

        addRedEnvelopeConfigGroup(this.queryParamsV2).then(response => {
          if (response.code === 200) {
            this.msgSuccess("生成成功");
            // this.open = false;
            this.redEnvelopeConfiguration();
          }
        });

        // this.packList = []
        // this.rechargeRow = row
        // this.getpackList()
        // setTimeout(() => {
        // 	this.infodilog = true
        // },500)
      },

      /** 修改按钮操作 */
      handleUpdateV2(row) {
        // this.reset();
        console.log(row)
        const id = row.id || this.ids
        getRedEnvelopeConfigGroup(id).then(response => {
          this.formV2 = response.data;
          this.openV2 = true;
          this.titleV2 = "修改红包个人配置";
        });
      },

      /** 提交按钮 */
      submitFormV2() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateRedEnvelopeConfigGroup(this.formV2).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.openV2 = false;
                this.redEnvelopeConfiguration();
              }
            });
          }
        });
      },
      handleDeleteV2(row) {
        const ids = row.id || this.idsV2;
        this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRedEnvelopeConfigGroup(ids);
        }).then(() => {
          this.redEnvelopeConfiguration();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      handleSelectionChangeV2(selection) {
        // this.ids = selection.map(item => item.userUid)
        // this.single = selection.length !== 1
        // this.multiple = !selection.length

        this.idsV2 = selection.map(item => item.id)
        this.singleV2 = selection.length!==1
        this.multipleV2 = !selection.length
      },

      groupBan(data, status) {
        this.form.gId = data.gId;
        if (status === 0) {
          this.ban = true;
        } else {
          data.gStatus = status;
          updateGroup(data).then(response => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.getList();
            }
          });
        }
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
      // 状态字典翻译
      gStatusFormat(row, column) {
        return this.selectDictLabel(this.gStatusOptions, row.gStatus);
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.open2 = false;
        this.openV2 = false;
        this.ban = false;
        this.reset();
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

	  // 销毁

	  handleRemove(row){
		  // let a = new Array();
		  // console.log(row)
		  // const gId = row.gId;
		  // a.push(gId)
		  // removeGroup(a).then(response => {
		  //   this.form = response.data;
		  //   this.open = true;
		  //   this.title = "修改群组";
		  // });

		  const gIds = row.gId || this.ids;
		  this.$confirm('是否确认删除所选的的数据项?', "警告", {
		    confirmButtonText: "确定",
		    cancelButtonText: "取消",
		    type: "warning"
		  }).then(function() {
		    return removeGroup(gIds);
		  }).then(() => {
		    this.getList();
		    this.msgSuccess("删除成功");
		  }).catch(function() {});

	  },

      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加群组";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const gId = row.gId || this.ids
        getGroup(gId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改群组";
        });
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
      /** 导出按钮操作 */
      handleExport() {
        const queryParams = this.queryParams;
        this.$confirm('是否确认导出所有群组数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGroup(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
      }
    }
  };
</script>
