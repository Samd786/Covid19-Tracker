import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import "./App.css";
import "leaflet/dist/leaflet.css";
import { sortData, prettyPrintStat } from "./util";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [table, setTable] = useState([]);
  const [mapCountry, setMapCountry] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https:disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    setCountry(countryCode);
    setCountryInfo(jsonResponse);
    setMapCenter([jsonResponse.countryInfo.lat, jsonResponse.countryInfo.long]);
    setMapZoom(4);
  };

  useEffect(() => {
    const arr = async () => {
      const response = await fetch("https:disease.sh/v3/covid-19/all");
      const jsonResponse = await response.json();

      setCountryInfo(jsonResponse);
    };
    arr();
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      const jsonResponse = await response.json();
      //console.log(jsonResponse);
      const countries = jsonResponse.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      setMapCountry(jsonResponse);
      setCountries(countries);
      const sortedData = sortData(jsonResponse);
      setTable(sortedData);
    };
    getCountries();
  }, []);

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1> Covid-19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered Cases"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Death Cases"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountry}
        />
      </div>
      <Card className="app_right">
        <CardContent>
          <h2>Live Cases by country</h2>
          <Table countries={table} />
          <h2>Worldwide new {casesType}</h2>
          <LineGraph casesType={casesType} />
        </CardContent>
        {/*Table*/}
        {/*Graph*/}
      </Card>
    </div>
  );
}

export default App;
