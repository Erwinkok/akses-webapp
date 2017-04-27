$(document).ready(function(){
	var $admin = null;
	// Initialize Firebase
	var config = {
	  apiKey: "AIzaSyCGhqnb48DGJ73DyrNNHTK0_AYxgtpA58o",
	  authDomain: "akses-dev.firebaseapp.com",
	  databaseURL: "https://akses-dev.firebaseio.com",
	  projectId: "akses-dev",
	  storageBucket: "akses-dev.appspot.com",
	  messagingSenderId: "389795367383"
	};

	firebase.initializeApp(config);

	$("#sign_in_form").one("submit", function(event) {
		event.preventDefault();
		var $this = $(this);
		var email = $("#sign_in_email").val();
		var password = $("#sign_in_password").val();
		//console.log(email);
		firebase.auth().signInWithEmailAndPassword(email, password).then(function(result){
			//console.log("form submitted");
			$this.submit();
		}).catch(function(error) {
			if(error.code === "auth/wrong-password"){
				console.log("Wrong password");
			} else {
				console.log("Error signing in: ", error);	  	
			}
		});
	});

	//TODO Fix the firebase login after register, like ruby on rails does.
	// $("#sign_up_form").one('submit', function(event) {
	// 	event.preventDefault();
	//	var $this = $(this);
	// 	var email = $("#sign_up_email").val();
	// 	var password = $("#sign_up_password").val();
	// 	console.log(email);
	// 	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(result){
	//		console.log("registered");
	//		$this.submit()
	//	}).catch(function(error) {
	// 	  console.log("Error ", error);
	// 	});
	// });

	$("#sign_out").click(function(){
		firebase.auth().signOut();
	});

	firebase.auth().onAuthStateChanged(function(user) {
	  	console.log("User", user);
		$admin = user;
		console.log($admin);

	});
});

/* - - - - FUNCTIONS - - - - */

function getSpaceId(userId){
	firebase.database().ref('users/'+userId).once("value").then(function(snapshot){
		console.log(snapshot.val());
	});
}

function getSpaceMembers(){
	firebase.database().ref("members/").once('value').then(function(snapshot){
		snapshot.forEach(function(memberSnapshot) {
			var member = memberSnapshot.val();
			console.log(member);
		});
	});
}
