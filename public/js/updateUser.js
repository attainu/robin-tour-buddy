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

const updateData = async(data, type) => {
    const updatedData = await fetch('/api/user/updateMe', {
        method: 'PATCH',
        body: data
    })
    const final = await updatedData.json()
    console.log(final)
    if (final.status === 'success') {
        window.setTimeout(() => {
            location.reload(true)
        }, 1500)
    }
}

updateSavePhoto.addEventListener('click', function(e) {
    e.preventDefault()
    let formData = new FormData();
    formData.append('photo', updatePhoto.files[0]);
    updateData(formData, 'data')
})

const updateDetails = async(data, type) => {
    const url =
      type === 'password'
        ? '/api/user/updateMyPassword'
        : '/api/user/updateMe';
    const updatedDetail = await fetch(`${url}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    const finalRes = await updatedDetail.json()
    console.log(finalRes)
    if (finalRes.status === 'success') {
        window.setTimeout(() => {
            location.reload(true)
        }, 1500)
    }
}

updateSaveData.addEventListener('click', async function(e) {
    e.preventDefault()
    const body = {
        email: updateEmail.value,
        firstName: updatefirstName.value,
        lastName: updatelastName.value
    }
    updateDetails(body, 'data')
})



if (updateSavePass) {
    updateSavePass.addEventListener('click', (e) => {
        e.preventDefault()
        const bodyPass = {
            oldPassword: currentPass.value,
            password: pass.value,
            confirmPassword: confirmPass.value
        }
        console.log(JSON.stringify(bodyPass))
        updateDetails(bodyPass, 'password')
    })
}