'use strict';

(function () {

   var pics = document.querySelector('.grid');
   var currentUrl = window.location.href, apiUrl;
   
   //Facebook authentication attaches '#_=_' to the url, so the url is changed here manually to the original on Facebook authentication
   if (currentUrl === appUrl + '/#_=_') {
      window.location = '/';
   }
   
   //If the url doesn't contain a user id, we send a request to the server for all the pics, and otherwise, we get only the pics by that specific user
   if (currentUrl === appUrl + '/' || currentUrl === appUrl + '/#_=_') {
      apiUrl =  appUrl + '/api/pics';
   } else {
      apiUrl = appUrl + '/api/' + currentUrl.split('/')[3];
   }
   
   //call to the library for the grid-like view of the picture posts
   function masonryLoad () {
      var msnry = new Masonry(pics, {
         itemSelector: '.grid-item',
         fitWidth: true
      });
   }
   
   function heartIconClass (object, user) {
      //returns a filled or empty heart icon depending on whether the user has liked or unliked the post
      if (object.likes.indexOf(user.socialId) >= 0) {
         return "fa-heart l" + object._id;
      } else {
         return "fa-heart-o l" + object._id;
      }  
   }
   
   function updateLikes (data) {
      //updates the number of likes and the heart icon when a user click the icon
      var object = JSON.parse(data);
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + '/api/current-user', function (user) {
         var user = JSON.parse(user);
         var heartIcon = document.querySelector('i.l' + object._id); 
         var numOfLikes = document.querySelector('.l' + object._id + ' .likes-num');
         numOfLikes.innerHTML = object.likes.length;
         heartIcon.className = 'fa ' + heartIconClass(object, user);
      }));
   }
   
   function updatePics (data) {
      ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', appUrl + '/api/current-user', function (user) {
         var picsObject = JSON.parse(data);
         var counter = 0;
         var iconClass;
         if (user) {
            var user = JSON.parse(user);
         }
         picsObject.forEach(function(item) {
            //attach all the pictures that are received from the server side to the page one by one
            iconClass = user ? heartIconClass(item, user) : 'fa-heart-o l' + item._id;
            var newDiv = document.createElement("div");
            //the trash icon is visible for users on their own posts
            var trashVisibility = 'hidden';
            if (user && user.socialId === item.postedId) trashVisibility = 'visible'; 
            newDiv.className = 'grid-item';
            newDiv.innerHTML = '<img src="' + item.url + '" onerror="this.src = \'https://www.axure.com/c/attachments/forum/7-0-general-discussion/3919d1401387174-turn-placeholder-widget-into-image-maintain-interactions-screen-shot-2014-05-29-10.46.57-am.png\'" alt="' 
                                 + item.title + '"></img><div><h3 class="title">' 
                                 + item.title + '</h3><h5 class="posted">' + '<a href="' + appUrl + '/' + item.postedId + '">' 
                                 + item.posted + '</a>' + '</h5><h5 class="likes l' + item._id 
                                 + '"><i class="fa fa-trash-o trash-' + item._id + '" style="visibility:' + trashVisibility + '"></i><i class="fa ' + iconClass + '" aria-hidden="true"></i>' 
                                 + '<span class="likes-num">' + item.likes.length + '</span>' + '<h5></div>';
            pics.appendChild(newDiv);
            counter++;
            if (counter === picsObject.length) {
               //Multiple calls to the masonry library to make sure the pics are loaded properly and don't overlap with each other
               masonryLoad();
               var counter2 = 0;
               var interval = setInterval(function () {
                  masonryLoad();
                  counter2++;
                  if (counter2 === 20) {
                     clearInterval(interval);
                  }
               }, 400);
            }
         });  
         
         //delete the picture whenever the user clicks on the trash icon
         var trashes = document.querySelectorAll('.fa-trash-o');
         for (var i = 0; i < trashes.length; i++) {
            trashes[i].addEventListener('click', function () {
               var id = this.className.split(' ').slice(2).join(' ').split('-').slice(1).join(' ');
               ajaxFunctions.ajaxRequest('DELETE', appUrl + '/api/pic/' + id, function (data) {location.reload()});
            });
         }
         
         //like/unlike the picture whenever the user clicks on the heart icon
         var nonLiked = document.querySelectorAll('.fa-heart-o');
         var liked = document.querySelectorAll('.fa-heart');
         var hearts = [];
         hearts.push.apply(hearts, nonLiked);
         hearts.push.apply(hearts, liked);
         for (var i = 0; i < hearts.length; i++) {
            hearts[i].addEventListener('click', function () {
               var id = this.className.split(' ').slice(2).join(' ').slice(1);
               ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST', appUrl + '/api/like/' + id, updateLikes));
            });
         }
         
         document.querySelector('.my-pics').setAttribute('href', '/' + user.socialId);
      }));
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePics));

})();