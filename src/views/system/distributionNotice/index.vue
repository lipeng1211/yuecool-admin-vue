<template>
  <div class="app-container">
    <div class="item-title">文 字 消 息</div>
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入内容"
      v-model="textarea">
    </el-input>
    <div class=" k_mtp">
      <el-button type="primary" @click="submitTxt">确定提交</el-button>
    </div>
    <br/>
    <br/>
    <div class="item-title">图 片 消 息</div>
    <el-upload
      class="upload-demo"
      :http-request="uploadFile"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      list-type="picture">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传单个图片</div>
    </el-upload>
    <div class=" k_mtp">
      <el-button type="primary" @click="submitImg">确定提交</el-button>
    </div>

  </div>



</template>

<script>

	import {
		getConfig
	} from "@/api/system/appConfig";
	import {
		uploadUrl,
    submitMsg
	} from "@/api/system/distributionNotice";

  export default {
    data() {
      return {
        textarea: '',
        value: 1,
        imBaseUrl: null,
        uploadPath: '/yuecoolChat/FileUploader4Web?action=0',
        messageImgData: {},
        messageData: {},
      }
    },
		created() {
      console.log("created>>>>>");
      getConfig().then(res => {
        console.log("created--2-->>>>>",res);
        this.imBaseUrl = res.data.imfileUrl;
      });
		},
    methods: {
      uploadFile(param){
        console.log("uploadFile>>>>>",param,this.uploadKey);
			  let fileObj = param.file;
			  let form = new FormData();
			  form.append("file", fileObj);
			  uploadUrl(form, this.imBaseUrl + this.uploadPath).then(response => {
          console.log("success>>>>>",response);
          if(response.data.fileNameMD5){
            this.messageImgData = {
              type: "1",
              msg: response.data.fileNameMD5
            }
					  this.$message.success("上传成功，请提交！")
          }
			  });
      },
      // uploadSuccess(res,file,fileList){
      //   console.log("uploadSuccess>>>>>",res);
      // },
      submitTxt(){
        console.log("submit>>>>>");
        if(this.textarea == '') return;
        let data = {
          type: 0,
          msg: this.textarea,
        }
				submitMsg(data).then(response => {
					if (response.code === 200) {
						this.$message.success("发送成功")
						this.getList()
					} else {
						this.$message.error("发送失败")
					}
				})
      },
      submitImg(){
        console.log("submit>>>>>");
        if(!this.messageImgData.msg) return;

				submitMsg(this.messageImgData).then(response => {
					if (response.code === 200) {
						this.$message.success("发送成功")
						this.getList()
					} else {
						this.$message.error("发送失败")
					}
				})
      }
    }
  }
</script>

<style scoped="scoped">
  .item-title {
    font-size: 28px;
    color: #8c939d;
    line-height: 60px;
  }
</style>
