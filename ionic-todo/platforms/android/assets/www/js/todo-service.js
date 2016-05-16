angular.module('todo.services', [])

.factory('SQLservice', function ($q) {
    var db;

    function createDB() {
        try{
            db = window.openDatabase("todoDB", 1.0, "ToDoApp", 10*1024*1024);
            db.transaction(function(tx){
                tx.executeSql("create table if not exists tasks (task_id integer not null primary key autoincrement, \
                task_name varchar(100))", []);
            })
        } catch (err) {
            alert('Error processing SQL: ' + err);
        }
    }

    function setTasks(tname) {
        return promiseQuery("insert into tasks (task_name) values('" + tname + "')", defaultResultHandler,
            defaultErrorHandler);
    }

    function delTasks(tid) {
        return promiseQuery("delete from tasks where task_id = " + tid, defaultResultHandler,
            defaultErrorHandler);
    }

    function updateTasks(tname, tid) {
        return promiseQuery("update tasks set task_name = '" + tname + "' where task_id = " + tid, defaultResultHandler,
            defaultErrorHandler);
    }

    function getTasks() {
        return promiseQuery("select * from tasks", defaultResultHandler,
            defaultErrorHandler);
    }

    function defaultResultHandler(deferred) {
        return function (tx, results) {
            var len = results.rows.length;
            var output_results = [];

            for (var i = 0; i < len; i++) {
                var t = { 'task_id': results.rows.item(i).task_id, 'task_name': results.rows.item(i).task_name };
                output_results.push(t);
            }
            deferred.resolve(output_results);
        }
    }

    function defaultErrorHandler(deferred) {
        return function (tx, results) {
            var len = 0;
            var output_results = '';
            deferred.resolve(output_results);
        }
    }

    function promiseQuery(query, successCB, errorCB) {
        var deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql(query, [], successCB(deferred), errorCB(deferred));
        }, errorCB);
        return deferred.promise;
    }

    return {
        setup: function () {
            return createDB();
        },
        set: function (t_name) {
            return setTasks(t_name);
        },
        del: function (taskid) {
            return delTasks(taskid);
        },
        edit: function (t_name, taskid) {
            return updateTasks(t_name, taskid);
        },
        all: function () {
            return getTasks();
        }
    }
})