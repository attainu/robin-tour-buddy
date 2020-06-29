
const loginBtn = document.querySelector('.submit_login')
const email = document.querySelector('#loginEmail')
const password = document.querySelector('#loginPassword')
const alertRowLogin = document.querySelector('.row_alert')

const login = async (email, password) => {
    const body = {
        email,
        password
    }
    const data = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    const res = await data.json()
    if (res.status === 'success') {
        alertRowLogin.style.display = 'block'
        alertRowLogin.innerHTML = `
            <div class="spinner-border text-success" role="status">
                <span class="sr-only">Logging In...</span>
            </div>
            <h4 style="color:green">Logging In...</h4>
            `
        window.setTimeout(() => {
            location.assign('/')
        }, 1500)
    } else if (res.status === 'error') {
        alertRowLogin.style.display = 'block'
        alertRowLogin.innerHTML = `
        <div class="col" style="color:red">
            <h4>${res.message}</h4>
        </div>
        `
        window.setTimeout(() => {
            alertRowLogin.style.display = 'none'
        }, 4000)
    }
}

if (loginBtn) {
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault()
        login(email.value, password.value)
    })
}