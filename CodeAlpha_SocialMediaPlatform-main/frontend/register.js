async function register(event){

    event.preventDefault();


    const username =
    document.getElementById("username").value;


    const email =
    document.getElementById("email").value;


    const password =
    document.getElementById("password").value;



    if(!username || !email || !password){

        alert("Please fill all fields");

        return;

    }



    try{


        const response = await fetch(
            "http://localhost:3000/register",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    username,
                    email,
                    password

                })

            }
        );



        const data = await response.json();



        console.log(data);



        if(response.ok){


            alert("Registration Successful");


            window.location.href="login.html";


        }

        else{


            alert(data.message);


        }



    }

    catch(error){


        console.log(error);


        alert("Server not running");


    }



}