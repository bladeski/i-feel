// chrome.runtime.onInstalled.addListener(() => {
//   chrome.alarms.onAlarm.addListener(() => {
//     chrome.notifications.create({
//       type: 'basic',
//       iconUrl: 'assets/icon_128.png',
//       title: 'How are you feeling?',
//       message: "Stop and think about it!",
//       priority: 0
//     });
//   });

//   chrome.notifications.onClicked.addListener(() => {
//     chrome.tabs.create({
//         url: './index.html'
//     }); 
//   });
  
//   chrome.alarms.create('I Feel', {
//     delayInMinutes: 1,
//     periodInMinutes: 10
//   });
// });

chrome.alarms.onAlarm.addListener(() => {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'assets/icon_128.png',
    title: 'How are you feeling?',
    message: "Stop and think about it!",
    priority: 0
  });
});

chrome.notifications.onClicked.addListener(() => {
  chrome.tabs.create({
    url: './index.html'
  }); 
});

chrome.alarms.create('I Feel', {
  delayInMinutes: 60,
  periodInMinutes: 60
});