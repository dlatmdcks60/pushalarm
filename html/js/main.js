if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("my-service-worker.js");
}

window.onload = () => {
    const btn = document.querySelector("button");
    btn.addEventListener("click", () => {
        navigator.serviceWorker.ready.then((registration) => {
            registration.pushManager.getSubscription().then((subscription) => {
                if (subscription) {

                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            const resData = JSON.parse(xhr.responseText);
                            if (!resData) {
                                alert('유저 등록에 오류가 발생하였습니다.');
                            }
                        }
                    }
                    xhr.open('POST', `${location.protocol}//${location.hostname}/get`);
                    xhr.setRequestHeader("Content-type", "application/json");
                    xhr.send(JSON.stringify({
                        data: subscription,
                    }));
                } else {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: "BGznPZnFMMCkT5dCxBBT1_OTELe-Kn0h7IQ8K1iKgzEZwbfYO2BFfF6GvETmsCjGAq_WxOHkw-LNIOplg7POo2U"
                    }).then((subscription) => {});
                }
            });
        });
    });

    navigator.serviceWorker.addEventListener('notificationclick', function (event) {
        event.notification.close();
    });
}

let pageNum = 0;
const xhr = new XMLHttpRequest();
xhr.onload = function () {
    if (xhr.status == 200) {
        const resData = JSON.parse(xhr.responseText);
        let HTML = "";
        for (let i = 0; i < resData.data.length; i++) {
            HTML +=
                `<li id="${resData.data[i].msgId}"><span class="title">${resData.data[i].msgTitle}</span><span class="msg">${resData.data[i].msgContent}</span><div class="section_1"><span class="serverType">${resData.data[i].serverType}</span><span class="section_l">|</span><span class="serverIp">${resData.data[i].serverIp}</span><span class="section_l">|</span><span class="success ${resData.data[i].success.data[0] === 1 ? " on" : " off"}">${resData.data[i].success.data[0] === 1 ? "ok" : "fail"}</span></div><div class="section_2"><span class="datetime">${resData.data[i].datetime}</span></div></li>`;
        }
        if (resData.data.length === 0) {
            HTML += `<span class="noneData">데이터 없음</span>`;
        }
        document.querySelector(`.content ul`).insertAdjacentHTML("afterbegin", HTML);
    }
}
xhr.open('POST', `${location.protocol}//${location.hostname}:8031/getData`);
xhr.setRequestHeader("Content-type", "application/json");
xhr.send(JSON.stringify({
    page: pageNum,
}));

const btn_2 = document.querySelector(".content .btn");
btn_2.addEventListener("click", () => {
    pageNum++;
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200) {
            const resData = JSON.parse(xhr.responseText);
            let HTML = "";
            for (let i = 0; i < resData.data.length; i++) {
                HTML +=
                    `<li id="${resData.data[i].msgId}"><span class="title">${resData.data[i].msgTitle}</span><span class="msg">${resData.data[i].msgContent}</span><div class="section_1"><span class="serverType">${resData.data[i].serverType}</span><span class="section_l">|</span><span class="serverIp">${resData.data[i].serverIp}</span><span class="section_l">|</span><span class="success ${resData.data[i].success.data[0] === 1 ? " on" : " off"}">${resData.data[i].success.data[0] === 1 ? "ok" : "fail"}</span></div><div class="section_2"><span class="datetime">${resData.data[i].datetime}</span></div></li>`;
            }
            document.querySelector(`.content ul`).insertAdjacentHTML("beforeend", HTML);
        }
    }
    xhr.open('POST', `${location.protocol}//${location.hostname}:8031/getData`);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({
        page: pageNum,
    }));
});