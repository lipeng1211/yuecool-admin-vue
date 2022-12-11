<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="queryParams.name" placeholder="请输入名称" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="分类" prop="category">
        <el-select v-model="queryParams.category" placeholder="资讯分类" clearable size="small" style="width: 240px">
          <el-option v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictLabel"
            :value="dict.dictValue" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['group:group:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['group:group:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['group:group:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="groupList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="120" />
      <el-table-column label="文章名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="来源" align="center" prop="keywords" :show-overflow-tooltip="true" />
      <el-table-column label="文章简介" align="center" prop="brief" />
      <el-table-column label="发布时间" align="center" prop="addTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.addTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="370">
        <template slot-scope="scope">

          <el-button v-if="scope.row.isTop == 1" size="small" type="primary" plain class="input"
            @click="isTop(scope.row,0)">取消推荐</el-button>
          <el-button v-else size="small" type="primary" plain class="input" @click="isTop(scope.row,1)">推荐</el-button>
          <el-button size="small" type="primary" plain class="input" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button plain size="small" type="primary" class="input" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" zIndex="1"  :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="来源" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="简介" prop="brief">
          <el-input v-model="form.brief" placeholder="请输入简介" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="资讯分类" clearable size="small" style="width: 240px">
            <el-option v-for="dict in statusOptions" :key="dict.dictValue+1" :label="dict.dictLabel"
              :value="dict.dictValue" v-if="dict.dictValue != 0" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.isVideo" @change="isVideoChange" >
            <el-radio
              v-for="dict in contentStatus"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :aria-checked="form.isVideo"
            >{{dict.dictLabel}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="上传图片" prop="picUrl">
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
            :http-request="uploadSectionFile" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
            accept="image/*">
            <img v-if="form.picUrl" :src="form.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详细介绍" v-if="form.isVideo == false">
<!--          <editor v-model="form.detail" :init="editorInit" append-to-body />-->
          <vue-ueditor-wrap   v-model="form.detail" :config="myConfig"  @keyup.enter.native="detailChange" ></vue-ueditor-wrap>
        </el-form-item>


        <el-form-item label="上传视频" prop="payVideo"  v-if="form.isVideo == true">
          <el-input v-model="form.videoUrl" placeholder="请上传视频" readonly />
          <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                     :http-request="uploadpayaudio" :on-success="handleAvatarSuccess2"
                     :before-upload="beforeAvatarUpload2" accept="video/*">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="line-height: 20px; margin: 0;">支持mp4，avi，wmv，mov，flv，rmvb，3gp，m4v，mkv格式；文件最大不超过5G。</p>
        </el-form-item>

      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button  @click="detailChange"  v-if="form.isVideod == false">保存图片</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
    uploadUrl,
    imageUnloading
  } from "@/api/article/articleInfo";
  import Editor from '@tinymce/tinymce-vue'
  import VueUeditorWrap from "vue-ueditor-wrap"
  import { put } from '@/api/app'
  export default {
    name: "article1",
    components: {
      Editor,
      VueUeditorWrap
    },
    data() {
      return {
        myConfig:{
          autoHeightEnabled: false,
          initialFrameHeight: 245,
          initialFrameWidth: "100%",
          serverUrl: "/UEConfig",
          UEDITOR_HOME_URL: "/UEditor/",
          whiteList:{
            video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width', 'class', 'style', 'data-setup'],
            source: ['src', 'type'],
            embed: ['type', 'class', 'pluginspage', 'src', 'width', 'height', 'align', 'style', 'wmode', 'play','autoplay','loop', 'menu', 'allowscriptaccess', 'allowfullscreen', 'controls', 'preload'],
            iframe: ['src', 'class', 'height', 'width', 'max-width', 'max-height', 'align', 'frameborder', 'allowfullscreen']
          }
        },
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
        groupList: [],
        // 弹出层标题
        title: "",
        imageUrl: '',
        imgs: "",
        imgsVisible: false,
        isVideod: 0,
        uploadPath: "/api/storage/upload",
        detail: '',

        // 是否显示弹出层
        open: false,
        contentStatus:[{
          dictLabel: '文章',
          dictValue: 0
        }, {
          dictLabel: '视频',
          dictValue: 1
        }],
        // 状态字典
        statusOptions: [{
          dictLabel: '推荐',
          dictValue: 0
        }, {
          dictLabel: '头条',
          dictValue: 1
        }, {
          dictLabel: '牛人解盘',
          dictValue: 2
        }, {
          dictLabel: '实战干货',
          dictValue: 3
        }, {
          dictLabel: '基金学院',
          dictValue: 4
        }, {
          dictLabel: '服务',
          dictValue: 5
        }],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          name: null,
          addressUrl: null,
          imgUrl: null,
        },
        // 表单参数
        form: {
        },
        // 表单校验
        rules: {},
        editorInit: {
          language: 'zh_CN',
          height: 500,
          convert_urls: false,
          selector: 'textarea',
          deprecation_warnings: false,
          plugins: [
            'advlist anchor autolink autosave code codesample colorpicker colorpicker contextmenu directionality emoticons fullscreen hr image imagetools importcss insertdatetime link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace spellchecker tabfocus table template textcolor textpattern visualblocks visualchars wordcount'
          ],
          toolbar: [
            'searchreplace bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript code codesample',
            'hr bullist numlist link image charmap preview anchor pagebreak insertdatetime media table emoticons forecolor backcolor fullscreen'
          ],
          images_upload_handler: function(blobInfo, success, failure) {
            const formData = new FormData()
            formData.append('file', blobInfo.blob())
            console.log(blobInfo.filename())
            let url = "/api/storage/upload";
            uploadUrl(formData, url).then(res => {
              success(res.data.imgUrl)
            }).catch(() => {
              failure('上传失败，请重新上传')
            })
          },
          file_picker_types: 'media',
          file_picker_callback: (callback, value, meta)=> {
            if(meta.filetype == 'media'){
              let input = document.createElement('input');//创建一个隐藏的input
              input.setAttribute('type', 'file');
              let that = this;
              input.onchange = function(){
                let file = this.files[0];//选取第一个文件
                console.log(file);
                const formData = new FormData()
                formData.append('file', file)
                // meta('上传失败，请重新上传')
                let url = "/api/storage/upload";
                uploadUrl(formData, url).then(res => {
                  console.log(res)
                  callback(res.data.imgUrl, { title: res.data.imgUrl }) //将url显示在弹框输入框中
                  // success()
                }).catch((data) => {
                  console.log(data)
                  // failure('上传失败，请重新上传')
                })

                // uploadUrl(that.qiniuToken, file, 'video'); // 上传视频拿到url

                // if(that.uploaded){

                // }else{
                //   setTimeout(()=>{
                //     callback(that.resVideo, { title: file.name })
                //   },2000)
                // }
              }
              //触发点击
              input.click();
            }
          }
        }
      };
    },
    created() {
      this.getList();

      this.getDicts("article_category").then(response => {
        this.statusOptions = response.data;
      });

    },
    methods: {

      isVideoChange:function(val){
        console.info(val)
        console.info(val == true)
        this.isVideo = val?0:1;
        console.info()
      },
      // 上传付费音频/视频
      uploadpayaudio(param) {
        let fileObj = param.file
        let form = new FormData()
        form.append("file", fileObj)
        // this.form.videoUrl ="http://guoxuerongmei.oss-cn-beijing.aliyuncs.com/824198%E5%BD%95%E5%83%8F5_%E8%BD%AC_%E6%A0%87%E5%87%86.mp4";
        put(fileObj).then(response => {
          console.info("这是回调的1111")
          console.info(response)
          console.info()
          this.form.videoUrl =  response.url
          console.info("这是回调的1111")
          // this.imageUrl = response.data[0].url;
          // this.form.imgUrl = this.imageUrl
        });

        //   uploadUrl(form, this.uploadPath).then(response => {
        //   this.form.payVideo = response.data.imgUrl
        // })
      },

        // document.onkeydown = function(e) {
        //   let evn = e || event;
        //   let key = evn.keyCode || evn.which || evn.charCode; //这是当你按下按钮时获取到的keycode
        //   codeArr.push(key); //从尾部添加你按下按钮的那个keycode
        //   let lastOne = codeArr[codeArr.length - 1]; //这是数组里面倒数第一个元素
        //   let lastTwo = codeArr[codeArr.length - 2];//这是数组里面倒数第二个元素
        //   let lastThree = codeArr[codeArr.length - 3];//这是数组里面倒数第三个元素
        //   let lastFour = codeArr[codeArr.length - 4];//这是数组里面倒数第四个元素
        //   // +回车
        //   if (lastTwo == 107 && lastOne == 13) {
        //     //按+回车
        //     console.log("+现金结算");
        //     codeArr = [];
        //   } else if (lastThree == 110 && lastTwo == 104 && lastOne == 13) {
        //     //按.8回车      注意lastThree ，lastTwo ，lastOne 的顺序
        //     console.log(".8卡卷结算");
        //     codeArr = [];
        //   } else if (
        //     lastFour == 110 &&
        //     lastThree == 104 &&
        //     lastTwo == 97 &&
        //     lastOne == 13
        //   ) {
        //     //按.81回车
        //     console.log(".81查询移动支付");
        //     codeArr = [];
        //   } else if (lastThree == 110 && lastTwo == 97 && lastOne == 13) {
        //
        //     console.log(".1会员卡");
        //     codeArr = [];
        //   } else if (lastThree == 110 && lastTwo == 100 && lastOne == 13) {
        //     console.log(".4员工卡");
        //     codeArr = [];
        //   } else if (lastThree == 110 && lastTwo == 101 && lastOne == 13) {
        //     console.log(".5折扣");
        //     codeArr = [];
        //   } else if (lastThree == 110 && lastTwo == 103 && lastOne == 13) {
        //     console.log(".7冲印小票");
        //     codeArr = [];
        //   } else if (lastThree == 110 && lastTwo == 105 && lastOne == 13) {
        //     console.log(".9屏保");
        //     codeArr = [];
        //   } else if (lastThree == 106 && lastTwo == 106 && lastOne == 13) {
        //     console.log("**同步资料");
        //     codeArr = [];
        //   } else if (lastThree == 109 && lastTwo == 109 && lastOne == 13) {
        //     console.log("--退货");
        //     codeArr = [];
        //   }
        // },


      detailChange(){

        let that = this;
        imageUnloading(this.form).then(response => {
            if (response.code === 200) {
              console.info(response.data.detail)

              that.form.detail = response.data.detail;
            }

        });

      },
      groupBan(data, status) {
        this.form.id = data.id;
        updateGroup(data).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.getList();
          }
        });

      },
      confirmBan() {

        updateGroup(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.ban = false;
            this.getList();
            this.reset();
          }
        });
      },
      /** 查询列表 */
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
        this.ban = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          name: null,
          category: null,
          keywords: null,
          brief: null,
          addTime: null,
          detail: '',
          picUrl: '',
          isTop: null,
          isVideo: 0,
          videoUrl: ''
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
        this.title = "添加";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getGroup(id).then(response => {
          console.log(response)
          console.log(this.form.detail == '')
          this.form = response.data;
          console.log(this.form)
          this.imgUrl = this.form.picUrl;
          this.form.addTime = '';
          this.open = true;
          this.title = "修改";
        });

        //
        // if (this.form.detail == ''){
        //   getGroup(id).then(response => {
        //     console.log(response)
        //     this.form = response.data;
        //     console.log(this.form)
        //     this.imgUrl = this.form.picUrl;
        //     this.form.addTime = '';
        //     this.open = true;
        //     this.title = "修改";
        //   });
        // }
        //

      },
      /** 修改按钮操作 */
      isTop(row, istop) {
        row.isTop = istop;
        updateGroup(row).then(response => {
          if (response.code === 200) {
            this.msgSuccess("修改成功");
            this.open = false;
            this.getList();
          }
        });
        console.log(row)
      },
      /** 提交按钮 */
      submitForm() {
        console.log(this.form.detail)
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
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
      uploadSpecPicUrl: function(response) {
        this.specForm.picUrl = response.data.url
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGroup(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },
      // ----


      uploadSectionFile(param) {
        console.log(param);
        let fileObj = param.file;
        let form = new FormData();
        form.append("file", fileObj);
        uploadUrl(form, this.uploadPath).then(response => {
          // this.imageUrl = ;
          this.form.picUrl = response.data.imgUrl

        });
      },

      handleAvatarSuccess(res, file) {
        this.form.picUrl  = URL.createObjectURL(file.raw);
        self.$forceUpdate();
      },


      handleAvatarSuccess2(res, file) {
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 4MB!');
        }
        return isLt2M;
      },
      beforeAvatarUpload2(file) {
      },


      watch(data) {
        this.imgs = data.imgUrl;
        this.imgsVisible = true
      }
      /** 导出按钮操作 */

    }
  };

</script>
<style>
  .el-card {
    margin-bottom: 10px;
  }

  .el-tag+.el-tag {
    margin-left: 10px;
  }

  .input-new-keyword {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
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
    height: 145px;
    display: block;
  }
</style>
