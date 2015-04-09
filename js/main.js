var occasionList = document.getElementById("occasion-list");
var peopleList = document.getElementById("people-list");
var occasionGift = document.getElementById("gifts-for-occasion");
var peopleGift = document.getElementById("gifts-for-person");
var modals = document.querySelectorAll("[data-role=modal]");
var db = null;

document.addEventListener("DOMContentLoaded", onDeviceReady, false);
//document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	addHammerEventListener();
	addHammerEventListenerSwipe();
	buttonHandler();
	
	db = openDatabase("myDB", "1.0", "DataApp storage", 1024*1024);
	checkDB();
	displayDB();
	populatePeople();
	//document.addEventListener("scroll", handleScrolling, false);
}

function checkDB(){
	db.transaction(function(tx){
		tx.executeSql('CREATE TABLE IF NOT EXISTS people(person_id INTEGER PRIMARY KEY, person_name VARCHAR)');
		tx.executeSql('INSERT INTO people(person_id, person_name)VALUES (6, "Monkey")');
		tx.executeSql('CREATE TABLE IF NOT EXISTS occasions(occ_id INTEGER unique, occ_name VARCHAR)');
		tx.executeSql('CREATE TABLE IF NOT EXISTS gifts(gift_id INTEGER unique, person_id INTEGER, occ_id INTEGER, gift_idea VARCHAR, purchased BOOLEAN)');
		});	
}

function displayDB(){		
	//print out people
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM people', [], function(tx, results){
			console.log(tx);
			var ul = document.querySelectorAll("[data-role=listview]");
			for (var i = 0; i < results.rows.length; i++){
				var msg = "<li>"+results.rows.item(i).person_id+results.rows.item(i).person_name+"</li>";
				ul[0].innerHTML += msg;	
			}
			});
		});
	//print out occasions
	db.transaction(function(tx){
		tx.executeSql('SELECT * FROM occasions', [], function(tx, results){
			var ul = document.querySelectorAll("[data-role=listview]");
			for (var i = 0; i < results.rows.length; i++){
				var msg = "<li>"+results.rows.item(i).occ_id+results.rows.item(i).occ_name+"</li>";
				ul[1].innerHTML += msg;	
			}
			});
		});
}


function addHammerEventListener(ev){
	var tar = document.querySelectorAll("[data-role=listview]");
	var mcOne = new Hammer(tar[0], {});
	var mcTwo = new Hammer(tar[1], {});
	var mcThree = new Hammer(tar[2], {});
	var mcFour = new Hammer(tar[3], {});
	
	var singleTap = new Hammer.Tap({event: 'tap'});
	var doubleTap = new Hammer.Tap({event:'doubletap', taps:2, threshold:10, posThreshold:25});
	
	mcOne.add([doubleTap, singleTap]);
	mcTwo.add([doubleTap, singleTap]);
	mcThree.add([doubleTap, singleTap]);
	mcFour.add([doubleTap, singleTap]);
	doubleTap.requireFailure(singleTap);
	
	mcFour.on("tap", function(ev){
		if(ev.target.parentNode.parentNode.getAttribute("id") == "people-list"){
			alert("single tap one");
			console.log(tar);
			document.getElementById("gifts-for-person").style.display = "block";
			document.getElementById("gifts-for-occasion").style.display = "none";
		}
		else if(ev.target.parentNode.parentNode.getAttribute("id") == "occasion-list"){
			alert("single tap two");
			document.getElementById("gifts-for-person").style.display = "none";
			document.getElementById("gifts-for-occasion").style.display = "block";
		}
	});
	
	mcFour.on("doubletap", function(ev){
		alert("doubled");
		console.log(ev);
		console.log(ev.target);
		clearData();
	});
}


function addHammerEventListenerSwipe(ev){
	var tar = document.querySelectorAll("[data-role=page]");
	var mcOne = new Hammer(tar[0], {});
	var mcTwo = new Hammer(tar[1], {});
	var mcThree = new Hammer(tar[2], {});
	var mcFour = new Hammer(tar[3], {});

	mcOne.on("swipe", function(ev){
		alert("swipe on");
		console.log(tar[0])
		console.log(ev.target)
		peopleList.style.display = "none";
		occasionList.style.display = "block";
	});
	mcTwo.on("swipe", function(ev){
		alert("swipe two");
		console.log(tar[0])
		console.log(ev.target)
		peopleList.style.display = "block";
		occasionList.style.display = "none";
	});
	mcThree.on("swipe", function(ev){
		alert("swipe three");
		peopleGift.style.display = "none";
		peopleList.style.display = "block";
	});
	mcFour.on("swipe", function(ev){
		alert("swipe four");
		occasionGift.style.display = "none";
		occasionList.style.display = "block";
	});
}

function buttonHandler(ev){
	//handle Cancel buttons
	var btnCancel = document.querySelectorAll(".btnCancel");
		for (var i = 0; i < btnCancel.length; i++){
			btnCancel[i].addEventListener("click", closeModal);
	}
	//handle Add buttons
	var btnAdd = document.querySelectorAll(".btnAdd");
	btnAdd[0].addEventListener("click", openModalOne);
	btnAdd[1].addEventListener("click", openModalTwo);
	btnAdd[2].addEventListener("click", openModalThree);
	btnAdd[3].addEventListener("click", openModalThree);
}

function openModalOne(ev){
	modals[0].style.display = "block";
	document.querySelector("[data-role=overlay]").style.display = "block";
}

function openModalTwo(ev){
	modals[1].style.display = "block";
	document.querySelector("[data-role=overlay]").style.display = "block";
}

function openModalThree(ev){
	modals[2].style.display = "block";
	document.querySelector("[data-role=overlay]").style.display = "block";
}

function closeModal(ev){
	modals[0].style.display = "none";
	modals[1].style.display = "none";
	modals[2].style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
}

function clearData(ev){
	db.transaction(function(tx){
		tx.executeSql('DELETE FROM people');
});
}

function populatePeople(){
	var btnSave = document.querySelectorAll(".btnSave");
	btnSave[0].addEventListener("click", function(ev){
		ev.preventDefault();
		var newPerson= document.getElementById("new-per").value;
		console.log(newPerson);
		if(newPerson !== ""){
			db.transaction(function(t){
				alert("im in");
				t.executeSql('INSERT INTO people(person_id, person_name)VALUES (1, "Pop")');
				t.executeSql('INSERT INTO people(person_name)VALUES (?)', [newPerson]);
				closeModal();	
			});
		}
		else{
			alert("name is required");
		}
	});			
}
