
let postsAll = document.getElementById("postsAll");
let submit = document.getElementById("submit-new-post");
let submitButton = document.getElementById("submitButt");
let destroy = document.getElementById("knight");
let help = document.getElementById("help");
let logo = document.getElementById("logo");
let orc = document.getElementById("orc");
let tooltip = document.getElementById("tootltipText");
let goBack = document.getElementById("goBack");

const playGameButton = document.getElementById("playGameButton");



if(submit !== null) {
submit.addEventListener("click", function () {
  window.location.href = "http://localhost:3000/submit";
})};

if(goBack !== null) {
  goBack.addEventListener("click", function () {
    window.location.href = "http://localhost:3000/main";
  })};

 

if(destroy !== null) {
destroy.addEventListener("click", function () {
  window.location.href =
    "https://warhammer40k.fandom.com/wiki/Adeptus_Mechanicus";
})};

if(help !== null) {
help.addEventListener("click", function () {
  window.location.href = "http://localhost:3000/help";
})};

if(playGameButton !== null) {
playGameButton.addEventListener("click", function() {
  window.location.href = "http://localhost:3000/game";
})};

if(logo !== null) {
logo.addEventListener("click", function () {
  window.location.href =
    "https://warhammer40k.fandom.com/wiki/Collegia_Titanica";
})};


let createPost = function (post) {
  let postElement = document.createElement("div");
  postElement.className = "myPost";

  let modifyStart = document.createElement("button");
  modifyStart.id = "modifyStart";
  modifyStart.innerHTML = "modify";

  let modifyEnd = document.createElement("button");
  modifyEnd.id = "modifyEnd";
  modifyEnd.innerHTML = "save";
  modifyEnd.disabled = "true";

  destroy.src = "img/knight.gif";

  let title = document.createElement("h1");
  title.innerHTML = `${post.title}`;

  let url = document.createElement("a");
  url.href = post.url;
  url.innerHTML = `${post.url}`;

  let timestamp = document.createElement("p");
  const date = new Date(post.timestamp).toLocaleString();
  timestamp.innerHTML = `created: ${date}`;

  let delButton = document.createElement("button");
  delButton.id = "delButton";
  delButton.innerHTML = "delete";

  let idCount = document.createElement("p2");
  idCount.id = "idCounter";
  idCount.innerHTML = `${post.id}.`;

  let voteNumber = document.createElement("p3");
  voteNumber.id = "voting";
  voteNumber.innerHTML = `${post.vote}`;

  let upvotePic = document.createElement("img");
  upvotePic.id = "upvotePic";
  upvotePic.src = "img/upvote.png";

  let downvotePic = document.createElement("img");
  downvotePic.id = "downvotePic";
  downvotePic.src = "img/downvote.png";

  let votingAll = document.createElement("div");
  votingAll.className = "voteAll";

  let content = document.createElement("div");
  content.className = "postContent";

  votingAll.appendChild(idCount);
  votingAll.appendChild(upvotePic);
  votingAll.appendChild(voteNumber);
  votingAll.appendChild(downvotePic);

  content.appendChild(title);
  content.appendChild(url);
  content.appendChild(timestamp);

  postElement.appendChild(votingAll);
  postElement.appendChild(content);
  postElement.appendChild(delButton);
  postElement.appendChild(modifyStart);
  postElement.appendChild(modifyEnd);
  postsAll.appendChild(postElement);

  delButton.addEventListener("click", function () {
    deletePost(post.id);
    destroy.src = "img/once.gif";
    postElement.remove();
    setTimeout(() => {
      destroy.src = "img/adeptus.gif";
    }, 4500);
  });

  upvotePic.addEventListener("click", function () {
    upvote(post.id);
    voteNumber.innerHTML = `${(post.vote += 1)}`;
  });

  downvotePic.addEventListener("click", function () {
    downvote(post.id);
    voteNumber.innerHTML = `${(post.vote -= 1)}`;
  });

  modifyStart.addEventListener("click", function () {
    modifyEnd.disabled = false;
    modifyStart.disabled = true;
    title.contentEditable = true;
    url.contentEditable = true;
    title.style.backgroundColor = "white";
    title.style.border = "1px dashed red";
    url.style.backgroundColor = "white";
    url.style.border = "1px dashed red";
  });

  modifyEnd.addEventListener("click", function () {
    modifyStart.disabled = false;
    modifyEnd.disabled = true;
    title.contentEditable = false;
    title.style.backgroundColor = "#e1e6e9";
    title.style.border = "0";
    url.contentEditable = false;
    url.style.backgroundColor = "#e1e6e9";
    url.style.border = "0";
    modify(post.id, { title: title.textContent, url: url.textContent });
  });
};

fetch("http://localhost:3000/api/posts/get")
  .then((value) => {
    return value.json();
  })
  .then((value) => {
    for (let i = 0; i < value.length; i++) {
      createPost(value[i]);
    }
    //console.log(value);
  });

function deletePost(id) {
  fetch(`http://localhost:3000/api/posts/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Post deleted successfully");
      } else {
        console.error("Error deleting post");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function upvote(id) {
  fetch(`http://localhost:3000/api/posts/${id}/upvote`, {
    method: "PUT",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Post upvoted ");
      } else {
        console.error("Error upvoting post");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
function downvote(id) {
  fetch(`http://localhost:3000/api/posts/${id}/downvote`, {
    method: "PUT",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Post downvoted ");
      } else {
        console.error("Error downvoting post");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function modify(id, post) {
  fetch(`http://localhost:3000/api/posts/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      Title: post.title,
      URL: post.url,
    }),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Post modifies ");
      } else {
        console.error("Error modifying post");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function drag_start(event) {
  var style = window.getComputedStyle(event.target, null);
  event.dataTransfer.setData(
    "text/plain",
    parseInt(style.getPropertyValue("left"), 10) -
      event.clientX +
      "," +
      (parseInt(style.getPropertyValue("top"), 10) - event.clientY)
  );
}
function drag_over(event) {
  event.preventDefault();
  return false;
}
function drop(event) {
  var offset = event.dataTransfer.getData("text/plain").split(",");
  logo.style.left = event.clientX + parseInt(offset[0], 10) + "px";
  logo.style.top = event.clientY + parseInt(offset[1], 10) + "px";
  event.preventDefault();

  function animate() {
    logo.style.left =
      parseInt(logo.style.left) + (Math.random() * 20 - 10) + "px";
    logo.style.top =
      parseInt(logo.style.top) + (Math.random() * 20 - 10) + "px";

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  submit.disabled = false;
  orc.style.visibility = "hidden";
  tooltip.innerHTML = "Good job, now you can continue with the production";
  return false;
}
if(logo !== null) {
logo.addEventListener("dragstart", drag_start, false);
}

let element = document.getElementById("droptarget");
if(element !== null) {
element.addEventListener("dragover", drag_over, false);
element.addEventListener("drop", drop, false);
}


function changeTextColor() {
  var header = document.getElementById("header");
  var header2 = document.getElementById("header2");
  var firstText = document.getElementById("firstText");
  var list = document.getElementById("list");
  let button = document.getElementById("colorChange");
  header.style.color = "black";
  header2.style.color = "green";
  list.style.color = "red";
  firstText.style.color = "transparent";
  button.disabled = true;
}

function changeGif() {
  console.log("pokus4");
  var gif = document.getElementById("titans");
  var currentGif = gif.src.substring(gif.src.lastIndexOf("/") + 1);
  var newGif;

  if (currentGif === "t1.gif") {
    newGif = "t2.gif";
  } else if (currentGif === "t2.gif") {
    newGif = "t3.gif";
  } else if (currentGif === "t3.gif") {
    newGif = "t4.gif";
  } else {
    newGif = "t1.gif";
  }

  gif.src = "img/" + newGif;
}

/*
window.addEventListener("load", function () {
  setTimeout(function () {
    let titan = document.getElementById("titanchange");
    if(titan !== null) {
    titan.style.visibility = "visible";}
  }, 2000);
});
*/

window.addEventListener("load", function () {
  setTimeout(function () {
    
    let helpButton = document.getElementById("colorChange");
    if(helpButton !== null) {
    helpButton.style.visibility = "visible";}
  }, 3000);
});

const agree = document.getElementById("agree");
const continueBtn = document.getElementById("goBack");
if(agree !== null) {

agree.addEventListener("change", function() {
  if (this.checked) {
    continueBtn.style.display = "block";
  } else {
    continueBtn.style.display = "none";
  }
})};




