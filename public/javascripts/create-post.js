$(document).ready(function () {
  /**
   * Event handler for when the user submits a post
   */
  $('#postForm').submit(function (event) {
    event.preventDefault();

    var path = window.location.pathname;
    var domain = window.location.hostname;
    var port = window.location.port;
    var fields = path.split("/");
    var module = fields[4];                                   //Module code
    var title = event.target.inputPostTitle.value;            //Post title
    var description = event.target.inputPostDesc.value;       //Post description
    var route = path.replace('/createPost', '');              //Route for the POST request
    var files = document.getElementById('inputPostFile').files;

    var check_1 = checkStrings(title, description);   //Checks to see if the strings are empty
    var check_2 = checkFile(files);                   //Checks that the files are of the correct type and do not exceed 10MB

    if (check_1 && check_2) {
      var formData = new FormData();
      
      formData.append('user_name', User);
      formData.append('module_code', module);
      formData.append('post_title', title);
      formData.append('post_content', description);
      formData.append('post_link', '//' + domain + ':' + port + route + '/' + title);

      for (var i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
      }

      $.ajax({
        url: route + '/addPost',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function () {
          $(location).attr('href', route + '/' + title);
        },
      })
    }
  });

  function checkStrings(title, description) {
    if(title === '' || description === '') {
      $('[data-toggle="popover"]').popover()
      return false;
    }

    return true;
  }

  function checkFile(files) {
    var validFileTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword',                           //File types that are allowed
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',                                      //.jpeg, .png, .pdf, .doc, .docx, .ppt, .pptx
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];

    for (var i = 0; i < files.length; i++) {
      var fileType = files[i]['type'];

      if ($.inArray(fileType, validFileTypes) < 0) {                  //Checks if the file type is valid
        swal("Sorry, only the following files are permitted: jpeg, png, pdf, word, powerpoint");
        return false;
      }

      if (files[i].size > 1024 * 1024 * 10) {          //Checks to see if the file exceeds 10MB
        swal("Sorry, the file can't exceed 10MB!");
        return false;
      }
    }

    return true;
  }
});