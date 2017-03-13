document.querySelector('.navbar-toggle').addEventListener('click', function () {
    var navLinks = document.querySelector('.navbar-links');
    navLinks.className = navLinks.className === 'navbar-links' ? 'navbar-links navbar-links-visible' : 'navbar-links';
});