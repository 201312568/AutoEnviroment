//client id: 732154933996-t0cv0rpuertt6v2j2tauohvok1cskbs9.apps.googleusercontent.com
//client secrete: z3GVEFFK8XLgGGawxMfxZDmC
//api key : AIzaSyBqHauQZBtXQ1q4w1HQdHJQZH216QdVHUs

// Client ID and API key from the Developer Console
var CLIENT_ID = '732154933996-t0cv0rpuertt6v2j2tauohvok1cskbs9.apps.googleusercontent.com'; 
var API_KEY = 'AIzaSyBqHauQZBtXQ1q4w1HQdHJQZH216QdVHUs';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file ";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

var username='';
var emai='';
var imageurl ='';

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
}).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
});
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse();
        var user =  gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        console.log(user,'..../....')
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        username = user.getName();
        emai = user.getEmail();
        imageurl = user.getImageUrl();
        document.getElementById('username').innerHTML = username;
        document.getElementById('email').innerHTML = emai;
        document.getElementById('dpic').src = imageurl;
        document.getElementById('dpic').style.display = '-webkit-inline-box';
        document.getElementById('auth-btn').style.top= "-16px";
        console.log(username,'..',emai);
        listMajors();
       
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        document.getElementById('dpic').style.display = 'none';
        document.getElementById('auth-btn').style.top= "-1px";
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
    
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

 /**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/18vbikq7Q7OxkvlbZrEDkq0_upuf8aaG7WTNDBwzjKEQ/edit
 */
function listMajors() {
gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '18vbikq7Q7OxkvlbZrEDkq0_upuf8aaG7WTNDBwzjKEQ',
    range: 'A2:E7',
}).then(function(response) {

    var range = response.result;
    if (range.values.length > 0) {
        UpdateCards(range);
    } else {
        appendPre('No data found.');
    }
}, function(response) {
    appendPre('Error: ' + response.result.error.message);
});
}


//get detials
function setCards(ticketElmId, devElmId, range ){
    
    env = range;
    tickets = env[1];

    if(tickets === undefined || tickets === "" || tickets === " ")
    {   
        ticketElm = document.getElementById(ticketElmId).innerHTML = 'Ticket Number';
        devElm = document.getElementById(devElmId).innerHTML = 'Developer Name';
    }else{
        ticket = env[1].split(' ')[0];
        dev =  env[1].split(' ')[1];
        ticketElm = document.getElementById(ticketElmId).innerHTML = ticket;
        devElm = document.getElementById(devElmId).innerHTML = dev;
    }

}

function UpdateCards(range){
    //account
    account = range.values[0];
    setCards('account_id', 'account_dev', account );

    //assets
    assets = range.values[1];
    setCards('assets_id', 'assets_dev', assets );

    //Catalog
    catalog = range.values[2];
    setCards('catalog_id', 'catalog_dev', catalog );

    //checkout
    checkout = range.values[3];
    setCards('checkout_id', 'checkout_dev', checkout );

    //magento
    magento = range.values[4];
    setCards('magento_id', 'magento_dev', magento );
    
    //newsletter
    newsletter = range.values[5];
    setCards('newsletter_id', 'newsletter_dev', newsletter );
}

function sendTicket(ticketNum, reponame,range){
    var valueInputOption = 'RAW';
    var values = [
        [
            reponame,ticketNum+" "+username
        ],
      ];
      var body = {
        values: values
      };
      gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: '18vbikq7Q7OxkvlbZrEDkq0_upuf8aaG7WTNDBwzjKEQ',
        range: range,//'A2:B2'
         valueInputOption: valueInputOption,
         resource: body
      }).then((response) => {
        var result = response.result;
        console.log(`${result.updatedCells} cells updated.`);
        listMajors()
      });
}

(function editCards(){
    var btnEdit = document.querySelectorAll('#editbtn');
    var btnAry = Array.prototype.slice.call(btnEdit);
    btnAry.forEach(elm => {
        elm.addEventListener('click', function(){
            if(gapi.auth2.getAuthInstance().isSignedIn.get()){
                var reponame = elm.innerText
                console.log(reponame);
                x0p('Enter Ticket number', null, 'input').then(
                    function(data) {
                        var ticketNum = data.text;
                        var reponame = elm.innerText
                        if(data.button === 'info') {
                            x0p('Congratulations', 
                                'You have occuppied Dev 1 with ' + data.text + '!', 
                                'ok', false);
                            if(reponame.localeCompare("ACCOUNT")){
                                sendTicket(ticketNum, reponame,'A2:B2');
                            }else if(reponame.localeCompare("CATALOG")){
                                sendTicket(ticketNum, reponame,'A2:B4');
                            }else if(reponame.localeCompare("ASSETS")){
                                sendTicket(ticketNum, reponame,'A3:B7');
                            }else if(reponame.localeCompare("CHECKOUT")){
                                sendTicket(ticketNum, reponame,'A2:B2');
                            }else if(reponame.localeCompare("MAGENTO ")){
                                sendTicket(ticketNum, reponame,'A2:B2');
                            }else if(reponame.localeCompare("NEWSLETTER")){
                                sendTicket(ticketNum, reponame,'A2:B2');
                            }

                        }
                        if(data.button === 'cancel') {
                            x0p('Canceled', 
                                'You canceled input.',
                                'error', false);
                        }
                    });         
            }else{
                handleAuthClick(event);
            }
           
        }); 
    });
})();




