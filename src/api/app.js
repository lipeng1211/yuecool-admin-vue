// const OSS = require('ali-oss')
// const path = require("path")

const axios = require("axios");
const OSS = require("ali-oss");

// 在客户端使用临时访问凭证初始化OSS客户端，用于临时授权访问OSS资源。
const getToken = async () => {
  await axios.get("https:/xxx/sts").then((token) => {
    const client = new OSS({
      // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
      region: 'yourRegion',
      accessKeyId: token.AccessKeyId,
      accessKeySecret: token.AccessKeySecret,
      stsToken: token.SecurityToken,
      // 填写Bucket名称，例如examplebucket。
      bucket: "examplebucket",
      // 刷新临时访问凭证。
      refreshSTSToken: async () => {
        const refreshToken = await axios.get("http://127.0.0.1/sts");
        return {
          accessKeyId: refreshToken.AccessKeyId,
          accessKeySecret: refreshToken.AccessKeySecret,
          stsToken: refreshToken.SecurityToken,
        };
      },
    });
  });
};

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  // region: 'https://oss-cn-beijing.aliyuncs.com',
  region: 'oss-cn-beijing',
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: "LTAI5tFrWyVsAgcqmV5QMLbd",
  accessKeySecret: "bH86IhYpUF9ADgGyXx2F8P9fiHTvr5",
  bucket: "guoxuerongmei",
  timeout: 20 * 60 * 1000
});

export async function put (file) {
  try {
    // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
    // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。D:\视频
    console.info(getToken)
    console.info("开始上传1");
    // OSS.Buffer('D:\\视频\\logo.png')
    let random1 = random(100000,999999)
    const result = await  client.put(random1 + file.name,file );
    console.info("结束上传2");
    // console.log(result);
    return result;
  } catch (e) {
    console.info("报错了");
    console.log(e);
  }
}
function random(min, max) {

  return Math.floor(Math.random() * (max - min)) + min;

}
