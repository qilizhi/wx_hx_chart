var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var config = require('../../utils/config');
var WebIM = WebIM.default

Page({
    data: {
        search_btn: true,
        search_friend: false,
        show_mask: false,
        token: '',
        member: [],
        myName: ''
    },
    onLoad: function (option) {
      var myName = wx.getStorageSync('openId')
      var token = wx.getStorageSync('accessToken');
        this.setData({
          myName:myName
        })  
        this.groupDetail(token)//获取群组详情
    },
    
    onShow: function () {
      var token = wx.getStorageSync('accessToken');
      this.groupList(token)//获取app下所有的群组
    }, 
    
    
    openSearch: function () {
        this.setData({
            search_btn: false,
            search_friend: true,
            show_mask: true
        })
    },
    cancel: function () {
        this.setData({
            search_btn: true,
            search_friend: false,
            show_mask: false
        })
    },
    add_new: function () {
        wx.navigateTo({
            url: '../add_new/add_new'
        })
    },
    tab_chat: function () {
        wx.redirectTo({
            url: '../chat/chat'
        })
    },
    close_mask: function () {
        this.setData({
            search_btn: true,
            search_friend: false,
            show_mask: false
        })
    },
    tab_setting: function () {
        wx.redirectTo({
            url: '../settings/settings'
        })
    },
    into_inform: function () {
        wx.navigateTo({
            url: '../inform/inform'
        })
    },
    into_groups: function (event) {
      console.log(event)
      wx.navigateTo({
        url: '../groups/groups'
      })
    },
   
    into_room: function (event) {
        var that = this
        var myName= that.data.myName
        var groupName = that.data.groupName
        wx.navigateTo({
          url: '../chatroom/chatroom?groupName='+ groupName
        })
        
    },
    into_info: function (event) {
        wx.navigateTo({
            url: '../friend_info/friend_info?yourname=' + event.target.dataset.username
        })
    },

    groupDetail: function(token){
        var that=this
        var openId = wx.getStorageSync('openId');
        var host = config.host;
        var token = token;
        var username = openId;
        var org_name = config.org_name;
        var app_name = config.app_name;
        var group_id = config.group_id
        var member = []
        wx.request({
          url: 'http://' + host + '/' + org_name + '/' + app_name + '/chatgroups/'+group_id,
          method: "GET",
          header: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          success: function (res) {
            //console.log(res.data.data[0].affiliations)//群组成员
            //获取所有群组member
            var temp = res.data.data[0].affiliations
            for (var i = 0;i<(res.data.data[0].affiliations).length;i++){
              //console.log(res.data.data[0].affiliations[i])
              if((temp[i].member)!= undefined){
                member.push(temp[i].member)
              }
            }
            console.log(member)
            that.setData({
              member: member
            })
            wx.setStorage({
              key: 'member',
              data: that.data.member
            })
          }
        })
    },


     groupList: function (token) {
      var that = this
      var openId = wx.getStorageSync('openId');
      var host = config.host;
      var token = token;
      var username = openId;
      var org_name = config.org_name;
      var app_name = config.app_name;
      wx.request({
        url: 'http://' + host + '/' + org_name + '/' + app_name + '/chatgroups',
        method: "GET",
        header: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        success: function (res) {
          //console.log(res)
          console.log(res.data.data[0].groupid)
          console.log(res.data.data[0].groupname)
          that.setData({
            groupName: res.data.data[0].groupname
          })
        }
      })
    },



})