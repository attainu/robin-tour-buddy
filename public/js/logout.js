const logoutBtn = document.querySelector('#logoutBtn');
const alertLogout = document.querySelector('.row_alertlogout');

const logout = async () => {
    const data = await fetch('http://localhost:3000/api/user/logout')
    const res = await data.json()
    console.log(res)
    if(res.status === 'success') {
        alertLogout.style.display = 'block'
        alertLogout.innerHTML = `
        <div class="spinner-border text-danger" role="status">
            <span class="sr-only">Logging Out...</span>
        </div>
        <h4 style="color:red">Logging Out...</h4>
        `
        window.setTimeout(() => {
            location.assign('/')
        },2000)
    }
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
        e.preventDefault()
        logout()
    })
}