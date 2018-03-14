
// main document ready function to check if dom is loaded fully or not


$( document ).ready(function() {
  //Function to show fb home-page
  function showHomePage() {
    $('body').css('background-color', '#475397');
    $("#fbHome").show();
    $("#output,#fbFeedInfo,#about,#work,#family,#contact,#goBackBtn").hide();

  }//Function ends here
  
  //Function to show fb profile info Page
  function showProfilePage() {
    $('body').css('background-color', '#FFF');
    $("#fbProfileInfo,#output,#about,#goBackBtn").show();
    $("#fbHome,#work,#family,#contact,#fbFeedInfo").hide();
  }//Function ends here
  
  //Function to show fb feed Page
  function showFeedPage() {
    $('body').css('background-color', '#FFF')
    $("#fbFeedInfo,#output,#goBackBtn").show();
    $("#fbProfileInfo,#fbHome").hide();
 
  }//Function end here
  
  
  showHomePage();//start call to function to show fb home page 

  //Function to show fb profile info on click of Get Fb Profile button on homepage 
  $("#fbProfileBtn").on('click', function () {

    showProfilePage();//call to show profile page

    //navigate to particular profile info

    //navigate to about info
    $("#navToAbout").on('click', function () {
      $("#about").show();
      $("#work,#family,#contact").hide();
    })//end about info

    //navigate to work info
    $("#navToWork").on('click', function () {
      $("#work").show();
      $("#about,#family,#contact").hide();
    })//end work info

    //navigate to family info
    $("#navToFamily").on('click', function () {
      $("#family").show();
      $("#about,#work,#contact").hide();
    })//end family info

    //navigate to contact info
    $("#navToContact").on('click', function () {
      $("#contact").show();
      $("#about,#work,#family").hide();
    })//end contact info



    var myFacebookToken = $("#api").val(); //store user enterd api token from homepage 
    //ajax request to get fb data
    $.ajax('https://graph.facebook.com/me?fields=picture.width(150).height(150),id,name,first_name,last_name,birthday,about,hometown,languages,gender,education,work,relationship_status,quotes,family,website,email,cover.width(815).height(320)&access_token=' + myFacebookToken, {

      success: function (response) {
        console.log(response);

        // Cover photo
        $(".myCoverPic").attr("src", "" + response.cover.source + "");

        // Profile photo
        $(".myProfilePic").attr("src", "" + response.picture.data.url + "");

        //About me Section
        $("#myFirstName").text(response.first_name);
        $("#myLastName").text(response.last_name);
        $("#myFullName").text(response.name);
        $("#myProfileId").html('<a target="blank" href="https://facebook.com/' + response.id + '">' + response.id + '</a>');
        $("#myGender").text(response.gender);
        $("#myBirthday").text(response.birthday);
        var myLanguage = $.map(response.languages, function (index) {
          return index.name;
        });
        $("#myLanguages").text(myLanguage);
        $("#myHometown").text(response.hometown.name);
        $("#myQuotes").text(response.quotes);
        
        // Work and Education  
        var work = response.work;
        var myWork = $.map(work, function (index) {
          return index.employer.name;
        });
        $("#myWork").text(myWork);

        var education = response.education;
        var myEducation = $.map(education, function (index) {
          return (index.type + ":" + index.school.name);
        });
        $("#myEducation").text(myEducation);

        // Family and Relationship
        $("#myRelationship").html(response.relationship_status);
        var family = response.family;
        var myFamily = $.map(family, function (index) {
          return index.name;
        });
        $("#myFamily").text(myFamily);

        //Contact
        $("#myEmail").text(response.email);
        $("#myWebsite").html(response.website);


      }, // end of success      

      //error handling
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error.message + " Please refresh the page and Enter valid API token");
      },
    });//end ajax call 
  });// end function get fb profile btn info


  //Function to show fb posts feed on click of Get Fb Posts Feed button on homepage  
  $("#fbFeedBtn").on('click', function () {
    
    showFeedPage();//call to show fb feed page


    var myFacebookToken = $("#api").val();//store the api token from homepage
    //ajax request to get fb data
    $.ajax('https://graph.facebook.com/me?fields=posts{created_time,type,full_picture,story,message,source,likes.limit(1).summary(true),comments.limit(1).summary(true)},picture.width(250).height(250),cover,name&access_token=' + myFacebookToken, {

      success: function (response) {
      
        $("#fbFeedInfo").html('<div></div>');//clear the data when user makes consecutive requests
      


        // Cover photo
        $(".myCoverPic").attr("src", "" + response.cover.source + "");

        // Profile photo
        $(".myProfilePic").attr("src", "" + response.picture.data.url + "");


        var feeds = response.posts.data;//store the fb posts data array
        
        console.log(feeds);

        //map function to loop through the posts data
        $.map(feeds, function (value, index) {
          var post = feeds[index];
         
         
          
          //switch case to call particular posts function based on fb posts type
          switch (post.type) {
            case 'status': {
              var likesCount = post.likes.summary.total_count;
              var commentsCount = post.comments.summary.total_count;
              createStatusPost(post.message,likesCount,commentsCount);
            }
              break;
            case 'photo':{ 
              var likesCount = post.likes.summary.total_count;
              var commentsCount = post.comments.summary.total_count;
              createPhotoPost(post.story, post.full_picture,likesCount,commentsCount);
            } 
              break;
            case 'link': createLinkPost(post.story);
              break;
            case 'video':{
              var likesCount = post.likes.summary.total_count;
              var commentsCount = post.comments.summary.total_count;
              createVideoPost(post.story, post.source,likesCount,commentsCount);
            } 
              break;
          }
           
        });
        
        //function to create photo post
        function createPhotoPost(story, full_picture,likesCount,commentsCount) {
          var sectionStart = '<section id="photo" class="post1"><div class="story">' + story + '</div>';
          var pictureURL = '<div class="picture" style="background-image:url(' + full_picture + ')"></div>';
          var likeSection = '<div class="likeCommentContainer"><a href="#" class="likeBox">Likes<span class="badge">'+likesCount+'';
          var commentSection = '</span></a><a href="#" class="commentBox">Comment<span class="badge">'+commentsCount+'';
          var sectionEnd = '</span></a></div></section>';
          var postElement = sectionStart + pictureURL + likeSection + commentSection + sectionEnd;
          $("#fbFeedInfo").append(postElement);

        }

        //function to create status post
        function createStatusPost(message,likesCount,commentsCount) {
          var sectionStart = '<section id="status" class="post2">';
          var postMessage = '<div class="story">' + response.name + ':<a class="postMessage">' + message + '</a></div>';
          var likeSection = '<div class="likeCommentContainer"><a href="#" class="likeBox">Likes<span class="badge">'+likesCount+'';
          var commentSection = '</span></a><a href="#" class="commentBox">Comment<span class="badge">'+commentsCount+'';
          var sectionEnd = '</span></a></div></section>';
          var postElement = sectionStart + postMessage + likeSection + commentSection + sectionEnd;
          $('#fbFeedInfo').append(postElement);
        }

        //function to create video post
        function createVideoPost(story,source,likesCount,commentsCount) {
         
          var sectionStart = '<section id="video" class="post1">';
          var postStory = '<div class='+story+'>' + story + '</div>';
          var postVideo =  '<div><video controls> <source  src='+source+' type= "video/mp4"></video></div>';
          var likeSection = '<div class="likeCommentContainer"><a href="#" class="likeBox">Likes<span class="badge">'+likesCount+'';
          var commentSection = '</span></a><a href="#" class="commentBox">Comment<span class="badge">'+commentsCount+'</section>';
          var postElement = sectionStart + postStory + postVideo;
          $("#fbFeedInfo").append(postElement);
        }

        //function to create link post
        function createLinkPost(story) {
          var sectionStart = '<section id="link" class="post2">';
          var postLink = '<div class="story">' + story + '</div>';
          var postElement = sectionStart + postLink;
          $("#fbFeedInfo").append(postElement);
        }
     
      }, // end of success  
      //error handling
      error: function (jqXHR) {
        alert(jqXHR.responseJSON.error.message + " Please refresh the page and Enter valid API token");
      },
    })//end ajax call 
  });// end get fb feed btn info	

  //Function for Go to homepage btn
  $("#goBackBtn").on("click", function () {
    showHomePage();// call to function to show fb home page  
  });// end go back btn 

})

