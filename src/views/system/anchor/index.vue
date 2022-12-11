<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="昵称" prop="nickname">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="性别" prop="userSex">
        <el-select v-model="queryParams.userSex" placeholder="请选择" clearable size="small">
          <el-option label="男" value="1" />
          <el-option label="女" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否上榜" prop="isOnList">
        <el-select v-model="queryParams.isOnList" placeholder="请选择" clearable size="small">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间" prop="addTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.addTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择添加时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="是否高级" prop="isVip">
        <el-select v-model="queryParams.isVip" placeholder="请选择" clearable size="small">
          <el-option label="审核中" value="1" />
          <el-option label="是" value="2" />
          <el-option label="审核未通过" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="省" prop="province">
        <el-input
          v-model="queryParams.province"
          placeholder="请输入省"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <el-input
          v-model="queryParams.city"
          placeholder="请输入城市"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus">
        <el-select v-model="queryParams.auditStatus" placeholder="请选择" clearable size="small">
          <el-option label="审核中" value="1" />
          <el-option label="审核通过" value="2" />
          <el-option label="审核未通过" value="3" />
        </el-select>
      </el-form-item>

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
          v-hasPermi="['system:anchor:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:anchor:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:anchor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:anchor:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="anchorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="昵称" align="center" prop="nickname" />
      <el-table-column label="性别" align="center" prop="userSex">
        <template slot-scope="scope">
          <span v-if="scope.row.userSex == 1">男</span>
          <span v-if="scope.row.userSex == 0">女</span>
        </template>
      </el-table-column>
      <el-table-column label="热度分" align="center" prop="heatFraction" />
      <el-table-column label="是否上榜" align="center" prop="isOnList">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnList == 1">是</span>
          <span v-if="scope.row.isOnList == 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="榜单排名" align="center" prop="rank" />
      <el-table-column label="涉黄次数" align="center" prop="yellowTimes" />
      <el-table-column label="添加时间" align="center" prop="addTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="相册" align="center" prop="photoAlbum" >
        <template slot-scope="scope">
          <img :src="scope.row.photoAlbum" width="100" alt="">
        </template>
      </el-table-column>
      <el-table-column label="是否高级主播" align="center" prop="isVip">
        <template slot-scope="scope">
          <span v-if="scope.row.isVip == 1">审核中</span>
          <span v-if="scope.row.isVip == 2">是</span>
          <span v-if="scope.row.isVip == 2">审核未通过</span>
        </template>
      </el-table-column>
      <el-table-column label="价格(钻)" align="center" prop="price" />
      <el-table-column label="主播分类" align="center" prop="lqCategoryName" />
      <el-table-column label="历史热度" align="center" prop="historyHeatFraction" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="背景图" align="center" prop="backgroundurl">
        <template slot-scope="scope">
          <img :src="scope.row.backgroundurl" width="100" alt="">
        </template>
      </el-table-column>
      <el-table-column label="露脸图" align="center" prop="facephotourl">
        <template slot-scope="scope">
          <img :src="scope.row.facephotourl" width="100" alt="">
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="auditStatus">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus == 1">审核中</span>
          <span v-if="scope.row.auditStatus == 2">审核通过</span>
          <span v-if="scope.row.auditStatus == 3">审核未通过</span>
        </template>
      </el-table-column>
      <el-table-column label="认证图片" align="center" prop="superAnchorAuthphoto">
        <template slot-scope="scope">
          <img :src="scope.row.superAnchorAuthphoto" width="100" alt="">
        </template>
      </el-table-column>
      <el-table-column label="高级主播开始时间" align="center" prop="superAnchorStart" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.superAnchorStart, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:anchor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:anchor:remove']"
          >删除</el-button>
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

    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-select v-model="form.userSex" placeholder="请选择">
            <el-option label="男" value="1" />
            <el-option label="女" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="热度分" prop="heatFraction">
          <el-input v-model="form.heatFraction" placeholder="请输入热度分" />
        </el-form-item>
        <el-form-item label="评价值" prop="appraisals">
          <el-input v-model="form.appraisals" placeholder="请输入评价值" />
        </el-form-item>
        <el-form-item label="是否上榜" prop="isOnList">
          <el-select v-model="form.isOnList" placeholder="请选择">
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="榜单排名" prop="rank">
          <el-input v-model="form.rank" placeholder="请输入榜单排名" />
        </el-form-item>
        <el-form-item label="涉黄次数" prop="yellowTimes">
          <el-input v-model="form.yellowTimes" placeholder="请输入涉黄次数" />
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="form.weight" placeholder="请输入权重" />
        </el-form-item>
        <el-form-item label="添加时间" prop="addTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.addTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择添加时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="相册" prop="photoAlbum">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
            :http-request="uploadAlbum"
            :before-upload="beforeAvatarUpload" accept="image/*">
            <img v-if="form.photoAlbum" :src="form.photoAlbum" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="高级主播" prop="isVip">
          <el-select v-model="form.isVip" placeholder="请选择">
            <el-option label="审核中" value="1" />
            <el-option label="是" value="2" />
            <el-option label="审核未通过" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格(钻)" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="主播分类" prop="lqCategory">
          <el-checkbox-group v-model="lqCategory">
            <el-checkbox v-for="(item,index) in anchorClass" :key="index" :label="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="历史热度" prop="historyHeatFraction">
          <el-input v-model="form.historyHeatFraction" placeholder="请输入历史热度" />
        </el-form-item>
        <el-form-item label="省" prop="province">
          <el-input v-model="form.province" placeholder="请输入省" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="form.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="背景图" prop="backgroundurl">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
            :http-request="uploadback"
            :before-upload="beforeAvatarUpload" accept="image/*">
            <img v-if="form.backgroundurl" :src="form.backgroundurl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="露脸图" prop="facephotourl">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
            :http-request="uploadface"
            :before-upload="beforeAvatarUpload" accept="image/*">
            <img v-if="form.facephotourl" :src="form.facephotourl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="form.auditStatus">
            <el-radio label="1">审核中</el-radio>
            <el-radio label="2">通过</el-radio>
            <el-radio label="3">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="高级主播认证图片" prop="superAnchorAuthphoto">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
            :http-request="uploadAuth"
            :before-upload="beforeAvatarUpload" accept="image/*">
            <img v-if="form.superAnchorAuthphoto" :src="form.superAnchorAuthphoto" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { listAnchor, getAnchor, delAnchor, addAnchor, updateAnchor, exportAnchor, uploadUrl, getanchClass } from "@/api/system/anchor";

export default {
  name: "Anchor",
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
      // 用户信息表格数据
      anchorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickname: null,
        userSex: null,
        heatFraction: null,
        appraisals: null,
        isOnList: null,
        rank: null,
        leaderboardId: null,
        yellowTimes: null,
        weight: null,
        addTime: null,
        deleted: null,
        photoAlbum: null,
        isVip: null,
        price: null,
        lqCategory: null,
        historyHeatFraction: null,
        province: null,
        city: null,
        phone: null,
        country: null,
        backgroundurl: null,
        facephotourl: null,
        auditStatus: null,
        superAnchorAuthphoto: null,
        superAnchorStart: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nickname: [
          { required: true, message: "昵称不能为空", trigger: "blur" }
        ],
        userSex: [
          { required: true, message: "1 男，0 女  默认是1不能为空", trigger: "change" }
        ],
        heatFraction: [
          { required: true, message: "热度分不能为空", trigger: "blur" }
        ],
        appraisals: [
          { required: true, message: "评价值不能为空", trigger: "blur" }
        ],
        isOnList: [
          { required: true, message: "是否上榜 0： 否 1： 是不能为空", trigger: "blur" }
        ],
        price: [
          { required: true, message: "价格 单位 钻不能为空", trigger: "blur" }
        ],
      },
      uploadPath: "/api/storage/upload",
      anchorClass: [],
      lqCategory: []
    };
  },
  created() {
    this.getList()
    this.getanClass()
  },
  methods: {
    /** 查询用户信息列表 */
    getList() {
      this.loading = true;
      listAnchor(this.queryParams).then(response => {
        this.anchorList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 获取主播分类 */
    getanClass() {
      this.loading = true;
      getanchClass('').then(response => {
        this.anchorClass = response.rows
        console.log(response)
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 上传图片前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 4MB!');
      }
      return isLt2M;
    },
    // 上传相册
    uploadAlbum(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.photoAlbum = response.data.imgUrl
      })
    },
    // 上传背景图
    uploadback(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.backgroundurl = response.data.imgUrl
      })
    },
    // 上传露脸图
    uploadface(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.facephotourl = response.data.imgUrl
      })
    },
    // 上传高级主播认证图片
    uploadAuth(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        this.form.superAnchorAuthphoto = response.data.imgUrl
      })
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        nickname: null,
        userSex: null,
        heatFraction: null,
        appraisals: null,
        isOnList: null,
        rank: null,
        leaderboardId: null,
        yellowTimes: null,
        weight: null,
        addTime: null,
        updateTime: null,
        deleted: null,
        photoAlbum: null,
        isVip: null,
        price: null,
        lqCategory: null,
        historyHeatFraction: null,
        province: null,
        city: null,
        phone: null,
        country: null,
        backgroundurl: null,
        facephotourl: null,
        auditStatus: 0,
        superAnchorAuthphoto: null,
        superAnchorStart: null
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
      this.lqCategory = []
      this.open = true;
      this.title = "添加用户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAnchor(id).then(response => {
        this.form = response.data;
        this.lqCategory = this.form.lqCategory ? this.form.lqCategory.split(',') : []
        for (let i=0; i<this.lqCategory.length; i++) {
          this.lqCategory[i] = parseInt(this.lqCategory[i])
        }
        this.open = true;
        this.title = "修改用户信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let lq = ''
          this.lqCategory.forEach((item,index) => {
            lq+=item
            if (index + 1 < this.lqCategory.length) {
              lq+=','
            }
          })
          this.form.lqCategory = lq
          if (this.form.id != null) {
            updateAnchor(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addAnchor(this.form).then(response => {
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
          return delAnchor(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有用户信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAnchor(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
<style>
  .avatar-uploader .el-upload {
    width: 145px;
    height: 145px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 145px;
    height: auto;
    display: block;
  }
</style>
