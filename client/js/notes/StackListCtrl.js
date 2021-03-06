'use strict';
angular.module('oto')
.controller('StackListCtrl', ['$scope', '$filter', 'Stacks', 'Cards', function ($scope, $filter, Stacks, Cards) {
   $scope.stackActionError = false;
   $scope.stackActionErrorMsg = '';

   //Stack size badges
   $scope.stackSizes = {};
   $scope.$watch('[cards, stacks]', function() {
      jQuery.each($scope.stacks, function(i, stack) {
         var count = 0;
         jQuery.each($scope.cards, function(i, card) {
            if (card.stackid === stack._id && !card.archivedat) {
               count++;
            }
         });
         $scope.stackSizes[stack._id] = count;
         //TODO: it works, but perfomrance? optimize the counting?, put broadcast on actions that could change this?
      });
   }, true);

   //css for active stack
   $scope.stackIsActive = function(stacktitle) {
      return stacktitle == $scope.activestack.title ? true : false;
   };

   $scope.stackIsEditable = function() {
      if (
            $scope.$parent.activestack.title == 'Floating' ||
            $scope.$parent.activestack.title == 'Archive' ||
            $scope.$parent.activestack.title == 'All'
          ) {
             return true;
          } else {
            return false;
          }
   };

   //stacks actions
   $scope.startAddStack = function() {
      $scope.addStackInput = '';
      $scope.isVisibleStackAdd = true;
   };
   $scope.startRenameStack = function(stack) {
      $scope.renameStackInput = '';
      $scope.isVisibleStackAdd = false;
      $scope.isVisibleStackRename = true;
      $scope.isVisibleStackDelete = false;
      $scope.stackToRename = stack;
   };
   $scope.startDeleteStack = function(stack) {
      $scope.isVisibleStackAdd = false;
      $scope.isVisibleStackRename = false;
      $scope.isVisibleStackDelete = true;
      $scope.stackToDelete = stack;
   };

   $scope.addStack = function() {
      Stacks.add(
         $scope.addStackInput,
         function(stack) {
            $scope.stacks.push(stack);
            $scope.isVisibleStackAdd = false;
            $scope.stackSizes[stack._id] = 0; //no need for a $watch on stacks here
         },
         function(response) {
            if (response.code == 11000) {
               $scope.stackActionError = true;
               $scope.stackActionErrorMsg = 'Stack with that title already exists';
            }
         }
      );
   };

   $scope.renameStack = function() {
      Stacks.rename(
         $scope.stackToRename._id,
         $scope.renameStackInput,
         function(renamedStack) {
            $scope.stacks[$scope.stacks.indexOf($scope.stackToRename)] = renamedStack;
            $scope.isVisibleStackRename = false;
            if ($scope.$parent.activestack._id == renamedStack._id) {
               $scope.$parent.activestack.title = renamedStack.title;
            }
            Stacks.activeStack = renamedStack;
         },
         function(response) {
         if (response.code == 11000) {
            $scope.stackActionError = true;
            $scope.stackActionErrorMsg = 'Stack with that title already exists';
         }
      });
   };

   $scope.deleteStack = function() {
      //First archive cards in stack
      var cardsInStack = $filter('filter')($scope.cards, {stackid:$scope.stackToDelete._id});
      jQuery.each(cardsInStack, function(i, card) {
         Cards.archive(
            card._id,
            $scope.stackToDelete.title,
            function(updatedCard) {
               var filtered = $filter('filter')($scope.cards, {id : updatedCard._id});
               $scope.cards[$scope.cards.indexOf(filtered[0])] = angular.copy(updatedCard);
            },
            function(error) {
               console.log(error);
            }
         );
      });

      Stacks.remove(
         $scope.stackToDelete._id,
         function() {
            $scope.stacks.splice($scope.stacks.indexOf($scope.stackToDelete), 1);
            $scope.isVisibleStackDelete = false;
            if ($scope.$parent.activestack._id == $scope.stackToDelete._id) {
               $scope.listStackUser($scope.$parent.floatingStack);
            }
         },
         function(error) {
            console.log(error);
         }
      );
   };

   //Filter cardsview by active stack
   $scope.listStackUser = function(stack) {
      Cards.setActiveCard(null);
      $scope.$parent.search = stack._id;
      $scope.$parent.activestack = stack;
       Stacks.activeStack = stack;
   };

   $scope.listStackAll = function() {
      Cards.setActiveCard(null);
      $scope.$parent.search = null;
      $scope.$parent.activestack = {
         'owner':null,
         'title':'All',
         '_id': null
      };
      Stacks.activeStack = {
         'owner':null,
         'title':'All',
         '_id': null
      };
   };
   $scope.listStackArchive = function() {
      Cards.setActiveCard(null);
      $scope.$parent.search = "archive";
      $scope.$parent.activestack = {
         'title':'Archive',
         '_id':'archive'
      };
      Stacks.activeStack = {
         'title':'Archive',
         '_id':'archive'
      };
   };

}]);

