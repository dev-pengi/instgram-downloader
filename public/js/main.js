const main = document.querySelector('main')
const search_button = document.querySelector('#search_button');
const search_field = document.querySelector('#search_field .search input');
const errorBlock = document.querySelector('.err-block');
const proxy = `https://cors-anywhere.herokuapp.com/`
search_button.addEventListener('click', () => {
    setSearching(true)
    search(search_field.value)
})
search_field.addEventListener('input', () => {
    search_field.classList.contains('err') && search_field.classList.remove('err');
})

function search(url) {
    if (!isURL(url)) return renderErr("please insert a valid url!")
    $.ajax({
        type: "GET",
        // async: true,
        // crossDomain: true,
        url: `https://api.bhawanigarg.com/social/instagram/?url=${url}`,
        success: (result) => {
            setSearching(false);
            console.log(result);
            if (result.status == 0 || !result.graphql) return renderErr('typed url can\'t be found, please make sure to type a valid instagram link and the publisher account is not privat')
            setResult(result.graphql.shortcode_media);
        },
        error: (err) => {
            console.log(err);
            renderErr('something went wrong, try again later')
            setSearching(false)
        }
    });
}



function renderErr(err) {
    setSearching()
    search_field.classList.add('err')
    errorBlock.innerHTML = err;
}
function setSearching(status) {
    const icon = status ? 'fas fa-circle-notch fa-spin' : 'fa-solid fa-magnifying-glass';
    const text = status ? 'Searching' : 'Search';
    search_button.querySelector('i').setAttribute('class', icon);
    search_button.querySelector('p').innerHTML = text;
    // search_button.addEventListener('click', () => {
    //     setSearching(true)
    //     search(search_field.value)
    // })
}
function setResult(result) {

    let dlURL = ''
    let displayURL = result.display_url ? result.display_url : result.display_resources[0].src;
    let type = result.is_video ? 'video' : 'image';
    // console.log(result.display_url);
    // console.log(result.display_resources[0].src);
    console.log(displayURL);
    if (result.is_video) {
        dlURL = `${result.video_url}&dl=1`

    }
    else {
        dlURL = `${displayURL}&dl=1`;
    }


    const proxy = `https://cors-anywhere.herokuapp.com/`
    main.innerHTML +=
        ` <div class="result" id="result">
        <img crossorigin="anonymous"
            src="${proxy}${displayURL}"
            alt="">
            <a href="${dlURL}"
                download="img" target="_blank" class="download_btn" id="download_btn">Download<span>(${type})</span></a>
    </div>`
}
const isURL = (url) => {
    var regex = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;
    return regex.test(url);
}