function safeGetValue(value, default_value) {
  if (value === undefined) {
    return default_value;
  } else {
    return value;
  }
}

function saveOptions(e) {
  e.preventDefault();

  browser.storage.local.set({
    replace_all_page: document.querySelector("#replace_all_page").checked,
    use_blank: document.querySelector("#use_blank").checked,
    max_response: document.querySelector("#max_response").value,
    use_preview: document.querySelector("#use_preview").checked,
    close_preview: document.querySelector("#close_preview").checked,
    max_width: document.querySelector("#max_width").value,
    max_height: document.querySelector("#max_height").value,
    volume: document.querySelector("#volume").value,
    sio_quate_link: document.querySelector("#sio_quate_link").checked,
  });
}

function setCurrentChoice(result) {
  document.querySelector("#replace_all_page").checked = safeGetValue(result.replace_all_page, true);
  document.querySelector("#use_blank").checked = safeGetValue(result.use_blank, true);
  document.querySelector("#max_response").value = safeGetValue(result.max_response, 2000);
  document.querySelector("#use_preview").checked = safeGetValue(result.use_preview, true);
  document.querySelector("#close_preview").checked = safeGetValue(result.close_preview, false);
  document.querySelector("#max_width").value = safeGetValue(result.max_width, 500);
  document.querySelector("#max_height").value = safeGetValue(result.max_height, 500);
  document.querySelector("#volume").value = safeGetValue(result.volume, 0.5);
  document.querySelector("#sio_quate_link").checked = safeGetValue(result.sio_quate_link, false);
}

function onError(error) {
  //  console.log(`Error: ${error}`);
}

function restoreOptions() {
  browser.storage.local.get().then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);