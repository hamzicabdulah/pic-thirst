'use strict';

(function () {

   var pics = document.querySelector('.grid');
   var apiUrl = appUrl + '/api/mypics';
   
   function masonryLoad () {
      var msnry = new Masonry(pics, {
         itemSelector: '.grid-item',
         fitWidth: true
      });
   }
   
   function heartIconClass (object, user) {
      if (object.likes.indexOf(user.displayName) >= 0) {
         return "fa-heart " + object.title.split(' ').join('-');
      } else {
         return "fa-heart-o " + object.title.split(' ').join('-');
      }  
   }
   
   function updateLikes (data) {
      var object = JSON.parse(data);
      ajaxFunctions.ajaxRequest('GET', appUrl + '/api/current-user', function (user) {
         var user = JSON.parse(user);
         var heartIcon = document.querySelector('i.' + object.title.split(' ').join('-')); 
         var numOfLikes = document.querySelector('.' + object.title.split(' ').join('-') + ' .likes-num');
         numOfLikes.innerHTML = object.likes.length;
         heartIcon.className = 'fa ' + heartIconClass(object, user);
      });
   }
   
   function updatePics (data) {
      ajaxFunctions.ajaxRequest('GET', appUrl + '/api/current-user', function (user) {
         var picsObject = JSON.parse(data);
         var counter = 0;
         var iconClass;
         if (user) {
            var user = JSON.parse(user);
         }
         picsObject.forEach(function(item) {
            iconClass = user ? heartIconClass(item, user) : 'fa-heart-o ' + item.title.split(' ').join('-');
            var newDiv = document.createElement("div");
            newDiv.className = 'grid-item';
            newDiv.innerHTML = '<img src="' + item.url + '" onerror="this.src = \'https://cdn.hyperdev.com/us-east-1%3A60e6615e-7d9e-47ac-903b-3b4b47372e42%2Fplaceholder.png\'" alt="' 
                                 + item.title + '"></img><div><h3 class="title">' 
                                 + item.title + '</h3><h5 class="posted">' + item.posted 
                                 + '</h5><h5 class="likes ' + item.title.split(' ').join('-') +'"><i class="fa ' + iconClass 
                                 + '" aria-hidden="true"></i>' 
                                 + '<span class="likes-num">' + item.likes.length + '</span>' + '<h5></div>';
            pics.appendChild(newDiv);
            counter++;
            if (counter === picsObject.length) {
               masonryLoad();
               var counter2 = 0;
               var interval = setInterval(function () {
                  masonryLoad();
                  counter2++;
                  if (counter2 === 10) {
                     clearInterval(interval);
                  }
               }, 400);
            }
         });  
         var nonLiked = document.querySelectorAll('.fa-heart-o');
         var liked = document.querySelectorAll('.fa-heart');
         var hearts = [];
         hearts.push.apply(hearts, nonLiked);
         hearts.push.apply(hearts, liked);
         for (var i = 0; i < hearts.length; i++) {
            hearts[i].addEventListener('click', function () {
               var title = this.className.split(' ').slice(2).join(' ');
               ajaxFunctions.ajaxRequest('POST', appUrl + '/api/like/' + title.split('-').join(' '), updateLikes);
            });
         }
      });
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePics));

})();