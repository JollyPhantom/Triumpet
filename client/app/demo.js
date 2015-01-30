var url = 'http://localhost:8080';

var demoRetailer = {
	"username"    : "abcstore1",
	"password"    : "abcstore1", 
	"description" : "Small Grocery Shop",
	"name"        : "ABC Store", 
	"phoneNumber" : "415-765-4321", 
	"address"     : "123 4th St, Oakland, CA 94321",
  "floorPlan"   : [
									  {"x" : 0  , "y" : 0 },
									  {"x" : 30 , "y" : 0 }, 	
									  {"x" : 30 , "y" : 20}, 	
									  {"x" : 0  , "y" : 20} 
									],
	"shelves"     : [
										{ 	"x" : 0 , 	"y" : 0 , 	"width" : 2 , 	"height" : 15}, 	
										{ 	"x" : 2 , 	"y" : 0 , 	"width" : 26, 	"height" : 2 }, 	
										{ 	"x" : 28,   "y" : 0 , 	"width" : 2 , 	"height" : 15}, 	
										{ 	"x" : 8 ,   "y" : 5 , 	"width" : 2 , 	"height" : 8 }, 	
										{ 	"x" : 10,   "y" : 5 , 	"width" : 2 , 	"height" : 8 }, 	
										{ 	"x" : 4 , 	"y" : 18, 	"width" : 22, 	"height" : 2 }, 
										{ 	"x" : 19, 	"y" : 5 , 	"width" : 2 , 	"height" : 8 },
										{ 	"x" : 21, 	"y" : 5 , 	"width" : 2 , 	"height" : 8 } 
									]
};

var Item = function(name, category, coordinates){
	this.name = name;
	this.category = category;
	this.coordinates = [coordinates];
};

var item1 = new Item('apple', 'fruit', {x:10,y:10});
var item2 = new Item('apple sauce', 'canned fruit', {x:20, y:20});
var item3 = new Item('apple pie', 'baked goods', {x:30, y:30});
var item4 = new Item('rotten apple bits', 'rotten goodies', {x:40, y:40});

var items = [item1, item2, item3, item4];

// items already written to local database, so don't need to do this unless
// i delete the local db server  
// items.forEach(function(item){
// 	console.log(item);
// 	createItem(item);
// });

function createItem(item){
	$.ajax({
		url: url + '/api/items/retailer',
		type: 'POST',
		data: item
	});
};


// $.ajax({
// 	url: 'http://localhost:8080/api/retailers/abcstore1',
// 	type: 'DELETE',
// 	success: function(){
// 		createRetailer();
// 	},
// 	error: function(e){
// 		console.log('error trying to delete abcstore1');
// 	}
// });

//

// function createRetailer(){ 
// 	$.ajax({
// 		url:'http://localhost:8080/api/retailers/signup',
// 		type:'POST',
// 		data:demoRetailer, 
// 		success: function(data){
// 			console.log('data from signing up new retailer', data);
// 			getRetailerData();
// 		},
// 		error: function(e){
// 			console.log('error attempting to add new retailer to database', e);
// 		}
// 	});
// };

// // do I need to chain all these ajax calls since they are are async and depend on eachother?
// function getRetailerData(){
// 	$.ajax({
// 		url: 'http://localhost:8080/api/retailers/abcstore1',
// 		type: 'GET',
// 		success: function(data){
// 			console.log('retailer data with retailer id', data);
// 			getRetailerItems();
// 		},
// 		error: function(e){
// 			console.log('error attempgint to fetch retailer id', e);
// 		}
// 	});
// };

// // make ajax call to retrieve items
// function getRetailerItems(){
// 	$.ajax({
// 		url: 'http://localhost:8080/api/items/abcstore1',
// 		type: 'GET',
// 		success: function(data){
// 			console.log('item data', data);
// 		},
// 		error: function(e){
// 			console.log('error attempting to fetch items for retailer', e);
// 		}
// 	});
// };
