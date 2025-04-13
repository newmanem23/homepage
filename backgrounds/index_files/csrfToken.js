(function (window, document, $) {
    $(function () {
        $(document).ajaxSend(function (event, jqXHR, ajaxOptions) {

            if(ajaxOptions.url != undefined && ajaxOptions.url != null && ajaxOptions.url.indexOf("applySubmit") >=0 ) {
                var body = JSON.parse(ajaxOptions.data);
                if(jobSource != null && jobSource != undefined && jobSource != "") {
                    body["source"] = jobSource;
                }
            }

            if (ajaxOptions !== undefined && ajaxOptions.type === 'POST' ) {

        		try{
					var csrfTokenElement = document.getElementById('csrfToken');
	                var csrfTokenStr = "";
	                if(csrfTokenElement != undefined && csrfTokenElement != null){
	                 	if(csrfTokenElement.children.length == 0){
			                csrfTokenStr = csrfTokenElement.innerHTML;
		             	}else if(csrfTokenElement.children.length == 1){
	 	             		if(csrfTokenElement.firstElementChild.length == 1){
				                csrfTokenStr = csrfTokenElement.firstElementChild.firstElementChild.innerHTML;
			             	}else{
			                   console.error("Error in read csrfToken.");
			             	}
		             	}else{
	  					 	console.error("Error in read csrfToken.");
		             	}
	                }else{
		  				console.error("Could not found csrfToken.");
	                }
					if(csrfTokenStr !== undefined && csrfTokenStr !== ""){
				        jqXHR.setRequestHeader('x-csrf-token', csrfTokenStr);
                    }
                    setToXHR(jqXHR);
                }catch(e){
                   console.error("Error in read csrfToken.");
                }

                try{
                     var apTxnIdDElement = document.getElementById('apTxnId');
                     if(apTxnIdDElement != undefined && apTxnIdDElement != null){
                         var apTxnIdStr = apTxnIdDElement.getAttribute('apply-txn-id');
                         if(apTxnIdStr !== undefined && apTxnIdStr !== ""){
                            var payloadStr = ajaxOptions.data;
                             if(payloadStr !== undefined && payloadStr !== ""){
                                var payloadJson;
                                try {
                                    payloadJson = JSON.parse(payloadStr);
                                } catch (e) {
                                }
                                if(payloadJson !== undefined && payloadJson != null){
                                    var formData = payloadJson["formData"];
                                    if(formData !== undefined && formData !== null){
                                       payloadJson['formData']['apTxnId'] = apTxnIdStr;
                                    }
                                    ajaxOptions.data = JSON.stringify(payloadJson);
                                }
                             }
                         }
                    }
                }catch(e){
                   console.error("request payload is not a json, skippig apTxnId add.");
                }
            }
        });
        loadCommonResumeDropzone();
    })

    function setToXHR(request){
        const headers = getExtraHeaders();
        Object.keys(headers).forEach(function(key){
            request.setRequestHeader(key, headers[key]);
        })
    }

    function setHeadersForOld(resumeDropzoneOptions){
        const headers = getExtraHeaders();
        Object.keys(headers).forEach(function(key){
            resumeDropzoneOptions.headers[key] = headers[key];
        })
    }

    function getExtraHeaders(){
        if (!(window.phApp.ddo.response && window.phApp.ddo.response.response)){
            return {}
        }
        const response = window.phApp.ddo.response.response;
        const jobSeqNo = response.JobSeqNo || response.jobSeqNo;
        const jobId = response.jobId;
        const requestInvokerPage = (jobSeqNo || jobId ) ? "apply": "jtc";

        // sets data for all requests
        const returnData = {}

        returnData.jobSeqNo = jobSeqNo;
        returnData.jobId = response.jobId;
        returnData.requestInvokerPage = requestInvokerPage;
        return returnData;
    }




    function loadCommonResumeDropzone() {
        var resumeDropzoneOptions = window.resumeDropzoneOptions;
        try{
	        if (resumeDropzoneOptions !== undefined) {
	        	var csrfTokenElement = document.getElementById('csrfToken');
	            var csrfTokenStr = "";
	            if(csrfTokenElement != undefined && csrfTokenElement != null){
	             	if(csrfTokenElement.children.length == 0){
		                csrfTokenStr = csrfTokenElement.innerHTML;
	             	}else if(csrfTokenElement.children.length == 1){
		             	if(csrfTokenElement.firstElementChild.length == 1){
			                csrfTokenStr = csrfTokenElement.firstElementChild.firstElementChild.innerHTML;
		             	}else{
		                   console.error("Error in read csrfToken.");
		             	}
	             	}else{
						 	console.error("Error in read csrfToken.");
	             	}
	            }else{
	  				console.error("Could not found csrfToken.");
	            }
	            if(csrfTokenStr !== undefined && csrfTokenStr !== ""){
	                if (resumeDropzoneOptions.headers != undefined) {
	                    var oldHeaders = resumeDropzoneOptions.headers;
	                    oldHeaders['x-csrf-token'] = csrfTokenStr
	                    resumeDropzoneOptions.headers = oldHeaders;
	                } else {
	                    resumeDropzoneOptions.headers = { 'x-csrf-token': csrfTokenStr };
                    }
                    setHeadersForOld(resumeDropzoneOptions);
	                if (resumeDropzone != undefined) {
	                    resumeDropzone.destroy();
	                    if (Dropzone.instances.length > 0) {
	                      Dropzone.instances.forEach(function(dz){
	                        dz.destroy();
	                      });
	                    }
	                    if ($('#resumeFile').length) {
	                       try{
	                            resumeDropzone = new Dropzone('#resumeFile', resumeDropzoneOptions);
                            }catch(e){
        		                console.error("#resumeFile is not loaded in the Dropzone");
                            }
	                    }
	                    if ($('#resumeFile1').length) {
	                        try{
	                            resumeDropzone = new Dropzone('#resumeFile1', resumeDropzoneOptions);
                            }catch(e){
                                console.error("#resumeFile1 is not loaded in the Dropzone");
                            }
	                    }
	                }
	                console.log("Reloaded resumeDropzone");
	            }else{
	            	console.error("Could not found csrfToken.");
	            }
	        } else {
	            setTimeout(loadCommonResumeDropzone, 100); //wait 100 ms, then try again
	        }
	    }catch(e){
    	   console.error("Error in read csrfToken for resumeDropzone");
    	}
    }
})(window, document, jQuery);