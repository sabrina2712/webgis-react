
import React from "react";
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon, RegularShape } from 'ol/style';
import { fromLonLat, get } from "ol/proj"
import dataGer from "./germany.json"

import Overlay from 'ol/Overlay';
import distData from "../distrct-ger.json"

console.log(distData)

        class MainMap extends React.Component {
            constructor() {
                super();
                this.onClickHandler = this.onClickHandler
                this.state = {
                    stateRevenue: {

                        "DE-BB": 5627,
                        "DE-BE": 5500,
                        "DE-BW": 3231,
                        "DE-BY": 1813,
                        "DE-HB": 9792,
                        "DE-HE": 4538,
                        "DE-HH": 2883,
                        "DE-MV": 9752,
                        "DE-NI": 5550,
                        "DE-NW": 282,
                        "DE-RP": 1469,
                        "DE-SH": 9673,
                        "DE-SL": 7858,
                        "DE-SN": 3835,
                        "DE-ST": 3852,
                        "DE-TH": 4264
                    },
                    distRev: {
                        0: 824,
                        1: 3176,
                        2: 2578,
                        3: 2014,
                        4: 2673,
                        5: 3503,
                        6: 3226,
                        7: 2074,
                        8: 2446,
                        9: 964,
                        10: 2436,
                        11: 1625,
                        12: 2795,
                        13: 1717,
                        14: 2323,
                        15: 3825,
                        16: 783,
                        17: 2702,
                        18: 3877,
                        19: 3246,
                        20: 727,
                        21: 1605,
                        22: 3144,
                        23: 894,
                        24: 1232,
                        25: 514,
                        26: 3401,
                        27: 681,
                        28: 3040,
                        29: 1411,
                        30: 456,
                        31: 694,
                        32: 1056,
                        33: 1507,
                        34: 1124,
                        35: 164,
                        36: 1558,
                        37: 1086,
                        38: 687,
                        39: 2197,
                        40: 3077,
                        41: 1662,
                        42: 373,
                        43: 3916,
                        44: 3282,
                        45: 2399,
                        46: 645,
                        47: 1676,
                        48: 122,
                        49: 3275,
                        50: 763,
                        51: 182,
                        52: 89,
                        53: 36,
                        54: 2907,
                        55: 12,
                        56: 2976,
                        57: 2565,
                        58: 3038,
                        59: 1098,
                        60: 251,
                        61: 1562,
                        62: 3255,
                        63: 55,
                        64: 3872,
                        65: 3471,
                        66: 1841,
                        67: 715,
                        68: 2192,
                        69: 2396,
                        70: 3580,
                        71: 1660,
                        72: 982,
                        73: 1077,
                        74: 991,
                        75: 3210,
                        76: 1505,
                        77: 1458,
                        78: 2254,
                        79: 282,
                        80: 2801,
                        81: 864,
                        82: 3303,
                        83: 1614,
                        84: 3239,
                        85: 1818,
                        86: 2361,
                        87: 2152,
                        88: 3509,
                        89: 1677,
                        90: 522,
                        91: 3176,
                        92: 972,
                        93: 2701,
                        94: 59,
                        95: 2101,
                        96: 3121,
                        97: 831,
                        98: 369,
                        99: 337,
                        100: 568,
                        101: 1095,
                        102: 3035,
                        103: 2823,
                        104: 3187,
                        105: 2953,
                        106: 3958,
                        107: 598,
                        108: 236,
                        109: 2259,
                        110: 1999,
                        111: 3684,
                        112: 3794,
                        113: 2744,
                        114: 1742,
                        115: 3864,
                        116: 3953,
                        117: 1028,
                        118: 2263,
                        119: 798,
                        120: 2879,
                        121: 3076,
                        122: 645,
                        123: 821,
                        124: 3679,
                        125: 3234,
                        126: 3088,
                        128: 258,
                        129: 1370,
                        130: 1589,
                        131: 3877,
                        132: 113,
                        133: 322,
                        134: 2664,
                        135: 3224,
                        136: 1118,
                        137: 1853,
                        138: 1859,
                        139: 568,
                        140: 3172,
                        141: 2413,
                        142: 2915,
                        143: 2286,
                        144: 1088,
                        145: 421,
                        146: 1364,
                        147: 1580,
                        148: 2696,
                        149: 1076,
                        150: 2242,
                        151: 1465,
                        152: 659,
                        153: 862,
                        154: 3445,
                        155: 782,
                        156: 2042,
                        157: 3357,
                        158: 79,
                        159: 2712,
                        160: 2252,
                        161: 42,
                        162: 871,
                        163: 1457,
                        164: 1840,
                        165: 3321,
                        166: 1677,
                        167: 3502,
                        168: 2476,
                        169: 2945,
                        170: 1068,
                        171: 3847,
                        172: 3224,
                        173: 3807,
                        174: 2416,
                        175: 665,
                        176: 186,
                        177: 931,
                        178: 1358,
                        179: 1538,
                        180: 3048,
                        181: 804,
                        182: 1904,
                        183: 717,
                        184: 1312,
                        185: 2509,
                        186: 3494,
                        187: 2474,
                        188: 855,
                        189: 1232,
                        190: 1272,
                        191: 1462,
                        192: 1481,
                        193: 3824,
                        194: 1041,
                        195: 1259,
                        196: 1138,
                        197: 1772,
                        198: 2596,
                        199: 2086,
                        200: 1001,
                        201: 3571,
                        202: 1730,
                        203: 955,
                        204: 106,
                        205: 1490,
                        206: 1499,
                        207: 2908,
                        208: 1502,
                        209: 1617,
                        210: 773,
                        211: 3081,
                        212: 3026,
                        213: 3967,
                        214: 1328,
                        215: 3035,
                        216: 1645,
                        217: 829,
                        218: 336,
                        219: 907,
                        220: 2003,
                        221: 3630,
                        222: 3235,
                        223: 1549,
                        224: 2770,
                        225: 1129,
                        226: 1432,
                        227: 877,
                        228: 3408,
                        229: 2142,
                        230: 1573,
                        231: 903,
                        232: 2800,
                        233: 3458,
                        234: 3511,
                        235: 1066,
                        236: 910,
                        237: 2945,
                        238: 372,
                        239: 3196,
                        240: 333,
                        241: 178,
                        242: 279,
                        243: 2856,
                        244: 1410,
                        245: 2048,
                        246: 95,
                        247: 2921,
                        248: 341,
                        249: 58,
                        250: 2777,
                        251: 3419,
                        252: 3947,
                        253: 1989,
                        254: 2862,
                        255: 2286,
                        256: 788,
                        257: 433,
                        258: 634,
                        259: 2337,
                        260: 2349,
                        261: 2220,
                        262: 841,
                        263: 1344,
                        264: 3186,
                        265: 2784,
                        266: 722,
                        267: 167,
                        268: 1356,
                        269: 228,
                        270: 2081,
                        271: 1495,
                        272: 81,
                        273: 1366,
                        274: 1303,
                        275: 949,
                        276: 2295,
                        277: 2339,
                        278: 1958,
                        279: 861,
                        280: 1573,
                        281: 3035,
                        282: 2752,
                        283: 2338,
                        284: 3123,
                        285: 1765,
                        286: 3412,
                        287: 1145,
                        288: 3403,
                        289: 1288,
                        290: 1673,
                        291: 1148,
                        292: 2908,
                        293: 2914,
                        294: 2080,
                        295: 385,
                        296: 53,
                        297: 2575,
                        298: 3902,
                        299: 154,
                        300: 2950,
                        301: 2776,
                        302: 3292,
                        303: 1653,
                        304: 2496,
                        305: 3727,
                        306: 1108,
                        307: 2156,
                        308: 1943,
                        309: 3480,
                        310: 2625,
                        311: 3092,
                        312: 3637,
                        313: 3592,
                        314: 3251,
                        315: 2983,
                        316: 3177,
                        317: 2401,
                        318: 3149,
                        319: 709,
                        320: 3814,
                        321: 2317,
                        322: 509,
                        323: 3955,
                        324: 2009,
                        325: 1667,
                        326: 3052,
                        327: 718,
                        328: 2085,
                        329: 1286,
                        330: 1489,
                        331: 929,
                        332: 946,
                        333: 75,
                        334: 1832,
                        335: 3771,
                        336: 1254,
                        337: 1242,
                        338: 1043,
                        339: 1963,
                        340: 2596,
                        341: 3956,
                        342: 3271,
                        343: 3350,
                        344: 948,
                        345: 1504,
                        346: 1104,
                        347: 1156,
                        348: 2758,
                        349: 3768,
                        350: 3384,
                        351: 2130,
                        352: 188,
                        353: 1569,
                        354: 695,
                        355: 3995,
                        356: 1274,
                        357: 1031,
                        358: 2626,
                        359: 1228,
                        360: 3734,
                        361: 80,
                        362: 718,
                        363: 2300,
                        364: 3123,
                        365: 3337,
                        366: 1282,
                        367: 1613,
                        368: 170,
                        369: 3100,
                        370: 3711,
                        371: 2527,
                        372: 2447,
                        373: 1957,
                        374: 594,
                        375: 513,
                        376: 924,
                        377: 2088,
                        378: 3539,
                        379: 1152,
                        380: 2504,
                        381: 3762,
                        382: 1299,
                        383: 1445,
                        384: 1105,
                        385: 922,
                        386: 2050,
                        387: 1012,
                        388: 1890,
                        389: 1573,
                        390: 1923,
                        391: 3892,
                        392: 3987,
                        393: 1575,
                        394: 2324,
                        395: 2556,
                        396: 2795,
                        397: 3373,
                        398: 2179,
                        399: 297,
                        400: 944,
                        401: 819,
                        402: 2752,
                        403: 985,
                        404: 921,
                        405: 3651,
                        406: 3477,
                        407: 3623,
                        408: 462,
                        409: 171,
                        410: 2247,
                        411: 1187,
                        412: 3356,
                        413: 3002,
                        414: 281,
                        415: 3876,
                        416: 2364,
                        417: 2281,
                        418: 3674,
                        419: 3625,
                        420: 1628,
                        421: 2543,
                        422: 1680,
                        423: 985,
                        424: 137,
                        425: 1267,
                        426: 571,
                        427: 1291,
                        428: 3571,
                        429: 1889,
                        430: 3867,
                        431: 1445,
                        432: 2049,
                        433: 1307,
                    },


                    colors: { red: "rgba(255,0,0,1)", green: "rgba(0,255,0,1)", blue: "rgba(0,0,255,1)", purple: "rgba(145, 61, 136, 1)" },
                    info: "",
                    map: this.map,
                    selectedState: null,
                    infoText : ""
                }
            }
            getColor = (d) => {

                return d > 6000 ? '#800026' :
                    d > 5000 ? '#BD0026' :
                        d > 4000 ? '#E31A1C' :
                            d > 3000 ? '#FC4E2A' :
                                d > 2000 ? '#FD8D3C' :
                                    d > 1000 ? '#FEB24C' :
                                        d > 500 ? '#FED976' :
                                            '#FFEDA0';
            }


            getLegend = () => {
                return <>
                    <div style={{ width: "20px", height: "20px", backgroundColor: this.getColor(1000) }}><span className="legend-span">{">"}1000</span></div>
                    <div style={{ width: "20px", height: "20px", backgroundColor: this.getColor(2000) }}><span className="legend-span">{">"}2000</span></div>
                    <div style={{ width: "20px", height: "20px", backgroundColor: this.getColor(3000) }}><span className="legend-span">{">"}3000</span></div>
                    <div style={{ width: "20px", height: "20px", backgroundColor: this.getColor(5000) }}><span className="legend-span">{">"}5000</span></div>
                    <div style={{ width: "20px", height: "20px", backgroundColor: this.getColor(6000) }}><span className="legend-span">{">"}6000</span></div>
                    <div style={{ width: "20px", height: "20px", backgroundColor: this.getColor(9000) }}><span className="legend-span">{">"}8000</span></div>

                </>
            }

            componentDidMount = () => {

                const map = this.props.map

                console.log("------- germany ----", this.props)
                ///revinue for districts Germany
                distData.features.forEach((f) => {
                    const stateOfThisFeature = f['id'];
                    const revenueForThisDist = this.state.distRev[stateOfThisFeature];
                    f.properties['reve'] = revenueForThisDist;

                });
        
        ///creating style for districts Germany
                const getStyleForDist = (f) => {
                    let id = f.get("id")
                    let name = f.get("name")
                    let rev = this.state.distRev[id]

                    console.log(rev)
                    return new Style({
                        stroke: new Stroke({
                            width: 2
                        }),
                        fill: new Fill({
                            color: this.getColor(f.get("reve"))
                        })
                    })
                }


            var vectorSourceDist = new VectorSource({
                features: [],
            });

            let vectorLayerDist = new VectorLayer({ style: getStyleForDist, source: vectorSourceDist });
            this.vectorLayerDist = vectorLayerDist;


        ///revinue for States Germany
        dataGer.features.forEach((f) => {
            const stateOfThisFeature = f.properties['id'];
            const revenueForThisState = this.state.stateRevenue[stateOfThisFeature];
            f.properties['revenue'] = revenueForThisState;

        });


        const getStyle = (f) => {
            let id = f.get("id")
            let name = f.get("name")
            let rev = this.state.stateRevenue[id]
            return new Style({
                stroke: new Stroke({
                    width: 2
                }),
                fill: new Fill({
                    color: this.getColor(f.get("revenue"))
                })
            })
        }
        var infoMy = document.getElementById('info');


        /**
         * Create an overlay to anchor the popup to the map.
         */
        /*
        var overlay = new Overlay({
            element: infoMy,
            autoPan: true,
                autoPanAnimation: {
                duration: 250
            }
            });
         */

        const overlay = this.props.overLayer
        var vectorSourceState = new VectorSource({
            features: new GeoJSON({
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857"
            }).readFeatures(dataGer),
        });

        let vectorLayerState = new VectorLayer({ style: getStyle, source: vectorSourceState });
      
        let stateRev = this.state.stateRevenue
        let info = this.state.info
        this.vectorLayerState = vectorLayerState;

        map.addLayer(vectorLayerState)

        map.addLayer(vectorLayerDist)

      

        //// map click function
        map.on('click', (evt) => {

            let pixel = evt.pixel;
            this.vectorLayerState.getFeatures(pixel).then((features) => {
                if (features.length < 1) return;
                let feature = features[0];
                console.log(feature)
                let stateName = feature.get("name");

                if (stateName) {

                    this.setState((state) => {
                        return { selectedState: stateName };
                    })
                }
            })
        map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            console.log(feature)
            let stateName = feature.get("name")

            console.log(stateName)
            let eachId = feature.get("id")
            console.log(stateRev)
            let curRev = stateRev[eachId]


            var coordinate = evt.coordinate;
            overlay.setPosition(coordinate);

            this.setState(()=>{})

            let info = document.getElementById("mapGermany")
            info.innerHTML = ` ${stateName} Rv: ${curRev}`
            let legend = document.getElementById("legend")

            //map present district data

            let infoDist = document.getElementById("info-dist")
            info.innerHTML = ` ${stateName} Rv: ${curRev}`
            })
        })
        }

        render() {
            if (this.vectorLayerDist) {
                let features = new GeoJSON({
                    dataProjection: "EPSG:4326",
                    featureProjection: "EPSG:3857"
                }).readFeatures(distData).filter((f) => {
                    console.log(f.get("NAME_1"), "==", this.state.selectedState, ": ", f.get("NAME_1") === this.state.selectedState)
                    return f.get("NAME_1") === this.state.selectedState
                })
                this.vectorLayerDist.getSource().clear();
                this.vectorLayerDist.getSource().addFeatures(features);
            }
            return (<div id="mapGermany" className="map" >
                <div id="infomapGermany" ></div>
                <div id="legend"><h3 className="legend-header">Legend </h3> {this.getLegend()}</div>
                <div id="info-dist"></div>
            </div>)
        }
}
export default MainMap;


