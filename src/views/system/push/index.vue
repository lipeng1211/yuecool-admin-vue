<template>
  <div class="app-container">
    <div class="title">
      IOS原生推送
    </div>

    <el-form :inline="true" label-width="68px">
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
    </el-form>


    <div class="title">
      安卓第三方推送（MobPush）
    </div>

    <el-form :inline="true" label-width="68px">
      <el-table :data="tableData2" border>
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
    </el-form>



    <div class=" k_mtp">
      <el-button type="primary">确定提交</el-button>
    </div>



  </div>



</template>

<script>
  export default {
    data() {
      return {
        options: [{
          value: '1',
          label: '阿里云短信'
        }, {
          value: '2',
          label: 'mob'
        }],
        selValue: '',


        tableData: [{
            host: 'appId',
            key: '',
            name: 'iosAppId',
            type: 'string'
          },
          {
            host: 'appSecret',
            key: '',
            name: 'iosAppSecret',
            type: 'string'
          }
        ],
        tableData2: [{
            host: 'appId',
            key: '',
            name: 'anAppId',
            type: 'string'
          },
          {
            host: 'appSecret',
            key: '',
            name: 'anAppSecret',
            type: 'string'
          }
        ],
        value: 1
      }
    },
    methods: {
      selChange() {
        console.log(this.selValue)
      }
    }
  }
</script>

<style scoped="scoped">
  .title {
    text-align: center;
    font-size: 18px;
    padding: 14px 0;
    width: 100%;
    color: #1890FF;

  }
</style>
