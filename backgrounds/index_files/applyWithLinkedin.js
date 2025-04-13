// Handle the successful return from the LinkedIN API call
function getAWLIProfileData(data) {
  try{
      $('.widget-loader').show();
  $('.overlaybg').show();
  raiseResumeClickEvent("linkedin");
  var obj = {
    "ddoKey": "linkedinResume",
    "linkedInProfile": eval(data),
    "isApplyWithLinkedin": true
  };

  console.log(JSON.stringify(obj));
  var baseUrl = phApp.baseDomain;
  $.ajax({
            url: baseUrl.split("/")[0] + '/widgets',// hubsite location for
            // resume parsing
            cache: false,
            type: 'POST',
            data: JSON.stringify(obj), // 'requestData=' +
            // encodeURIComponent(requestData),
            contentType: "application/json",
            dataType: 'json',
            beforeSend: function() {
              // overlay
            },
            success: function(response) {
              var resObj = eval(response);
              if (resObj.liResumeResponse.status == 'success') {
                global_resumeSource = "linkedin";
                if(phApp.locale == 'en_uk') {
                    var resumeUploadMsg = $.i18n.prop("apply.errmsg.err.resumeUploadMsg");
                    alert(resumeUploadMsg);
                } else {
                    alert("Your resume has been uploaded successfully.");
                }


                console.log(resObj);
                $("#resumePath").val(resObj.liResumeResponse.S3UploadedFileUrl);
                $("#resumeName").val(resObj.liResumeResponse.fileName);
                if( resObj.liResumeResponse.resume.email != undefined && resObj.liResumeResponse.resume.email != null) {
                    $("#username").val(resObj.liResumeResponse.resume.email);
                }
                var resumeDataObj = resObj.liResumeResponse.resume;
                resumeData = resObj.liResumeResponse.resume;
                if (resObj.liResumeResponse.resumetxt) {
                  resumeDataObj['detailResume'] = resObj.liResumeResponse.resumetxt;
                }

                console.log(resObj);
                $("#applySource").val("LinkedIn");
                postResumeUploadAction(resObj.liResumeResponse.resume);


                raiseResumeUploadEvent(resumeDataObj, "linkedin",
                        resObj.liResumeResponse.S3UploadedFileUrl);

                if (document.querySelector(".afterResumeUpload") != null
                        && document.querySelector(".afterResumeUpload") != undefined) {
                  $(".afterResumeUpload")
                          .html(resObj.liResumeResponse.fileName);
                  $(".afterResumeUpload").removeClass().addClass(
                          "pdf afterResumeUpload");

                } else {
                  if (document.querySelector(".afterUpload") != null
                          && document.querySelector(".afterUpload") != undefined) {
                    $(".afterUpload").html(
                            '' + resObj.liResumeResponse.fileName + '');

                  } else {
                    $("#afterupload")
                            .html(
                                    '<div class="afterUploadOuter"><div class="afterUpload" style="min-height: 50px; display: block;"><a id="downloadFile" class="filename" href="javascript:void(0)" tabindex="0" style="font-size: medium">'
                                            + resObj.liResumeResponse.fileName
                                            + '</a></div></div>').css(
                                    "display", "block");
                  }

                  $(".afterUpload").removeClass().addClass("pdf afterUpload");
                  $(".afterupload").removeClass().addClass("pdf afterUpload");
                }
                jQuery('.widget-loader').removeClass("resume-loader").hide();
                jQuery('.overlaybg').hide();
              } else {
                $("#resumeUpload").addClass("res-upload-fail");
                $("#resumeUpload")
                        .html(
                                "Unable to upload the resume. Please choose another one.");
                $('.widget-loader').hide();
                $('.overlaybg').hide();
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(textStatus, errorThrown);
            },
          });
  }catch(err){
    console.log("Error occured in AWLI js ..."+err);
  }
}
// status 401 means user unathorized; again authorized with app
function onError(error) {
  console.log("error  " + error);
  if (error.status == 401 || error.status == "401") {
    IN.User.Authorize().place();
  }
}

function applyWithLinkedin(jobId, linkedinSettings) {
    try{
        if (linkedinSettings != undefined
          && linkedinSettings.integration_context != undefined
          && linkedinSettings.integration_context != '') {

    if ($('script[type="IN/AwliWidget"]').length === 0) {

      let widgetContainerElem = document.querySelector('.awli-2-o');
      let apiKey = linkedinSettings.client_id ;
  widgetContainerElem.innerHTML = '';
  let xdoorElem = document.createElement('script');
  const xdoorUrl = `https://platform.linkedin.com/in.js`;
  const widgetUrl = `https://www.linkedin.com/talentwidgets/extensions/apply-with-linkedin-widget-v3`;

  xdoorElem.src = xdoorUrl;
  xdoorElem.innerHTML = `api_key:${apiKey}
    extensions:AwliWidget@${widgetUrl}
    userSessionEnabled: true
    `;

  let widgetElem = document.createElement('script');
  widgetElem.type = 'IN/AwliWidget';
  // for (let paramKey in params) {
  //     const paramValue = params[paramKey];
  //     widgetElem.setAttribute(paramKey,paramValue);
  // }
  widgetElem.setAttribute('data-callback-method', 'getAWLIProfileData');
  widgetElem.setAttribute('data-company-job-code', jobId);
  widgetElem.setAttribute('data-integration-context', linkedinSettings.integration_context);
  widgetElem.setAttribute('data-mode', 'BUTTON_DATA');
  // widgetElem.setAttribute('data-color', params['data-color']);
  // widgetElem.setAttribute('data-size', params['data-size']);
  // process optional params
  // OPTIONAL_PARAMS.forEach((param) => {
  //     if (params[param]) {
  //         widgetElem.setAttribute(param, params[param]);
  //     }
  // });

  widgetContainerElem.append(xdoorElem);
  widgetContainerElem.append(widgetElem);


      // var awliWidget = "" + ""
      //         + "  <script type='text/javascript' script-tag='awliWidget'"
      //         + "src='extensions:AwliWidget@https://www.linkedin.com/talentwidgets/extensions/apply-with-linkedin-widget-v3'>"
      //         + "</script>"
      //         + "  <script type='text/javascript' script-tag='awliWidget'"
      //         + "src='https://platform.linkedin.com/xdoor/scripts/in.js'>"
      //         + "</script>";
      //
      // awliWidget = awliWidget + "<script type='IN/AwliWidget'"
      //         + "data-company-job-code='" + jobId + "'"
      //         + "data-integration-context='"
      //         + linkedinSettings.integration_context + "'"
      //         + "data-mode='BUTTON_DATA'"
      //         + "data-callback-method='getAWLIProfileData'" + "data-api-key='"
      //         + linkedinSettings.client_id + "'" + "data-allow-sign-in='true'>"
      //         + "</script>";
      // $('.awli-2-o').append(awliWidget);
    }

  }
  }catch(err){
    console.log("Error occured in AWLI js ..."+err);
  }
}

function enableApplyWithLinkedIn(response) {
  if (response != undefined && response.atsSpecificData != undefined
          && response.atsSpecificData.cloudOptionSettings) { return true; }
  return false;
}
