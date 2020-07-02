const emailuser = document.querySelector('#forgotPassUser')
const submitLink = document.querySelector('.submitEmail')
const col = document.querySelector('.renderLink')
const rowAlertPass = document.querySelector('.row_alertPass')
const newPass = document.querySelector('#passwordReset')
const newPassConfirm = document.querySelector('#passwordResetConfirm')
const passwordSet = document.querySelector('.resetPasswordSubmit')
const linkToken = document.querySelector('.linkToken');

if (submitLink) {
    submitLink.addEventListener('click', async e => {
        try {
            e.preventDefault()
            const body = {
                email: emailuser.value
            }
            const passwordResetEmail = await fetch(`/api/user/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const finalData = await passwordResetEmail.json()
            console.log(finalData)
            if(finalData.status === 'success') {
                col.innerHTML = `
                <h5>Check Your Email! Password Token is sent valid for only 10 mins</h5>
                `
            } else if (finalData.status === 'fail') {
                rowAlertPass.style.display = 'block'
                rowAlertPass.innerHTML = `
                <div class="col" style="color:red">
                    ${finalData.message}
                </div>
                `
                window.setTimeout(() => {
                    rowAlertPass.style.display = 'none'
                }, 2000)
            }
        } catch (err) {
            console.log(err)
        }
    })
}

if (passwordSet) {
    passwordSet.addEventListener('click', async e => {
        e.preventDefault()
        const bodyReset = {
            password: newPass.value,
            confirmPassword: newPassConfirm.value
        }
        const resetPass = await fetch(`/api/user/reset-password/${linkToken.dataset.resetToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyReset)
        })
        const finalReset = await resetPass.json()
        console.log(finalReset)
        if (finalReset.status === 'success') {
            rowAlertPass.style.display = 'block'
            rowAlertPass.innerHTML = `
            <div class="col" style="color:green">
                ${finalReset.status} updated password
            </div>
            `
            window.setTimeout(() => {
                location.assign('/login')
            }, 1500)
        } else if (finalReset.status === 'error' || finalReset.status === 'fail') {
            rowAlertPass.style.display = 'block'
            rowAlertPass.innerHTML = `
            <div class="col" style="color:red">
                ${finalReset.message}
            </div>
            `
            window.setTimeout(() => {
                rowAlertPass.style.display = 'none'
            }, 2000)
        }
    })
}