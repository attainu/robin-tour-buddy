const firstName = document.querySelector('#firstName')
const lastName = document.querySelector('#lastName')
const signupEmail = document.querySelector('#signupEmail')
const signupPassword = document.querySelector('#signupPass')
const confirmPassword = document.querySelector('#signuConfirmpass')
const submitBtn = document.querySelector('.submit_signup')
const alertSignup = document.querySelector('.row_alertSignup')

if (submitBtn) {
    submitBtn.addEventListener('click', async function(e) {
        const body = {
            firstName: firstName.value,
            lastName: lastName.value,
            email: signupEmail.value,
            password: signupPassword.value,
            confirmPassword: confirmPassword.value
        }
        const data = await fetch('/api/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const res = await data.json()
        console.log(res)
        if (res.status === 'success') {
            alertSignup.style.display = 'block'
            alertSignup.innerHTML = `
            <div class="col" style="color:green">
                <h4>Registration Success</h4>
            </div>
            `
            window.setTimeout (()=> {
                location.assign('/')
            
            }, 1500)
        } else if (res.status === 'error') {
            alertSignup.style.display = 'block'
            alertSignup.innerHTML = `
            <div class="col" style="color:red">
                <h4>${res.message}</h4>
            </div>
            `
            window.setTimeout(() => {
                alertSignup.style.display = 'none'
            }, 4000)
        }
    })
}