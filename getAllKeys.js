/*
  A small script to print the names of all properties of the documents within
  all collections of all databases within a MongoDB server to stdout. Uses
  MapReduce.

mongo --quiet getAllKeys.js

*/



var mongodb_conn = db.getMongo();
var admin_db = mongodb_conn.getDB("admin");

var role = "(MASTER)";
if (!admin_db.isMaster().ismaster) {
	mongodb_conn.setSlaveOk(true);
	role = "(SLAVE)";
}
var db_list = admin_db.runCommand("listDatabases").databases;
for (var db_index in db_list) {
	var curr_db_name = db_list[db_index].name;
	var curr_db = admin_db.getSiblingDB(curr_db_name);
	var curr_coll_list = curr_db.getCollectionNames();
	for (var coll_idx in curr_coll_list) {
		var mapred = curr_db.runCommand({"mapreduce" : curr_coll_list[coll_idx], "map" : function() { for (var key in this) { emit(key, null); } }, "reduce" : function(key, anything) { return null; }, "out" : "myoutput" });
		var key_list = curr_db.myoutput.distinct("_id");
		for (var key_idx in key_list) {
			print(role + " " + curr_db_name + " " + curr_coll_list[coll_idx] + " " + key_list[key_idx]);
		}
		curr_db.myoutput.drop();
	}
}

