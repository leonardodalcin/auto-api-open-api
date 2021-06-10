chrome.tabs?.query(
  {
    active: true,
    currentWindow: true,
  },
  function (tabs) {
    const element = document.getElementById("url");
    if (element) {
      element.textContent = tabs[0].url ?? "";
    }
  }
);
