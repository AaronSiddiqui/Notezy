$(document).ready(function () {
  getCourses();

  /**
   * Retrieves the courses for that college from the databases
   */
  function getCourses() {
    var path = window.location.pathname
    var fields = path.split('/')
    var collegeBack = fields[1] + "/" + fields[2];  
    var college = fields[2].toUpperCase();      //Retrieves the college from the path name

    $("#collegeAbbr").text(college);
  
    $.get(path + "/getCourses", function (data) {
      var courses = "";

      for (var i = 0; i < data.length; i++) {
        if (college === data[i].college_abbreviation) {         //Only adds courses that with the college in the path name
          courses += " <div id='collegewrap'> <a href='" + path + "/" + data[i].course_code + "'> <div id='contentwrap'> <div class='container'> <div class='row'> <div class='col-lg-4'> <h4 class='course'>" + data[i].course_name + "</h4> </div> <div class='col-lg-4'></div> <div class='col-lg-4'> <h4 class='course'>" + data[i].course_code + "</h4> </div> </div> <div class='row'> <div class='col-xs-12'> <h5>Course Leader : " + data[i].course_leader + "</h5> </div> </div> </div> </div> </a> </div>"}
      }

      if(courses === "") {                                          //Alters the heading if there is no courses
        $("#courses").prev().text("There are currently no courses for this college!");
      }

      $("#courses").html(courses);
    });
  }
});