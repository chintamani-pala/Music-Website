/*
$(document).ready(async function () {
    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
    });
    let searchBtn = document.getElementById("searchBtn")
    let inputField = document.getElementById("inputField")
    searchBtn.addEventListener("click", async () => {
        searchBtn.disabled = true;
        let inputFieldValue = inputField.value;
        inputFieldValue = inputFieldValue.trim();
        if (inputFieldValue == "") {
            topRightSmallToast(`Enter a valid song name`, `error`);
            searchBtn.disabled = false;
        } else {
            inputFieldValue = inputFieldValue.replace(" ", "+")
            inputFieldValue = inputFieldValue.toLowerCase()
            await fetchAndDisplay(inputFieldValue)
            localStorage.setItem("lastSearch",inputFieldValue);
            searchBtn.innerHTML = "Search"
            searchBtn.disabled = false;
        }

    })
    const loadMusicToTable = (musicData) => {
        const formattedData = musicData.map(item => [
            item.image,
            item.album,
            formatDuration(item.duration),
            getArtistNames(item.artistMap)
        ]);

        // Function to format duration (convert seconds to MM:SS format)
        function formatDuration(durationInSeconds) {
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
        }

        // Function to get artist names from the artistMap object
        function getArtistNames(artistMap) {
            return Object.keys(artistMap).join(', ');
        }
        if ($.fn.DataTable.isDataTable('#musicTable')) {
            // If DataTable is already initialized, destroy it
            $('#musicTable').DataTable().destroy();
        }
        const columns = [
            {
                title: "Image",
                render: function (data, title) {
                    return '<img src="' + data + '" alt="Song Logo" width="100">';
                }
            },
            { title: "Title" },
            { title: "Duration" },
            { title: "Artists" },

        ];
        const dataTable = $('#musicTable').DataTable({
            data: formattedData,
            columns: columns,
            searching: false,
            paging: false,
            info: false
        });

        $('#musicTable tbody').on('click', 'tr', function () {
            const rowData = dataTable.row(this).data();
            if (rowData) {
                const dataIndex = dataTable.row(this).index();
                const fullData = musicData[dataIndex];
                let audioPlayer = document.getElementById("audioPlayer");

                audioPlayer.src = fullData.media_url;
                audioPlayer.play()
            }
        });
        searchBtn.innerHTML = "Search"
    }
    const fetchData = async (query) => {
        searchBtn.innerHTML = "Loading..."
        try {
            const response = await fetch(`https://jio-saavn-api-chintamanipala.vercel.app/song/?query=${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null; // or handle the error as needed
        }
    };

    function getLastLocalStorageData() {
        let keys = Object.keys(localStorage);
        if (keys.length === 0) {
            return null; // No data in local storage
        }
    
        let lastKey=localStorage.getItem("lastSearch");
        let lastValue=localStorage.getItem(lastKey);
        if(lastKey==null || lastValue==null || lastKey==undefined || lastValue==undefined){
            return null;
        }
        return { key: lastKey, value: lastValue };
    }

    const fetchAndDisplay = async (query) => {
        const value = localStorage.getItem(query);
        if (value != null) {
            loadMusicToTable(JSON.parse(value))
            return;
        }
        const musicData = await fetchData(query)
        if(musicData==null){
            topRightSmallToast(`Some error Occured contact admin`, `error`);
            searchBtn.disabled = false;
            searchBtn.innerHTML = "Search"
            return;
        }
        if (query != "Top+Songs") {
            localStorage.setItem(query, JSON.stringify(musicData));
        }
        loadMusicToTable(musicData)
    }

    const initialLoad=()=>{
        let data=getLastLocalStorageData()
        if(data==null){
            fetchAndDisplay("Top+Songs");
        }else{
            let key=data.key
            key=key.replace("+"," ");
            inputField.value=key;
            loadMusicToTable(JSON.parse(data.value));
        }
    }

    // initial loading top songs
    initialLoad()


});
*/


$(document).ready(async function () {
    let searchBtn = document.getElementById("searchBtn");
    let inputField = document.getElementById("inputField");
    let dataTable;

    const loadMusicToTable = (musicData) => {
        const formattedData = musicData.map(item => [
            item.image,
            item.album,
            formatDuration(item.duration),
            getArtistNames(item.artistMap)
        ]);

        function formatDuration(durationInSeconds) {
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            return `${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;
        }

        function getArtistNames(artistMap) {
            return Object.keys(artistMap).join(', ');
        }

        if ($.fn.DataTable.isDataTable('#musicTable')) {
            $('#musicTable').DataTable().destroy();
        }

        const columns = [
            {
                title: "Image",
                render: function (data, type, row) {
                    return '<img src="' + data + '" alt="Song Logo" width="100">';
                }
            },
            { title: "Title" },
            { title: "Duration" },
            { title: "Artists" },
        ];

        dataTable = $('#musicTable').DataTable({
            data: formattedData,
            columns: columns,
            searching: false,
            paging: false,
            info: false,
            scrollY: 400,
            deferRender: true, // Improve performance for large datasets
            scroller: {
                loadingIndicator: true
            }
        });

        $('#musicTable tbody').on('click', 'tr', function () {
            const rowData = dataTable.row(this).data();
            if (rowData) {
                const dataIndex = dataTable.row(this).index();
                const fullData = musicData[dataIndex];
                let audioPlayer = document.getElementById("audioPlayer");

                audioPlayer.src = fullData.media_url;
                audioPlayer.play();
            }
        });

        searchBtn.innerHTML = "Search";
    };

    const fetchMoreData = async (query) => {
        // Simulate fetching more data after a short delay (replace this with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        const moreData = await fetchData(query); // Fetch additional data based on query or current state
        dataTable.rows.add(moreData).draw();
    };

    $('#musicTable').on('draw.dt', function () {
        const table = $('#musicTable').DataTable();
        const pageInfo = table.page.info();

        if (pageInfo.end === pageInfo.recordsTotal) {
            fetchMoreData("YourQueryHere");
        }
    });

    const fetchData = async (query) => {
        searchBtn.innerHTML = "Loading...";
        try {
            const response = await fetch(`https://jio-saavn-api-chintamanipala.vercel.app/song/?query=${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return []; // or handle the error as needed
        } finally {
            searchBtn.innerHTML = "Search";
        }
    };

    const getLastLocalStorageData = () => {
        let lastKey = localStorage.getItem("lastSearch");
        let lastValue = localStorage.getItem(lastKey);
        if (!lastKey || !lastValue) {
            return null;
        }
        return { key: lastKey, value: lastValue };
    };

    const fetchAndDisplay = async (query) => {
        const value = localStorage.getItem(query);
        if (value != null) {
            loadMusicToTable(JSON.parse(value));
            return;
        }
        const musicData = await fetchData(query);
        if (musicData.length === 0) {
            console.error('No data fetched');
            return;
        }
        if (query !== "Top+Songs") {
            localStorage.setItem(query, JSON.stringify(musicData));
        }
        loadMusicToTable(musicData);
    };

    const initialLoad = async () => {
        let data = getLastLocalStorageData();
        if (data === null) {
            await fetchAndDisplay("Top+Songs");
        } else {
            let key = data.key;
            key = key.replace("+", " ");
            inputField.value = key;
            loadMusicToTable(JSON.parse(data.value));
        }
    };

    initialLoad();
});
