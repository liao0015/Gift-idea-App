
var occasionList = document.getElementById("occasion-list");
var peopleList = document.getElementById("people-list");
var occasionGift = document.getElementById("gifts-for-occasion");
var peopleGift = document.getElementById("gifts-for-person");
var modals = document.querySelectorAll("[data-role=modal]");
var btnSave = document.querySelectorAll(".btnSave");
var db = null;

document.addEventListener("DOMContentLoaded", onDeviceReady, false);
//document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	checkDB();
}

function checkDB(){
    db = openDatabase('Rho', '', 'DataApp Rho', 1024*1024);
    if(db.version == ''){
        console.info('First time running... create tables'); 
        db.changeVersion('', '1.0',
                function(trans){
                    console.info("DB version incremented");
                    trans.executeSql('CREATE TABLE stuff(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)', [], 
                                    function(tx, rs){
                                        console.info("Table stuff created");
                                    },
                                    function(tx, err){
                                        console.info( err.message);
                                    });
                    trans.executeSql('CREATE TABLE occasions(occ_id INTEGER PRIMARY KEY AUTOINCREMENT, occ_name TEXT)', [], 
                                    function(tx, rs){
                                        console.info("Table occasion created");
                                    },
                                    function(tx, err){
                                        console.info( err.message);
                                    });
					trans.executeSql('CREATE TABLE gifts(gift_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, occ_id INTEGER, gift_idea TEXT, purchased INTEGER)', [], 
									function(tx, rs){
										console.info("Table gifts created");
									},
									function(tx, err){
										console.info( err.message);
									});
                },
                function(err){
                    console.info( "error:"+err.message);
                },
                function(){
                    console.info("successfully completed the transaction of incrementing the version number");  
                });
        addNavHandlers();
    }else{
		
		//save new person input into table people
		btnSave[0].addEventListener("click", function(){
			var newName = document.getElementById("new-per").value;
			console.log("user input: "+newName);
			if(newName !== ""){
				db.transaction(function(tx){
					tx.executeSql('INSERT INTO stuff(name)VALUES (?)',[newName]);
				});
				closeModal();
				displayPeople();
			}
			else{alert("Please enter a new name");}
		});
		
		//save new occasion input into table occasions
		btnSave[1].addEventListener("click", function(){
			var newOcc = document.getElementById("new-occ").value;
			console.log("user input: "+newOcc);
			if(newOcc !== ""){
				db.transaction(function(tx){
					tx.executeSql('INSERT INTO occasions(occ_name)VALUES (?)',[newOcc]);
				});
				closeModal();
				displayOccasions();
			}
			else{alert("Please enter a new occasion");}
		});
		//save new occasion input into table gifts
		/*btnSave[2].addEventListener("click", function(){
			var newGift = document.getElementById("new-idea-person").value;
			var personId=9;
			var occasionId=9;
			var purchased=1;
			console.log("user input: "+newGift);
			if(newGift !== ""){
				db.transaction(function(tx){
					//tx.executeSql('SELECT g.purchased, g.gift_id, g.gift_idea, o.occ_name FROM gift AS g WHERE JOIN occasions AS o ON o.occ_id = g.occ_id WHERE g.person_id = ? ORDER BY o.occ_name, g.gift_idea');
					tx.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea, purchased)VALUES (?,?,?,?)',[personId, occasionId, newGift, purchased]);
				});
				closeModal();
				displayPersonGifts();
			}
			else{alert("Please enter a new gift idea");}
		});*/
		//save new occasion input into table gifts
		/*btnSave[3].addEventListener("click", function(){
			var newGift = document.getElementById("new-idea-occasion").value;
			var personId=8;
			var occasionId=8;
			var purchased=1;
			console.log("user input: "+newGift);
			if(newGift !== ""){
				db.transaction(function(tx){
					tx.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea, purchased)VALUES (?,?,?,?)',[personId, occasionId, newGift, purchased]);
				});
				closeModal();
				displayOccasionGifts();
			}
			else{alert("Please enter a new gift idea");}
		});
*/		
		//display the version and add event handlers
        console.info('Version: ', db.version)   
        addNavHandlers();
    }
}

function addNavHandlers(){
    addHammerEventListener();
	addHammerEventListenerSwipe();
	buttonHandler();
    console.info("Adding nav handlers");
    displayPeople();
	displayOccasions();
	displayOccasionGifts();
	//displayOccasionGifts();
}

function displayPeople() {
    db.transaction(function(trans){
        trans.executeSql('SELECT * FROM stuff', [], 
            function(tx, rs){
                console.info("success on getting access to database stuff");
                var output = document.querySelectorAll("[data-role=listview]");
				var optOutput = document.getElementById("list-per");
				output[0].innerHTML = "";
				optOutput.innerHTML = "";
				for (var i = 0; i < rs.rows.length; i++){
					output[0].innerHTML += "<li data-ref="+i+">"+rs.rows.item(i).name+"</li>";
					optOutput.innerHTML +="<option data-ref="+i+">"+rs.rows.item(i).name +"</option>";
					console.info("Display items from database stuff");
				}
            }, 
            function(tx, err){
                console.info( "error: "+err.message);
            });    
    }, transErr, transSuccess);	
}

function displayOccasions() {
    db.transaction(function(trans){
        trans.executeSql('SELECT * FROM occasions', [], 
            function(tx, rs){
                console.info("success on getting access to database occasions");
                var output = document.querySelectorAll("[data-role=listview]");
				var optOutput = document.getElementById("list-occ");
				output[1].innerHTML = "";
				optOutput.innerHTML = "";
				for (var i = 0; i < rs.rows.length; i++){
					output[1].innerHTML += "<li data-ref="+i+">"+rs.rows.item(i).occ_name+"</li>";
					optOutput.innerHTML +="<option data-ref="+i+">"+rs.rows.item(i).occ_name +"</option>";
					console.info("Display items from database occasions");
				}
            }, 
            function(tx, err){
                console.info( "error: "+err.message);
            });    
    }, transErr, transSuccess);	
}

function displayOccasionGifts(){
	db.transaction(function(trans){
        trans.executeSql('SELECT * FROM gifts WHERE occ_id = 0', [], 
            function(tx, rs){
                console.info("success on getting access to database gifts");
                var output = document.querySelectorAll("[data-role=listview]");
				output[3].innerHTML = "";
				for (var i = 0; i < rs.rows.length; i++){
					output[3].innerHTML += "<li data-ref="+i+">"+rs.rows.item(i).gift_idea+"</li>";
					console.info("Display items from database gifts");
				}
            }, 
            function(tx, err){
                console.info( "error: "+err.message);
            });    
    }, transErr, transSuccess);
}

/*function displayOccasionGifts(occId){
	console.log("ohmy");
	db.transaction(function(trans){
        trans.executeSql('SELECT g.purchased, g.gift_id, g.gift_idea, o.occ_name FROM gifts AS g WHERE JOIN occasions AS o ON o.occ_id = g.occ_id WHERE g.person_id = ? ORDER BY o.occ_name, g.gift_idea', [occId], 
            function(tx, rs){
                console.info("success on getting access to database gifts");
                var output = document.querySelectorAll("[data-role=listview]");
				output[2].innerHTML = "";
				for (var i = 0; i < rs.rows.length; i++){
					output[2].innerHTML += "<li data-ref="+i+">"+rs.rows.item(i).gift_name+"</li>";
					console.info("Display items from database gifts");
				}
            }, 
            function(tx, err){
                console.info( "error: "+err.message);
            });    
    }, transErr, transSuccess);
}*/

function transErr(tx, err){
    console.info("Error processing transaction: " + err);
}

function transSuccess(){
	console.info("successful, the end");
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
			console.log(ev);
			console.log(ev.target);
			document.getElementById("gifts-for-person").style.display = "block";
			document.getElementById("gifts-for-occasion").style.display = "none";
			showName(ev.target);
		}
		else if(ev.target.parentNode.parentNode.getAttribute("id") == "occasion-list"){
			alert("single tap two");
			document.getElementById("gifts-for-person").style.display = "none";
			document.getElementById("gifts-for-occasion").style.display = "block";
			showOccasion(ev.target);
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
	btnAdd[2].addEventListener("click", openModalFour);
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

function openModalFour(ev){
	modals[3].style.display = "block";
	document.querySelector("[data-role=overlay]").style.display = "block";
}

function closeModal(ev){
	modals[0].style.display = "none";
	modals[1].style.display = "none";
	modals[2].style.display = "none";
	modals[3].style.display = "none";
	document.querySelector("[data-role=overlay]").style.display = "none";
}

function clearData(ev){
	db.transaction(function(tx){
		tx.executeSql('DELETE FROM stuff');
});
}

function showName(ev){
	/*This is another way to achieve this
	console.log(ev.parentNode.childNodes);
	var indexNum = ev.getAttribute("data-ref");
	var arr = ev.parentNode.childNodes[indexNum].innerHTML;
	var span = document.getElementById("thePerson");
	span.innerHTML = arr;*/
	
	//obtain person_id or occasion_id from data-ref index
	var indexNum = ev.getAttribute("data-ref");
	++indexNum;//an error was showing that indexNum is not a number, so I did this...
	--indexNum;
	console.log(indexNum+" being generated");
	db.transaction(function(trans){
        trans.executeSql('SELECT * FROM stuff', [], 
            function(tx, rs){
                var span = document.getElementById("thePerson");
				var spam = document.getElementById("nowPerson");
				span.innerHTML = rs.rows.item(indexNum).name;
				spam.innerHTML = rs.rows.item(indexNum).name;
            }, 
            function(tx, err){
                console.info( "error: "+err.message);
            });    
    }, transErr, transSuccess);	
	
	//obtain occasion_id from option list
	var curOptOcc = document.getElementById("list-occ");
	var curValueOcc;
	var allOptionsOcc = curOptOcc.querySelectorAll("option");
	for (var i = 0; i < allOptionsOcc.length; i++){
		if(allOptionsOcc[i].selected == true){
			//curValueOcc = allOptionsOcc[i].getAttribute("data-ref");
			curValueOcc = allOptionsOcc[i];
		}
	console.log("option occ:"+curValueOcc);
	}
	//obtain person_id from option list
	var curOptPer = document.getElementById("list-per");
	var curValuePer;
	var allOptionsPer = curOptPer.querySelectorAll("option");
	for (var i = 0; i < allOptionsPer.length; i++){
		if(allOptionsPer[i].selected == true){
			curValuePer = allOptionsPer[i].getAttribute("data-ref");
		}
	console.log("option per:"+curValuePer);
	}
	
	//display all gifts for one occasion
	btnSave[2].addEventListener("click", function(){
			var newGift = document.getElementById("new-idea-person").value;
			var personId= 5;
			var occasionId=indexNum;
			var purchased=1;
			console.log("user input: "+newGift);
			if(newGift !== ""){
				db.transaction(function(tx){
					tx.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea, purchased)VALUES (?,?,?,?)',[personId, occasionId, newGift, purchased]);
				});
				closeModal();
				displayOccasionGifts(indexNum);
			}
			else{alert("Please enter a new gift idea");}
		});
		
	//display all gifts for one person
	btnSave[3].addEventListener("click", function(){
			var newGift = document.getElementById("new-idea-occasion").value;
			var personId= curValuePer;
			var occasionId=indexNum;
			var purchased=1;
			console.log("user input: "+newGift);
			if(newGift !== ""){
				db.transaction(function(tx){
					tx.executeSql('INSERT INTO gifts(person_id, occ_id, gift_idea, purchased)VALUES (?,?,?,?)',[personId, occasionId, newGift, purchased]);
				});
				closeModal();
				//displayPersonGifts(personId);
			}
			else{alert("Please enter a new gift idea");}
		});
}

function showOccasion(ev){
	var indexNum = ev.getAttribute("data-ref");
	++indexNum;
	--indexNum;
	console.log(indexNum+" being generated again");
	db.transaction(function(trans){
		trans.executeSql('SELECT * FROM occasions', [], 
			function(tx, rs){
				var span = document.getElementById("theOccasion");
				var spam = document.getElementById("nowOccasion");
				span.innerHTML = rs.rows.item(indexNum).occ_name;
				spam.innerHTML = rs.rows.item(indexNum).occ_name;
			}, 
			function(tx, err){
				console.info( "error: "+err.message);
			});    
	}, transErr, transSuccess);	
}