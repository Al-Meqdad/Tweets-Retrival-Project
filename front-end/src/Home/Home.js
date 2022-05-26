import "./Home.css";
import { AreaSelect, boxbound } from '../Map/MapSelector'
import React, { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-area-select";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import { useState } from "react";
import { FaHeart, FaRetweet } from 'react-icons/fa';
import L from "leaflet";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Button, Modal } from 'react-bootstrap';
import Chart from 'chart.js/auto'
import { Bar } from "react-chartjs-2";
import axios from 'axios'
import ReactWordcloud from 'react-wordcloud';

const Chartoptions = {
    responsive: true,

};
const WordCloudOptions = {
    enableTooltip: true,
    deterministic: false,
    fontFamily: 'sans-serif',
    fontSizes: [20, 100],
    fontStyle: 'bold',
    fontWeight: 'italic',
    padding: 1,
    rotations: 3,
    rotationAngles: [-90, 0],
    scale: "sqrt",
    spiral: "archimedean",
    transitionDuration: 1000
};


//Creating a class for the icon defining it's options to edit the size
const LeafIcon = L.Icon.extend({
    options: {
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }
});

let DiagramLabel = 'day'

//Assigning variables using the LeafIcon class options
const blueIcon = new LeafIcon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
}),
    redIcon = new LeafIcon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    }),
    yellowIcon = new LeafIcon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    });


//giving my icon an initial variable of blue icon
var icon = blueIcon




function Contact() {
    const LablesArr = [{ label: "MonthlyLables", value: 'month' }, { label: "YearlyLables", value: 'year' }, { label: "DailyLables", value: 'day' }];




    const [LablesValue, setLableValue] = useState(LablesArr.name);
    const [MapData, setMapData] = useState()
    useEffect(() => {
        setMapData(SendData())
    }, [])


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => [setShow(true), setShowWordCloud(false), setShowTweets(false)];


    const [showWordCloud, setShowWordCloud] = useState(false);

    const handleCloseWord = () => setShowWordCloud(false);
    const handleShowWord = () => [setShowWordCloud(true), setShow(false), setShowTweets(false)];

    const [ShowTweets, setShowTweets] = useState(false);

    const HandleCloseTweets = () => setShowTweets(false);
    const handleShowTweets = () => [setShowTweets(true), setShowWordCloud(false), setShow(false)];

    const [Chartdata, setChartdata] = useState()
    useEffect(() => {
        setChartdata(SendData("chart"))
    }, [])

    const [WordCloud, setWordCloud] = useState()


    function SendData(Word) {


        if (boxbound._southWest != null) {
            let lon = boxbound._southWest.lng
            let lon2 = boxbound._northEast.lng
            let lat = boxbound._southWest.lat
            let lat2 = boxbound._northEast.lat

            let DataSent = {
                "Start_Time": ("Start_Time").value,
                "End_Time": document.getElementById("End_Time").value,
                "Word": document.getElementById("Text").value,
                "BottomLeft": [lon, lat],
                "UpperRight": [lon2, lat2],
                "Dlabel": DiagramLabel
            };

            const removeEmptyOrNull = (obj) => {

                Object.keys(obj).forEach(k =>

                    (obj[k] && typeof obj[k] === 'object') && removeEmptyOrNull(obj[k]) ||

                    (!obj[k] && obj[k] !== undefined) && delete obj[k]

                );

                return obj;

            };

            DataSent = removeEmptyOrNull(DataSent)

            GetData(DataSent)

            // setData(GetData(DataSent)) react





        }


        //Initial Position of the map
        else {
            const Initial_Position = [
                {
                    "name": "Initial Position", "gps": [51.505, -0.09], "likes": 0, "retweets": 0, "text": "Initial Positioning, of the map"
                }, {
                    "name": "Initial Position", "gps": [52.505, -0.09], "likes": 1, "retweets": 0, "text": "Initial Positioning of the map"
                }, {
                    "name": "Initial Position", "gps": [51.505, -0.19], "likes": 2, "retweets": 0, "text": "nop"
                }]









            if (Word == "chart") {
                var DataforDiagram = {
                    labels: [],
                    datasets: [
                        {
                            label: "Tweets",
                            data: [],
                            fill: true,
                            backgroundColor: [
                                'rgba(255, 255, 255, 0.6)',
                                'rgba(255, 255, 255, 0.6)',
                                'rgba(255, 255, 255, 0.6)'
                            ],
                            borderWidth: 1
                        }
                    ]
                };
                return DataforDiagram
            }
            return Initial_Position
        }
    }


    //This function retreives the data from back end
    function GetData(DataSent) {
        var DataforDiagram = {
            labels: [],
            datasets: [
                {
                    label: "Tweets",
                    data: [],
                    fill: true,
                    backgroundColor: [],
                    borderColor: [
                        "#111",
                        "#111",
                        "#111",
                        "#111",
                        "#111"
                    ],
                    borderWidth: 1
                }
            ]
        };
        let theArray = []
        let Tweetslabel = []
        let TweetsCount = []
        let TweetsColor = []
        var array = {}
        var WordCloudArray = []


        axios.post('http://localhost:5000/api/v1.1/TweetRetrieval', DataSent)
            .then(function (response) {
                let groupby = "group_by_" + DataSent.Dlabel
                console.log(response)
                if (response.data[0].length > 1) {
                    for (var i = 0; i < response.data[0].length; i++) {
                        const newItem = {
                            "gps": [response.data[0][i]._source.coordinates[1], response.data[0][i]._source.coordinates[0]],
                            "likes": response.data[0][i]._source.favorite_count,
                            "name": response.data[0][i]._source.user.name,
                            "text": response.data[0][i]._source.text,
                            "retweets": response.data[0][i]._source.retweet_count,
                            "date": response.data[0][i]._source.created_at
                        };
                        theArray.push(newItem)
                    }

                    for (var temp = 0; temp < response.data[1][groupby].buckets.length; temp++) {
                        if (response.data[1][groupby].buckets[temp].doc_count >= 1) {

                            Tweetslabel.push(response.data[1][groupby].buckets[temp].key_as_string)
                            TweetsCount.push(response.data[1][groupby].buckets[temp].doc_count)
                            TweetsColor.push(getRandomColorHex())
                        }

                    }
                    for (var Counter = 0; Counter < response.data[0].length; Counter++) {
                        var tempWord = response.data[0][Counter]._source.text.split(/[.,\/ -]+/)

                        for (var j = 0; j < tempWord.length; j++) {
                            if (array[tempWord[j]]) array[tempWord[j]]++
                            else array[tempWord[j]] = 1
                        }
                    }
                    Object.keys(array).map(function (keys) {
                        WordCloudArray.push({ text: keys, value: array[keys] })
                    })
                    console.log(WordCloudArray)
                    DataforDiagram.labels = Tweetslabel
                    DataforDiagram.datasets[0].data = TweetsCount
                    DataforDiagram.datasets[0].backgroundColor = TweetsColor
                    theArray.sort((a, b) => parseFloat(b.likes) - parseFloat(a.likes));
                    setChartdata(DataforDiagram)
                    setMapData(theArray)
                    setWordCloud(WordCloudArray)
                }

                else {
                    console.log("There is no data retreived")
                }
            })
    }



    return (
        <div>
            <div>
                <div className="row InputSyle">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="Time">Select a time interval</label>
                        <input type="date" className="form-control rounded-0" id="Start_Time" name="Start_Time" placeholder="Start_Time" />
                        <input type="date" className="form-control rounded-0" id="End_Time" name="End_Time" placeholder="End_Time" />
                        <label htmlFor="Text" >Type a word you want to search for</label>
                        <input type="text" className="form-control rounded-0" id="Text" name="Text" placeholder="Text" />


                        <div >Please Choose A label you want to group the data by</div>
                        <Dropdown options={LablesArr} onChange={(nextValue) => DiagramLabel = nextValue.value} placeholder="Select an option" />



                        <Button variant="primary" onClick={() => { handleShow(); SendData() }}>Show Tweets Distripution</Button>





                        <div id="Username_error"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="Username" id="textStyle">Select an area to view the tweets in that are by pressing Ctrl+Left mouse click</label>
                    </div>
                </div>
            </div>

            <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {MapData && MapData.map((array_of_position) => (

                    <Marker position={array_of_position.gps} icon={changeicon(array_of_position)}>

                        <Popup>
                            <div>
                                {array_of_position.name}
                            </div>
                            <div>
                                {array_of_position.text}
                            </div>
                            <div className="Stylingfo">
                                <FaHeart />{array_of_position.likes}
                                <FaRetweet />{array_of_position.retweets}
                            </div>

                        </Popup>
                    </Marker>
                )

                )}

                <AreaSelect />
            </MapContainer>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Bar data={Chartdata} options={Chartoptions} />

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleShowWord} >WordCloud</Button>
                    <Button variant="primary" onClick={handleShowTweets} >Top Tweets</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showWordCloud}
                onHide={handleCloseWord}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Word Cloud</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ height: 500, width: 1000 }}>
                        <ReactWordcloud words={WordCloud} options={WordCloudOptions} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseWord}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleShowTweets} >Top Tweets</Button>
                    <Button variant="primary" onClick={handleShow} >Chart</Button>
                </Modal.Footer>
            </Modal>

            <Modal
                show={ShowTweets}
                onHide={HandleCloseTweets}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Word Cloud</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <div className="row selection-area" >
                        {MapData && MapData.map((array_of_position) => (
                            <div >
                                <div className="n-thing-header__title">{array_of_position.name}</div>
                                <ul>
                                    <li> {array_of_position.text}
                                        <ul><li className="Stylingfo"> <FaHeart />{array_of_position.likes}
                                            <FaRetweet />{array_of_position.retweets}
                                        </li>
                                        </ul>
                                    </li>

                                </ul>

                            </div>

                        )
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>

                    <Button variant="secondary" onClick={HandleCloseTweets}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleShowWord} >WordCloud</Button>
                    <Button variant="primary" onClick={handleShow} >Chart</Button>
                </Modal.Footer>
            </Modal>



        </div>

    );

}






function getRandomColorHex() {
    var hex = "0123456789ABCDEF",
        color = "#";
    for (var i = 1; i <= 6; i++) {
        color += hex[Math.floor(Math.random() * 16)];
    }
    return color;
}


//This function purpose is to change the icon depending on the popularity of the tweet
function changeicon(arr) {
    if (arr.likes >= 100) {
        icon = redIcon
    }
    else if (arr.likes < 100 && arr.likes >= 20) {
        icon = yellowIcon
    }
    else {
        icon = blueIcon
    }
    return icon
}


export default Contact;

