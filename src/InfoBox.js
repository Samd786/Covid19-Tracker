import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import "./infobox.css";

function InfoBox(props) {
  return (
    <Card
      className={`infoBox ${props.active && "infoBox--selected"} ${
        props.isRed && "infoBox--red"
      }`}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infoBox_title" color="textSecondary">
          {props.title}
        </Typography>
        <h2
          className={`infoBox__cases ${!props.isRed && "infoBox__cases--green"}
          }`}
        >
          {props.cases}
        </h2>
        <Typography className="infoBox_total" color="textSecondary">
          {props.total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
