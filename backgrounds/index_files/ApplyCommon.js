
function ApplyCommon() {
//     this.isAWLILoaded = false;
}

ApplyCommon.prototype.applyPreInit = function(windowObj){
};

ApplyCommon.prototype.applyPostInit = function(windowObj){
	try{
		var me = this;
		if(windowObj.phApp && windowObj.phApp.ddo){
			var applyResponse =  window.phApp.ddo.response;
			var response = applyResponse.response; 
			me.enableApplyWithLinkedin(response);
		 }
	}catch(err){
		console.log("Error occured in common js ..."+err);
	}
};

ApplyCommon.prototype.postHandleApplyResponse = function(response){
	var me = this;
	me.enableApplyWithLinkedin(response);	

};

ApplyCommon.prototype.enableApplyWithLinkedin = function(response){
	try{
		var me = this;
		//        if(me.isAWLILoaded){
		//            return;
		//         }
			if(response && response.jobId && enableApplyWithLinkedIn(response)){
					var atsSpecificData = response.atsSpecificData;
					if(atsSpecificData && atsSpecificData.cloudOptionSettings){
						if(document.querySelector("#containerLinkedin") != null && document.querySelector("#containerLinkedin") != undefined){ 
							document.querySelector("#containerLinkedin").classList.add("awli-2-o");
							document.querySelector("#containerLinkedin").classList.remove("linkedin");
							applyWithLinkedin(response.jobId , atsSpecificData.cloudOptionSettings.linkedIn);
		//                        me.isAWLILoaded = true;
						 }else if(document.querySelector(".awli-2-o") != null && document.querySelector(".awli-2-o") != undefined){
							applyWithLinkedin(response.jobId , atsSpecificData.cloudOptionSettings.linkedIn);
		//                        me.isAWLILoaded = true;		
						}
					}
			}
	}catch(err){
		console.log("Error occured in common js ..."+err);
	}	
}

