$(document).ready(function() {

  loadComments()

  $('#newcomment').on('submit', function(event) {
    event.preventDefault()

    let commentText = ''
    if ($(this).serializeArray()[0]){
      commentText = $(this).serializeArray()[0].value
    }

    let rating = ''
    if ($(this).serializeArray()[1]){
      rating = $(this).serializeArray()[1].value
    }

    let urlid = $('#newcomment').attr('URLid')
    let url   = `/urls/${urlid}/comments`

    let error = validateComment(commentText, rating)
    if (error) {
      $('#newcomment .error').remove()
      $('#newcomment').append($('<div>').addClass('error').text(error))
    }
    else{
      $.ajax({
        method: 'POST',
        url   : url,
        data  : {'content': commentText, 'rating': rating}
      }).then(function(error) {
        if (error) {
          $('#newcomment .error').remove()
          $('#newcomment').append($('<div>').addClass('error').text(error))
        }
        else {
          loadComments()
        }
      })
      $(this).trigger('reset')
      $('#newcomment .error').remove()
    }




  })


})



function loadComments() {
  let urlid = $('#newcomment').attr('URLid')
  let url   = `/urls/${urlid}/comments`
  console.log(url)

  $('#comments-container').html('')
  $('#comments-container').append($('<div>').addClass('row').addClass('justify-content-center'))


  $.ajax({
    method: 'GET',
    url: url,
  }).then(function(response) {
    renderComments(response)
  })
}




function renderComments(comments) {
  let commentsContainer = $('#comments-container div')
  comments.forEach(function(comment) {
    let commentElm = createCommentElement(comment)
    commentsContainer.prepend(commentElm)
  })
}



// Create a URL element (to be added to the DOM by renderURLS)
function createCommentElement(comment) {
  let $ratingStars = $('<div>').addClass('rating')
  for (let i = 0; i < comment.rating; i++) {
    $ratingStars.append($('<span>').html('<i class="fa fa-star" aria-hidden="true"></i>'))
  }
  for (let i = 0; i < 5 - comment.rating; i++) {
    $ratingStars.append($('<span>').html('<i class="fa fa-star-o" aria-hidden="true"></i>'))
  }



  let $comment = $('<div>').addClass('container').addClass('comment-box')
                    .append($('<div>').append($('<img>').attr('src',comment.avatar)))
                    .append($('<div>').addClass('comment-name').append($('<p>').text(comment.name)))
                    .append($('<div>').addClass('comment-text').text(comment.content))
                    .append($ratingStars)

  return $comment
}


















