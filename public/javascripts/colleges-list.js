$(document).ready(function () {
  getColleges();

  function getColleges() {
    $.get("/colleges/getColleges", function(data) {
        var colleges = "";

        for(var i = 0; i < data.length; i++) {
            colleges += "<div class='panel panel-default'>" +
            "<div class='panel-heading'>" + data[i].college_name + "</div>" +
            "<div class='panel-body'>" + data[i].description + "</div></div>"
        }

        $("#colleges").html(colleges);
    });
}
})