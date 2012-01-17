/*
  A small script to print the names of all collections of all databases within
  a MongoDB server to stdout.

mongo --quiet getCollections.js

*/

var mongodb_conn = db.getMongo();
var admin_db = mongodb_conn.getDB("admin");


var role = "(MASTER)";
if (!admin_db.isMaster().ismaster) {
	mongodb_conn.setSlaveOk(true);
	role = "(SLAVE)";
}
var db_list = admin_db.runCommand("listDatabases").databases;
for (var db_index in db_list)  {
	var curr_db_name = db_list[db_index].name;
	var curr_coll_list = admin_db.getSiblingDB(curr_db_name).getCollectionNames();
	print(role + " " + curr_db_name + " " + curr_coll_list);
}

