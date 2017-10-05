var strophe = require('utils/strophe.js')
var WebIM = require('utils/WebIM.js')
var WebIM = WebIM.default
var config = require('./utils/config');

Page({

  //获取openid
  getOpenIdTap: function () {
    var that = this
    var app_id = config.app_id;
    var app_secret = config.app_secret;
    wx.login({
      success: function (res) {
        if (res.code) {
          // console.log(res.code)
          that.getOpenId(res.code)//根据code拿openIdthat.getOpenId(res.code)//根据code拿openId

          wx.getUserInfo({
            success: function (res) {
              console.log('userInfo:' + JSON.stringify(res.userInfo))
              wx.setStorage({
                key: "nickName",
                data: res.userInfo.nickName
              })
              wx.setStorage({
                key: "headImg",
                data: res.userInfo.avatarUrl
              })
            }
          });
        }
      }
    })
  },

  getOpenId: function (code) {
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
        appid: config.app_id,
        secret: config.app_secret,
        js_code: code,
        grant_type: 'authorization_code'
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        wx.setStorageSync('openId', res.data.openid);
        that.setData({
          openid: res.data.openid
        })
      }
    })
  },


  //获取rest接口token
  getToken: function () {
    var that = this
    var client_id = config.client_id;
    var client_secret = config.client_secret;
    var host = config.host;
    var org_name = config.org_name;
    var app_name = config.app_name;
    var token = '';
    var expiredAt;
    var d = { grant_type: 'client_credentials', client_id: client_id, client_secret: client_secret };
    wx.request({
      url: 'http://' + host + '/' + org_name + '/' + app_name + '/token',
      data: JSON.stringify(d),
      path: 'token',
      method: "post",
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        wx.setStorageSync('accessToken', res.data.access_token);
        that.authReg(res.data.access_token)//授权注册
        that.addToGroup(res.data.access_token)//添加进群组
      }
    })
  },


  //授权注册
  authReg: function (token) {
    var that=this
    var accessToken = token;
    var openId = wx.getStorageSync('openId');
    var nickName = wx.getStorageSync('nickName');
    //console.log(nickName)
    var host = config.host;
    var org_name = config.org_name;
    var app_name = config.app_name;
    var token = token;
    var expiredAt;
    var username = openId;
    var password='123456';
    var nickName = nickName;
    var d = { username: username, password:password,nickname: nickName};
    wx.request({
      url: 'http://' + host + '/' + org_name + '/' + app_name + '/user',
      data: JSON.stringify(d),
      path: 'token',
      method: "post",
      header: { 'Content-Type': 'application/json',
        'Authorization':'Bearer '+token
       },
      success: function (res) {
        //判断res.data.expires_in的时间token过期
        //console.log(res)
        //that.hxloign(username)
      }
    })
    
  },
  

  //将用户添加进群组
  addToGroup: function (token) {
    var that = this
    var openId = wx.getStorageSync('openId');
    var nickName = wx.getStorageSync('nickName');
    var host = config.host;
    var org_name = config.org_name;
    var app_name = config.app_name;
    var group_id = config.group_id;
    var token = token;
    var username = openId;
    var nickName = nickName;
    var d = { username: username, group_id: group_id };

    wx.request({
      url: 'http://' + host + '/' + org_name + '/' + app_name + '/chatgroups/' + group_id + '/users/'+username,
      data: JSON.stringify(d),
      path: 'token',
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: function (res) {
        //wx.navigateTo({
        //  url: '../pages/main/main?token=' + token //进入环信主页
        //})
        that.hxloign(username)
        
        //判断res.data.expires_in的时间token过期
        //console.log(res.statusCode)//打印错误代码
        if (res.statusCode == '200'){
          wx.showToast({
            title: '添加成功',
          })        
        }else{
          wx.showToast({
            title: '添加失败',
          })
        }
      }
    })
  },

  //登陆
  hxloign: function (username) {
    var options = {
      apiUrl: WebIM.config.apiURL,
      user: username,
      pwd: '123456',
      grant_type: 'password',
      appKey: WebIM.config.appkey //应用key
    }
    WebIM.conn.open(options)
    wx.navigateTo({
          url: '../pages/main/main'  //进入环信主页
    })
  },



})