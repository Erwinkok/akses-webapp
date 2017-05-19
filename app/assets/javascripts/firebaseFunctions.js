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
            if(member.activeVisit != null){
                $(".member_table").append(  "<tr>" +
                    "<td>" + member.name + "</td>" +
                    "<td>" + member.email + "</td>" +
                    "<td id='checked_in'>Checked in</td>" +
                    "<td id='check_out'>Check out</td>" +
                    "<td><a href='/admin/members/" + member.id + "'>Show Member</a></td>" +
                "</tr>");
            } else {
                $(".member_table").append(  "<tr>" +
                    "<td>" + member.name + "</td>" +
                    "<td>" + member.email + "</td>" +
                    "<td id='check_in'>Check in</td>" +
                    "<td id='checked_out'>Check out</td>" +
                    "<td><a href='/admin/members/" + member.id + "'>Show Member</a></td>" +
                "</tr>");
            }

            
        });
    });
}

function getActiveSpaceMembers() {
    var user = JSON.parse(localStorage.getItem("user"));
    var spaceId = JSON.parse(localStorage.getItem("spaceId"));
    var activeMembers = [];

    console.log("user", user);
    console.log("spaceId", spaceId);

    firebase.database().ref("spaceMembers/"+spaceId).hasChild("activeVisit").on("value", function(snapshot) {
        snapshot.forEach(function(activeMemberSnapshot){
            var activeMember = memberSnapshot.val();
            activeMembers.push(activeMember);
        });

        $(".active_member_table").html("");
        activeMembers.forEach(function(activeMember){
            $(".member_table").append(  "<tr>" +
                    "<td>" + member.name + "</td>" +
                    "<td>" + member.email + "</td>" +
                    "<td id='checked_in'>Checked in</td>" +
                    "<td id='check_out'>Check out</td>" +
                    "<td><a href='/admin/members/" + member.id + "'>Show Member</a></td>" +
                "</tr>");
        });
    });
}