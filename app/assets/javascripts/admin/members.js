/**
 * Created by arjen on 26/04/17.
 */
var intervalForStoredMembers;
$(document).ready(function () {
    //intervalForStoredMembers = setInterval(checkForStoredMembers, 300);
});

function checkForStoredMembers() {
    var storedMembers = JSON.parse(localStorage.getItem("members"));
    if(storedMembers != null && storedMembers != ""){
        storedMembers.forEach(function(member){
            $(".member_table").append(  "<tr>" +
                "<td>" + member.name + "</td>" +
                "<td>" + member.email + "</td>" +
                "<td>Check in</td>" +
                "<td>Check out</td>" +
                "<td><a href='/admin/members/" + member.id + "'>Show Member</a></td>" +
                "</tr>");
        });
        clearInterval(intervalForStoredMembers);
    }
}

