$(document).ready(function () {
  var id = "";
  getUser();

  /**
   * Retrieves the user's posts, comments, and details
   */
  function getUser() {
    var domain = window.location.hostname;
    var port = window.location.port;

    $.get('/users/getUserByName/' + User, function (data) {
      id = data._id;
      $('#profile-name').text(data.user_name);

      if (data.profile_pic) {
        $('#profile-pic').attr('src', '//' + domain + ':' + port + '/' + data.profile_pic);
      }
    });

    /**
     * Retrieves links to the user's posts
     */
    $.get('/posts/getPosts', function (data) {
      var posts = "";

      for (var i = 0; i < data.length; i++) {
        if (data[i].user_name === User) {
          posts += "<a href='" + data[i].post_link + "' class='list-group-item'>" + data[i].post_title + "</a>";
        }
      }

      $('#user-posts').html(posts);
    })

    /**
     * Retrieves links to the user's comments
     */
    $.get('/comments/getComments', function (data) {
      var comments = "";

      for (var i = 0; i < data.length; i++) {
        if (data[i].user_name === User) {
          comments += "<a href='" + data[i].comment_link + "' class='list-group-item'>" + data[i].comment + "</a>";
        }
      }

      $('#user-comments').html(comments);
    })
  }

  /**
   * Event handler for when the user changes profile pics
   */
  $('#change-profilePic').on('change', function (event) {
    var file = event.target.files[0];
    var check = checkFile(file);

    if (check) {
      var formData = new FormData();
      formData.append('profile_pic', file);

      $.ajax({
        url: '/users/updateUser/' + id,
        type: 'PUT',
        data: formData,
        contentType: false,
        processData: false,
        /**
         *  Something strange happened here. The console returns an error, saying the ajax method is not allowed but it succeeds in
         *  updating the profile picture in the backend. Therefore I have to reload the page on an error for it so succeed properly
         */
        error: function () {
          location.reload();
        }
      });
    }
  })

  function checkFile(file) {
    var validFileTypes = ['image/jpeg', 'image/png'];     //File types that are allowed
    var fileType = file['type'];

    if ($.inArray(fileType, validFileTypes) < 0) {                  //Checks if the file type is valid
      swal("Sorry, only you can only upload a jpeg or png image!");
      return false;
    }

    if (file.size > 1024 * 1024 * 10) {          //Checks to see if the file exceeds 10MB
      swal("Sorry, the file can't exceed 10MB!");
      return false;
    }

    return true;
  }
});