var addPic = document.querySelector('#add-pic');
var formDiv = document.querySelector('.form-div');
var darkDiv = document.querySelector('.dark-div');
var closeIcon = document.querySelector('.fa-times');

addPic.addEventListener('click', function () {
  formDiv.className += " form-div-vis";
  darkDiv.className += " dark-div-vis";
  document.querySelector('.navbar-links').className = 'navbar-links';
});

closeIcon.addEventListener('click', function () {
  formDiv.className = "form-div";
  darkDiv.className = "dark-div";
});