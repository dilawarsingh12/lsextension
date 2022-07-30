
function create(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){    

        var username = localStorage['username'];
        var furl = "http://127.0.0.1:8000/create/" + username;
        var furl_prod = "https://leetsheet.herokuapp.com/create/" + username;
        $.ajax({     
            url: furl_prod,     
            headers: {  'Access-Control-Allow-Origin': furl_prod,
                        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type' },   
            crossDomain: true,    
            dataType:"html",
            success: function(response) { 
                var id = JSON.parse(response).spreadsheetId
                localStorage['spreadsheetId']=id;              
                document.getElementById('create-btn').style.display="none";   
                document.getElementById('btn').style.display="block";                             
            } 
        });
    });    
}

function update(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){ 
        var tablink = tabs[0].url;
        var username = localStorage['username'];
        var link = tablink.split('/');
        var slug = link[4];               
        var furl = "http://127.0.0.1:8000/update" + "/" + slug + "/" + username;
        var furl_prod = "https://leetsheet.herokuapp.com/update" + "/" + slug + "/" + username;
       
            $.ajax({     
                url: furl_prod,     
                headers: {  'Access-Control-Allow-Origin': furl_prod,
                            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type' }, 
                              
                crossDomain: true,    
                dataType:"html",
                success: function(response) {                 
                    document.getElementById('btn').innerHTML='DONE';
                    document.getElementById('btn').style.background="green";
                } 
            });
    });
}

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){ 

    var isValid = localStorage['isValid'];

    if(typeof isValid === "string"){
        document.getElementById('verify-btn').style.display = "none";
        document.getElementById('welcome').style.display="none";
            
            var tablink = tabs[0].url;    
            var link = tablink.split('/');
            var isLeetcode = link[2];
            if(isLeetcode != "leetcode.com"){
                document.getElementById('create-btn').style.display="none";
                document.getElementById('btn').style.display="none"; 
                document.getElementById('ques').innerHTML="You are not on Leetcode"; 
            }
            else{        
            
                    var id = localStorage['spreadsheetId'];
                    if(typeof id === "string"){      
                        document.getElementById('create-btn').style.display="none";       
                    }
                    else{
                        document.getElementById('btn').style.display="none"; 
                    }
                
                    var slug = link[4];
                    var text = "Q. " + slug;           
            
                    document.getElementById('ques').innerHTML=text;            
                                    
            }
        
    }
    else{
        document.getElementById('ques').innerHTML = "Verify yourself first!"; 
        document.getElementById('btn').style.display="none"; 
        document.getElementById('create-btn').style.display="none"; 
        document.getElementById('welcome').style.display="none";

    }
});

function validate(){
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        let username = prompt("What's your Username?");
        
        
        var furl = "http://127.0.0.1:8000/validate/" + username;
        var furl_prod = "https://leetsheet.herokuapp.com/validate" + "/" + username;
       
            $.ajax({     
                url: furl_prod,     
                headers: {  'Access-Control-Allow-Origin': furl_prod,
                            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
                            'Access-Control-Allow-Headers': 'Content-Type' },    
                crossDomain: true,    
                dataType:"html",
                success: function(response) {
                    var isUser=false;  
                    var message = JSON.parse(response).message;   
                    if(message != 'Invalid User, create account.'){
                        localStorage['username'] = message 
                        localStorage['isValid'] = "true";
                        isUser=true;
                    }                              
                    var tablink = tabs[0].url;    
                    var link = tablink.split('/');
                    var isLeetcode = link[2];
                    if(isLeetcode != "leetcode.com"){                        
                        document.getElementById('ques').innerHTML="You are not on Leetcode"; 
                        document.getElementById('verify-btn').style.display="none";
                        document.getElementById('welcome').style.display="block";
                        if(isUser==true){
                            document.getElementById('welcome').innerHTML = "welcome " + message;
                        }
                        else{
                            document.getElementById('welcome').innerHTML = message
                        }
                    }
                    else{
                        var slug = link[4];
                        var text = "Q. " + slug;
                        document.getElementById('ques').innerHTML=text; 
                    
                        document.getElementById('verify-btn').style.display="none";
                        document.getElementById('create-btn').style.display="block"; 
                        document.getElementById('welcome').style.display="block";
                        if(isUser==true){
                            document.getElementById('welcome').innerHTML = "welcome " + message;
                        }
                        else{
                            document.getElementById('welcome').innerHTML = message
                        }
                    }

                } 
            });
        });
}




document.getElementById('btn').addEventListener('click',addQuestion);
document.getElementById('create-btn').addEventListener('click',create);
document.getElementById('del-btn').addEventListener('click',del);
document.getElementById('verify-btn').addEventListener('click',validate);

function addQuestion(){   
    update();    
}

function del(){
    localStorage.removeItem('spreadsheetId');
    localStorage.removeItem('username');
    localStorage.removeItem('isValid');
}

 

