const cancelTour = document.querySelectorAll('.cancelTour');
const bookedTourDiv = document.querySelectorAll('.bookHead');
const row_alert = document.querySelector('.row_alertlogout')

cancelTour.forEach((el, index) => {
    if(el) {
        el.addEventListener('click', async e => {
            e.preventDefault()
            const body = {
                tour: bookedTourDiv[index].textContent
            }
            const cancelTourData = await fetch(`/api/cancel`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(body)
            })
            const finalCancel = await cancelTourData.json()
            if (finalCancel.status === 'success') {
                row_alert.style.display = 'block'
                row_alert.innerHTML = `
                <div class="col" style="color:green">
                    Booking Cancelled
                </div>
                `
                window.setTimeout(() => {
                    location.reload(true)
                }, 1500)
            }
        })
    }
})