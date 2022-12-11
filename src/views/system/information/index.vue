<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="问诊类型" prop="typeOfConsultation">
        <el-select v-model="queryParams.typeOfConsultation" placeholder="请选择问诊类型">
          <el-option label="图文" value="1"></el-option>
          <el-option label="音频" value="2"></el-option>
          <el-option label="视频" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="患者名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入患者名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="问诊状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择问诊状态" clearable size="small">
          <el-option label="预约中" value="1" />
          <el-option label="预约确认" value="2" />
          <el-option label="取消预约" value="3" />
          <el-option label="已完成" value="4" />
          <el-option label="未完成" value="5" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否付费" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择付费类型" clearable size="small">
          <el-option label="已付费" value="1" />
          <el-option label="未付费" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="预约时间" prop="appointmentTime">
        <el-date-picker clearable size="small" style="width: 200px"
          v-model="queryParams.appointmentTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择预约时间">
        </el-date-picker>
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
          v-hasPermi="['system:information:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:information:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:information:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:information:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="informationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="问诊用户ID" align="center" prop="userId" />
      <el-table-column label="患者名称" align="center" prop="name" />
      <el-table-column label="问诊类型" align="center" prop="typeOfConsultation">
        <template slot-scope="scope">
          <span v-if="scope.row.typeOfConsultation == 1">图文</span>
          <span v-if="scope.row.typeOfConsultation == 2">音频</span>
          <span v-if="scope.row.typeOfConsultation == 3">视频</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center" prop="phone" />
      <el-table-column label="问诊状态" align="center" prop="status">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">预约中</span>
          <span v-if="scope.row.status == 2">预约确认</span>
          <span v-if="scope.row.status == 3">取消预约</span>
        </template>
      </el-table-column>
      <el-table-column label="聊天开始日期" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="聊天结束日期" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" prop="money" />
      <el-table-column label="支付状态" align="center" prop="type">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">已付费</span>
          <span v-if="scope.row.type == 2">未付费</span>
        </template>
      </el-table-column>
      <el-table-column label="预约时间" align="center" prop="appointmentTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.appointmentTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="问诊时间段" align="center" prop="time">
        <template slot-scope="scope">
          <span v-if="scope.row.time == 1">上午</span>
          <span v-if="scope.row.time == 2">中午</span>
          <span v-if="scope.row.time == 3">晚上</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:information:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:information:remove']"
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

    <!-- 添加或修改问诊记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="问诊时间" prop="time">
              <el-select v-model="form.time" placeholder="请选择问诊时间">
                <el-option label="上午" value="1"></el-option>
                <el-option label="中午" value="2"></el-option>
                <el-option label="晚上" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问诊类型" prop="typeOfConsultation">
              <el-select v-model="form.typeOfConsultation" placeholder="请选择问诊类型">
                <el-option label="图文" value="1"></el-option>
                <el-option label="音频" value="2"></el-option>
                <el-option label="视频" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="患者名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入患者名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问诊状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择问诊状态">
                <el-option label="预约中" value="1"></el-option>
                <el-option label="预约确认" value="2"></el-option>
                <el-option label="取消预约" value="3"></el-option>
                <el-option label="已完成" value="4"></el-option>
                <el-option label="未完成" value="5"></el-option>
              </el-select>
            </el-form-item> 
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="病例图片" prop="imageUrl">
              <div class="avatar-uploader" v-for="(item,index) in caseimglist" :key="index" @click="caseupimg(index)" style="float:left; margin-right: 10px;">
                <img v-if="item.url" :src="item.url" class="avatar">
        				<i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
              <el-button style="float: left;" size="mini" type="primary" @click="addCaseimg">新增图片</el-button>
              <el-upload class="avatar-uploader"
                style="width: 0; height: 0; overflow: hidden; opacity: 0;" 
                :action="uploadPath" 
                :show-file-list="false"
        				:http-request="uploadblimg"
        				:before-upload="beforeAvatarUpload" accept="image/*">
        	    </el-upload>
            </el-form-item>
          </el-col>
        </el-row>  
        <el-row>
          <el-col :span="12">
            <el-form-item label="预约时间" prop="appointmentTime">
              <el-date-picker clearable size="small" style="width: 200px"
                v-model="form.appointmentTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择预约时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否付费" prop="type">
              <el-select v-model="form.type" placeholder="请选择是否付费">
                <el-option label="已付费" value="1"></el-option>
                <el-option label="未付费" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="startTime">
              <el-date-picker clearable size="small" style="width: 200px"
                v-model="form.startTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择聊天开始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="endTime">
              <el-date-picker clearable size="small" style="width: 200px"
                v-model="form.endTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择聊天结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="金额" prop="money">
              <el-input v-model="form.money" placeholder="请输入金额" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总时间" prop="totalTime">
              <el-input v-model="form.totalTime" placeholder="请输入总时间" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="病情描述" prop="desc">
              <editor v-model="form.desc" :min-height="192"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInformation, getInformation, delInformation, addInformation, updateInformation, exportInformation, uploadUrl } from "@/api/system/information";
import Editor from '@/components/Editor';

export default {
  name: "Information",
  components: { Editor },
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
      // 问诊记录表格数据
      informationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        doctorId: null,
        time: null,
        userId: null,
        patientId: null,
        typeOfConsultation: null,
        name: null,
        idCard: null,
        phone: null,
        desc: null,
        imageUrl: null,
        status: null,
        order: null,
        appointment: null,
        startTime: null,
        endTime: null,
        money: null,
        totalTime: null,
        type: null,
        appointmentTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        time: [
          { required: true, message: "请选择问诊时间", trigger: "blur" },
        ],
        typeOfConsultation: [
          { required: true, message: "请选择问诊类型", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入患者名称", trigger: "blur" },
        ],
        idCard: [
          { required: true, message: "请输入身份证", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择问诊状态", trigger: "blur" },
        ],
        appointmentTime: [
          { required: true, message: '请选择预约时间', trigger: 'change' }
        ],
        type: [
          { required: true, message: "请选择是否付费", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: '选择聊天开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '选择聊天结束日期', trigger: 'change' }
        ],
        money: [
          { required: true, message: "请输入金额", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ]
      },
      uploadPath:"/api/storage/upload",
      caseindex: '',
      caseimglist: [
        {url: ''}
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询问诊记录列表 */
    getList() {
      this.loading = true;
      listInformation(this.queryParams).then(response => {
        this.informationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 点击上传按钮
    caseupimg(index) {
      this.caseindex = index
      document.querySelector('.el-upload .el-upload__input').click()
    },
    // 新增上传框
    addCaseimg() {
      this.caseimglist.push({url: ''})
    },
    // 上传病例照片
    uploadblimg(param) {
      let fileObj = param.file
      let form = new FormData()
      form.append("file", fileObj)
      uploadUrl(form, this.uploadPath).then(response => {
        // this.form.imageUrl = response.data.imgUrl
        this.caseimglist[this.caseindex].url = response.data.imgUrl
      })
    },
    handleAvatarSuccess(res, file) {
      
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
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        doctorId: null,
        time: null,
        userId: null,
        patientId: null,
        typeOfConsultation: null,
        name: null,
        idCard: null,
        phone: null,
        desc: null,
        imageUrl: null,
        status: '',
        createTime: null,
        order: null,
        appointment: null,
        startTime: null,
        endTime: null,
        money: null,
        totalTime: null,
        type: null,
        appointmentTime: null
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
      this.caseimglist = [{url: ''}]
      this.reset();
      this.open = true;
      this.title = "添加问诊记录";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.caseimglist = []
      this.reset();
      const id = row.id || this.ids
      getInformation(id).then(response => {
        if (response.data.imageUrl) {
          let imgarr = response.data.imageUrl.split(',')
          for (let i=0;i<imgarr.length; i++) {
            let arr = {url: ''}
            this.caseimglist.push({url: imgarr[i]})
          }
        }
        this.form = response.data;
        this.open = true;
        this.title = "修改问诊记录";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (new Date(this.form.startTime).getTime() > new Date(this.form.endTime).getTime()) {
            this.$message.error('结束时间必须大于开始时间')
            return false
          }
          let imgurl = ''
          for (let i=0;i<this.caseimglist.length; i++) {
            if (this.caseimglist[i].url !== '') {
              imgurl+=this.caseimglist[i].url
              if (i+1 < this.caseimglist.length) {
                imgurl+=','
              }
            }
          }
          this.form.imageUrl = imgurl
          if (this.form.id != null) {
            updateInformation(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addInformation(this.form).then(response => {
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
          return delInformation(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有问诊记录数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInformation(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>

<style>
  .avatar-uploader{
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    margin-bottom: 10px;
    width: 145px;
    height: 145px;
    
  }
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
