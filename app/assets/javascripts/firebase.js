$(document).ready(function(){
	// Initialize Firebase
	initializeFirebase();

	// Calling all the event listeners
	eventListeners();

	//Checking what the current auth state is
	firebase.auth().onAuthStateChanged(function(user) {
	  	if(user != null) {
			this.user = user;
			localStorage.setItem("current_member", JSON.stringify(user));
			$.ajax({
				url: '/admin/members/save_uid',
				type: 'PUT',
				data: {
					email: user.email,
					uid: user.uid
				},
				success: function(){
					//console.log("uid saved");
				}
			});
			if(localStorage.getItem("membersLoaded") != "true"){
				//console.log("getting everything");
				getSpaceId(user);
			}
		}
	});
});

/* - - - - FUNCTIONS - - - - */

function initializeFirebase() {
	var config = {
		apiKey: "AIzaSyCGhqnb48DGJ73DyrNNHTK0_AYxgtpA58o",
		authDomain: "akses-dev.firebaseapp.com",
		databaseURL: "https://akses-dev.firebaseio.com",
		projectId: "akses-dev",
		storageBucket: "akses-dev.appspot.com",
		messagingSenderId: "389795367383"
	};
	firebase.initializeApp(config);
}

function getSpaceId(user){
	//console.log(user.uid);
	firebase.database().ref('admins/users/'+user.uid).once("value").then(function(snapshot){
		snapshot.forEach(function (adminSnapshot) {
			//console.log(adminSnapshot);
			getSpaceMembers(adminSnapshot.getKey());
		})
	});
}

function getSpaceMembers(spaceId){
	var members = [];
    var counter = 0;
	//console.log(spaceId);
	firebase.database().ref("spaceMembers/"+spaceId).once('value').then(function(snapshot){
		snapshot.forEach(function(memberSnapshot) {
			var member = memberSnapshot.val();
			members.push(member);
		});
		members.forEach(function(member){
			$.ajax({
				url: '/admin/members',
				type: 'POST',
				data: {
					name: member.name,
					email: member.email,
                    spaceId: spaceId,
                    memberId: member.id
				},
				success: function(){
					//console.log("Inserted Member:", member);
                    counter++;
                    if(counter == members.length) {
                        // setting localstorage otherwise evert time the page reloads there will be another firebase database function called to get the members.
                        localStorage.setItem("membersLoaded", "true");
                        //refresh the page to show the newly added member(s)
                        window.location.href = "/admin/members";
                    }
				}
			});
		});
	}).catch(function(error){
        console.log("Error getting the members");
        //console.log(error);
    });

}

//All the event listeners
function eventListeners(){
	//This gets called when an user tries to log in
	$("#sign_in_form").one("submit", function(event) {
		/**
		 * This makes sure that rails doesn't leave the page before firebase could do anyting.
		 * Without it firebase will trow an instant network error
		 */
		event.preventDefault();

		// Getting all the needed variables
		var $this = $(this);
		var email = $("#sign_in_email").val();
		var password = $("#sign_in_password").val();

		//Calling the firebase login method
		firebaseSignInWithEmailAndPassword($this, email, password);
	});

	//This gets called when an user tries to create a new account
	$("#sign_up_form").one('submit', function(event) {
		//TODO Fix the firebase login after register, like ruby on rails does.
		/**
		 * This makes sure that rails doesn't leave the page before firebase could do anyting.
		 * Without it firebase will trow an network error
		 */
		event.preventDefault();

		//Getting all the needed variables
		var $this = $(this);
		var email = $("#sign_up_email").val();
		var password = $("#sign_up_password").val();

		//Calling the firebase sign up method
		firebaseCreateUserWithEmailAndPassword($this, email, password);
	});

	//Look if someone clicks the sign out button
	$("#sign_out").click(function(){
		//Log out from firebase and clear the localStorage so no data is left behind
		localStorage.clear();
		firebase.auth().signOut();
	});

	$("#force_refresh_members").click(function(){
		//console.log("Refresh");
		var user = JSON.parse(localStorage.getItem("current_member"));
		getSpaceId(user);
		localStorage.removeItem("membersLoaded");
	});
}

/**
 * Firebase sign in method
 * @params {form} $this
 * @params {string} email
 * @params {string} password
 */
function firebaseSignInWithEmailAndPassword($this, email, password){
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
		$this.submit();
	}).catch(function(error) {
		if(error.code === "auth/wrong-password"){
			console.log("Wrong password");
			$(".login_error").html("Username or password incorrect!");
			$("#sign_in").prop("disabled", false);
		} else {
			console.log("Error signing in: ", error);
			$(".login_error").html("Username or password incorrect!");
			$("#sign_in").prop("disabled", false);
		}
	});
}

/**
 * Firebase sign up method
 * @params {form} $this
 * @params {string} email
 * @params {string} password
 */
function firebaseCreateUserWithEmailAndPassword($this, email, password){
	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
		//console.log("registered");
		$this.submit()
	}).catch(function(error) {
		if(error == "auth/email-already-in-use"){
			firebaseSignInWithEmailAndPassword($this, email, password);
		} else {
			console.log("Error ", error);
		}
	});
}



