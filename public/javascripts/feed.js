$(document).ready(function () {
  var totalCharacters = 140;
  var editTotalCharacters = 140;
  var showComments = true;

  var path = window.location.pathname;
  var domain = window.location.hostname;
  var port = window.location.port;
  var fields = path.split("/");
  var title = fields[5];

  /**
   * Calculates the remaining characters and changes the html label with #charRemaining
   */
  $("#commentForm").keyup(function (event) {
    var inputText = event.target.value;
    $("#charRemaining").html(editTotalCharacters - inputText.length);
  });
  getComments();

  $("#editCommentForm").keyup(function (event) {
    var inputText = event.target.value;
    $("#editCharRemaining").html(totalCharacters - inputText.length);
  });

  /**
   * When the page loads (or is refreshed) we request all comments from the server
   */
  function getComments() {
    $.get("/comments/getComments", function (data) {
      var comments = "";
      var count = 0;

      for (var i = 0; i < data.length; i++) {
        if (data[i].post_title === title) {
          var date = new Date(data[i].date_created);
          comments += " <div id='comment'> <div class='row'> <div class='col-sm-8'>" + data[i].comment + "</div> <div class='col-sm-2'> <button type='button' name='" + data[i]._id + "' class='btn btn-success " + (User === data[i].user_name ? "": "hide") +  "' data-toggle='modal' data-target='#editModal' id='e-btn'>Edit</button> </div> <div class='col-sm-2'>" + " <button type='button' name='" + data[i]._id + "' class='btn btn-danger " + (User === data[i].user_name ? "": "hide") +  "' id='d-btn'>" + "Delete </button> </div> </div> Posted by " + data[i].user_name + " at " + date.toDateString() + " </div> ";     
          count++;
        }
      }

      $("#feedComments").html(comments);
      $("#count").html(count);

      if (!showComments)
        $("#feedComments").hide();
      else
        $("#feedComments").show();

      // Recursively call getComments every 10 seconds
      setTimeout(getComments, 10000);
    });
  }

  /**
 * Event handler for when the user submits a comment
 */
  $("#commentForm").submit(function (event) {
    event.preventDefault();

    if (event.target.inputComment.value) {
      $.post("/comments/addComment", {
        user_name: User,
        post_title: title,
        comment: event.target.inputComment.value,
        comment_link: "//" + domain + ":" + port + path,
      }, function (result) {
        $("#charRemaining").html(totalCharacters);
        event.target.reset();
        getComments();
      });
    } else {
      $('[data-toggle="popover"]').popover(); //Toggles a popover on the comment button
    }
  });

  /**
   * Determines which button to act on i.e. either the Edit or Delete button(MY VERSION)
   */
  $("#feedComments").click(function (event) {
    var name = event.target.name;   //Actually the comment id
    var id = event.target.id;       //This is the button element id

    if (name) {
      if (id === "e-btn") {
        $("#confirm-edit").click(function (e) {
          updateComment(name);
        })
      }

      if (id === "d-btn") {
        deleteComment(name);
      }
    }
  });

  /**
   * Event handler for when the user edits a comment
   */
  function updateComment(id) {
    if (document.getElementById("inputEditComment").value) {
      var newComment = document.getElementById("inputEditComment").value

      $.ajax({
        url: '/comments/updateComment/' + id,
        type: 'PUT',
        data: { comment: newComment },
        error: function () {
          getComments();
        }
      });
    }
    else {
      swal('You need to enter a new comment')
    }
  }

  /**
   * Event handler for when the user deletes a comment
   */
  function deleteComment(name) {
    $.ajax({
      url: '/comments/removeComment/' + name,
      type: 'DELETE',
      error: function () {
        getComments();
      }
    });
  }

  $("#btn-count").click(function (event) {
    var options = {};

    if (!showComments) {
      $("#feedComments").show("blind", options, 1000);
      showComments = true;
    }
    else {
      $("#feedComments").hide("blind", options, 1000);
      showComments = false;
    }
  });
});

