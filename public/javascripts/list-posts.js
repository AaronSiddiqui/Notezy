$(document).ready(function () {
  $("a#create-post-btn").attr("href", window.location.pathname + "/createPost");
  getPosts();

  /**
   * Retrieves the posts for that module from the databases
   */
  function getPosts() {
    var path = window.location.pathname
    var fields = path.split('/')
    var module = fields[4].toUpperCase();      //Retrieves the module from the path name

    $.get(path + "/getPosts", function (data) {
      var posts = "";

      for (var i = 0; i < data.length; i++) {
        if (module === data[i].module_code) {                 //Only adds posts that with the module in the path name
          posts += " <div id='collegewrap'> <a href='" + path + "/" + data[i].post_title + "'> <div id='contentwrap'> <div class='container'> <div class='row'> <div class='col-lg-4'> <h3 class='course'>" + data[i].post_title + "</h3> </div> <div class='col-lg-6'></div> <div class='col-lg-2'> <div class='row'> <div class='col-lg-6'> <div class='upVotes'> <img src='/uploads/imgs/ups.png' class='votes'> <h5>" + data[i].up_votes + "</h5> </div> </div> <div class='col-lg-6'> <img src='/uploads/imgs/downs.png' class='votes'> <div class 'downVotes'> <h5>" + data[i].down_votes + "</h5> </div> </div> </div> </div> </div> <div class='row'> <div class='col-lg-8'> <div class='well well-xs'> <div class='row'> <p class='post'>" + data[i].post_content + "</p> </div> </div> </div> <div class='col-lg-2'></div> <div class='col-lg-2'> <h6 class='course'>Submitted by : " + data[i].user_name + "</h6> </div> </div> </div> </div> </a> </div>"
        
        
        } }

      if(posts === "") {                                          //Alters the heading if there is no posts
        $("#list-posts").prev().text("There are currently no posts for this module!");
      }

      $("#list-posts").html(posts);
    });
  }
});