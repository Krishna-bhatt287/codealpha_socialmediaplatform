async function login(event) {

    event.preventDefault();

    console.log("Login function triggered");


    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;


    if (!email || !password) {

        alert("Please enter email and password");
        return;

    }


    try {


        const res = await fetch("http://localhost:3000/login", {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                email,
                password

            })

        });



        const data = await res.json();


        console.log("Backend response:", data);



        if(!res.ok){

            alert(data.message);

            return;

        }



        if(data.success){



            const userData = {

                _id: data.user._id,

                name: data.user.name,

                email: data.user.email

            };



            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );



            console.log(
                "Saved User:",
                localStorage.getItem("user")
            );



            alert("Login successful");



            window.location.href="index.html";


        }



    } catch(error){


        console.log(error);

        alert("Server error");


    }


}