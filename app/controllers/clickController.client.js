'use strict';

(function () {

   var pics = document.querySelector('.grid');
   var currentUrl = window.location.href, apiUrl;
   
   if (currentUrl === appUrl + '/' || currentUrl === appUrl + '/login') {
      apiUrl =  appUrl + '/api/pics';
   } else {
      apiUrl = appUrl + '/api/' + currentUrl.split('/')[3];
   }
   
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
            var trashVisibility = 'hidden';
            if (user && user.displayName === item.posted) trashVisibility = 'visible'; 
            newDiv.className = 'grid-item';
            newDiv.innerHTML = '<img src="' + item.url + '" onerror="this.src = \'https://www.axure.com/c/attachments/forum/7-0-general-discussion/3919d1401387174-turn-placeholder-widget-into-image-maintain-interactions-screen-shot-2014-05-29-10.46.57-am.png\'" alt="' 
                                 + item.title + '"></img><div><h3 class="title">' 
                                 + item.title + '</h3><h5 class="posted">' + '<a href="' + appUrl + '/' + item.posted + '">' 
                                 + item.posted + '</a>' + '</h5><h5 class="likes ' + item.title.split(' ').join('-') 
                                 +'"><i class="fa fa-trash-o trash-' + item.title.split(' ').join('-') + '" style="visibility:' + trashVisibility + '"></i><i class="fa ' + iconClass + '" aria-hidden="true"></i>' 
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
         
         document.querySelector('.my-pics').setAttribute('href', '/' + user.displayName);
         
         var trashes = document.querySelectorAll('.fa-trash-o');
         for (var i = 0; i < trashes.length; i++) {
            trashes[i].addEventListener('click', function () {
               var title = this.className.split(' ').slice(2).join(' ').split('-').slice(1).join(' ');
               ajaxFunctions.ajaxRequest('DELETE', appUrl + '/api/pic/' + title, function (data) {location.reload()});
            });
         }
         
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