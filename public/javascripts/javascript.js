(function() {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');
      userTopTracksSource = document.getElementById('top-tracks-template').innerHTML,
      userTopTracksTemplate = Handlebars.compile(userTopTracksSource),
      userTopTracksPlaceholder = document.getElementById('top-tracks');
  var oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');
  var params = getHashParams();
  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;
  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });
      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);
            $('#login').hide();
            $('#loggedin').show();
          }
      });

      $.ajax({
          url: 'https://api.spotify.com/v1/me/top/tracks',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            var songs = response.items;
            var albums = response.items.album

            for (var i = 0; i < songs.length; i++) {
              $(userTopTracksPlaceholder).append(userTopTracksTemplate(songs[i]))
            }
          },
      });

      var audioObject;

      $('#top-tracks').on('click', '.song-preview',function(event){
          event.preventDefault();
          var self = $(this)
          if (self.hasClass('playing')) {
            audioObject.pause();
            self.removeClass('playing')
          } else {
            audioObject = new Audio(self.data('song-url'));
            audioObject.play();
            self.addClass('playing')
          }
      });

    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }


    // $('create-playlist').addEventListener('click', function(event){
    //   event.preventDefault();
    //   $.ajax({
    //     url: 'https://api.spotify.com/v1/me/playlists',
    //     method: 'post'
    //   })
    // })



    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
      });
    }, false);
  }
})();







   var eventSearch = function(req, res) {
      request("http://api.jambase.com/events?zipCode=95128&radius=50&page=0&api_key=gy7rjt66uh2d6qedy36nph5f")
    }

    var jamBase = require('node-jambase')
    var client = new jamBase(gy7rjt66uh2d6qedy36nph5f)
    var today = new Date().toISOString();
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);
    endDate = endDate.toISOString();











