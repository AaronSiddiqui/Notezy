var User = "Anonymous";

$(document).ready(function () {
  var authCookie = Cookies.get('Authorization');
  var userName = Cookies.get('UserName');

  /**
   * Toggles login/logout and profile depending on if there is a Authorization cookie
   */
  if (authCookie) {
    User = userName;                     //Stores the user's name when they are logged in
    $("#login-li").toggleClass('hide');
    $("#profile-li").toggleClass('hide');
    $("#profile-a").attr('href', '/users/' + User)
    $("#logout-li").toggleClass('hide');
  }

  /**
   * Event handler for when the user attempts to register
   */
  $("#reg-form").submit(function (event) {
    event.preventDefault();
    var username = event.target.regisUsername.value;
    var firstPassword = event.target.firstRegisPassword.value;
    var secondPassword = event.target.secondRegisPassword.value;

    if (checkPasswords(firstPassword, secondPassword)) {
      $.ajax({
        type: 'POST',
        url: '/users/register',
        dataType: 'json',
        data: {
          'user_name': username,
          'password': firstPassword
        },
        success: function (token) {
          Cookies.set('UserName', username);
          swal("Congratulations! You've created a new account");

          setTimeout(function () {
            $(location).attr('href', '/users/' + username);	// Redirect to a login page
          }, 1500)
        },
        error: function (errMsg) {
          swal(                           //swal(sweet alerts) produces an error message for the client
            'Oops...',
            errMsg.responseJSON.body,
            'error'
          )
        }
      });
    }
  });

  /**
   * Checks to see if the registration passwords are equal and a minimum of 8 characters
   */
  function checkPasswords(fPassword, sPassword) {
    if (fPassword === sPassword) {
      if (fPassword.length >= 8) {
        return true;
      } else {
        swal('Passwords must be a minimum of 8 characters');
        return false;
      }
    } else {
      swal('Passwords do not match');
      return false;
    }
  }

  /**
   * Event handler for when the user logins in
   */
  $("#log-form").submit(function (event) {
    event.preventDefault();
    var username = event.target.loginUsername.value;
    var password = event.target.loginPassword.value;

    $.ajax({
      type: 'POST',
      url: '/users/login',
      dataType: 'json',
      data: {
        'user_name': username,
        'password': password
      },
      success: function (token) {
        Cookies.set('UserName', username);
        $(location).attr('href', '/users/' + username); // Redirect to logged in page
      },
      error: function (errMsg) {
        swal(
          'Oops...',
          errMsg.responseJSON.body,
          'error'
        )
      }
    });
  });

  $("#logout").click(function (event) {
    Cookies.remove('UserName');
    Cookies.remove('Authorization');
    $(location).attr('href', '/');
  });
});
