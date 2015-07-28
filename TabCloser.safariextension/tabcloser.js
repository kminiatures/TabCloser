safari.application.addEventListener("contextmenu", contextMenuHandler, false);
safari.application.addEventListener('command', function (event) {
  if (event.command === 'closeDuplicateDomain') closeDuplicateDomain();
  else if (event.command === 'closeRightTabs') closeRightTabs();
  return;
}, false);


var closeDuplicateDomain = function() {
  var domains = {};
  safari.application.browserWindows.forEach(function(window) {
    window.tabs.forEach(function(tab) {
      var arr = tab.url.split("/");
      var domain = arr[0] + "//" + arr[2];
      if (domains[domain]) {
        tab.close();
      }
      else {
        domains[domain] = true;
      };
    });
  });
};

var closeRightTabs = function() {
  var info = new safariInfo();
  for (var i = info.activeTabPosition+1; i < info.activeWindows_totalTab; i++){
    safari.application.browserWindows[info.activeWindowPosition].tabs[info.activeTabPosition+1].close();
  }
}

function contextMenuHandler(event) {
  var info = new safariInfo();
  var prefix = "🙅 タブを閉じる"
  if (info.activeTabPosition < safari.application.browserWindows[info.activeWindowPosition].tabs.length-1){
    event.contextMenu.appendContextMenuItem(
        "closeRightTabs", prefix + " 👉を全て", "closeRightTabs");
  }

  if(event.contextMenu.contextMenuItems.length > 0){
    event.contextMenu.appendContextMenuItem(
        "closeDuplicateDomain", prefix + " 同ドメイン", "closeDuplicateDomain");
  }
}

function safariInfo () {
  this.activeWindowPosition = 0;
  this.activeTabPosition = 0;
  this.activeWindows_totalTab = 0;
  this.totalTab=0;

  for (var i = 0; i < safari.application.browserWindows.length; i++){
    var theWindow = safari.application.browserWindows[i];
    if (theWindow === safari.application.activeBrowserWindow){
      this.activeWindowPosition = i;
    }
    var totalTabsInTheWindow = theWindow.tabs.length;
    this.totalTab = this.totalTab + totalTabsInTheWindow;
    for (var j = 0; j < totalTabsInTheWindow; j++){
      if (theWindow.tabs[j] === safari.application.activeBrowserWindow.activeTab){
        this.activeWindows_totalTab = totalTabsInTheWindow;
        this.activeTabPosition = j;
      }
    }
  }
}
