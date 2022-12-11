<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
			<!-- <el-form-item label="邮箱">
        <el-input
          v-model="queryParams.userMail"
          placeholder="请输入邮箱"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->

      <el-form-item label="账号Id">
        <el-input v-model="queryParams.userUid" placeholder="请输入账号Id" clearable size="small"
                  @keyup.enter.native="handleQuery" />
      </el-form-item>

			<el-form-item label="账号">
				<el-input v-model="queryParams.userMail" placeholder="请输入账号" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="短号ID">
				<el-input v-model="queryParams.userCornet" placeholder="请输入短号ID" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>

			<el-form-item label="昵称" prop="nickname">
				<el-input v-model="queryParams.nickname" placeholder="请输入昵称" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="性别">
				<el-select v-model="queryParams.userSex" placeholder="请选择性别" clearable size="small">
					<el-option v-for="dict in userSexOptions" :key="dict.dictValue" :label="dict.dictLabel"
						:value="dict.dictValue" />
				</el-select>
			</el-form-item>
			<el-form-item label="用户状态" prop="userStatus">
				<el-select v-model="queryParams.userStatus" placeholder="请选择用户状态" clearable size="small">
					<el-option v-for="dict in userStatusOptions" :key="dict.dictValue" :label="dict.dictLabel"
						:value="dict.dictValue" />
				</el-select>
			</el-form-item>
			<el-form-item label="在线" prop="isOnline">
				<el-input v-model="queryParams.isOnline" placeholder="请输入在线" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="用户类型" prop="userType">
				<el-select v-model="queryParams.userType" placeholder="请选择用户类型" clearable size="small">
					<el-option v-for="dict in userTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
						:value="dict.dictValue" />
				</el-select>
			</el-form-item>
			<el-form-item label="邀请码" prop="reCommunicationNumber">
				<el-input v-model="queryParams.reCommunicationNumber" placeholder="请输入邀请码" clearable size="small"
					@keyup.enter.native="handleQuery" />
			</el-form-item>

			<!-- <el-form-item label="选择日期">
        <el-date-picker
          v-model="value2"
          type="datetimerange"
          :picker-options="pickerOptions"
          @change="dateChange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyyMMdd"
          align="right">
        </el-date-picker>
      </el-form-item>
 -->

			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>


		</el-form>


		<!--    显示人数-->
		<!--
    <el-form :inline="true">
      <el-form-item label="总注册人数">
        <span>？</span>
      </el-form-item>

      <el-form-item label="本月注册用户总数">
        <span>？</span>
      </el-form-item>

      <el-form-item label="今日注册用户">
        <span>？</span>
      </el-form-item>

      <el-form-item label="今日登陆用户">
        <span>？</span>
      </el-form-item>

      <el-form-item label="目前在线人数">
        <span>？</span>
      </el-form-item>

    </el-form>
 -->

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:missuUsers:add']">新增
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
					v-hasPermi="['system:missuUsers:edit']">修改
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
					v-hasPermi="['system:missuUsers:remove']">删除
				</el-button>
			</el-col>
			<el-col :span="1.5">
				<el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport"
					v-hasPermi="['system:missuUsers:export']">导出
				</el-button>
			</el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="generateUser"
                   v-hasPermi="['group:groupMembers:export']">生成群成员</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="missuUsersList" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" align="center" />
			<el-table-column label="ID" align="center" prop="userUid" />
			<el-table-column label="短号ID" align="center" prop="userCornet" width="100" :show-overflow-tooltip="true" />
			<el-table-column label="账号" align="center" prop="userMail" width="140" :show-overflow-tooltip="true" />
			<el-table-column label="手机号码" align="center" prop="userPhone" width="130" :show-overflow-tooltip="true" />
			<!-- <el-table-column label="邮箱" align="center" prop="userMail" /> -->
			<el-table-column label="昵称" align="center" prop="nickname" width="100" :show-overflow-tooltip="true" />
			<el-table-column label="邀请码" align="center" prop="myCommunicationNumber" width="100" :show-overflow-tooltip="true" />
			<el-table-column label="性别" align="center" prop="userSex" :formatter="userSexFormat" />
			<el-table-column label="等级" align="center" prop="level">
				<template slot-scope="scope">
					<span v-if="scope.row.userLevelId==1">一星</span>
					<span v-else-if="scope.row.userLevelId==2">二星</span>
					<span v-else-if="scope.row.userLevelId==3">三星</span>
					<span v-else-if="scope.row.userLevelId==4">四星</span>
					<span v-else-if="scope.row.userLevelId==5">五星</span>
					<span v-else>暂无</span>

				</template>
			</el-table-column>

			<el-table-column label="用户状态" align="center" prop="userStatus" :formatter="userStatusFormat" />
			<el-table-column label="用户金额" align="center" prop="balance" />
			<el-table-column label="在线状态" align="center" prop="isOnline" :formatter="isOnlineFormat" />
			<el-table-column label="用户类型" align="center" prop="userType" width="130" :formatter="userTypeFormat" />
			<el-table-column label="最后登录时间" align="center" prop="latestLoginTime" width="180">
				<template slot-scope="scope">
					<span>{{ parseTime(scope.row.latestLoginTime2, '{y}-{m}-{d}') }}</span>
				</template>
			</el-table-column>
			<el-table-column label="最后登录地址" align="center" prop="latestLoginAddres" width="180" />
			<el-table-column label="最后登录ip" align="center" prop="latestLoginIp" width="180" />
			<el-table-column label="IP白名单" align="center" prop="ipWhiteList" width="140" :show-overflow-tooltip="true" />
			<el-table-column label="注册时间" align="center" prop="registerTime" width="100">
				<template slot-scope="scope">
					<span>{{ scope.row.registerTime }}</span>
				</template>
			</el-table-column>
			<el-table-column label="注册地址" align="center" prop="registerAddres" width="120" />
			<el-table-column label="注册ip" align="center" prop="registerIp" width="120" />
			<el-table-column label="封禁理由" align="center" prop="reasonsForBan" width="120" />

			<el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="490">
				<template slot-scope="scope">
					<!-- <el-button type="primary" size="small" plain class="input">查看上级
          </el-button>
          <el-button type="primary" size="small" plain class="input">查看下级
          </el-button> -->

					<el-button v-if="scope.row.reCommunicationNumber" type="primary" size="small" plain class="input" @click="lookInvitees(scope.row.reCommunicationNumber)"
						v-hasPermi="['system:missuUsers:edit']">邀请人
					</el-button>
					<el-button style="visibility: hidden;" v-else type="primary" size="small" plain class="input"
						v-hasPermi="['system:missuUsers:edit']">
						<span>占位符</span>
					</el-button>
					<el-button type="primary" size="small" plain class="input" @click="lookInfo(scope.row)">查看详情</el-button>
					<el-button type="primary" size="small" plain class="input" @click="redEnvelopeConfiguration(scope.row)">红包配置</el-button>
					<el-button type="primary" size="small" plain class="input" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:missuUsers:edit']">修改资料
					</el-button>
					<el-button type="primary" size="small" plain class="input" @click="updatePayPwd(scope.row)"
						v-hasPermi="['system:missuUsers:edit']">修改支付密码
					</el-button>
					<el-button type="primary" size="small" plain class="input" @click="handleRecharge(scope.row)"
                     v-hasPermi="['system:missuUsers:recharge']">钱包充值
          			</el-button>
					<el-button type="primary" size="small" plain class="input" @click="delChatRecord(scope.row)"
						>删除聊天记录
					</el-button>
					<el-button type="primary" size="small" plain class="input" @click="handleDelete(scope.row)"
						v-hasPermi="['system:missuUsers:remove']">删除账号
					</el-button>

					<el-button v-if="scope.row.ipType === 3" type="primary" size="small" plain class="input"
						@click="handleBanIpFor(scope.row ,1 )">封IP
					</el-button>
					<el-button v-if="scope.row.ipType === 0 || scope.row.ipType === 1 || scope.row.ipType === 2"
						type="warning" size="small" plain class="input" @click="handleBanIp(scope.row ,2)">解封IP
					</el-button>

					<el-button v-if="scope.row.userStatus === 1" type="primary" size="small" plain class="input"
						@click="handleLocking(scope.row ,1 )" v-hasPermi="['system:missuUsers:edit']">封号
					</el-button>
					<el-button v-if="scope.row.userStatus === 0" type="warning" size="small" plain class="input"
						@click="handleLocking(scope.row , 2)" v-hasPermi="['system:missuUsers:edit']">解封号
					</el-button>

					<!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:missuUsers:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:missuUsers:remove']"
          >删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />


		<!-- 邀请人 -->
		<el-dialog title="邀请人" :visible.sync="inviteesBox" width="60%" append-to-body :close-on-click-modal="false">
			<el-table :data="inviteesList" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column label="ID" align="center" prop="userUid" />
				<el-table-column label="短号ID" align="center" prop="userCornet" width="200" :show-overflow-tooltip="true" />
				<el-table-column label="账号" align="center" prop="userMail" width="180" :show-overflow-tooltip="true" />
				<el-table-column label="昵称" align="center" prop="nickname" width="160" :show-overflow-tooltip="true" />

			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="inviteesBox = false">关 闭</el-button>
			</div>
		</el-dialog>

		<!-- 添加或修改用户管理对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<!-- <el-form-item label="邮箱"  prop="userMail">
          <el-input v-model="form.userMail" placeholder="请输入邮箱                    用户邮箱可作该用户的登陆名，??????服务器唯一。" />
        </el-form-item> -->

				<el-form-item label="账号" prop="userMail">
					<el-input placeholder="请输入账号" v-model="form.userMail" />
				</el-form-item>


				<el-form-item label="昵称" prop="nickname">
					<el-input v-model="form.nickname" placeholder="请输入昵称" />
				</el-form-item>
				<el-form-item label="密码" prop="userPsw">
					<el-input show-password v-model="form.userPsw" placeholder="请输入密码" />
				</el-form-item>
<!--        <el-form-item label="归属科室" prop="deptId">-->
<!--          <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属科室" />-->
<!--        </el-form-item>-->
<!--
        <el-form-item label="归属科室" prop="deptId">
          <treeselect
            :multiple="true"
            :options="deptOptions"
            v-model="value"
            @select="select"
            @deselect="deselect"
            @close="close"

          />
        </el-form-item>

 -->

<!--        <div v-show="showRentPrise" >

          <el-form-item label="简介" prop="userDesc">
            <el-input v-model="form.userDesc" placeholder="简介" />
          </el-form-item>


          <el-form-item label="职位" prop="positionId">
            <el-input v-model="form.positionId" placeholder="职位" />
          </el-form-item>


          <el-form-item label="擅长" prop="beGoodAt">
            <el-input v-model="form.beGoodAt" placeholder="擅长" />
          </el-form-item>

          <el-form-item label="是否开方" prop="prescription">
            <el-select v-model="form.prescription" placeholder="医生是否能开药方">
              <el-option v-for="dict in prescriptions" :key="dict.dictValue" :label="dict.dictLabel"
                         :value="parseInt(dict.dictValue)"></el-option>

            </el-select>
          </el-form-item>

          <el-form-item label="是否推荐医师" prop="isRecommend">
            <el-select v-model="form.isRecommend" placeholder="医生是否能开药方">
              <el-option v-for="dict in isRecommendOptions" :key="dict.dictValue" :label="dict.dictLabel"
                         :value="parseInt(dict.dictValue)"></el-option>
            </el-select>
          </el-form-item>

        </div>
 -->
				<el-form-item label="我的邀请码" prop="myCommunicationNumber">
					<el-input v-model="form.myCommunicationNumber" placeholder="我的邀请码" :disabled="true" />
				</el-form-item>
				<el-form-item label="钱包余额" prop="balance">
					<el-input placeholder="您的钱包余额" v-model="form.balance" :disabled="true" />
				</el-form-item>

				<!--        <el-form-item label="支付密码" prop="userPsw">-->
				<!--          <el-input placeholder="请输入支付密码" />-->
				<!--        </el-form-item>-->

				<el-form-item label="性别" prop="userSex">
					<el-select v-model="form.userSex" placeholder="请选择性别">
						<el-option v-for="dict in userSexOptions" :key="dict.dictValue" :label="dict.dictLabel"
							:value="parseInt(dict.dictValue)"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="注册时间" prop="registerTime">
					<el-date-picker clearable size="small" style="width: 200px" v-model="form.registerTime" type="datetime"
						value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择注册时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="注册地址" prop="registerAddres">
					<el-input v-model="form.registerAddres" placeholder="请输入最后登录地址" />
				</el-form-item>
				<el-form-item label="最后登录地址" prop="latestLoginAddres">
					<el-input v-model="form.latestLoginAddres" placeholder="请输入最后登录地址" />
				</el-form-item>
				<el-form-item label="最后登录ip" prop="latestLoginIp">
					<el-input v-model="form.latestLoginIp" placeholder="请输入最后登录ip" />
				</el-form-item>
				<el-form-item label="IP白名单" prop="ipWhiteList">
					<el-input v-model="form.ipWhiteList" placeholder="请输入ip，多个用 # 号隔开" />
				</el-form-item>
				<el-form-item label="头像" prop="userAvatarFileName">
					<el-input v-model="form.userAvatarFileName" type="textarea" placeholder="请输入内容" />
				</el-form-item>
				<el-form-item label="最大好友数" prop="maxFriend">
					<el-input v-model="form.maxFriend" placeholder="请输入最大好友数" />
				</el-form-item>
				<el-form-item label="用户类型" prop="userType">
					<el-select v-model="form.userType" placeholder="请选择用户类型">
						<el-option v-for="dict in userTypeOptions" :key="dict.dictValue" :label="dict.dictLabel"
							:value="parseInt(dict.dictValue)"></el-option>
					</el-select>
				</el-form-item>


				<el-form-item label="用户星级" prop="userLevelId">
					<el-select v-model="form.userLevelId" placeholder="请选择用户星级">
						<el-option v-for="dict in userTypelevel" :key="dict.dictValue" :label="dict.dictLabel"
							:value="parseInt(dict.dictValue)"></el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>


    <!-- 添加或修改群成员对话框 -->
    <el-dialog :title="title" :visible.sync="open2" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form"  label-width="100px">


        <el-form-item label="生成人数" prop="nickname">
          <el-input v-model="form.generationNumberSegment" placeholder="请输入需要生成的人数,生成的用户无需验证码登录" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="generateUser1">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 查看详情 -->
		<el-dialog title="详情" :visible.sync="infodilog" width="80%" append-to-body :close-on-click-modal="false">
			<div class="tablebox">
				<el-table v-loading="loading" :data="packList">
					<el-table-column type="selection" width="55" align="center" />
					<el-table-column label="ID" align="center" prop="id" />
					<el-table-column label="用户ID" align="center" prop="userId" />
					<el-table-column label="群短号" align="center" prop="groupCornet" />
					<el-table-column label="余额" align="center" prop="amount" />
				</el-table>
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
    <el-table v-loading="loadingRedv2" :data="redEnvelopeConfigUserList"  append-to-body @selection-change="handleSelectionChangeV2">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="用户id" align="center" prop="userId" :disabled="true"/>
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
          <el-input v-model="formV2.userId" placeholder="请输入用户id" :disabled="true"/>
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


    <!-- 修改用户支付密码 -->
		<el-dialog title="修改支付密码" :visible.sync="payPwdBox" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="payform" :model="payform" :rules="rules" label-width="80px">
				<el-form-item label="支付密码" prop="payPassWord">
					<el-input maxlength="6" minlength="5" show-word-limit v-model="payform.payPassWord" placeholder="请输入支付密码(6位)" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitPayForm">确 定</el-button>
				<el-button @click="payPwdBox = false">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 添加或修改用户管理对话框 -->
		<el-dialog title="请输入充值金额" :visible.sync="recharge" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="rechargeForm" :model="rechargeForm" :rules="rules" label-width="80px">
<!--				<el-form-item label="用户群" prop="groupVal">-->
<!--					<el-select v-model="rechargeForm.groupVal" placeholder="请选择群">-->
<!--						<el-option v-for="dict in packList" :key="dict.gid" :label="dict.gid" :value="parseInt(dict.gid)"></el-option>-->
<!--					</el-select>-->
<!--				</el-form-item>-->
				<el-form-item label="充值金额" prop="rechargeValue">
					<el-input v-model="rechargeForm.rechargeValue" type="number" :min="0" placeholder="请输入充值金额" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitRechargeForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>


		<!-- 添加或修改用户管理对话框 -->
		<el-dialog title="请输入封禁的ip" :visible.sync="banIpFlag" width="500px" append-to-body :close-on-click-modal="false">
			<el-form ref="form" label-width="130px">
				<el-form-item label="ip">
					<el-input v-model="banIp.ip" placeholder="请输入ip" />
				</el-form-item>
			</el-form>

			<el-select v-model="banIp.ipType" placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleBanIp(banIp,1)">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>

		</el-dialog>

    <el-dialog :visible.sync="attributeVisiable" title="封号理由" :close-on-click-modal="false">
      <el-form
        ref="reasonsForBanFrom"
        :model="reasonsForBanFrom"
        status-icon
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="封禁理由" prop="attribute">
          <el-input v-model="reasonsForBanFrom.reasonsForBan" />
        </el-form-item>
<!--        <el-form-item label="商品参数值" prop="value">-->
<!--          <el-input v-model="attributeForm.value" />-->
<!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="attributeVisiable = false">取消</el-button>
        <el-button type="primary" @click="handleAttributeAdd(reasonsForBanFrom)">确定</el-button>
      </div>
    </el-dialog>


	</div>
</template>

<script>
	import {
		listMissuUsers,
		getMissuUsers,
		delMissuUsers,
		delChatRC,
		addMissuUsers,
		updateMissuUsers,
		exportMissuUsers,
		addIp,
		updateIp,
		delIp,
		listCustAccountbaseGroup,
		updateGroup,
    generateUserV2
	} from "@/api/system/missuUsers";
  import {treeselect} from "@/api/system/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import { generateUser } from '@/api/group/groupMembers'
  import { listRedEnvelopeConfigUser, getRedEnvelopeConfigUser, delRedEnvelopeConfigUser, addRedEnvelopeConfigUser, updateRedEnvelopeConfigUser, exportRedEnvelopeConfigUser } from "@/api/system/redEnvelopeConfigUser";
	export default {
		name: "MissuUsers",
    components: { Treeselect },
		data() {
			return {
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},
        attributeVisiable: false,
        reasonsForBanFrom: {userUid: null,reasonsForBan: null},
				value1: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
				value2: '',


				options: [{
					value: '0',
					label: '登录封禁'
				}, {
					value: '1',
					label: '禁登录'
				}, {
					value: '2',
					label: '禁注册'
				}],
				// 充值金额
				recharge: false,
				rechargeValue: 0,
				banIpFlag: false,
				// 遮罩层
				loading: true,
        loadingRedv1: false,
        loadingRedv2: true,
        redEnvelopeConfigUserList: [],
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
				// 用户管理表格数据
				missuUsersList: [],
				// 弹出层标题
				title: "",
				titleV2: "",
				// 是否显示弹出层
				open: false,
				openV2: false,
				open2: false,
				// 性别                   1 男，0 女??????????????????认是1。字典
				userSexOptions: [],
				// 用户状态字典
				userStatusOptions: [],
				// 用户状态字典
        prescriptions: [],
				// 用户状态字典
        isRecommendOptions: [],
				// 在线字典
				isOnlineOptions: [],
				// 用户类型字典
				userTypeOptions: [],
        // 部门树选项
        deptOptions: undefined,
				// 用户
				userTypelevel: [],
        value: [],
        showRentPrise: false,
        deptOptions1: [ {
          id: 'fruits',
          label: 'Fruits',
          children: [ {
            id: 'apple',
            label: 'Apple 🍎',
            isNew: true,
          }, {
            id: 'grapes',
            label: 'Grapes 🍇',
          }, {
            id: 'pear',
            label: 'Pear 🍐',
          }, {
            id: 'strawberry',
            label: 'Strawberry 🍓',
          }, {
            id: 'watermelon',
            label: 'Watermelon 🍉',
          } ],
        }, {
          id: 'vegetables',
          label: 'Vegetables',
          children: [ {
            id: 'corn',
            label: 'Corn 🌽',
          }, {
            id: 'carrot',
            label: 'Carrot 🥕',
          }, {
            id: 'eggplant',
            label: 'Eggplant 🍆',
          }, {
            id: 'tomato',
            label: 'Tomato 🍅',
          } ],
        },
          {
            id: 'vegetables',
            label: 'Vegetables',
            children: [ {
              id: 'corn',
              label: 'Corn 🌽',
            }, {
              id: 'carrot',
              label: 'Carrot 🥕',
            }, {
              id: 'eggplant',
              label: 'Eggplant 🍆',
            }, {
              id: 'tomato',
              label: 'Tomato 🍅',
            } ],
          }
        ],
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
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
				// 查询参数
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

				banIp: {
					id: null,
					ip: null,
					userId: null,
					datatime: null,
					ipType: null
				},
				// 表单参数
				form: {},
				formV2: {},
				// 表单校验
				rules: {
					userMail: [{
						required: true,
						message: "邮箱",
						trigger: "blur"
					}],
					nickname: [{
						required: true,
						message: "昵称不能为空",
						trigger: "blur"
					}],
					// userPsw: [{
					// 	required: true,
					// 	message: "密码不能为空",
					// 	trigger: "blur"
					// }],
					userSex: [{
						required: true,
						message: "性别",
						trigger: "change"
					}],
					registerTime: [{
						required: true,
						message: "注册时间不能为空",
						trigger: "blur"
					}],
					userStatus: [{
						required: true,
						message: "用户状态不能为空",
						trigger: "blur"
					}],
					isOnline: [{
						required: true,
						message: "在线不能为空",
						trigger: "blur"
					}],
					maxFriend: [{
						required: true,
						message: "最大好友数不能为空",
						trigger: "blur"
					}],
					userType: [{
						required: true,
						message: "用户类型不能为空",
						trigger: "change"
					}],
					userLevelId: [{
						required: true,
						message: "请选择用户星级",
						trigger: "change"
					}],
					payPassWord: [{
						required: true,
						message: "请输入支付密码",
						trigger: "blur"
					},
            		{ min: 6, max: 6, message: '长度 6 个字符', trigger: 'blur' }],
					// groupVal: [{
					// 	required: true,
					// 	message: "请选择群",
					// 	trigger: "change"
					// }],
					rechargeValue: [{
						required: true,
						message: "请输入充值金额",
						trigger: "blur"
					}],
				},
				//邀请人表格
				inviteesList:[],
				inviteesBox: false,
				payPwdBox: false,
				payform: {},
				rechargeForm: {},
				rechargeRow: null,
				packList: [],
				infodilog: false
			};
		},
		created() {
			this.getList()
      		this.getTreeselect()
			this.getDicts("sys_user_sex").then(response => {
				this.userSexOptions = response.data
			})
			this.getDicts("prescription").then(response => {
				this.prescriptions = response.data;
			});

			this.getDicts("is_recommend").then(response => {
				this.isRecommendOptions = response.data;
			});



			this.getDicts("user_status").then(response => {
				this.userStatusOptions = response.data;
			});
			this.getDicts("user_online").then(response => {
				this.isOnlineOptions = response.data;
			});
			this.getDicts("user_type").then(response => {
				this.userTypeOptions = response.data;
			});

			this.getDicts("l_start_level").then(response => {
				this.userTypelevel = response.data;
			});
		},
		methods: {
			/** 查询用户管理列表 */
			getList() {
				this.loading = true;
				listMissuUsers(this.queryParams).then(response => {
					this.missuUsersList = response.rows;
					this.total = response.total;
					this.loading = false;
					console.log("------------------------------")
				});
			},
			/** 查询用户钱包列表 */
			getpackList() {
				let params = {
					userId: this.rechargeRow.userUid
				}
				listCustAccountbaseGroup(params).then(response => {
					this.packList = response.rows
				});
			},
			// 性别                   1 男，0 女??????????????????认是1。字典翻译
			userSexFormat(row, column) {
        console.log("==============================================")
        console.log(this.userSexOptions+"=============================================="+row.userSex)

				return this.selectDictLabel(this.userSexOptions, row.userSex);
			},
      /** 查询部门下拉树结构 */
      getTreeselect() {
        treeselect().then((response) => {
          this.deptOptions = response.data;
        });
      },

      // 筛选节点
      filterNode(value, data) {
        console.log(data);
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 节点单击事件
      handleNodeClick(data) {
        console.log(data);
        this.queryParams.deptId = data.id;
        this.getList();
      },
			// 用户状态字典翻译
			userStatusFormat(row, column) {
				return this.selectDictLabel(this.userStatusOptions, row.userStatus);
			},
			// 在线字典翻译
			isOnlineFormat(row, column) {
				return this.selectDictLabel(this.isOnlineOptions, row.isOnline);
			},
			// 用户类型字典翻译
			userTypeFormat(row, column) {
				return this.selectDictLabel(this.userTypeOptions, row.userType);
			},
			// 取消按钮
			cancel() {
				this.open = false;
				this.open2 = false;
				this.recharge = false
				this.rechargeForm = {}
				this.reset();
			},
			// 表单重置
			resetBanIp() {
				this.banIp = {
					id: null,
					ip: null,
					userId: null,
					datatime: null,
					ipType: null
				};
				this.resetForm("form");
			},
			// 表单重置
			reset() {
				this.form = {
					balance: null,
					userUid: null,
					userMail: null,
					nickname: null,
					userPsw: null,
					userSex: null,
					registerIp: null,
					registerTime: null,
					latestLoginTime: null,
					registerAddres: null,
					latestLoginTime2: null,
					latestLoginAddres: null,
					latestLoginIp: null,
					ipWhiteList: null,
					userStatus: 0,
					isOnline: null,
					verificationCode: null,
					verificationTime: null,
					userAvatarFileName: null,
					whatSUp: null,
					maxFriend: null,
					userDesc: null,
					userType: null,
					userRegieon: null,
					iosDeviceToken: null,
					ipType: null,
					banId: null,
					userLevelId: null,
					payPassWord: null,
          deptId: null,
          positionId: null,
          beGoodAt: null,
          prescription: null,
          isRecommend: null,
          reasonsForBan: null,
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
				this.ids = selection.map(item => item.userUid)
				this.single = selection.length !== 1
				this.multiple = !selection.length
			},
			// 多选框选中数据
			handleSelectionChangeV2(selection) {
				// this.ids = selection.map(item => item.userUid)
				// this.single = selection.length !== 1
				// this.multiple = !selection.length

        this.idsV2 = selection.map(item => item.id)
        this.singleV2 = selection.length!==1
        this.multipleV2 = !selection.length
			},

			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
        this.getTreeselect();
				this.open = true;
				this.title = "添加用户管理";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {

        this.showRentPrise = false;
			  let deptId2 = null;
				this.reset();
        this.getTreeselect();
				const userUid = row.userUid || this.ids
				getMissuUsers(userUid).then(response => {
					this.form = response.data;

          this.value = [];
          if (this.form.deptId != null){
            let deptIds = this.form.deptId.split(",");

            for (let i = 0; i < deptIds.length; i++) {
              this.value[i] = parseInt(deptIds[i]);
            }
            if (this.value.length >0){
              this. showRentPrise = true;
            }
          }


					this.open = true;
					this.title = "修改用户管理";
				});


			},
			/* 修改支付密码 */
			updatePayPwd(row){
				this.payform={
					...row
				}
				this.payPwdBox = true;
			},
			// 查看详情
			lookInfo(row) {
				this.packList = []
				this.rechargeRow = row
				this.getpackList()
				setTimeout(() => {
					this.infodilog = true
				},500)
			},
			// 红包配置
      redEnvelopeConfiguration(row) {
        console.log(row)
        this.loadingRedv1 = true;
        this.loadingRedv2 = true;
        if (row != undefined){
          this.queryParamsV2.userId = row.userUid;
        }

        listRedEnvelopeConfigUser(this.queryParamsV2).then(response => {
          this.redEnvelopeConfigUserList = response.rows;
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

        addRedEnvelopeConfigUser(this.queryParamsV2).then(response => {
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
        const id = row.id || this.ids
        getRedEnvelopeConfigUser(id).then(response => {
          this.formV2 = response.data;
          this.openV2 = true;
          this.titleV2 = "修改红包个人配置";
        });
      },

      /** 提交按钮 */
      submitFormV2() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            updateRedEnvelopeConfigUser(this.formV2).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.openV2 = false;
                this.redEnvelopeConfiguration();
              }
            });
          }
        });
      },


      // 查看邀请人
			lookInvitees(code){
				console.log("lookInvitees>>>>>",code);
				listMissuUsers({'myCommunicationNumber':code}).then(response => {
					this.inviteesBox = true;
					this.inviteesList = response.rows;
				});
			},
			// 充值
			handleRecharge(row) {
				this.rechargeRow = row;
				this.getpackList()
				this.recharge = true;
        console.info("row:::::::::::")
        console.info(row)
        this.rechargeForm.userUid = row.userUid
			},

			handleBanIpFor(e, i) {
				// this.banIpFlag = true
				this.banIp.userId = e.userUid;
				this.handleBanIp(e, i)
			},


			handleBanIp(e, i) {
				let data = {
					ipType: 0,
					ip: e.latestLoginIp,
					userId: e.userUid
				}
				console.log(data)
				if (i == 1) {
					this.$confirm('确定要封此用户 ip吗,此用户会立即被封号，并且相同 ip的用户不能登录注册？', "警告", {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						addIp(data).then(response => {
							if (response.code === 200) {
								this.msgSuccess("封禁成功");
								this.open = false;
								this.getList();
							}
						});
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消操作'
						});
					});
				} else {
					delIp(e.banId).then(response => {
						if (response.code === 200) {
							this.msgSuccess("解除封禁成功");
							this.open = false;
							this.getList();
						}
					});
				}
			},

			handleLocking(e, i) {
				this.reset();
				if (i == 1) {
          this.reasonsForBanFrom.reasonsForBan = e.reasonsForBan;
          this.reasonsForBanFrom.userUid = e.userUid;
          this.attributeVisiable = true;
				} else {
					this.form.userUid = e.userUid
					this.form.userStatus = 1
          this.form.balance = null;
					updateMissuUsers(this.form).then(response => {
						if (response.code === 200) {
							this.msgSuccess("解封成功");
							this.open = false;
							this.getList();
						}
					});
				}

			},
			dateChange(e) {
				console.log(e)
			},
			/** 提交按钮 */
			submitForm() {
        console.log(2222222222222222222)
        console.log(this.value)
        this.form.deptId = this.value.toString();
				console.log("submitForm>>>");
        this.form.balance = null;
				// if (this.form.balance * 1 < 0) {
				// 	this.$message.error('金额不得小于0');
				// 	return false
				// }


				this.$refs["form"].validate(valid => {
					if (valid) {
						// console.log("md5>>>",this.$md5(this.form.userPsw));
						// let md5Code = this.$md5(this.form.userPsw);
						// this.form.userPsw = md5Code;
						if (this.form.userUid != null) {
							updateMissuUsers(this.form).then(response => {
								if (response.code === 200) {
									this.msgSuccess("修改成功");
									this.open = false;
									this.getList();
								}
							});
						} else {
							addMissuUsers(this.form).then(response => {
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
			submitRechargeForm(){
				this.$refs.rechargeForm.validate(valid => {
					if(valid){
						let params = {}
						// this.packList.forEach((item,index) => {
						// 	if (this.rechargeForm.groupVal == item.gid) {
						// 		params = item
						// 	}
						// })
            console.info(this.rechargeForm)
						params.balance = this.rechargeForm.rechargeValue
						params.userUid = this.rechargeForm.userUid
						params.userStatus = 100
            updateMissuUsers(params).then(response => {
							if (response.code === 200) {
								this.msgSuccess("修改成功");
								this.recharge = false;
								this.$refs.rechargeForm.resetFields();
								this.getList();
							}
						});
					}
				});

			},
			submitPayForm(){
				this.$refs["payform"].validate(valid => {
					if (valid) {
						// console.log("md5>>>",this.$md5(this.form.userPsw));
						// let md5Code = this.$md5(this.form.userPsw);
						// this.form.userPsw = md5Code;
            this.payform.balance = null;
							updateMissuUsers(this.payform).then(response => {
								if (response.code === 200) {
									this.msgSuccess("修改成功");
									this.payPwdBox = false;
									this.getList();
								}
							});
					}
				});
			},
      resetRandom() {
        this.form = {
          gMemberCount: null,
          gId: null,
        };
        this.resetForm("form");
      },
			/** 删除聊天记录 */
			delChatRecord(row) {
				const userUids = row.userUid || this.ids;
				this.$confirm('是否确认删除聊天记录?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(function() {
					return delChatRC(userUids);
				}).then(() => {
					this.getList();
					this.msgSuccess("删除成功");
				}).catch(function() {});
			},
			/** 删除按钮操作 */
			handleDelete(row) {
				const userUids = row.userUid || this.ids;
				this.$confirm('是否确认删除所选的的数据项?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(function() {
					return delMissuUsers(userUids);
				}).then(() => {
					this.getList();
					this.msgSuccess("删除成功");
				}).catch(function() {});
			},


      /** 删除按钮操作 */
      handleDeleteV2(row) {
        const ids = row.id || this.idsV2;
        this.$confirm('是否确认删除所选的的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRedEnvelopeConfigUser(ids);
        }).then(() => {
          this.redEnvelopeConfiguration();
          this.msgSuccess("删除成功");
        }).catch(function() {});
      },

      // select(node, instanceId){
      //   console.log("11111111111111111111111")
      //   // console.log(instanceId)
      // },
			/** 导出按钮操作 */
			handleExport() {
				const queryParams = this.queryParams;
				this.$confirm('是否确认导出所有用户管理数据项?', "警告", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(function() {
					return exportMissuUsers(queryParams);
				}).then(response => {
					this.download(response.msg);
				}).catch(function() {});
			}

			,
      /** 新增按钮操作 */
      generateUser() {
        this.resetRandom();
        this.open2 = true;
        this.title = "生成自定义用户";
      },

      select(node, instanceId){
        // console.log(this.value)
        // console.log(this.value.length)
			  // console.log(node.id)
			  // console.log("ddddddddddddddddd")
      }

			,
      deselect(node, instanceId){
        // console.log(this.value)
        // console.log(this.value.length)
        // console.log(node.id)
			  // console.log("ddddddddddddddddd")
      }
			,
      close(node, instanceId){
			  if (this.value.length >0){
          this. showRentPrise = true;
        }
        console.log(this.value)
        console.log(this.value.length)
        console.log(node.id)
			  console.log("ddddddddddddddddd")
      },
      // handleAttributeShow() {
      //   this.attributeForm = {}
      //   this.attributeVisiable = true
      // },
      handleAttributeAdd() {
        // this.attributes.unshift(this.attributeForm)
        console.info(this.reasonsForBanFrom)
        this.form.userUid = this.reasonsForBanFrom.userUid
        this.form.reasonsForBan = this.reasonsForBanFrom.reasonsForBan
        this.form.userStatus = 0
        this.form.balance = null;
        updateMissuUsers(this.form).then(response => {
          if (response.code === 200) {
            this.msgSuccess("封禁成功");
            this.open = false;
            this.getList();
          }
        });
        this.attributeVisiable = false


      },
      /** 导出按钮操作 */
      generateUser1() {
        this.queryParams.generationNumberSegment = this.form.generationNumberSegment;
        // console
        const queryParams = this.queryParams;
        console.log(queryParams)
        this.open2 = false;
        this.$confirm('是否确认生成自定义成员数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return generateUserV2(queryParams);
        }).then(response => {
          this.open = false;
          this.msgSuccess("生成成功");
          this.getList();
        }).catch(function() {});
      }
      // handleAttributeDelete(row) {
      //   const index = this.attributes.indexOf(row)
      //   this.attributes.splice(index, 1)
      // }

		}
	};
</script>
