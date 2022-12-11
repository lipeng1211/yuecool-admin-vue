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
          <span>
            <el-input v-model="scope.row.key" placeholder="请输入内容"></el-input>
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


  </div>

</template>

<script>
import { getConfig, updateConfig } from '@/api/system/appConfig'

export default {
  data() {
    return {
      tableData: [{
        host: '官网网址',
        key: 'sssss',
        name: 'webUrl',
        type: ''
      },
        {
          host: '最大好友量',
          key: '',
          name: 'maxFriend',
          type: ''
        },
        {
          host: '隐私政策网址',
          key: '',
          name: 'PrivacyPolicyUrl',
          type: ''
        }, {
          host: 'APP公告',
          key: '',
          name: 'AppNotice',
          type: ''
        }, {
          host: 'Android下载地址',
          key: '',
          name: 'androidDownloadUrl',
          type: ''
        }, {
          host: 'Android最新版本',
          key: '',
          name: 'androidNewUrl',
          type: ''
        }, {
          host: 'Android更新说明',
          key: '',
          name: 'androidUpdateUrl',
          type: ''
        }, {
          host: 'IOS下载地址',
          key: '',
          name: 'iosDownloadUrl',
          type: ''
        }, {
          host: 'IOS最新版本',
          key: '',
          name: 'iosNewUrl',
          type: ''
        }, {
          host: 'IOS更新说明',
          key: '',
          name: 'iosUpdateUrl',
          type: ''
        }, {
          host: '群喇叭价格',
          key: 10,
          name: 'groupHorn',
          type: ''
        }
      ],
      value: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getConfig().then(response => {
          for (let i = 0; i < this.tableData.length; i++) {
            if (i === 0) {
              this.tableData[i].key = response.data.webUrl
            }
            if (i === 1) {
              this.tableData[i].key = response.data.maxFriend
            }
            if (i === 2) {
              this.tableData[i].key = response.data.privacyPolicyUrl
            }
            if (i === 3) {
              this.tableData[i].key = response.data.appNotice
            }
            if (i === 4) {
              this.tableData[i].key = response.data.androidDownloadUrl
            }
            if (i === 5) {
              this.tableData[i].key = response.data.androidNewUrl
            }
            if (i === 6) {
              this.tableData[i].key = response.data.androidUpdateUrl
            }
            if (i === 7) {
              this.tableData[i].key = response.data.iosDownloadUrl
            }
            if (i === 8) {
              this.tableData[i].key = response.data.iosNewUrl
            }
            if (i === 9) {
              this.tableData[i].key = response.data.iosUpdateUrl
            }
            if (i === 10) {
              this.tableData[i].key = response.data.groupHorn
            }
          }
          console.log(this.tableData)
          this.loading = false
        }
      )
    },

    handleEdit() {
      console.log('------------------------------------')
      const baseConfig = {
        webUrl: '',
        maxFriend: '',
        privacyPolicyUrl: '',
        appNotice: '',
        androidDownloadUrl: '',
        androidNewUrl: '',
        androidUpdateUrl: '',
        iosDownloadUrl: '',
        iosNewUrl: '',
        iosUpdateUrl: '',
        groupHorn: 10
      }

      for (var i = 0; i < this.tableData.length; i++) {
        if (i === 0) {
          baseConfig.webUrl = this.tableData[i].key
        }
        if (i === 1) {
          baseConfig.maxFriend = this.tableData[i].key
        }
        if (i === 2) {
          baseConfig.privacyPolicyUrl = this.tableData[i].key
        }
        if (i === 3) {
          baseConfig.appNotice = this.tableData[i].key
        }
        if (i === 4) {
          baseConfig.androidDownloadUrl = this.tableData[i].key
        }
        if (i === 5) {
          baseConfig.androidNewUrl = this.tableData[i].key
        }
        if (i === 6) {
          baseConfig.androidUpdateUrl = this.tableData[i].key
        }
        if (i === 7) {
          baseConfig.iosDownloadUrl = this.tableData[i].key
        }
        if (i === 8) {
          baseConfig.iosNewUrl = this.tableData[i].key
        }
        if (i === 9) {
          baseConfig.iosUpdateUrl = this.tableData[i].key
        }
        if (i === 10) {
          baseConfig.groupHorn = this.tableData[i].key
        }
      }

      updateConfig(baseConfig).then(response => {
        if (response.code === 200) {
          this.$message.success('更新成功')
          this.getList()
        } else {
          this.$message.error('未更新')
        }
      })
    },

    ji() {
      console.log(this.value)
    }
  }

}
</script>

<style scoped="scoped">

</style>
