var mykey = "PASTE_API_HERE";

var videosDiv = document.querySelector("section.video-section .videos");
var iframe = document.querySelector("iframe");
var searchQuery = document.querySelector("form.search input");
var searchBtn = document.querySelector("form.search button");

function getData(url) {
  var request = new XMLHttpRequest();

  request.open("GET", url);

  request.onload = function () {
    listVideos(JSON.parse(request.responseText));
  };

  request.send();
}

function listVideos(data) {
  videosDiv.innerHTML = "";
  data.items.forEach(function (video) {
    createVideo(video);
  });
}

function createVideo(video) {
  var videoArticle = document.createElement("article");
  var videoInfoWrapper = document.createElement("div");
  var uploadDate = document.createElement("span");

  videoArticle.append(
    createEl(video, "img", "", video.snippet.thumbnails.medium.url)
  );

  videoInfoWrapper.append(createEl(video, "h2", "innerHTML", "title"));

  uploadDate.textContent = dateToRightFormat(video.snippet.publishedAt);
  videoInfoWrapper.append(uploadDate);

  videoInfoWrapper.append(createEl(video, "p", "textContent", "channelTitle"));

  videoInfoWrapper.append(createEl(video, "p", "textContent", "description"));

  videoArticle.append(videoInfoWrapper);
  videoArticle.addEventListener(
    "click",
    function () {
      iframe.setAttribute(
        "src",
        "https://www.youtube.com/embed/" + video.id.videoId
      );
      iframe.classList.add("visible");
      getData(
        "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&relatedToVideoId=" +
          video.id.videoId +
          "&type=video&key=" +
          mykey
      );
    },
    false
  );
  videosDiv.append(videoArticle);
}

function createEl(video, type, method, property) {
  var element = document.createElement(type);
  if (type === "img") {
    element.setAttribute("src", property);
    return element;
  } else {
    element[method] = video.snippet[property];

    return element;
  }
}

function dateToRightFormat(date) {
  var element = date;

  element.slice(0, element.indexOf("T"));
  element.replaceAll("-", ",");

  return moment([element]).fromNow();
}
searchBtn.addEventListener("click", function (e) {
  if (searchQuery.value) {
    e.preventDefault();
    getData(
      "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=" +
        searchQuery.value +
        "&key=" +
        mykey
    );
  }
});

searchQuery.addEventListener("keydown", function (e) {
  if (e.keyCode === 13 && searchQuery.value) {
    getData(
      "https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=" +
        searchQuery.value +
        "&key=" +
        mykey
    );
  }
});
