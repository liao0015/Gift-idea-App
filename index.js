var db = null;

window.addEventListener("DOMContentLoaded", init);
                        
function init(){
    console.info("DOMContentLoaded");
    document.addEventListener("deviceready", checkDB);   
}

function checkDB(){
    //app start once deviceready occurs
    console.info("deviceready");
    db = openDatabase('sample', '', 'Sample DB', 1024*1024);
    if(db.version == ''){
        console.info('First time running... create tables'); 
        //means first time creation of DB
        //increment the version and create the tables
        db.changeVersion('', '1.0',
                function(trans){
                    //something to do in addition to incrementing the value
                    //otherwise your new version will be an empty DB
                    console.info("DB version incremented");
                    //do the initial setup               
                    trans.executeSql('CREATE TABLE stuff(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)', [], 
                                    function(tx, rs){
                                        //do something if it works
                                        console.info("Table stuff created");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
                    trans.executeSql('INSERT INTO stuff(name) VALUES(?)', ["Cheese"], 
                                    function(tx, rs){
                                        //do something if it works, as desired   
                                        console.info("Added row in stuff");
                                    },
                                    function(tx, err){
                                        //failed to run query
                                        console.info( err.message);
                                    });
                },
                function(err){
                    //error in changing version
                    //if the increment fails
                    console.info( err.message);
                },
                function(){
                    //successfully completed the transaction of incrementing the version number   
                });
        addNavHandlers();
    }else{
        //version should be 1.0
        //this won't be the first time running the app
        console.info('Version: ', db.version)   
        addNavHandlers();
    }
}

function addNavHandlers(){
    //get the lists of links and pages
    //add the tap/click events to the links
    //add the pageshow and pagehide events to the pages
    console.info("Adding nav handlers");
    //dispatch the click event on the first tab to make the home page load
    demoFunction();
}

function demoFunction() {
    //just a function to show it in use.
    db.transaction(function(trans){
        trans.executeSql('SELECT COUNT(*) AS cnt FROM stuff', [], 
            function(tx, rs){
                //success running the query
                console.info("success getting number of rows");
                var output = document.querySelector("#output");
                output.innerHTML = rs.rows.item(0).cnt;
                console.info("number of items in stuff output");
            }, 
            function(tx, err){
                //failed to run the query
                console.info( err.message);
            });    
    }, transErr, transSuccess);	
}

function transErr(tx, err){
    //a generic function to run when any transaction fails
    //navigator.notification.alert(message, alertCallback, [title], [buttonName])
    console.info("Error processing transaction: " + err);
}

function transSuccess(){
    //a generic function to run when any transaction is completed
    //not something often done generically
}
s// JavaScript Document