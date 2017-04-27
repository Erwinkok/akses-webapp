/**
 * Created by arjen on 26/04/17.
 */
$(document).ready(function () {

    var db = firebase.database();
    var ref = db.ref("members");

    ref.on("value", function(snapshot) {
        console.log(snapshot.val());
        var member = snapshot.val();
        $(".member_table").append(  "<tr>" +
                                        "<td>" + member.name + "</td>" +
                                        "<td>" + member.email + "</td>" +
                                        "<td>Check in</td>" +
                                        "<td>Check out</td>" +
                                        "<td><a href='/admin/members/" + member.id + "'>Show Member</a></td>" +
                                    "</tr>");
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
});

