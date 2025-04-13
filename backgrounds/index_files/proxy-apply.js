var original_prepareKafkaData = window.prepareKafkaData;
var utm_appsource = getReqParameter("utm_appsource");
//proxy function
window.prepareKafkaData = function (args1, args2, args3) {
    var dataForTrackingNew = original_prepareKafkaData(args1, args2, args3);
    if (utm_appsource == "career-site-bot") {
        dataForTrackingNew["trait270"] = "bot";
    }
    var in_ref = getCookie("in_ref");

    if (in_ref != false && in_ref != true) {
        dataForTrackingNew["initialReferral"] = in_ref !== undefined && in_ref !== null && in_ref.trim().length !== 0 ? in_ref : "direct";
    } else {
        dataForTrackingNew["initialReferral"] = "direct";
    }

    return dataForTrackingNew;
};

function getReqParameter(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    return results == null ? null : results[1];
}

