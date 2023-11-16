// ==UserScript==
// @name         TwitchTracker watch clips without VPN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://twitchtracker.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitchtracker.com
// @grant        none
// ==/UserScript==

const CLIP_REGEX = /clip=([^&]+)/;
const TWITCH_CLIP_MEDIA_REGEX = /\/\/clips-media-assets2\.twitch\.tv\/(.+)/;
const TWIP_CLIP_URL = '//vod.twip.kr/clip/';
const EXTRACTOR_URL = '//vod-extractor.twip.kr/proxy/';
const EMBED_OPTIONS = '/embed?start=0&autoplay=false&muted=false';
const clipsDiv = document.getElementById('clips');

function updateLitebox(element, clipRegex) {
    const liteboxValue = element.getAttribute('data-litebox');
    if (liteboxValue && liteboxValue.match(clipRegex)) {
        element.setAttribute('data-litebox', `${TWIP_CLIP_URL}${RegExp.$1}${EMBED_OPTIONS}`);
    }
}

function updateThumbnail(thumbnail) {
    const srcValue = thumbnail.getAttribute('src');
    if (srcValue) {
        const match = srcValue.match(TWITCH_CLIP_MEDIA_REGEX);
        if (match) {
            thumbnail.setAttribute('src', `${EXTRACTOR_URL}${match[1]}`);
        }
    }
}

function updateIframe(iframe, clipRegex) {
    const src = iframe.getAttribute('src');
    if (src && src.match(clipRegex)) {
        iframe.setAttribute('src', `${TWIP_CLIP_URL}${RegExp.$1}${EMBED_OPTIONS}`);
    }
}

const clipRegex = new RegExp(CLIP_REGEX);

const updateElements = () => {
    const elements = clipsDiv.getElementsByTagName('div');
    for (const element of elements) {
        updateLitebox(element, clipRegex);
    }

    const clipThumbnails = document.getElementsByClassName('clip-thumbnail');
    for (const thumbnail of clipThumbnails) {
        updateThumbnail(thumbnail);
    }

    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
        updateIframe(iframe, clipRegex);
    }
};

setInterval(updateElements, 300);