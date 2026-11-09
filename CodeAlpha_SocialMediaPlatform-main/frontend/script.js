const user = JSON.parse(localStorage.getItem("user"));


if (!user) {

    window.location.href = "login.html";

}



// ================= CREATE POST =================

function createPost() {


    const content =
        document.getElementById("postInput").value.trim();



    if (content === "") {

        alert("Write something first");

        return;

    }



    fetch("http://localhost:3000/post", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },


        body: JSON.stringify({

            userId: user._id,

            content: content

        })


    })


    .then(res => res.json())


    .then(data => {


        alert(data.message);


        document.getElementById("postInput").value = "";


        loadPosts();


    })

    .catch(err => console.log(err));


}






// ================= LOAD POSTS =================


function loadPosts() {


    fetch("http://localhost:3000/posts")


    .then(res => res.json())


    .then(posts => {



        const box =
        document.getElementById("posts");



        box.innerHTML = "";




        posts.forEach(post => {



            let username = "User";



            if(post.userId && post.userId.username){

                username = post.userId.username;

            }




            let commentsHTML = "";



            if(post.comments.length === 0){


                commentsHTML =

                `<p>No comments yet</p>`;


            }

            else{


                commentsHTML = post.comments.map(comment => {


                    return `

                    <p>
                    💬 ${comment.text}
                    </p>

                    `;


                }).join("");

            }






            box.innerHTML += `


            <div class="post">


                <div class="post-header">


                    <div class="small-avatar">

                        👤

                    </div>



                    <div>


                        <h3>

                        ${username}

                        </h3>


                        <small>

                        ${new Date(post.createdAt)
                        .toLocaleString()}

                        </small>


                    </div>


                </div>





                <p class="post-content">

                    ${post.content}

                </p>





                <div class="post-actions">


                    <button 
                    class="like"
                    onclick="likePost('${post._id}')">


                    ❤️ ${post.likes} Like


                    </button>





                    <button 
                    class="comment"
                    onclick="addComment('${post._id}')">


                    💬 Comment


                    </button>


                </div>





                <div class="comments">


                    <h4>

                    Comments

                    </h4>


                    ${commentsHTML}


                </div>



            </div>


            `;


        });



    })


    .catch(err => console.log(err));


}







// ================= LIKE POST =================


function likePost(id) {


    fetch(`http://localhost:3000/like/${id}`, {


        method:"POST"


    })


    .then(res => res.json())


    .then(data => {


        loadPosts();


    })


    .catch(err => console.log(err));


}







// ================= ADD COMMENT =================


function addComment(id) {


    const text =
    prompt("Enter your comment");



    if(!text || text.trim()===""){

        return;

    }




    fetch(`http://localhost:3000/comment/${id}`, {


        method:"POST",


        headers:{


            "Content-Type":"application/json"


        },


        body:JSON.stringify({


            userId:user._id,

            text:text


        })


    })


    .then(res=>res.json())


    .then(data=>{


        alert("Comment added successfully");


        loadPosts();


    })


    .catch(err=>console.log(err));


}







// ================= LOGOUT =================


function logout(){


    localStorage.removeItem("user");


    window.location.href="login.html";


}




// LOAD POSTS WHEN PAGE OPENS

loadPosts();