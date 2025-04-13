const CHATBOT_CONFIGURATIONS_DDO = "getChatbotConfigurations";
const ENVIRONMENT = "stg-us";
const EXPERIENCE_TYPE = "cx";
window.chatbotBaseUrl = window.chatbotBaseUrl || window.chatbotURL || window.location.href;
window.chatbotURL = window.chatbotBaseUrl || window.chatbotURL;

const liveChatInfo = {
	commonLiveChatPages: ["/ge-tech-talk-3d-additive-innovations-live-chat", "/Live-Chat-Demo", "/TEST-Event-2", "/event", "/events", "/lehigh-valley", "/va-jobs", "/anheuser-busch-drivers", "/fort-wayne-in", "/groveport-oh"],
	customers: {
		GE11GLOBAL: {
			enabledPages: [],
			disabledPages: ["/event", "/events"],
		},
		PHENA0059: {
			enabledPages: [],
			disabledPages: [],
		},
		KNOWA0054: {
			enabledPages: [],
			disabledPages: [],
		},
		SAHEGLOBAL: {
			enabledPages: [],
			disabledPages: [],
		},
		WORKUS: {
			enabledPages: [],
			disabledPages: [],
		},
		NIDRUS: {
			enabledPages: [
				"/company-driver",
				"/owner-operators",
				"/new-drivers",
				"/search-results",

				"/Dedicated-Truck-Driver-CDL-A",
				"/Walmart-Local-Truck-Driver-CDL-A",
				"/Walmart-Line-Haul-Truck-Driver-CDL-A",
				"/Petsmart-Dedicated-Truck-Driver-CDL-A",
				"/Budweiser-Dedicated-Truck-Driver-CDL-A",

				"/job/22907/Southeast-Regional-Truckload-Driver-CDLA",
				"/job/18255/Southeast-Regional-Truckload-Driver-CDLA",
				"/job/31262/Regional-Truckload-Driver-CDL-A",
				"/job/18175/Regional-Truckload-Driver-CDL-A",
				"/job/33019/Grocery-Dedicated-Truck-Driver-CDL-A",
				"/job/29309/Big-Lots-Dedicated-Truck-Driver-CDL-A",
				"/job/27285/Kohl%27s-Dedicated-Truck-Driver-CDL-A",
				"/fort-wayne-in",
				"/job/26609/Target-Dedicated-Truck-Driver-CDL-A",
				"/job/3291/Walmart-Dedicated-Truck-Driver-CDL-A",
				"/job/7224/Staples-Dedicated-Local-Truck-Driver",
				"/job/33009/NestleWater-Dedicated-Truck-Driver-CDL-A",
				"/job/33080/Grocery-Dedicated-Truck-Driver-CDL-A",
				"/event/6169ca21d6018000092eff79/NFI-Truck-Driver-Hiring-Event",
				"/event/616db98fd601800006f2bc4e/NFI-Truck-Driver-Appreciation-Event",
				"/event/61785018cff47e00067b4f7f/CDL-Truck-Driver-Hiring-Event",
				"/job/32003/Owner-Operator-Truck-Driver-CDL-A",
				"/job/31286/Dedicated-Drayage-Driver-CDL-A",
				"/job/31512/CDL-A-Owner-Operators-Norfolk-Drayage",
				"/job/21794/CDLA-Owner-Operators-Savannah-Drayage",
				"/job/21793/CDLA-Owner-Operators-Wilmington-Drayage",
			],
			disabledPages: ["/event[/]*$"],
		},
		BHFSUS: {
			enabledPages: [],
			disabledPages: [],
		},
		CIELUS: {
			enabledPages: [],
			disabledPages: [],
		},
		PTUSGLOBAL: {
			enabledPages: [],
			disabledPages: [],
		},
	},
};
function isLiveChat() {
	const requestPagePath = window.location.href.trim();
	if (!window.phApp) return false;

	const refNum = window.phApp.refNum;

	if (!requestPagePath || !(refNum in liveChatInfo.customers)) return false;

	/* First check for customer specific livechat disabled path match */
	for (const pagePath of liveChatInfo.customers[refNum].disabledPages) {
		if (requestPagePath.search(pagePath) !== -1) {
			return false;
		}
	}

	/* Check for customer specific livechat enabled path match */
	for (const pagePath of liveChatInfo.customers[refNum].enabledPages) {
		if (requestPagePath.search(pagePath) !== -1) {
			return true;
		}
	}

	/* Check for master livechat path match */
	for (const pagePath of liveChatInfo.commonLiveChatPages) {
		if (requestPagePath.search(pagePath) !== -1) {
			return true;
		}
	}

	return false;
}

function getTriggerURL(environment, newChatbot) {
	const timestamp = new Date().getTime();
	if (newChatbot) {
		return "https://cdn-bot.phenompeople.com/chatbot-builds/" + environment + "/initiators/" + EXPERIENCE_TYPE + "/chatbot-trigger.js?v=" + timestamp;
	} else {
		return "https://cdn-bot.phenompeople.com/txm-bot/" + environment + "/chatbot-trigger.js?v=" + timestamp;
	}
}

const maxRetryCount = 10;
let retryCount = 0;

function decideAndInjectChatbotTrigger() {
	const script = document.createElement("script");
	script.id = "ChatbotScriptTrigger";
	if (window.phApp && window.phApp.phb && window.phApp.phb.profileLoginService && window.phApp.refNum) {
		window.phApp.phb.profileLoginService.fetchRequest(CHATBOT_CONFIGURATIONS_DDO, { currentUrlPath: window.location.href }, function (configurations) {
			if (!configurations || !configurations.data || configurations.statusCode !== 200) {
				console.info("Configurations Not found");
				return;
			}
			if (!configurations.data.isChannelEnabled) {
				console.info("Chatbot is disabled!!");
				return;
			}
			if (configurations.data.chatbotDisabledPageNames && Array.isArray(configurations.data.chatbotDisabledPageNames) && configurations.data.chatbotDisabledPageNames.includes(window.phApp.pageName)) {
				console.info("Chatbot is disabled on this page");
				return;
			}
			window.phChatbot = window.phChatbot || {};
			window.phChatbot.configurations = configurations;
			const newChatbot = configurations.data.chatbotVersion === "2.0" && !isLiveChat();
			const triggerURL = getTriggerURL(ENVIRONMENT, newChatbot);
			script.src = triggerURL;
			document.body.appendChild(script);
		});
	} else {
		if (window.phApp) {
			if (retryCount < maxRetryCount) {
				setTimeout(() => {
					decideAndInjectChatbotTrigger();
				}, 100);
				retryCount++;
				return;
			} else {
				console.error("Chatbot not injected, as Required dependent scripts not injected");
				return;
			}
		}
		const triggerURL = getTriggerURL(ENVIRONMENT, true);
		script.src = triggerURL;
		setTimeout(function () {
			document.body.appendChild(script);
		}, 2000);
	}
}

if (document.readyState === "complete") {
	decideAndInjectChatbotTrigger();
} else {
	window.addEventListener("load", () => {
		decideAndInjectChatbotTrigger();
	});
}
