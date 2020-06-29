const stripe = Stripe('pk_test_51GxqeJLgFGfdIbJfPGflUggdtoAsKwb2nw6xprwpY8rewb0vbKn7io7T0Bbko9iLlf0C2EQ24EmmF2cmOJdEs5C1008Z90JaiV')
const bookBtn = document.querySelector('.finalBook')
if (bookBtn) {
    bookBtn.addEventListener('click', async e => {
        try {
            e.preventDefault()
            const { tourId } = e.target.dataset;
            const session = await fetch(`/api/booking/checkout-session/${tourId}`)
            const finalSession = await session.json()
            console.log(finalSession)
            await stripe.redirectToCheckout({
                sessionId: finalSession.session.id
            });
        } catch (err) {
            console.log(err);
        }
    })
}

const myTour = document.querySelector('.tourPage');

if (myTour) {
    myTour.addEventListener('click', async function(e) {
        e.preventDefault()
        location.assign('/my-tours')
    })
}