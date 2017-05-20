var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Participant = require('../models/participant').participant;
var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: 'participants' }
}
const ERROR_CODE={
  NOT_BOUND:"100001",
  NOT_APPLYED:"100002",
  DUMP_APPLY:"100003",
  DUMP_REWARD:"100004"
}
mongoose.connect('mongodb://localhost/participant',options);

router.get('/apply', function(req, res) {
    var resBody={}
		var par = new Participant({
      openId:req.query.openId,
      phone:req.query.phone,
      applyFlag:true,
      rewardFlag:false
    });
    par.save(function(err,p){
      if(!err){
        resBody={
          status:0,
          message:"success"
        }
      }
      else {
        resBody={
          status:-1,
          message:"sys error"
        }
        if(err.code==11000) {
          resBody.status=ERROR_CODE.DUMP_APPLY;
          resBody.message="you have already applyed this activity."
        }
      }
      return res.json(resBody);
    })
});

router.get('/reward', function(req, res) {
    var id= req.query.openId;
    var resBody={};
    var applyFlag=false;
    var rewardFlag=true;
    Participant.find({openId:id},function(err,p){
        if(p&&p.length>0){
          applyFlag=p[0].applyFlag;
          rewardFlag=p[0].rewardFlag;
        }
        else{
          resBody={
            status:ERROR_CODE.NOT_APPLYED,
            message:"you have not applyed this activity yet."
          }
          return res.json(resBody);
        }
    });
    if(rewardFlag){
      resBody={
        status:ERROR_CODE.DUMP_REWARD,
        message:"you have already been rewarded."
      }
      return res.json(resBody);
    }
    if(applyFlag){
    	Participant.update({openId:id},
        {
          $set:{rewardFlag:'true'}
        },
        function(err,p){
          if(!err){
            resBody={
              status:0,
              message:"success"
            }
          }
          else{
            resBody={
              status:-1,
              message:"sys error"
            }
          }
          return res.json(resBody);
        });
    }
});
router.get('/applyStatus', function(req, res) {
  var id= req.query.openId;
  var resBody={};
  Participant.find({openId:id},function(err,p){
      if(p&&p.length>0){
        if(p[0].applyFlag){
          resBody={
            status:0,
            message:"success",
            applyStatus:true
          }
        }
        else{
          resBody={
            status:0,
            message:"success",
            applyStatus:false
          }
        }
      }
      else{
        resBody={
          status:0,
          message:"success",
          applyStatus:false
        }
      }
      return res.json(resBody);
  });

});


module.exports = router;
