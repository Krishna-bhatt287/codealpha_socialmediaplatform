const user = JSON.parse(localStorage.getItem("user"));


if(!user){

    window.location.href="login.html";

}



// ================= LOAD PROFILE =================

function loadProfile(){


fetch(`http://localhost:3000/profile/${user._id}`)


.then(res=>res.json())


.then(data=>{


console.log(data);



document.getElementById("username").innerHTML =
data.user.username;



document.getElementById("email").innerHTML =
data.user.email;



document.getElementById("postsCount").innerHTML =
data.totalPosts;



document.getElementById("followers").innerHTML =
data.user.followers.length;



document.getElementById("following").innerHTML =
data.user.following.length;



loadMyPosts();



})

.catch(err=>console.log(err));



}






// ================= MY POSTS =================


function loadMyPosts(){


fetch("http://localhost:3000/posts")


.then(res=>res.json())


.then(posts=>{


const box =
document.getElementById("myPosts");



box.innerHTML="";



posts.forEach(post=>{


if(post.userId && post.userId._id === user._id){



box.innerHTML += `


<div class="post">


<h3>
👤 ${user.name}
</h3>



<p>

${post.content}

</p>



<p>

❤️ Likes: ${post.likes}

</p>


<div class="comments">


<h4>
Comments
</h4>


${
post.comments.length===0

?

"<p>No comments yet</p>"

:

post.comments.map(c=>`

<p>
💬 ${c.text}
</p>

`).join("")

}


</div>


</div>


`;



}


});



});


}






// ================= LOGOUT =================


function logout(){


localStorage.removeItem("user");


window.location.href="login.html";


}




loadProfile();