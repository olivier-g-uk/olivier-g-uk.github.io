
angular.module('ngWerewolf', ['ngMaterial'])

  .controller('cardCtrl', function($scope, $timeout) { 

    $scope.game_started = false;
    // Populate Random Card Sequence
    var request = new XMLHttpRequest();
    request.overrideMimeType("application/json");  
    request.open("GET", "ngWerewolf.json", true);
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var cards_load = JSON.parse(request.responseText);
                $scope.cards = [];
                for (i = 0; i < cards_load.length; i++) {
                  if (cards_load[i].playing) {
                    $scope.cards.push(cards_load[i]);
                  }
                }
                $scope.$apply();
            }
        }

    };
    request.send(null);

    var request2 = new XMLHttpRequest();
    request2.overrideMimeType("application/json"); 
    request2.open("GET", "ngWerewolfCharacters.json", true);
    request2.onreadystatechange = function() {
        if (request2.readyState === 4) {
            if (request2.status === 200) {
                $scope.characters = JSON.parse(request2.responseText);
                // $scope.newGame(cards);
                // console.log($scope.characters)
                $scope.$apply();
            }
        }
      
    };
    request2.send(null);

    $scope.shuffle = function(characters) {
      $scope.char_selection = [];
      var werewolf = [{"name":"Werewolf","picture":"img/werewolf.jpg","selected": true}];
      var villager = [{"name":"Villager","picture":"img/villager.jpg","selected": true}];
      var i;
      for (i = 0; i < characters.length; i++) {
        if (characters[i].selected) {
          $scope.char_selection.push(characters[i]);
        }
      }
      $scope.char_selection.push(werewolf[0]);
      $scope.char_selection.push(werewolf[0]);
      while ($scope.char_selection.length < $scope.cards.length) {
        $scope.char_selection.push(villager[0]);

      }
      // console.log($scope.char_selection)
      $scope.newGame();
    }

    $scope.select = function(card) {
      card.isFlipped = !card.isFlipped;
    }

    $scope.pick = function(card) {
      card.selected = !card.selected;
    }

    $scope.newGame = function() {
      cards = $scope.cards;
      $scope.cards = [];
      characters = $scope.char_selection.splice(0,cards.length);

      while (cards.length > 0) {
        var index = Math.floor(Math.random() * cards.length);
        var card = cards.splice(0,1)[0];
        var c = characters.splice(index,1)[0];
        if(card.playing) {
          card.character = c.name;
          card.isDead = false;
          card.img = c.picture;
          $scope.cards.push(card);
        }
      }
      console.log($scope.cards)
      $scope.game_started = true;
    }

    $scope.reset_cards = function(cards) {
      for (i = 0; i < cards.length; i++) {
        cards[i].isFlipped = false;
        cards[i].isDead = false;
      }
    }

    $scope.kill = function(card) {
      playAudio(card);
      card.isDead = true;
    }

    function playAudio(card) {
      var index = Math.floor(Math.random() * card.sound.length);
      console.log('Playing  kill sound number '+index);
      var audio = new Audio(card.sound[index]);
      audio.play();
    }

  });