const value = document.querySelector('#tourName');
const submitFilters = document.querySelector('.submitFilters');

if (submitFilters) {
    submitFilters.addEventListener('click', async e => {
        e.preventDefault()
        const getTours = await fetch(`/api/tour?name=${value.value}`)
        const finalTours = await getTours.json()
        if (finalTours.status === 'success') {
            location.assign(`/?name=${value.value}`)
        }
    })
}