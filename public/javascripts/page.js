$(document).ready(function () {
  getPage();
  
  function getPage() {
    var path = window.location.pathname
    var crumb = path.split('/')
    var collegeBack = crumb[1] + "/" + crumb[2];      //Retrieves the college from the path name
    var courseBack = crumb[1] + "/" +crumb[2]+ "/" + crumb[3];
    var moduleBack = crumb[1] + "/" +crumb[2]+ "/" + crumb[3]+ "/" + crumb[4];
    var post = crumb[1] + "/" +crumb[2]+ "/" + crumb[3]+ "/" + crumb[4]+ "/" + crumb[5];
$("#collegeBack").attr("href", "/" + collegeBack);
$("#courseBack").attr("href", "/" + courseBack);
$("#modBack").attr("href", "/" + moduleBack);
$("#Post").attr("href", "/" + post);
$("#modCode").text(crumb[4]);
$("#courseName").text(crumb[3]);
$("#collegeAbbr").text(crumb[2]);
  }
});