<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:level:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:level:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:level:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:level:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="levelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="等级" align="center" prop="level" />
      <el-table-column label="等级名称" align="center" prop="levelName" />
      <el-table-column label="加群" align="center" prop="addGroup" :formatter="addGroupFormat" />
      <el-table-column label="发红包" align="center" prop="sendRedpacket" :formatter="sendRedpacketFormat" />
      <el-table-column label="加好友" align="center" prop="addFriend" :formatter="addFriendFormat" />
      <el-table-column label="创建群" align="center" prop="createGroup" :formatter="createGroupFormat" />
      <el-table-column label="强制加好友" align="center" prop="addFriendSuper" :formatter="addFriendSuperFormat" />
      <el-table-column label="强制加群" align="center" prop="addGroupSuper" :formatter="addGroupSuperFormat" />
      <el-table-column label="强制拉人加群" align="center" prop="addPersonSuper" :formatter="addPersonSuperFormat" />
      <el-table-column label="群内撤回他人消息" align="center" prop="groupDelMsg" :formatter="groupDelMsgFormat" />
      <el-table-column label="查看云消息记录" align="center" prop="seeYunMsg" :formatter="seeYunMsgFormat" />
      <el-table-column label="消息开关" align="center" prop="msgTab" :formatter="msgTabFormat" />
      <el-table-column label="联系人开关" align="center" prop="friendTab" :formatter="friendTabFormat" />
      <el-table-column label="朋友圈开关" align="center" prop="circleTab" :formatter="circleTabFormat" />
      <el-table-column label="我的钱包开关" align="center" prop="walletTab" :formatter="walletTabFormat" />
      <el-table-column label="收藏开关" align="center" prop="collectionTab" :formatter="collectionTabFormat" />
      <el-table-column label="发现开关" align="center" prop="findTab" :formatter="findTabFormat" />
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:level:edit']"
          >修改</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['system:level:remove']"-->
<!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户等级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入等级" />
        </el-form-item>
        <el-form-item label="等级名称" prop="levelName">
          <el-input v-model="form.levelName" placeholder="请输入等级名称" />
        </el-form-item>
        <el-form-item label="加群">
          <el-radio-group v-model="form.addGroup">
            <el-radio
              v-for="dict in addGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发红包">
          <el-radio-group v-model="form.sendRedpacket">
            <el-radio
              v-for="dict in sendRedpacketOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加好友">
          <el-radio-group v-model="form.addFriend">
            <el-radio
              v-for="dict in addFriendOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="创建群">
          <el-radio-group v-model="form.createGroup">
            <el-radio
              v-for="dict in createGroupOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="强制加好友">
          <el-radio-group v-model="form.addFriendSuper">
            <el-radio
              v-for="dict in addFriendSuperOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="强制加群">
          <el-radio-group v-model="form.addGroupSuper">
            <el-radio
              v-for="dict in addGroupSuperOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="强制拉人加群">
          <el-radio-group v-model="form.addPersonSuper">
            <el-radio
              v-for="dict in addPersonSuperOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="群内撤回他人消息">
          <el-radio-group v-model="form.groupDelMsg">
            <el-radio
              v-for="dict in groupDelMsgOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="查看云消息记录">
          <el-radio-group v-model="form.seeYunMsg">
            <el-radio
              v-for="dict in seeYunMsgOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="消息开关">
          <el-radio-group v-model="form.msgTab">
            <el-radio
              v-for="dict in msgTabOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人开关">
          <el-radio-group v-model="form.friendTab">
            <el-radio
              v-for="dict in friendTabOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="朋友圈开关">
          <el-radio-group v-model="form.circleTab">
            <el-radio
              v-for="dict in circleTabOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="我的钱包开关">
          <el-radio-group v-model="form.walletTab">
            <el-radio
              v-for="dict in walletTabOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收藏开关">
          <el-radio-group v-model="form.collectionTab">
            <el-radio
              v-for="dict in collectionTabOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发现开关">
          <el-radio-group v-model="form.findTab">
            <el-radio
              v-for="dict in findTabOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
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
import { listLevel, getLevel, delLevel, addLevel, updateLevel, exportLevel } from "@/api/system/level";

export default {
  name: "Level",
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
      // 用户等级表格数据
      levelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 加群字典
      addGroupOptions: [],
      // 发红包字典
      sendRedpacketOptions: [],
      // 加好友字典
      addFriendOptions: [],
      // 创建群字典
      createGroupOptions: [],
      // 强制加好友字典
      addFriendSuperOptions: [],
      // 强制加群字典
      addGroupSuperOptions: [],
      // 强制拉人加群字典
      addPersonSuperOptions: [],
      // 群内撤回他人消息字典
      groupDelMsgOptions: [],
      // 查看云消息记录字典
      seeYunMsgOptions: [],
      // 消息开关字典
      msgTabOptions: [],
      // 联系人开关字典
      friendTabOptions: [],
      // 朋友圈开关字典
      circleTabOptions: [],
      // 我的钱包开关字典
      walletTabOptions: [],
      // 收藏开关字典
      collectionTabOptions: [],
      // 发现开关字典
      findTabOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("l_user_level_no").then(response => {
      this.addGroupOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.sendRedpacketOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.addFriendOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.createGroupOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.addFriendSuperOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.addGroupSuperOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.addPersonSuperOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.groupDelMsgOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.seeYunMsgOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.msgTabOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.friendTabOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.circleTabOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.walletTabOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.collectionTabOptions = response.data;
    });
    this.getDicts("l_user_level_no").then(response => {
      this.findTabOptions = response.data;
    });
  },
  methods: {
    /** 查询用户等级列表 */
    getList() {
      this.loading = true;
      listLevel(this.queryParams).then(response => {
        this.levelList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 加群字典翻译
    addGroupFormat(row, column) {
      return this.selectDictLabel(this.addGroupOptions, row.addGroup);
    },
    // 发红包字典翻译
    sendRedpacketFormat(row, column) {
      return this.selectDictLabel(this.sendRedpacketOptions, row.sendRedpacket);
    },
    // 加好友字典翻译
    addFriendFormat(row, column) {
      return this.selectDictLabel(this.addFriendOptions, row.addFriend);
    },
    // 创建群字典翻译
    createGroupFormat(row, column) {
      return this.selectDictLabel(this.createGroupOptions, row.createGroup);
    },
    // 强制加好友字典翻译
    addFriendSuperFormat(row, column) {
      return this.selectDictLabel(this.addFriendSuperOptions, row.addFriendSuper);
    },
    // 强制加群字典翻译
    addGroupSuperFormat(row, column) {
      return this.selectDictLabel(this.addGroupSuperOptions, row.addGroupSuper);
    },
    // 强制拉人加群字典翻译
    addPersonSuperFormat(row, column) {
      return this.selectDictLabel(this.addPersonSuperOptions, row.addPersonSuper);
    },
    // 群内撤回他人消息字典翻译
    groupDelMsgFormat(row, column) {
      return this.selectDictLabel(this.groupDelMsgOptions, row.groupDelMsg);
    },
    // 查看云消息记录字典翻译
    seeYunMsgFormat(row, column) {
      return this.selectDictLabel(this.seeYunMsgOptions, row.seeYunMsg);
    },
    // 消息开关字典翻译
    msgTabFormat(row, column) {
      return this.selectDictLabel(this.msgTabOptions, row.msgTab);
    },
    // 联系人开关字典翻译
    friendTabFormat(row, column) {
      return this.selectDictLabel(this.friendTabOptions, row.friendTab);
    },
    // 朋友圈开关字典翻译
    circleTabFormat(row, column) {
      return this.selectDictLabel(this.circleTabOptions, row.circleTab);
    },
    // 我的钱包开关字典翻译
    walletTabFormat(row, column) {
      return this.selectDictLabel(this.walletTabOptions, row.walletTab);
    },
    // 收藏开关字典翻译
    collectionTabFormat(row, column) {
      return this.selectDictLabel(this.collectionTabOptions, row.collectionTab);
    },
    // 发现开关字典翻译
    findTabFormat(row, column) {
      return this.selectDictLabel(this.findTabOptions, row.findTab);
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
        level: null,
        levelName: null,
        addGroup: "0",
        sendRedpacket: "0",
        addFriend: "0",
        createGroup: "0",
        addFriendSuper: "0",
        addGroupSuper: "0",
        addPersonSuper: "0",
        groupDelMsg: "0",
        seeYunMsg: "0",
        msgTab: "0",
        friendTab: "0",
        circleTab: "0",
        walletTab: "0",
        collectionTab: "0",
        findTab: "0"
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加用户等级";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLevel(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户等级";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLevel(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addLevel(this.form).then(response => {
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
          return delLevel(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户等级数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLevel(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
