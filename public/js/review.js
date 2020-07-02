
const postReviewBtn = document.querySelector('.ratingSubmit')
const rating = document.querySelector('#rating')
const review = document.querySelector('#review')
const dataSet = document.querySelector('.dataSet')
const ratingDiv = document.querySelector('.ratingDiv')

if (postReviewBtn) {
    postReviewBtn.addEventListener('click', async e => {
        try{
            e.preventDefault()
            const body = {
                rating: rating.value,
                review: review.value
            }
            const ratingData = await fetch(`/api/review/post-review/${dataSet.dataset.tourId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            const ratingRes = await ratingData.json()
            if(ratingRes.status === 'success') {
                ratingDiv.innerHTML = `<h4>ThankYou for your feedback!</h4>`
                window.setTimeout(() => {
                    location.reload(true)
                },1500)
            }
        } catch (err) {
            showAlert('error', err.response.data.message)
        }
    })
}