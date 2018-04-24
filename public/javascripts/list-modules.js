$(document).ready(function () {
  getModules();

  /**
   * Retrieves the modules for that course from the databases
   */
  function getModules() {
    var path = window.location.pathname
    var fields = path.split('/')
    var course = fields[3].toUpperCase();      //Retrieves the course from the path name

    $.get(path + "/getModules", function (data) {
      var modules = "";

      for (var i = 0; i < data.length; i++) {
        if (course === data[i].course_code) {                 //Only adds module that have the course in the path name
          modules += " <div id='collegewrap'> <a href='" + path + "/" + data[i].module_code + "'> <div id='contentwrap'> <div class='container'> <div class='row'> <div class='col-lg-4'> <h4 class='course'>" + data[i].module_name + "</h4> </div> <div class='col-lg-4'></div> <div class='col-lg-4'> <h4 class='course'>" + data[i].module_code + "</h4> </div> </div> <div> <h5>" + data[i].lecturer + "</h5> </div> </div> </div> </a> </div>" }
      }

      if(modules === "") {                                          //Alters the heading if there is no modules
        $("#modules").prev().text("There are currently no modules for this course!");
      }

      $("#modules").html(modules);
    });
  }
});