$(document).ready(function(){
	var $admin = null;
	// Initialize Firebase
	initializeFirebase();

	// Calling all the event listeners
	eventListeners();

	//Checking what the current auth state is
	firebase.auth().onAuthStateChanged(function(user) {
	  	if(user != null) {
			getSpaceId(user.uid);
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

function getSpaceId(userUid){
	firebase.database().ref('admins/users/'+userUid).once("value").then(function(snapshot){
		snapshot.forEach(function (adminSnapshot) {
			getSpaceMembers(adminSnapshot.getKey());
		})
	});
}

function getSpaceMembers(spaceId){
	firebase.database().ref("spaceMembers/"+spaceId).once('value').then(function(snapshot){
		snapshot.forEach(function(memberSnapshot) {
			var member = memberSnapshot.val();
			console.log(member);
		});
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
		 * Without it firebase will trow an instant network error
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
		//Log out from firebase
		firebase.auth().signOut();
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



