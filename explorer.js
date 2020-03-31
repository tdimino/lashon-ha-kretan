/*
# Copyright (c) 2019 Robert Hogan (robhogan at gmail.com) All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are
# met:
#
#    * Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#    * Redistributions in binary form must reproduce the above
# copyright notice, this list of conditions and the following disclaimer
# in the documentation and/or other materials provided with the
# distribution.
#    * Neither the name of Google Inc. nor the names of its
# contributors may be used to endorse or promote products derived from
# this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var result = document.getElementById("result");
result.addEventListener("animationend", function() { result.style.display = "none"; result.style.animationDelay = "0s";});

console.log("If you have any feedback or issues contact me @mwenge on Twitter or open a ticket at https://github.com/mwenge/LinearAExplorer/issues")
document.onkeydown = checkKey;
function checkKey(e) {
  var search = document.getElementById("search");
  if (search == document.activeElement) {
    if (e.key == "Escape") {
      toggleColor(document.getElementById("search-command"));
      showSearch();
    }
    return;
  }
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  if (e.ctrlKey) {
    return;
  }
  switch(e.key) {
    case "?": // show help
      if (help_menu.style.display == "block") {
        help_menu.style.display = "none";
      } else {
        help_menu.style.display = "block";
      }
      toggleColor(document.getElementById("help-command"));
      break;
    case "/": // '/' - focus search bar
      toggleColor(document.getElementById("search-command"));
      showSearch();
      break;
    case "t": // 't' - toggle translation
      toggleTranslation(document);
      toggleColor(document.getElementById("translate-command"));
      break;
    case "w": // 'w' - highlight words according to frequency
      updateDisplayOfWordFrequency(document, true);
      toggleColor(document.getElementById("word-command"));
      break;
    case "i": // 'i' - copy image of inscription to clipboard
      var current = getInscriptionHoveredOver();
      result.style.animationDelay = "90s";
      result.style.display = "inline-block";
      result.textContent = "Copying Image to clipboard";
      if (current) {
        captureImage(current);
      }
      break;
    case "y": // 'y' - show commentary for inscription currently hovered over
      var current = getInscriptionHoveredOver();
      if (current) {
        showCommentaryForInscription(current.id);
      }
      break;
    case "Escape":
      zoomItem(current);
      break;
    case "z": // 'z' - zoom
      var current = getInscriptionHoveredOver();
      zoomItem(current);
      break;
    case "1": // '1 to 9' - save state to 1 to 9
    case "2": 
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      result.style.display = "none";
      result.style.display = "inline-block";
      saveSearchTerms(e.keyCode);
      result.textContent = "Saved search terms";
      break;
    case "!": // '1 to 9' - save state to 1 to 9
    case "\"": 
    case "£":
    case "$":
    case "%":
    case "^":
    case "&":
    case "*":
    case "(":
      result.style.display = "none";
      result.style.display = "inline-block";
      loadSearchTerms(e.keyCode);
      result.textContent = "Loaded search terms";
      break;
    case "c": // 'c' - clear search terms
      var container = document.getElementById("search-terms");
      container.innerHTML = "";
      applySearchTerms();
      break;
    default:
      return;
  }
  // Cancel the default action to avoid it being handled twice
  e.preventDefault();
}

function showSearch() {
  var search = document.getElementById('search');
  var isVisible = search.style.visibility == "visible";
  if (isVisible) {
    search.style.visibility = 'hidden';
    return;
  }

  var container = document.getElementById("filter-details-container");
  container.innerHTML = "";

  search.style.visibility = "visible";
  search.focus();
  search.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        updateSearch(event);
      }
  }); 
}

function sendKey(event, keyValue) {
  var e = new KeyboardEvent("keydown", {
        bubbles : true,
        key : keyValue,
  });
  document.dispatchEvent(e);
}

function toggleColor(element) {
  var color = element.style.backgroundColor;
  element.style.backgroundColor = color == "purple" ? "black" : "purple";
}

function closeZoomedWindow(e) {
  zoomItem(null);
  e.stopPropagation();
}

var commentaries = {};
commentaries["HT118"] = "https://docs.google.com/document/d/e/2PACX-1vQN17sMMY9JAehLGo8kfNHNq5qQMZFIhBrZhjuPRZemRXBcbAyxk9uIeLaEHuWFeZQ7-MgPM0iYgB5Y/pub?embedded=true";
commentaries["HT123b"] = "https://docs.google.com/document/d/e/2PACX-1vSgQ4OWVOOuhdcv54lX942IcbCXEt1BazXLAoQiByVIQKHHymG1K1WEUFm9OLDyQuKmMGxUJ9w6IttC/pub?embedded=true";
commentaries["HT123a"] = "https://docs.google.com/document/d/e/2PACX-1vSgQ4OWVOOuhdcv54lX942IcbCXEt1BazXLAoQiByVIQKHHymG1K1WEUFm9OLDyQuKmMGxUJ9w6IttC/pub?embedded=true";
commentaries["HT95a"] = "https://docs.google.com/document/d/e/2PACX-1vTBHvxagDkbtGQrRGB7S2D79hzuAuBISJLLkmoTFChHB0VD0pgsucIg0Bysq9N9TfAn6OzmrycYooHK/pub?embedded=true";
commentaries["HT95b"] = "https://docs.google.com/document/d/e/2PACX-1vTBHvxagDkbtGQrRGB7S2D79hzuAuBISJLLkmoTFChHB0VD0pgsucIg0Bysq9N9TfAn6OzmrycYooHK/pub?embedded=true";

function showCommentaryForInscription(inscription) {
  if (!commentaries[inscription]) {
    showYoungerCommentaryForInscription(inscription);
    return;
  }

  var inscriptionElement = document.getElementById(inscription);
  var commentBox = document.getElementById("mycomment-box-" + inscription);
  if (commentBox) {
    document.body.offsetTop;
    commentBox.style.top = inscriptionElement.offsetHeight + "px";
    if (commentBox.style.display == "block") {
      commentBox.style.display = "none";
      return;
    }
    commentBox.style.display = "block";
    return;
  }

  var commentBox = document.createElement("iframe")
  commentBox.className = 'comment-box';
  commentBox.id = 'mycomment-box-' + inscription;
  commentBox.style.top = inscriptionElement.offsetHeight + "px";
  commentBox.src = commentaries[inscription];
  commentBox.height = "400px";
  commentBox.addEventListener("click", makeHideElements([commentBox]));
  inscriptionElement.appendChild(commentBox);
  commentBox.style.display = "block";
}

function showYoungerCommentaryForInscription(inscription) {
  var inscriptionElement = document.getElementById(inscription);

  var commentBox = document.getElementById("comment-box-" + inscription);
  if (commentBox) {
    document.body.offsetTop;
    commentBox.style.top = inscriptionElement.offsetHeight + "px";
    if (commentBox.style.display == "block") {
      commentBox.style.display = "none";
      return;
    }
    commentBox.style.display = "block";
    return;
  }

  var commentBox = document.createElement("div")
  commentBox.className = 'comment-box';
  commentBox.id = 'comment-box-' + inscription;
  commentBox.style.top = inscriptionElement.offsetHeight + "px";
  commentBox.addEventListener("click", makeHideElements([commentBox]));
  inscriptionElement.appendChild(commentBox);

  inscription = inscription.replace(/[a-z]$/g, "");
  var commentaries = ["commentary/" + inscription + ".html"]
  commentBox.innerHTML = "";
  var failures = 0;
  commentaries.forEach( commentary => {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function() {
        if (xhttp.status == 404) {
          failures++;
        } else {
          commentBox.innerHTML += xhttp.responseText;
          commentBox.style.display = "block";
        }
        if (failures >= commentaries.length) {
          commentBox.style.display = "none";
        }
    };
    xhttp.open("GET", commentary, true);
    xhttp.send();
  });
}

function getInscriptionHoveredOver() {
  var n = document.querySelector(":hover");
  var nn;
  while (n) {
    nn = n;
    if (nn.className == "item-container") {
      return nn;
    }
    n = nn.querySelector(":hover");
  }
  return null;
}

var cycleColor = (function () {
  var frequency = .3;
  var i = 0;
  return function () {
    i++;
    red   = Math.round(Math.sin(frequency*i + 0) * 55 + 200);
    green = Math.round(Math.sin(frequency*i + 2) * 55 + 200);
    blue  = Math.round(Math.sin(frequency*i + 4) * 55 + 200);
    return "rgba(" + red + ", " + green + ", " + blue + ", 0.5)";
  }
})();

function hasMatchForHighlight(fullWordMatch, searchTerm, text) {
  if (fullWordMatch) {
    return (searchTerm == text);
  }
  searchTerm = searchTerm.replace(/\\/g, "");
  var re = new RegExp(searchTerm);
  return (re.test(text));
}

function stripErased(word) {
  return word.replace(/\u{1076b}/gu, "");
}

function highlightMatchesInElement(element, searchTerm, highlightColor) {
  if (searchTerm == "") {
    return;
  }
  var fullWordMatch = searchTerm.includes("\"");
  searchTerm = searchTerm.replace(/\"/g, "");
  for (var j = 0; j < element.children.length; j++) {
    var span = element.children[j];
    if (hasMatchForHighlight(fullWordMatch, searchTerm, stripErased(span.textContent.trim()))) {
      var inscription = element.getAttribute("inscription");
      if (!inscription) {
        continue;
      }
      var translation = document.getElementById(inscription + "-translation-" + j);
      translation.style.backgroundColor = highlightColor;
      var transliteration = document.getElementById(inscription + "-transliteration-" + j);
      transliteration.style.backgroundColor = highlightColor;
      var transcription = document.getElementById(inscription + "-transcription-" + j);
      transcription.style.backgroundColor = highlightColor;

      highlightedSearchElements.push(translation);
      highlightedSearchElements.push(transliteration);
      highlightedSearchElements.push(transcription);

      var highlightedElements = setHighlightLettersInTranscription(inscription, j, highlightColor);
      highlightedSearchElements = highlightedSearchElements.concat(highlightedElements);
    }
  }
}

function clearHighlights() {
  for (var index in highlightedSearchElements) {
    highlightedSearchElements[index].style.backgroundColor = "";
  }
  highlightedSearchElements = [];
}

var highlightedSearchElements = [];
function updateSearch(event) {
  var searchTerm = event.target.value;
  if (!searchTerm.length) {
    return;
  }
  updateSearchTerms(event, searchTerm);
}

function makeMoveLens(lens, img, result, imageToAdd, name, cx, cy) {
  return function(e) {
    result.style.display = "flex";
    lens.style.display = "block";
    result.style.width = (result.parentElement.offsetWidth * 2) + "px";
    result.style.height = result.parentElement.offsetHeight + "px";
    lens.style.width = (result.parentElement.offsetWidth / 2) + "px";
    lens.style.height = (result.parentElement.offsetHeight / 5) + "px";

    var availableHeight = result.parentElement.getBoundingClientRect().top;
    if (availableHeight < (result.parentElement.offsetHeight / 2)) {
      result.style.top = result.parentElement.offsetHeight + "px";
    } else {
      result.style.top = "-" + result.parentElement.offsetHeight + "px";
    }

    /* Calculate the ratio between itemZoom DIV and lens: */
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    /* Calculate the position of the lens: */
    x = pos.x - (lens.offsetWidth / 2);
    y = pos.y - (lens.offsetHeight / 2);
    /* Prevent the lens from being positioned outside the image: */
    if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
    if (x < 0) {x = 0;}
    if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
    if (y < 0) {y = 0;}
    /* Set the position of the lens: */
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /* Display what the lens "sees": */
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";

    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /* Get the x and y positions of the image: */
      a = img.getBoundingClientRect();
      /* Calculate the cursor's x and y coordinates, relative to the image: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
  };
}

function makeGiveUpOnImages(elements) {
  return function(e) {
    for (var index in elements) {
      elements[index].remove();
    }
    e.stopPropagation();
  };
}

function makeHideElements(elements) {
  return function(e) {
    for (var index in elements) {
      elements[index].style.display = "none";
    }
    e.stopPropagation();
  };
}

function makeZoomItem(item) {
  return function(e) {
    zoomItem(item);
  };
}

function addImageToItem(item, imageToAdd, name, imageType) {
  var itemShell = document.createElement("div");
  itemShell.className = 'item-shell';
  item.appendChild(itemShell);

  var itemZoom = document.createElement("div");
  itemZoom.className = 'item-zoom';
  itemShell.appendChild(itemZoom);

  var label = document.createElement("div");
  label.className = 'label';
  label.textContent = name;
  itemZoom.appendChild(label);

  var inscriptionImage = document.createElement("div");
  inscriptionImage.className = 'item';
  var imageWrapper = document.createElement("div");
  imageWrapper.setAttribute("class", "img-wrapper");
  imageWrapper.id = "image-wrapper-" + imageType + "-" + name;
  inscriptionImage.appendChild(imageWrapper);

  var lens = document.createElement("div");
  lens.setAttribute("class", "img-zoom-lens");
  imageWrapper.appendChild(lens);

  var img = document.createElement("img");
  img.src = encodeURIComponent(imageToAdd);
  img.id = "image-" + imageType + "-" + name;
  img.height = "200";
  img.addEventListener("error", makeGiveUpOnImages([inscriptionImage, itemZoom]));
  img.addEventListener("load", addWordsToImage(imageToAdd, name, imageType, img, imageWrapper, lens, itemZoom, item));
  imageWrapper.appendChild(img);
  itemShell.appendChild(inscriptionImage);

  itemZoom.style.backgroundImage = "url('" + img.src + "')";
  lens.addEventListener("mousemove", makeMoveLens(lens, img, itemZoom, imageToAdd, name));
  img.addEventListener("mousemove", makeMoveLens(lens, img, itemZoom, imageToAdd, name));
  itemShell.addEventListener("mouseout", makeHideElements([lens, itemZoom]));
}

function addWordsToImage(imageToAdd, name, imageType, img, imageWrapper, lens, itemZoom, item) {
  return function(e) {
    if (!coordinates.has(imageToAdd)) {
      return;
    }
    var imageCoords = coordinates.get(imageToAdd);
    var currentWord = 0;
    var prevWord = -1;
    var wordContainer = null;
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      currentWord = wordIndexForLetterIndex(name, i, currentWord);

      if (currentWord != prevWord) {
        wordContainer = document.createElement("div");
        var wordID = "image-" + imageType + "-" + name + "-word-highlight-" + currentWord;
        wordContainer.className = "word-highlight";
        wordContainer.style.top = ((area.y / img.naturalHeight) * 100) + '%';
        wordContainer.style.left = ((area.x / img.naturalWidth) * 100) + '%';
        wordContainer.id = wordID;
        wordContainer.setAttribute("onmouseout", "clearHighlight(event, '" + name + "', '" + currentWord + "')");
        imageWrapper.appendChild(wordContainer);
      }
      prevWord = currentWord;

      var highlight = document.createElement("div");
      highlight.className = "letter-highlight";
      highlight.id = "image-" + imageType + "-" + name + "-letter-highlight-" + i;
      highlight.style.width = ((area.width / img.naturalWidth) * 100) + '%';
      highlight.style.height = ((area.height / img.naturalHeight) * 100) + '%';
      highlight.style.top = ((area.y / img.naturalHeight) * 100) + '%';
      highlight.style.left = ((area.x / img.naturalWidth) * 100) + '%';
      highlight.addEventListener("mousemove", makeMoveLens(lens, img, itemZoom, imageToAdd, name));
      highlight.setAttribute("onmouseover", "highlightWords('" + name + "', '" + currentWord + "')");
      highlight.setAttribute("onmouseout", "clearHighlight(event, '" + name + "', '" + currentWord + "')");
      wordContainer.appendChild(highlight);
    }

    // Highlight any search terms in the image
    var searchTerms = document.getElementById("search-terms");
    for (index in searchTerms.children) {
      var searchElement = searchTerms.children.item(index);
      if (!searchElement) {
        continue;
      }
      var term = searchElement.textContent;
      for (var j = 0; j < item.children.length; j++) {
        var element = item.children[j];
        var highlightColor = searchElement.getAttribute("highlightColor");
        highlightMatchesInElement(element, term, highlightColor);
      }
    }

    var inscription = inscriptions.get(name);
    for (var tag of activeWordTags) {
      var highlightColor = tagColors[tag];
      for (var index in inscription.wordTags) {
        if (!inscription.wordTags[index].includes(tag)) {
          continue;
        }

        var highlightedElements = setHighlightLettersInTranscription(name, index, highlightColor);
        highlightedSearchElements = highlightedSearchElements.concat(highlightedElements);
      }
    }
  };
}

function wordIndexForLetterIndex(name, index, from) {
  var splitter = new GraphemeSplitter();
  var words = inscriptions.get(name).words;
  var letters = 0;
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (word == '\u{1076b}' || word == '\n' || word == '𐄁') {
      continue;
    }
    letters += splitter.countGraphemes(stripErased(word));
    if (letters > index) {
      return i;
    }
  }
  return 0;
}


var captureImage = function(root) {
  html2canvas(root, {
    backgroundColor: 'white'
  })
    .then(function(canvas) {
      canvas.toBlob(function(blob) { 
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]); 
            result.style.animationDelay = "0s";
            result.textContent = "Image copied to clipboard";
      });
    })
};

with ({zoomedElement : null}) var zoomItem = function(item) {
  var itemToZoom = item;
  if (zoomedElement) {
    itemToZoom = zoomedElement;
    zoomedElement = null;
  } else {
    zoomedElement = item;
  }
  if (!itemToZoom) {
    return;
  }
  
  Array.prototype.map.call(itemToZoom.getElementsByClassName("item-shell"), x => x.classList.toggle("zoomed-item"));
  Array.prototype.map.call(itemToZoom.getElementsByClassName("item"), x => x.classList.toggle("zoomed-item"));
  Array.prototype.map.call(itemToZoom.getElementsByClassName("close-window"), x => x.classList.toggle("zoomed-close-window"));
  itemToZoom.classList.toggle("zoomed-item-container");
}

with ({displayed : true}) var updateDisplayOfWordFrequency = function(root, update) {
    if (update) {
      displayed = !displayed;
    }
    Array.prototype.map.call(root.getElementsByTagName("span"), x => displayed ? x.classList.add("word-frequency-none") : x.classList.remove("word-frequency-none"));
}

function getClassNameForWord(word) {
  word = stripErased(word);
  var stem = "word-frequency-";
  if (wordsInCorpus.has(word)) {
    var wordCount = Math.min(10, wordsInCorpus.get(word));
    return stem + wordCount; 
  }
  return stem + "1"; 
}

function displayingTranslation(container) {
  var lastChild = container.lastChild;
  if (!lastChild || lastChild.nodeName != "DIV") {
    return false;
  }
  var displayingTranslation = lastChild.getElementsByClassName("translation-item")[0].style.display == "block";
  return displayingTranslation;
}

function loadInscription(inscription) {
  if (inscription.element) {
    return null;
  }

  var item = document.createElement("div");
  item.className = 'item-container';
  item.id = inscription.name;
  item.setAttribute("onclick", "showCommentaryForInscription('" + inscription.name + "')");
  item.addEventListener("dblclick", makeZoomItem(item));

  inscription.images.forEach( image => {
    addImageToItem(item, image, inscription.name, "photo")
  });
  inscription.tracingImages.forEach( image => {
    addImageToItem(item, image, inscription.name, "transcription")
  });


  var transcript = document.createElement("div");
  transcript.className = 'item text-item';
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < inscription.words.length; i++) {
    var word = inscription.words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word;
      span.className = getClassNameForWord(word);
      span.classList.add("word-frequency-none");

      var searchTerm = stripErased(word);
      span.id = inscription.name + "-transcription-" + i;
      span.setAttribute("onmouseover", "highlightWords('" + inscription.name + "', '" + i + "')");
      span.setAttribute("onmouseout", "clearHighlight(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onclick", "updateSearchTerms(event, '\"" + span.textContent + "\"')");
    }
    transcript.appendChild(span);
  }
  item.appendChild(transcript);

  var transliteration = populateText(inscription, "transliteration", inscription.transliteratedWords);
  item.appendChild(transliteration);

  var translation = populateText(inscription, "translation", inscription.translatedWords);
  translation.style.display = "none";
  item.appendChild(translation);

  var tagContainer = document.createElement("div");
  tagContainer.className = 'tag-container';
  item.appendChild(tagContainer);
  inscription.tagContainer = tagContainer;

  var label = document.createElement("div");
  label.className = "label";
  label.textContent = inscription.name;
  item.appendChild(label);

  var label = document.createElement("div");
  label.className = "close-window";
  label.id = inscription.name + "-close-window";
  label.onclick = closeZoomedWindow;
  item.appendChild(label);

  inscription.element = item;
  if (displayingTranslation(container)) {
    toggleTranslation(item);
  }
  container.appendChild(item);
  updateDisplayOfWordFrequency(item, false);

  return item;
}

function populateText(inscription, type, words) {
  transcript = document.createElement("div");
  transcript.className = 'item text-item ' + type + '-item';
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word + " ";
      span.className = getClassNameForWord(inscription.words[i]);
      span.classList.add("word-frequency-none");
      span.id = inscription.name + "-" + type + "-" + i;
      span.setAttribute("onmouseover", "highlightWords('" + inscription.name + "', '" + i + "')");
      span.setAttribute("onmouseout", "clearHighlight(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onclick", "updateSearchTerms(event, '\"" + inscription.words[i] + "\"')");
    }
    transcript.appendChild(span);
  }
  transcript.appendChild(document.createElement("br"));
  transcript.appendChild(document.createElement("br"));
  return transcript;
}

function toggleTranslation(container) {
  Array.prototype.map.call(container.getElementsByClassName("translation-item"), x => x.style.display == "none" ? x.style.display = "block" : x.style.display = "none");
  Array.prototype.map.call(container.getElementsByClassName("transliteration-item"), x => x.style.display == "none" ? x.style.display = "block" : x.style.display = "none");
}

function addWordTip(word, inscription) {
  word = stripErased(word.trim());
  var wordCount = 0;
  if (wordsInCorpus.has(word)) {
    wordCount = wordsInCorpus.get(word) - 1;
  }
  var tip = document.getElementById(inscription + "-tip");
  var inscriptionElement = document.getElementById(inscription);
  if (!tip) {
    var tip = document.createElement("div")
    tip.className = 'word-tip';
    tip.id = inscription + "-tip";
    inscriptionElement.appendChild(tip);
  }
  tip.style.display = "block";
  tip.innerHTML = "";

  var wordCommentElement = document.createElement("div");
  wordCommentElement.className = "lexicon";
  wordCommentElement.textContent = lexicon.get(word);

  if (lexicon.has(word)) {
    var wordCommentElement = document.createElement("div");
    wordCommentElement.className = "lexicon";
    wordCommentElement.textContent = lexicon.get(word);
    tip.appendChild(wordCommentElement);
  }
  if (ligatures.has(word)) {
    var wordCommentElement = document.createElement("div");
    wordCommentElement.className = "lexicon";
    wordCommentElement.textContent = 'Ligature: ' + word + ' = ' + ligatures.get(word).join(' + ');
    tip.appendChild(wordCommentElement);
  }

  var tipText = "";
  switch(wordCount) {
    case 0:
      tipText = "There is no other instance of this word."
      break;
    case 1:
      tipText = wordCount + " other instance of this word. Click to add to filter."
      break;
    default:
      tipText = wordCount + " other instances of this word. Click to add to filter."
  }
  var wordCommentElement = document.createElement("span");
  wordCommentElement.className = "tip-text";
  wordCommentElement.textContent = tipText;
  tip.appendChild(wordCommentElement);

  var availableHeight = inscriptionElement.getBoundingClientRect().top;
  if (availableHeight < tip.offsetHeight) {
    tip.style.top = inscriptionElement.offsetHeight + "px";
  } else {
    tip.style.top = "-" + tip.offsetHeight + "px";
  }
}

function updateTipText(string) {
  var tip = document.getElementById("tip");
  tip.innerHTML = string;
}

function setHighlightLettersInTranscription(name, index, highlight) {
  var highlightedElements = [];
  var element = document.getElementById("image-transcription-" + name + "-word-highlight-" + index);
  if (!element) {
    return highlightedElements;
  }

  var elements = element.getElementsByClassName("letter-highlight");
  Array.from(elements).forEach( element => {
    element.style.backgroundColor = highlight;
    highlightedElements.push(element);
  });
  return highlightedElements;
}

function highlightWords(name, index) {
  var items = ["transcription", "translation", "transliteration"];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var element = document.getElementById(name + "-" + item + "-" + index);
    if (item == "transcription") {
      addWordTip(element.textContent, name);
    }
    if (element.style.backgroundColor) {
      continue;
    }
    setHighlightLettersInTranscription(name, index, "rgba(255, 255, 0, 0.5)");
    element.style.backgroundColor = "yellow";
  }
}

function clearHighlight(evt, name, index) {
  var tip = document.getElementById(name + "-tip");
  if (tip) {
    tip.style.display = "none";
  }
  var items = ["transcription", "transliteration", "translation"];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var element = document.getElementById(name + "-" + item + "-" + index);
    if (highlightedSearchElements.includes(element)) {
      continue;
    }
    setHighlightLettersInTranscription(name, index, "");
    element.style.backgroundColor = "";
  }
}

function updateSearchTerms(evt, searchTerm) {
  var searchTerm = stripErased(searchTerm);
  var container = document.getElementById("search-terms");
  var existingElement = document.getElementById("search-for-" +  searchTerm);
  if (existingElement) {
    return;
  }
  var item = document.createElement("div");
  item.className = 'search-term';
  item.textContent = searchTerm;
  item.id = "search-for-" + searchTerm;
  item.setAttribute("term", searchTerm);
  item.setAttribute("onclick", "removeFilter(event)");

  var color = cycleColor();
  item.style.backgroundColor = color;
  item.style.opacity = "0.8";
  item.setAttribute("highlightColor", color);

  container.appendChild(item);
  applySearchTerms();
  evt.stopPropagation();
}

function saveSearchTerms(key) {
  var number = key - 48;
  var container = document.getElementById("search-terms");
  localStorage.setItem(key, container.innerHTML);
  changeIcon("icons/" + number + '.png');
}

function loadSearchTerms(key) {
  var number = key - 48;
  var container = document.getElementById("search-terms");
  container.innerHTML = localStorage.getItem(key);
  applySearchTerms();
  changeIcon("icons/" + number + '.png');
}

function hasMatch(fullWordMatch, searchTerm, inscription) {
  searchTerm = searchTerm.replace(/\\/g, "");
  var re = new RegExp(searchTerm);
  if (!fullWordMatch) {
    var containsRegEx = inscription.translatedWords.filter(word => re.test(word)).length > 0;
    containsRegEx |= inscription.transliteratedWords.filter(word => re.test(word)).length > 0;
    var containsTerm = inscription.translatedWords.filter(word => word.includes(searchTerm)).length > 0;
    containsTerm |= inscription.transliteratedWords.filter(word => word.includes(searchTerm)).length > 0;
    return (containsRegEx || containsTerm ||
        inscription.transcription.includes(searchTerm) ||
        inscription.name.includes(searchTerm) ||
        inscription.words.includes(searchTerm) ||
        inscription.words.map(x => stripErased(x)).includes(searchTerm)
        );
  }

  var containsTerm = inscription.translatedWords.filter(word => word == searchTerm).length > 0;
  containsTerm |= inscription.transliteratedWords.filter(word => word == searchTerm).length > 0;
  return (containsTerm ||
      inscription.name == searchTerm ||
      inscription.words.includes(searchTerm) ||
      inscription.words.map(x => stripErased(x)).includes(searchTerm)
      );
}

function hasTag(tag, inscription) {
  return (
      (tags.has(inscription.name) && tags.get(inscription.name).includes(tag)) ||
      (contexts.has(inscription.name) && contexts.get(inscription.name).includes(tag)) ||
      inscription.support.includes(tag) ||
      inscription.wordTags.flat(2).includes(tag) ||
      inscription.scribe == tag
      );
}

function applySearchTerms() {
  var searchTerms = document.getElementById("search-terms");
  var numberOfSearchTerms = searchTerms.children.length;	
  var searchTermValues = Array.prototype.slice.call(searchTerms.children)
                         .map(x => stripErased(x.textContent));
  var numberOfTags = activeTags.length;
  var hasSearchTerm = (numberOfSearchTerms + numberOfTags > 0)
  clearHighlights();

  for (var inscription of inscriptions.values()) {
    if (!hasSearchTerm) {
      if (inscription.element) {
        inscription.element.style.display = "flex";
      }
      if (inscription.tagContainer) {
        inscription.tagContainer.innerHTML = "";
      }
      continue;
    }
    var shouldDisplay = false;
    searchTermValues.forEach( searchTerm => {
      var fullWordMatch = searchTerm.includes("\"");
      searchTerm = searchTerm.replace(/\"/g, "");

      if (hasMatch(fullWordMatch, searchTerm, inscription)) {
        shouldDisplay = true;
      }
    });

    var tagsToAdd = [];
    activeTags.forEach( tag => {
      if (hasTag(tag, inscription)) {
        shouldDisplay = true;
        tagsToAdd.push(tag);
      }
    });

    if (!shouldDisplay) {
      if (inscription.element) {
        inscription.element.style.display = "none";
      }
      continue;
    }
    var newElement = loadInscription(inscription);
    if (!newElement) {
      inscription.element.style.display = "flex";
    }

    inscription.tagContainer.innerHTML = "";
    tagsToAdd.forEach( tag => {
      var label = document.createElement("div");
      label.className = 'tag';
      label.style.backgroundColor = tagColors[tag];
      label.textContent = tag;
      inscription.tagContainer.appendChild(label);
    });

    for (index in searchTerms.children) {
      var searchElement = searchTerms.children.item(index);
      if (!searchElement) {
        continue;
      }
      var term = searchElement.textContent;
      for (var j = 0; j < inscription.element.children.length; j++) {
        var element = inscription.element.children[j];
        var highlightColor = searchElement.getAttribute("highlightColor");
        highlightMatchesInElement(element, term, highlightColor);
      }
    }

    for (var tag of activeWordTags) {
      var highlightColor = tagColors[tag];
      for (var index in inscription.wordTags) {
        if (!inscription.wordTags[index].includes(tag)) {
          continue;
        }
        var translation = document.getElementById(inscription.name + "-translation-" + index);
        translation.style.backgroundColor = highlightColor;
        var transliteration = document.getElementById(inscription.name + "-transliteration-" + index);
        transliteration.style.backgroundColor = highlightColor;
        var transcription = document.getElementById(inscription.name + "-transcription-" + index);
        transcription.style.backgroundColor = highlightColor;
        highlightedSearchElements.push(translation);
        highlightedSearchElements.push(transliteration);
        highlightedSearchElements.push(transcription);

        var highlightedElements = setHighlightLettersInTranscription(inscription.name, index, highlightColor);
        highlightedSearchElements = highlightedSearchElements.concat(highlightedElements);
      }
    }
  }
}

function removeFilter(evt) {
  evt.target.parentElement.removeChild(evt.target);
  applySearchTerms();
}

function searchForWord(evt, name, index) {
  var element = document.getElementById(name + "-transcription-" + index);
  var searchTerm = stripErased(element.textContent);
  var searchBox = document.getElementById("search");
  searchBox.value = searchTerm;
  searchBox.dispatchEvent(new InputEvent("input"));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle the inscriptions so we display a different group at the top every time
var inscriptionsToLoad = shuffleArray(Array.from(inscriptions.keys()))[Symbol.iterator]();
// create config object: rootMargin and threshold
// are two properties exposed by the interface
const config = {
  rootMargin: '0px 0px 50px 0px',
  threshold: 0
};

function toggleTag(event, tag) {
  if (activeTags.includes(tag)) {
    activeTags.splice(activeTags.indexOf(tag), 1);
  } else {
    activeTags.push(tag);
  }
  var element = event.target;
  var color = element.style.backgroundColor;
  element.style.color = color == tagColors[tag] ? "white" : "black";
  element.style.backgroundColor = color == tagColors[tag] ? "black" : tagColors[tag];
  applySearchTerms();
}

function showMetadata(event, metadata, activeMetadata, activeMetadataName) {
  metadata = metadata.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
  });

  var search = document.getElementById("search");
  search.style.visibility = "hidden";
  document.getElementById("search-command").style.backgroundColor = "black";

  var container = document.getElementById("filter-details-container");
  container.innerHTML = "";

  if (container.showing == activeMetadataName) {
    container.style.visibility = "hidden";
    container.showing = "";
    return;
  }
  container.showing = activeMetadataName;
  container.style.visibility = "visible";

  for (var datum of metadata) {
    var item = document.createElement("div");
    item.className = 'filter-tag';
    item.textContent = datum;
    item.setAttribute("onclick", "toggleMetadatum(event, '" + datum + "', " + activeMetadataName + ", '" + event.target.id + "')");
    item.style.backgroundColor = activeMetadata.includes(datum) ? tagColors[datum] : "black";
    item.style.color = activeMetadata.includes(datum) ? "black" : "white";
    container.appendChild(item);
  }
}

var tagColors = {};
function toggleMetadatum(event, datum, activeMetadata, commandElementID) {
  if (activeMetadata.includes(datum)) {
    activeMetadata.splice(activeMetadata.indexOf(datum), 1);
  } else {
    activeMetadata.push(datum);
    if (!tagColors[datum]) {
      tagColors[datum] = cycleColor(); 
    }
  }
  var element = document.getElementById(commandElementID);
  element.style.backgroundColor = activeMetadata.length ? "purple" : "black";
  toggleTag(event, datum);
}

var activeTags = [];
var activeSupports = [];
var activeScribes = [];
var activeContexts = [];
var activeWordTags = [];
var activeTagValues = [];
// Load inscriptions as they come into view
let observer = new IntersectionObserver(function(entries, self) {
  entries.forEach(entry => {
    // Only load new inscriptions if a search isn't active
    if(entry.isIntersecting && !highlightedSearchElements.length && !activeTags.length) {
		  var key = inscriptionsToLoad.next().value;
      if (key) {
        var visibleInscription = loadInscription(inscriptions.get(key));
        if (visibleInscription) {
          observer.observe(visibleInscription);
        }
      }
      self.unobserve(entry.target);
    }
  });
}, config);

function loadExplorer() {
  loadInscriptionLevelTags();
  loadAnnotations();

  for (var i = 0; i < 10; i++) {
    var key = inscriptionsToLoad.next().value;
    var visibleInscription = loadInscription(inscriptions.get(key));
    observer.observe(visibleInscription);
  }
}
