var strophe = require('../../utils/strophe.js')
var WebIM = require('../../utils/WebIM.js')
var WebIM = WebIM.default

Page({
	data: {
		username:''
	},
	onLoad: function() {
		var myname = wx.getStorageSync('myname')
    console.log('myname:'+myname)
		this.setData({
			username: myname
		})
	},
	tab_contact: function() {
		wx.redirectTo({
			url: '../main/main'
		})
	},
	tab_chat: function() {
		wx.redirectTo({
			url: '../chat/chat'
		})
	},
	person: function() {
		var myUsername = wx.getStorageSync('myUsername')
		wx.navigateTo({
			url: '../friend_info/friend_info?yourname=' + myUsername
		})
	},
	logout: function() {
		wx.showModal({
			title: '是否退出登录',
			success: function(res) {
			    if (res.confirm) {
		   	        WebIM.conn.close()
		   	        //wx.closeSocket()
		   	        wx.redirectTo({
		   	        	url: '../login/login'
		   	        })
				}
			}
		})
	}
})