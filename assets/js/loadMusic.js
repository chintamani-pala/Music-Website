$(document).ready(async function () {
    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
    });
    const searchBtn = document.getElementById("searchBtn");
    const inputField = document.getElementById("inputField");
    let dataTable;
    let page=1;
    let finalFullData=[]
    let inputFieldValue="Top+Songs";
    searchBtn.addEventListener("click", async () => {
        searchBtn.disabled = true;
        inputFieldValue = inputField.value;
        inputFieldValue = inputFieldValue.trim();
        if (inputFieldValue == "") {
            topRightSmallToast(`Enter a valid song name`, `error`);
            searchBtn.disabled = false;
        } else {
            inputFieldValue = inputFieldValue.replace(" ", "+")
            inputFieldValue = inputFieldValue.toLowerCase()
            searchBtn.innerHTML = "Loading..."
            finalFullData=[]
            await fetchAndDisplay(inputFieldValue)
            localStorage.setItem("lastSearch",inputFieldValue);
            searchBtn.innerHTML = "Search"
            searchBtn.disabled = false;
        }

    })
    const formatDuration = (durationInSeconds) => {
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;
        return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
    }

    const getArtistNames = (artistMap) => {
        return Object.keys(artistMap).join(', ');
    }

    const formatData = async(musicData) =>{
        return musicData.map(item => [
            item.image,
            item.album,
            formatDuration(item.duration),
            getArtistNames(item.artistMap)
        ]);
    }

    const loadMusicToTable = async (musicData) => {
        const formattedData= await formatData(musicData)
        const columns = [
            {
                title: "Image",
                render: (data) => '<img src="' + data + '" alt="Song Logo" width="100">'
            },
            { title: "Album" },
            { title: "Duration" },
            { title: "Artists" },
        ];

        if ($.fn.DataTable.isDataTable('#musicTable')) {
            $('#musicTable').DataTable().destroy();
        }

        dataTable = $('#musicTable').DataTable({
            data: formattedData,
            paging: false,
            columns: columns,
            deferRender: true,
            scroller: {
                loadingIndicator: true
            }
        });
        finalFullData=musicData
        $('#musicTable tbody').on('click', 'tr', function () {
            const rowData = dataTable.row(this).data();
            if (rowData) {
                const dataIndex = dataTable.row(this).index();
                const fullData = finalFullData[dataIndex];
                let audioPlayer = document.getElementById("audioPlayer");
                audioPlayer.src = fullData.media_url;
                audioPlayer.play();
            }
        });
        searchBtn.innerHTML = "Search";
    };

    const fetchMoreData = async (query) => {
        page+=1;
        const response = await fetch(`https://jio-saavn-api-chintamanipala.vercel.app/song/?query=${query}&page=${page}`);
        const moreData = await response.json();
        const formattedData= await formatData(moreData)
        dataTable.rows.add(formattedData).draw();
        finalFullData = finalFullData.concat(moreData);
        //localStorage.setItem(query,finalFullData);

    };

    $(window).on('scroll', function() {
        if($(window).scrollTop() + $(window).innerHeight() >= $(document).height() - 250) { // Adjusted for mobile devices
            
            console.log("yes");
            fetchMoreData(inputFieldValue);
        }
    });

    const fetchData = async (query) => {
        const response = await fetch(`https://jio-saavn-api-chintamanipala.vercel.app/song/?query=${query}`);
        return await response.json();
    };

    const getLastLocalStorageData = () => {
        const lastKey = localStorage.getItem("lastSearch");
        const lastValue = localStorage.getItem(lastKey);
        return (lastKey && lastValue) ? { key: lastKey, value: lastValue } : null;
    }

    const fetchAndDisplay = async (query) => {
        const value = localStorage.getItem(query);
        if (value) {
            await loadMusicToTable(JSON.parse(value));
            return;
        }
        const musicData = await fetchData(query);
        if(!musicData){
            topRightSmallToast(`Some error Occured contact admin`, `error`);
            searchBtn.disabled = false;
            searchBtn.innerHTML = "Search";
            return;
        }
        if (query !== "Top+Songs") {
            localStorage.setItem(query, JSON.stringify(musicData));
        }
        finalFullData=musicData
        await loadMusicToTable(musicData);
    }

    const initialLoad = async () => {
        const data = getLastLocalStorageData();
        if (!data) {
            await fetchAndDisplay("Top+Songs");
        } else {
            inputField.value = data.key.replace("+", " ");
            await loadMusicToTable(JSON.parse(data.value));
        }
    };

    initialLoad();
});
