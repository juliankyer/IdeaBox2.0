$(document).ready(function() {
  retrieveIdea();
});

$(".search-input").on("keyup", function(){
  var ideaCards = $(".idea-render");
  var userSearchValue = $(this).val().toLowerCase();
  for (var cardCount = 0; cardCount < ideaCards.length; cardCount ++){
    var ideaCardText = $(ideaCards[cardCount]).text().toLowerCase();
    var matched = ideaCardText.indexOf(userSearchValue) !== -1;
    $(ideaCards[cardCount]).toggle(matched);
    console.log(matched);
  }
});

function createIdea (title, body, id, quality) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = quality || "swill";
}

$('.save-button').on('click', function(event) {
  event.preventDefault();
  var $ideaTitle = $('.idea-title').val();
  var $ideaBody = $('.idea-body').val();
  var ideaToStore = new createIdea($ideaTitle, $ideaBody);
  storeIdea(ideaToStore);
  retrieveIdea();
  clearInputs();
});

function clearInputs() {
  $('.idea-title').val('');
  $('.idea-body').val('');
}

function storeIdea(ideaToStore) {
  var ideaID = ideaToStore.id;
  var stringIdea = JSON.stringify(ideaToStore);
  localStorage.setItem(ideaID, stringIdea);
}

function retrieveIdea() {
  $('.idea-render').remove();
  for(var key in localStorage) {
    var parsedIdea = JSON.parse(localStorage[key]);
    renderCard(parsedIdea);
  }
}

function renderCard(parsed) {
  $('.idea-section').prepend(`
    <div id=${parsed.id} class ="idea-render">
    <div class="id-wrapper">
      <h2 class ="title-render" contenteditable="true">${parsed.title}</h2>
      <button class="button delete">delete</button>
    </div>
    <p class="editable-body" contenteditable="true">${parsed.body}</p>
    <div id="button-wrapper">
      <button class = "button upvote"></button>
      <button class = "button downvote"></button>
      <span class="quality-text">quality: ${parsed.quality}</span>
    </div>
  </div>`
);
}

$('.idea-section').on('click', '.delete', function() {
  var $targetID = $(this).closest('.idea-render').attr('id');
  localStorage.removeItem($targetID);
  retrieveIdea();
});

$('.idea-section').on('click', '.upvote', function() {
  var $targetID = $(this).closest('.idea-render').attr('id');
  var targetIdea = JSON.parse(localStorage.getItem($targetID));
  if (targetIdea.quality === 'swill'){
    targetIdea.quality = 'plausible';
  } else if (targetIdea.quality === 'plausible'){
    targetIdea.quality = 'genius';
  }
  var upVotedIdea = JSON.stringify(targetIdea);
  localStorage.setItem($targetID, upVotedIdea);
  retrieveIdea();
});

$('.idea-section').on('click', '.downvote', function() {
  var $targetID = $(this).closest('.idea-render').attr('id');
  var targetIdea = JSON.parse(localStorage.getItem($targetID));
  if (targetIdea.quality === 'genius'){
    targetIdea.quality = 'plausible';
  } else if (targetIdea.quality === 'plausible'){
    targetIdea.quality = 'swill';
  }
  var upVotedIdea = JSON.stringify(targetIdea);
  localStorage.setItem($targetID, upVotedIdea);
  retrieveIdea();
});

$('.idea-section').on('focusout', '.title-render', function(){
  var $targetID =  $(this).closest('.idea-render').attr('id');
  var targetIdea = JSON.parse(localStorage.getItem($targetID));
  var $newTitle = $(this).closest('.title-render').html();
  targetIdea.title = $newTitle;
  var titleToStore = JSON.stringify(targetIdea);
  localStorage.setItem($targetID, titleToStore);
  retrieveIdea();

});

$('.idea-section').on('focusout', '.editable-body', function() {
  var $targetID =  $(this).closest('.idea-render').attr('id');
  var targetIdea = JSON.parse(localStorage.getItem($targetID));
  var $newBody = $(this).closest('.editable-body').html();
  targetIdea.body = $newBody;
  var bodyToStore = JSON.stringify(targetIdea);
  localStorage.setItem($targetID, bodyToStore);
  retrieveIdea();
});
