Page({
	data: {
    nickName: wx.getStorageSync("nickName"), 
    userId: wx.getStorageSync('openId')
	},
	onLoad: function() {
		this.setData({
			nickName:this.data.nickName,
      userId:this.data.userId
		})
	}
})