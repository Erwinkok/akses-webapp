$(document).ready(function(){
    getSpaceId(JSON.parse(localStorage.getItem("user")));
    //Look if someone clicks the sign out button
    $("#sign_out").click(function(){
        //Log out from firebase and clear the localStorage so no data is left behind
        localStorage.clear();
        firebase.auth().signOut();
    });
});

function createUser(user) {
    firebase.database().ref("users/"+user.uid).set({
        primaryEmail: user.email,
        uid: user.uid
    }, function(error){
        if(!error){
            //getSpaceId(user);
        }
        console.log(error);
    });

}

function getSpaceId(user){
    //console.log(user);
    firebase.database().ref('admins/users/'+user.uid).on("value", function(snapshot){
        if(snapshot.val() == null) {
            console.log("No user with this uid");
            //createUser(user);
        }
        snapshot.forEach(function(adminSnapshot) {
            var spaceId = adminSnapshot.getKey();
            getSpaceMembers(user, spaceId);
            localStorage.setItem("spaceId", JSON.stringify(spaceId));
        });
    });
}

function getSpaceMembers(user, spaceId){
    var members = [];
    // console.log(spaceId);
    firebase.database().ref("spaceMembers/"+spaceId).on('value', function(snapshot){
        snapshot.forEach(function(memberSnapshot) {
            var member = memberSnapshot.val();
            members.push(member);
        });

        $(".member_table").html("");
        members.forEach(function(member){
            $(".member_table").append(  "<tr>" +
                "<td>" + member.name + "</td>" +
                "<td>" + member.email + "</td>" +
                "<td>Check in</td>" +
                "<td>Check out</td>" +
                "<td><a href='/admin/members/" + member.id + "'>Show Member</a></td>" +
                "</tr>");
        });
    });
}