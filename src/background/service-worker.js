function injectScript(tabId, scriptPath)
{
	chrome.scripting.executeScript({
		target: { tabId, allFrames: true },
		files: [scriptPath],
	}, injectionCallback);
}

function injectionCallback()
{
	if(chrome.runtime.lastError)
	{
		console.warn(`Script execution error: ${chrome.runtime.lastError.message}`);
	}
	else
	{
		console.warn("Politifier injected.");
	}
}

async function getAllTabsAsync()
{
	const queryOptions = { url: ["https://*/*", "http://*/*"] };

	return await chrome.tabs.query(queryOptions);
}

async function getTabAsync(tabId)
{
	return await chrome.tabs.get(tabId);
}

function newTabInjectorListener()
{
	chrome.tabs.onCreated.addListener((newTab) => {
		chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo)
        {
			if (tabId === newTab.id && changeInfo.status === "complete")
            {
				chrome.tabs.onUpdated.removeListener(listener);
				injectScript(tabId, "content/swap-injector.js");
			}
		});
	});
}

function tabUpdateInjectorListener()
{
	chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
		if (changeInfo.status === "complete")
        {
			injectScript(tabId, "content/swap-injector.js");
		}
	});
}

async function existingTabInjector()
{
	const tabs = await getAllTabsAsync();
	tabs.forEach((tab) => {
		injectScript(tab.id, "content/swap-injector.js");
	});
}

async function bootExtension()
{
	existingTabInjector();

	newTabInjectorListener();

	tabUpdateInjectorListener();
}

bootExtension();
