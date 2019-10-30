const url_pattern = /(.*?)(h?ttps?:\/\/[0-9A-Za-z-.,_~!#$%&'()*+,/:;=?@[\]]+)(.*)/;

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
    `http://dec.2chan.net/up/src/`,
    `http://dec.2chan.net/up2/src/`,
    `http://www.siokarabin.com/futabafiles/big/src/auth.redirect.php?`,
    `http://www.nijibox6.com/futabafiles/mid/src/`,
    `http://www.nijibox5.com/futabafiles/tubu/src/`,
    `http://www.nijibox6.com/futabafiles/001/src/`,
    `http://www.nijibox5.com/futabafiles/kobin/src/`,
    `http://www.nijibox2.com/futabafiles/003/src/`,
];

let g_replace_all_page = true;
let g_use_blank = true;
let g_max_response = 2000;
let g_preview = true;
let g_hide_preview = false;
let g_volume = 0.5;
let max_width = 500;
let max_height = 500;
let g_youtube_preview = true;
let youtube_width = 0;
let sio_quote_link = false;
let use_preview_link = false;
let is_tsumanne = location.hostname == "tsumanne.net";
let is_ftbucket = location.hostname.endsWith("ftbucket.info");

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
    let hostname = "www";
    let watch = "";

    let long_url = url.match(/h?ttps?:\/\/([-0-9A-Za-z]+)\.youtube.com\/watch\?.*v=([0-9A-Za-z_-]+).*/);

    if (long_url) {
        if (long_url[1] != "m") {
            hostname = long_url[1];
        }
        watch = long_url[2];
    }

    let short_url = url.match(/h?ttps?:\/\/youtu\.be\/([0-9A-Za-z_-]+).*/);
    if (short_url) {
        watch = short_url[1];
    }

    if (watch) {
        return `https://${hostname}.YouTube.com/embed/${watch}?enablejsapi=1`;
    } else {
        return null;
    }
}

function createPreviewSwitch(elem, hide) {
    let switch_button = document.createElement("a");
    switch_button.className = "KOSHIAN_PreviewSwitch";
    switch_button.href = "javascript:void(0)";
    switch_button.text = hide ? "[見る]" : "[隠す]";
    switch_button.style.fontSize = "small";
    switch_button.appendChild(elem);
    switch_button.onclick = (e) => {    // eslint-disable-line no-unused-vars
        if (elem.style.display == "none") {
            elem.style.display = "block";
            switch_button.text = "[隠す]";
            if (elem.className == "KOSHIAN_PreviewContainer" && !elem.style.width) {
                let img = elem.getElementsByTagName("img")[0];
                if (img && img.complete) {
                    let rect = img.getBoundingClientRect();
                    if (rect.width && rect.height) {
                        elem.style.width = `${rect.width}px`;
                        elem.style.height = `${rect.height}px`;
                    }
                }
            }
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
        let has_link = false;
        if (parent.nodeName == "A" && parent.textContent == url_matches[2]) {
            // 既にリンク化されているときは置き換える（リダイレクト回避）
            parent = parent.parentNode;
            node = node.parentNode;
            has_link = true;
        }
        let elem1 = document.createTextNode(url_matches[1]);
        let elem2 = document.createElement("a");
        let elem3 = document.createTextNode(url_matches[3]);
        elem2.href = url_matches[2].indexOf("h") === 0 ? url_matches[2] : "h" + url_matches[2];
        elem2.text = url_matches[2];
        if (g_use_blank) {
            elem2.target = "_blank";
        }
        parent.insertBefore(elem1, node);
        parent.insertBefore(elem2, node);
        parent.insertBefore(elem3, node);

        if (g_youtube_preview) {
            let youtube_url = getYoutubeUrl(url_matches[2]);
            if (youtube_url) {
                // 「プレビューをデフォルトで閉じる」が有効 or elem1の直前のnodeの先頭文字が">"（新しいふたばの仕様）or nodeの先頭文字が">"（古いふたばの仕様）ならプレビューを閉じる
                let initial_hide = (g_hide_preview) ? (true) : (has_link ? (elem1.previousSibling ? (elem1.previousSibling.nodeValue ? elem1.previousSibling.nodeValue[0] == ">" : false) : false) : node.nodeValue[0] == ">");
                let iframe = document.createElement("iframe");
                let preview_switch = createPreviewSwitch(iframe, initial_hide);
                iframe.src = youtube_url;
                iframe.frameBorder = "0";
                iframe.allowFullscreen = true;
                iframe.style.maxWidth = `${max_width}px`;
                iframe.style.maxHeight = `${max_height}px`;
                iframe.style.display = initial_hide ? "none" : "block";
                if (youtube_width > 0) {
                    let youtube_height = Math.round(youtube_width * 9 / 16);
                    iframe.style.maxWidth = `${youtube_width}px`;
                    iframe.style.width = `${youtube_width}px`;
                    iframe.style.maxHeight = `${youtube_height}px`;
                    iframe.style.height = `${youtube_height}px`;
                }
                parent.insertBefore(preview_switch, elem3);
                if (is_ftbucket && url_matches[3] == "	[") {
                    // FTBucketは[link]の前にプレビューを挿入する
                    parent.insertBefore(iframe, elem3);
                } else {
                    parent.insertBefore(iframe, node);
                }
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
            let font = parent.closest("font");
            if (font && font.color == "#789922" && !sio_quote_link) {
                break;
            }
            let elem1 = document.createTextNode(sio_matches[1]);
            let elem2 = document.createElement("a");
            let elem3 = document.createTextNode(sio_matches[3]);
            let href = `${sio_url_list[i]}${sio_matches[2]}`;
            if ((is_tsumanne || is_ftbucket) && parent.href) {
                // 「」ッチー・FTBucketに塩のファイル有り
                href = parent.href;
                elem2.href = href;
                parent.removeAttribute("href");
            } else if (/^sq/.test(sio_matches[2])) {
                //塩中瓶のDLKey付対策でリンクの拡張子を削除
                elem2.href = `${sio_url_list[i]}${sio_matches[2].split(/\./)[0]}`;
            } else {
                elem2.href = href;
            }
            elem2.text = sio_matches[2];
            if (g_use_blank) {
                elem2.target = "_blank";
            }
            parent.insertBefore(elem1, node);
            parent.insertBefore(elem2, node);
            parent.insertBefore(elem3, node);

            if (g_preview) {
                let preview = null;
                let anchor = null;
                let ext = sio_matches[2].split(/\./)[1].toLowerCase();
                switch (ext) {
                    case "jpg":
                    case "jpeg":
                    case "png":
                    case "gif":
                    case "bmp":
                    case "webp":
                        preview = document.createElement("img");
                        anchor = document.createElement("a");
                        anchor.className = "KOSHIAN_PreviewContainer";
                        anchor.href = href;
                        if (g_use_blank) {
                            anchor.target = "_blank";
                        }
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
                    // 「プレビューをデフォルトで閉じる」が有効 or nodeのの先頭文字が">" or parentの直前のnodeの先頭文字が">" ならプレビューを閉じる
                    let initial_hide = (g_hide_preview) ? (true) : (node.nodeValue[0] == ">" ? true : (parent.previousSibling ? (parent.previousSibling.nodeValue ? parent.previousSibling.nodeValue[0] == ">" : false) : false));
                    let preview_switch = createPreviewSwitch(anchor && use_preview_link ? anchor : preview, initial_hide);
                    preview.style.maxWidth = `${max_width}px`;
                    preview.style.maxHeight = `${max_height}px`;
                    parent.insertBefore(preview_switch, elem3);
                    if (anchor && use_preview_link) {
                        preview.style.display = "block";
                        anchor.style.display = initial_hide ? "none" : "block";
                        anchor.appendChild(preview);
                        preview.onload = () => {
                            if (anchor.style.display == "block") {
                                let rect = preview.getBoundingClientRect();
                                anchor.style.width = `${rect.width}px`;
                                anchor.style.height = `${rect.height}px`;
                            }
                        }
                        preview.src = href;
                        parent.insertBefore(anchor, node);
                        parent.removeChild(node);
                        return anchor;
                    } else {
                        preview.style.display = initial_hide ? "none" : "block";
                        preview.src = href;
                        parent.insertBefore(preview, node);
                        parent.removeChild(node);
                        return preview;
                    }
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
        for (let j = 0, targets = rtd_list[i].querySelectorAll("blockquote,blockquote>font,blockquote>a,blockquote>font>a"); j < targets.length; ++j) {
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
        for (let i = 0, targets = document.querySelectorAll(".thre>blockquote,.thre>blockquote>font,.thre>blockquote>a,.thre>blockquote>font>a"); i < targets.length; ++i) {
            for (let node = targets[i].firstChild; node; node = node.nextSibling) {
                if (node.nodeType == Node.TEXT_NODE) {
                    node = replaceText(node);
                }
            }
        }

        process();

        // KOSHIAN リロード監視
        document.addEventListener("KOSHIAN_reload", () => {
            process(last_process_index);
        });

        // ふたば リロード監視
        let contdisp = document.getElementById("contdisp");
        if (contdisp) {
            checkFutabaReload(contdisp);
        }

    } else if (g_replace_all_page) {
        for (let i = 0, targets = document.querySelectorAll("blockquote,blockquote>font,blockquote>a,blockquote>font>a"); i < targets.length; ++i) {
            for (let node = targets[i].firstChild; node; node = node.nextSibling) {
                if (node.nodeType == Node.TEXT_NODE) {
                    node = replaceText(node);
                }
            }
        }
        
        fixFormPosition();
    }

    function checkFutabaReload(target) {
        let status = "";
        let reloading = false;
        let config = { childList: true };
        let observer = new MutationObserver(function() {
            if (target.textContent == status) {
                return;
            }
            status = target.textContent;
            if (status == "・・・") {
                reloading = true;
            } else if (reloading && status.endsWith("頃消えます")) {
                process(last_process_index);
                reloading = false;
            } else {
                reloading = false;
            }
        });
        observer.observe(target, config);
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
    g_youtube_preview = safeGetValue(result.use_youtube_preview, true);
    youtube_width = safeGetValue(result.youtube_width, 0);
    sio_quote_link = safeGetValue(result.sio_quote_link, false);
    use_preview_link = safeGetValue(result.use_preview_link, false);

    main();
}

function onError(e) {   // eslint-disable-line no-unused-vars

}

browser.storage.local.get().then(onLoadSetting, onError);