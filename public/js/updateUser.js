const updatefirstName = document.querySelector('#firstName')
const updatelastName = document.querySelector('#lastName')
const updateEmail = document.querySelector('#email')
const updatePhoto = document.querySelector('#photo')
const updateSavePhoto = document.querySelector('.saveBtnUpdatePhoto')
const updateSaveData = document.querySelector('.saveBtnUpdateData')
const updateSavePass = document.querySelector('.btnSavePass')
const pass = document.getElementById('password')
const confirmPass = document.getElementById('password-confirm')
const currentPass = document.getElementById('password-current')
const rowAlert = document.querySelector('.row_alertlogout')

const updateData = async(data, type) => {
    const updatedData = await fetch('/api/user/update-me', {
        method: 'PATCH',
        body: data
    })
    const final = await updatedData.json()
    if (final.status === 'success') {
        window.setTimeout(() => {
            location.reload(true)
        }, 1500)
    } else if (final.status === 'error') {
        rowAlert.style.display = 'block'
        rowAlert.innerHTML = `
        <div class="col" style="color:red">
            <h4>${final.message}</h4>
        </div>
        `
        window.setTimeout(() => {
            rowAlert.style.display = 'none'
        }, 4000)
    }
}
if (updateSavePhoto) {
    updateSavePhoto.addEventListener('click', function(e) {
        e.preventDefault()
        let formData = new FormData();
        formData.append('photo', updatePhoto.files[0]);
        updateData(formData, 'data')
    })
}

const updateDetails = async(data, type) => {
    const url =
      type === 'password'
        ? '/api/user/update-my-password'
        : '/api/user/update-me';
    const updatedDetail = await fetch(`${url}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const finalRes = await updatedDetail.json()
    if (finalRes.status === 'success') {
        window.setTimeout(() => {
            location.reload(true)
        }, 1500)
    }
}
if (updateSaveData) {
    updateSaveData.addEventListener('click', async function(e) {
        e.preventDefault()
        const body = {
            email: updateEmail.value,
            firstName: updatefirstName.value,
            lastName: updatelastName.value
        }
        updateDetails(body, 'data')
    })
}


if (updateSavePass) {
    updateSavePass.addEventListener('click', (e) => {
        e.preventDefault()
        const bodyPass = {
            oldPassword: currentPass.value,
            password: pass.value,
            confirmPassword: confirmPass.value
        }
        updateDetails(bodyPass, 'password')
    })
}