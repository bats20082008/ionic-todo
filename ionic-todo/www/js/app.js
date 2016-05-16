// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('todo', ['ionic', 'todo.services'])

/*
.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (cordova.platformId === 'ios' && window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})
*/

.controller('TodoCtrl', function ($scope, $ionicModal, $ionicPopup, SQLservice) {

    SQLservice.setup();

    $scope.loadTask = function () {
        /*
        $scope.tasks = [
            { 'task_id': 1, 'task_name': 'task 1' },
            { 'task_id': 2, 'task_name': 'task 2' },
            { 'task_id': 3, 'task_name': 'task 3' }
        ]
        */
        SQLservice.all().then(function (results) {
            $scope.tasks = results;
        })
    }

    $scope.loadTask();

    $ionicModal.fromTemplateUrl('new-task.html', function (modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $scope.newTask = function () {
        $scope.taskModal.show();
    }

    $scope.closeNewTask = function () {
        $scope.taskModal.hide();
    }

    $scope.createTask = function (task) {
        //save task
        SQLservice.set(task.title);
        $scope.loadTask();
        $scope.taskModal.hide();
        task.title = '';
    }

    $scope.onItemDelete = function (taskid) {
        $ionicPopup.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this task?'
        }).then(function (res) {
            if (res) {
                //del task
                SQLservice.del(taskid);
                $scope.loadTask();
            }
        })
    }

    $scope.onItemEdit = function (taskid) {
        $ionicPopup.prompt({
            title: 'Update task',
            sunTitle: 'Enter new task'
        }).then(function (res) {
            //edit task
            SQLservice.edit(res, taskid);
            $scope.loadTask();
        })
    }

    $scope.moveItem = function (item, $fromIndex, $toIndex) {
        $scope.tasks.splice($fromIndex - 1, 1);
        $scope.tasks.splice($toIndex, 0, item);
    }
})