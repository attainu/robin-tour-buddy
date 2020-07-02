const newsSubmit = document.querySelector('#newsSubmit');
const emailNews = document.querySelector('#emailNews')
const offers = document.querySelector('.offers')
const newsLetter = document.querySelector('.newsLetter')
const row_alertlogout = document.querySelector('.row_alertlogout')
if (newsSubmit) {
    newsSubmit.addEventListener('click', async e => {
        e.preventDefault()
        const body = {
            email: emailNews.value
        }
        const createLetter = await fetch('/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const finalLetter = await createLetter.json()
        if (finalLetter.status === 'success') {
            newsLetter.innerHTML = `<h3>Subscribed</h3>`
            window.setTimeout(() => {
                newsLetter.innerHTML = `
                <h6 class="footer_links2 optional">Subscribe to our newsletter</h6><input type="text" id="emailNews" placeholder="Email" style="width: 100%;" /><input class="offers" type="checkbox" style="margin-top:10px" /><label class="footerText" for="checkBox">&nbsp;&nbsp;Get Updates & Offers</label>
<button
    class="btn-block btn-danger" id="newsSubmit">Subscribe</button>
                `
            },1500)
        } else if (finalLetter.status === 'error') {
            row_alertlogout.style.display = 'block'
            row_alertlogout.innerHTML =`
            <div class="col" style="color:red">
                ${finalLetter.message}
            </div>
            `
            window.setTimeout(() => {
                row_alertlogout.style.display = 'none'
            }, 1500)
        }
    })
}