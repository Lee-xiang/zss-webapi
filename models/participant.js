var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var participant = new Schema({
	openId: {
    type:String,
    unique: true
  },
  phone:String,
  bindFlag:Boolean,
  applyFlag:Boolean,
  rewardFlag:Boolean
});	//	定义了一个新的模型，但是此模式还未和users集合有关联
exports.participant = mongoose.model('participant', participant,"participants"); //	与mycart集合关联
