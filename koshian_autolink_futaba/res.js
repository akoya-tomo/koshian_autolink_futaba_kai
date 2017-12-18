const url_pattern = /(.*)(https?:\/\/[0-9A-Za-z-.,_~!#$%&'()*+,/:;=?@[\]]+)(.*)/;

const sio_pattern_list = [
    /(.*)(f\d+\.[0-9A-Za-z]+)(.*)/,
    /(.*)(fu\d+\.[0-9A-Za-z]+)(.*)/,
    /(.*)(sz\d+\.[0-9A-Za-z]+)(.*)/,
    /(.*)(sq\d+\.[0-9A-Za-z]+)(.*)/,
    /(.*)(su\d+\.[0-9A-Za-z]+)(.*)/,
    /(.*)(sa\d+\.[0-9A-Za-z]+)(.*)/,
    /(.*)(ss\d+\.[0-9A-Za-z]+)(.*)/,
    /(.*)(sp\d+\.[0-9A-Za-z]+)(.*)/,
];

const sio_url_list = [
    `http://133.242.9.183/up/src/`,
    `http://133.242.9.183/up2/src/`,
    `http://www.siokarabin.com/futabafiles/big/src/`,
    `http://www.nijibox6.com/futabafiles/mid/src/`,
    `http://www.nijibox5.com/futabafiles/tubu/src/`,
    `http://www.nijibox6.com/futabafiles/001/src/`,
    `http://www.nijibox5.com/futabafiles/kobin/src/`,
    `http://www.nijibox2.com/futabafiles/003/src/`,
];

const UPLOADER_NUM = 8;
let g_replace_all_page = true;
let g_replace_url = true;
let g_replace_file = true;
let g_use_blank = true;
let g_max_response = 2000;
let g_preview = true;
let g_hide_preview = false;
let g_volume = 0.5;
let max_width = 500;
let max_height = 500;
let sio_quate_link = false;

function fixFormPosition() {
    let form = document.getElementById("ftbl");
    let uform = document.getElementById("ufm");

    if (!form || !uform) {
        return;
    }

    if (form.style.position != "absolute") {
        return;
    }

    let rect = uform.getBoundingClientRect();
    let top = rect.y + document.documentElement.scrollTop;
    form.style.top = `${top}px`;
}

function getYoutubeUrl(url) {
    let watch = "";

    let long_url = url.match(/https?:\/\/www\.youtube.com\/watch\?.*v=([0-9A-Za-z_-]+).*/);

    if (long_url) {
        watch = long_url[1];
    }

    let short_url = url.match(/https?:\/\/youtu\.be\/([0-9A-Za-z_-]+).*/);
    if (short_url) {
        watch = short_url[1];
    }

    if (watch) {
        return `https://www.YouTube.com/embed/${watch}?enablejsapi=1`;
    } else {
        return null;
    }
}

function createPreviewSwitch(elem, hide) {
    let switch_button = document.createElement("a");
    switch_button.className = "KOSHIAN_PreviewSwitch";
    switch_button.href = "javascript:void(0)";
    switch_button.text = hide ? "[見る]" : "[隠す]"
    switch_button.style.fontSize = "small";
    switch_button.appendChild(elem);
    switch_button.onclick = (e) => {
        if (elem.style.display == "none") {
            elem.style.display = "block";
            switch_button.text = "[隠す]";
        } else {
            if (elem.tagName == "AUDIO" || elem.tagName == "VIDEO") {
                elem.pause();
            } else if (elem.tagName == "IFRAME") {
                elem.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }

            elem.style.display = "none";
            switch_button.text = "[見る]";
        }

        fixFormPosition();
    };

    return switch_button;
}

function replaceText(node) {
    let parent = node.parentNode;

    let url_matches = node.nodeValue.match(url_pattern);
    if (url_matches) {
        let elem1 = document.createTextNode(url_matches[1]);
        let elem2 = document.createElement("a");
        let elem3 = document.createTextNode(url_matches[3]);
        elem2.href = url_matches[2];
        elem2.text = url_matches[2];
        if (g_use_blank) {
            elem2.target = "_blank";
        }
        parent.insertBefore(elem1, node);
        parent.insertBefore(elem2, node);
        parent.insertBefore(elem3, node);

        if (g_preview) {
            let youtube_url = getYoutubeUrl(url_matches[2]);
            if (youtube_url) {
                let initial_hide = (g_hide_preview) ? (true) : (node.nodeValue[0] == ">" ? true : false);
                let iframe = document.createElement("iframe");
                let preview_switch = createPreviewSwitch(iframe, initial_hide);
                iframe.src = youtube_url;
                iframe.frameBorder = "0";
                iframe.allowFullscreen = true;
                iframe.style.maxWidth = `${max_width}px`;
                iframe.style.maxHeight = `${max_height}px`;
                iframe.style.display = initial_hide ? "none" : "block";
                parent.insertBefore(preview_switch, elem3);
                parent.insertBefore(iframe, node);
                parent.removeChild(node);
                return iframe;
            }
        }

        parent.removeChild(node);
        return elem3;
    }

    for (let i = 0; i < sio_pattern_list.length; ++i) {
        let sio_matches = node.nodeValue.match(sio_pattern_list[i]);
        if (sio_matches) {
            let hasQuate = false;
            let quate_pattern = /[>＞][ 　]*$/;
            if (sio_matches[1]) {
                hasQuate = quate_pattern.test(sio_matches[1]);
//              console.log("res.js : hasQuate = " + hasQuate);
                if (hasQuate && !sio_quate_link) break;
            }
            let elem1 = document.createTextNode(sio_matches[1]);
            let elem2 = document.createElement("a");
            let elem3 = document.createTextNode(sio_matches[3]);
            elem2.href = `${sio_url_list[i]}${sio_matches[2]}`;
            elem2.text = sio_matches[2];
            if (g_use_blank) {
                elem2.target = "_blank";
            }
            parent.insertBefore(elem1, node);
            parent.insertBefore(elem2, node);
            parent.insertBefore(elem3, node);

            if (g_preview) {
                let preview = null;
                let ext = sio_matches[2].split(/\./)[1].toLowerCase();
                switch (ext) {
                    case "jpg":
                    case "jpeg":
                    case "png":
                    case "gif":
                    case "bmp":
                        preview = document.createElement("img");
                        break;
                    case "wav":
                    case "mp3":
                        preview = document.createElement("audio");
                        preview.controls = true;
                        preview.volume = g_volume;
                        break;
                    case "mp4":
                    case "webm":
                        preview = document.createElement("video");
                        preview.controls = true;
                        preview.volume = g_volume;
                        break;
                }

                if (preview) {
                    let initial_hide = (g_hide_preview) ? (true) : (node.nodeValue[0] == ">" ? true : false);
                    let preview_switch = createPreviewSwitch(preview, initial_hide);
                    preview.src = `${sio_url_list[i]}${sio_matches[2]}`;
                    preview.style.maxWidth = `${max_width}px`;
                    preview.style.maxHeight = `${max_height}px`;
                    preview.style.display = initial_hide ? "none" : "block";
                    parent.insertBefore(preview_switch, elem3);
                    parent.insertBefore(preview, node);
                    parent.removeChild(node);
                    return preview;
                }
            }

            parent.removeChild(node);
            return elem3;
        }
    }

    return node;
}

let last_process_index = 0;

function process(beg = 0) {
    let rtd_list = document.getElementsByClassName("rtd");
    let end = Math.min(rtd_list.length, g_max_response);

    for (let i = beg; i < end; ++i) {
        for (let j = 0, targets = rtd_list[i].querySelectorAll("blockquote,blockquote>font"); j < targets.length; ++j) {
            for (let node = targets[j].firstChild; node; node = node.nextSibling) {
                if (node.nodeType == Node.TEXT_NODE) {
                    node = replaceText(node);
                }
            }
        }
    }

    last_process_index = end;

    fixFormPosition();
}

function main() {
    if (/.+res\/[0-9]+.html?/.test(location.href)) {
        for (let i = 0, targets = document.querySelectorAll(".thre>blockquote,.thre>blockquote>font"); i < targets.length; ++i) {
            for (let node = targets[i].firstChild; node; node = node.nextSibling) {
                if (node.nodeType == Node.TEXT_NODE) {
                    node = replaceText(node);
                }
            }
        }

        process();

        document.addEventListener("KOSHIAN_reload", (e) => {
            process(last_process_index);
        });
    } else if (g_replace_all_page) {
        for (let i = 0, targets = document.querySelectorAll("blockquote,blockquote>font"); i < targets.length; ++i) {
            for (let node = targets[i].firstChild; node; node = node.nextSibling) {
                if (node.nodeType == Node.TEXT_NODE) {
                    node = replaceText(node);
                }
            }
        }
        
        fixFormPosition();
    }
}

function safeGetValue(value, default_value) {
    if (value === undefined) {
        return default_value;
    } else {
        return value;
    }
}

function onLoadSetting(result) {
    g_replace_all_page = safeGetValue(result.replace_all_page, true);
    g_use_blank = safeGetValue(result.use_blank, true);
    g_max_response = safeGetValue(result.max_response, 2000);
    g_preview = safeGetValue(result.use_preview, true);
    g_hide_preview = safeGetValue(result.close_preview, false);
    max_width = safeGetValue(result.max_width, 500);
    max_height = safeGetValue(result.max_height, 500);
    g_volume = safeGetValue(result.g_volume, 0.5);
    sio_quate_link = safeGetValue(result.sio_quate_link, false);

    main();
}

function onError(e) {

}

browser.storage.local.get().then(onLoadSetting, onError);