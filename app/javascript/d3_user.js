var cleanData = [];
var rejectData = [];
var testID = "K000384";
var missMinMax = [];
var partyMinMax = [];
var statsParty = {};
var statsMiss = {};
var statsR = {
  house: {
    missed: {},
    party: {}
  },
  senate: {
    missed: {},
    party: {}
  }
};
var statsD = {
  house: {
    missed: {},
    party: {}
  },
  senate: {
    missed: {},
    party: {}
  }
};
var rColors = ['red', 'blue'];
var dColors = ['blue', 'red'];

function stats() {
  // takes in cleanData
  // arranges useful stats into arrays and objects for recall
  var missArr = [];
  var voteArr = [];
  var houseMissR =[];
  var houseMissD = [];
  var senateMissR = [];
  var senateMissD =[];
  var houseVoteR = [];
  var houseVoteD = [];
  var senateVoteR = [];
  var senateVoteD = [];


  for (var i = 0; i < cleanData.length; i++) {
    // vote
    if (cleanData[i].partyVote >= 60) {
      voteArr.push(cleanData[i].partyVote);
      switch (cleanData[i].chamber) {

        case "senate":
          switch (cleanData[i].party) {
            case "R":
              senateVoteR.push(cleanData[i].partyVote);
            break;

            case "D":
              senateVoteD.push(cleanData[i].partyVote);
            break;
          };
        break;

        case "house":
          switch (cleanData[i].party) {

            case "R":
              houseVoteR.push(cleanData[i].partyVote);
            break;

            case "D":
              houseVoteD.push(cleanData[i].partyVote);
            break;
          };
        break;
      };
    };

    if (cleanData[i].missVote <= 45) {
      // missed votes
      missArr.push(cleanData[i].missVote);
      switch (cleanData[i].chamber) {
        case "senate":
          switch (cleanData[i].party) {
            case "R":
              senateMissR.push(cleanData[i].missVote);
            break;

            case "D":
              senateMissD.push(cleanData[i].missVote);
            break;

            default:
          }
        break;

        case "house":
          switch (cleanData[i].party) {
            case "R":
              houseMissR.push(cleanData[i].missVote);
            break;

            case "D":
              houseMissD.push(cleanData[i].missVote);
            break;

            default:
          }
        break;
        default:

      }
    };
  };
  var missMin = d3.min(missArr);
  var missMax = d3.max(missArr);
  var partyMin = d3.min(voteArr);
  var partyMax = d3.max(voteArr);
  missMinMax.push(missMin, missMax);
  partyMinMax.push(partyMin, partyMax);

  //stats
    // total stats across both chambers and parties
      // for pct vote with party
  statsParty.mean = d3.mean(voteArr);
  statsParty.sd = d3.deviation(voteArr);
  statsParty.firstSD = [statsParty.mean - statsParty.sd, statsParty.mean + statsParty.sd];
  statsParty.median = d3.median(voteArr);
  statsParty.quartiles = [d3.min(voteArr), d3.quantile(voteArr.sort(), 0.25), d3.quantile(voteArr.sort(), 0.5), d3.quantile(voteArr.sort(), 0.75), d3.max(voteArr)];

      // for pct missed votes
  statsMiss.mean = d3.mean(missArr);
  statsMiss.sd = d3.deviation(missArr);
  statsMiss.firstSD = [statsMiss.mean - statsMiss.sd, statsMiss.mean + statsMiss.sd];
  statsMiss.median = d3.median(missArr);
  statsMiss.quartiles = [d3.min(missArr), d3.quantile(missArr.sort(), 0.25), d3.quantile(missArr.sort(), 0.5), d3.quantile(missArr.sort(), 0.75), d3.max(missArr)];

  var statsList = [statsD.house.missed, statsD.house.party, statsD.senate.missed, statsD.senate.party, statsR.house.missed, statsR.house.party, statsR.senate.missed, statsR.senate.party];

  var arrList = [houseMissD, houseVoteD, senateMissD, senateVoteD, houseMissR, houseVoteR, senateMissR, senateVoteR];

  for (var i = 0; i < statsList.length; i++) {
    statsList[i].mean = d3.mean(arrList[i]);
    statsList[i].sd = d3.deviation(arrList[i]);
    statsList[i].firstSD = [statsList[i].mean - statsList[i].sd, statsList[i].mean + statsList[i].sd];
    statsList[i].median = d3.median(arrList[i]);
    statsList[i].quartiles = [d3.min(arrList[i]), d3.quantile(arrList[i].sort(), 0.25), d3.quantile(arrList[i].sort(), 0.5), d3.quantile(arrList[i].sort(), 0.75), d3.max(arrList[i])];
  };
  // console.log(statsD);
  // console.log(statsR);
};

function votingDonut(id) {
  // id is the id of the congressperson you want to find
  // target can be two things...
  // ... party means voting with their party
  // ... miss means missed votes vs attended votes

  // find data from id
  var member = {};
  for (var i = 0; i < cleanData.length; i++) {
    if (cleanData[i].id === id) {
      member = cleanData[i];
    };
  };
  // console.log(member);

  var dataSet = [
    {
      label: member.name + " voted with their party",
      count: member.partyVote
    },
    {
      label: member.name + " voted against their party",
      count: 100-member.partyVote
    }
  ];

  switch (member.party) {
    case "R":
      var color = d3.scaleOrdinal()
          .domain([dataSet[0].label, dataSet[1].label])
          .range(['red', 'blue']);
      break;
    case "D":
      var color = d3.scaleOrdinal()
          .domain([dataSet[0].label, dataSet[1].label])
          .range(['blue', 'red']);
      break;
    default:
      var color = d3.scaleOrdinal()
          .domain(dataSet)
          .range(['purple', 'green']);
  };

  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 75;

  var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

  var labelArc = d3.arc()
    	.outerRadius(radius - 40)
    	.innerRadius(radius - 40);


  var pie = d3.pie()
	  .value(function(d) { return d.count; })(dataSet);

  var svg = d3.select(".party-chart")
  	.append("svg")
  	.attr("width", width)
   	.attr("height", height)
   		.append("g")
   		.attr("transform", "translate(" + width/2 + "," + height/2 +")"); // Moving the center point. 1/2 the width and 1/2 the height

  var g = svg.selectAll("arc")
 	  .data(pie)
  	.enter().append("g")
  	.attr("class", "arc");

  g.append("path")
  	.attr("d", arc)
  	.style("fill", function(d) { return color(d.data.label);})
    .each(function(d) { this._current = d; }); // store the initial angles

  g.append("text")
  	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
  	.text(function(d) { return d.data.count.toFixed(2) + "%";})
  	.style("fill", "#fff")
    .each(function(d) { this._current = d; }); // store the initial angles

  // make a legend
  function makeLegend() {
    var legend = $('.party-tooltip');
    legend.empty();
    for (var i = 0; i < dataSet.length; i++) {
      var row = $('<div/>');
      row.attr("class", "row");

      var textCol = $('<div/>');
      textCol.attr("class", "col s6 m6");

      var svgCol = $('<div/>');
      svgCol.attr("class", "col s6 m6");

      var label = dataSet[i].label + " " + dataSet[i].count.toFixed(2) + "% of the time.";

      var svg = $('<svg/>');
      svg.attr({
        "width": "120",
        "height": "120"
      });

      var rect = $('<rect/>');
      rect.attr({
        "width": "25",
        "height": "25",
        "style": color.range[i]
      });

      svg.append(rect);

      textCol.append(label);
      svgCol.append(svg);
      row.append(textCol).append(svgCol);
      legend.append(row);
    };
  };

  makeLegend();

  // add in transitory functions
  function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
  }

  function labelarcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return "translate(" + labelArc.centroid(i(t)) + ")";
      };
  }

  function change(val) {
    // console.log(val);
    // check the passed value from the button to determine the dataset
    switch (val) {
      // for the inidividual
      case "member":
        dataSet = [
          {
            label: member.name + " voted with their party",
            count: member.partyVote
          },
          {
            label: member.name + " voted against their party",
            count: 100-member.partyVote
          }
        ];
        break;
      // for the chamber, it gets a little more complicated
      case "chamber":
        switch (details.roles[0].chamber) {
          case "Senate":
            dataSet = [
              {
                label: "The average Senator voted with their party",
                count: d3.mean([statsR.senate.party.mean, statsD.senate.party.mean])
              },
              {
                label: "The average Senator voted against their party",
                count: 100-d3.mean([statsR.senate.party.mean, statsD.senate.party.mean])
              }
            ];
            break;
          case "House":
            dataSet = [
              {
                label: "The average Representative voted with their party",
                count: d3.mean([statsR.house.party.mean, statsD.house.party.mean])
              },
              {
                label: "The average Represenative voted against their party",
                count: 100-d3.mean([statsR.house.party.mean, statsD.house.party.mean])
              }
            ];
            break;
        };
        break;
      // for the party, it's still complicated
      case "party":
        switch (details.party) {
          case "R":
            dataSet = [
              {
                label: "The average Republican voted with their party",
                count: d3.mean([statsR.house.party.mean, statsR.senate.party.mean])
              },
              {
                label: "The average Republican voted against their party",
                count: 100-d3.mean([statsR.house.party.mean, statsR.senate.party.mean])
              }
            ];
            break;
          case "D":
            dataSet = [
              {
                label: "The average Democrat voted with their party",
                count: d3.mean([statsD.house.party.mean, statsD.senate.party.mean])
              },
              {
                label: "The average Democrat voted against their party",
                count: 100-d3.mean([statsD.house.party.mean, statsD.senate.party.mean])
              }
            ];
            break;
          default:
            dataSet = [
              {
                label: "There is no reliable data on independents",
                count: 1
              },
              {
                label: "There is no reliable data on independents",
                count: 1
              }
            ];
        };
        break;
    };

  	var pie = d3.pie()
  		.value(function(d) { return d.count; })(dataSet);
  	path = d3.select(".party-chart").selectAll("path").data(pie); // Compute the new angles
  	path.transition().duration(500).attrTween("d", arcTween); // Smooth transition with arcTween
  	d3.selectAll("text").data(pie).transition().duration(500).attrTween("transform", labelarcTween) // Smooth transition with labelarcTween
    .text(function(d) { return d.data.count.toFixed(2) + "%";}); // recomputing the centroid and translating the text accordingly.

    makeLegend();
  };

  d3.selectAll('.party-btn')
      .on('click touch', function() {
        change(d3.select(this).attr("data-val"));
      });
};

function missedDonut(id) {
  // id is the id of the congressperson you want to find

  // find data from id
  var member = {};
  for (var i = 0; i < cleanData.length; i++) {
    if (cleanData[i].id === id) {
      member = cleanData[i];
    };
  };
  // console.log(member);

  var dataSet = [
    {
      label: member.name + " missed a vote",
      count: member.missVote
    },
    {
      label: member.name + " voted",
      count: 100-member.missVote
    }
  ];

  switch (member.party) {
    case "R":
      var color = d3.scaleOrdinal()
          .domain([dataSet[0].label, dataSet[1].label])
          .range(['darkGreen', 'black']);
      break;
    case "D":
      var color = d3.scaleOrdinal()
          .domain([dataSet[0].label, dataSet[1].label])
          .range(['black', 'darkGreen']);
      break;
    default:
      var color = d3.scaleOrdinal()
          .domain(dataSet)
          .range(['purple', 'green']);
  };

  var width = 360;
  var height = 360;
  var radius = Math.min(width, height) / 2;
  var donutWidth = 75;

  var arc = d3.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

  var labelArc = d3.arc()
    	.outerRadius(radius - 40)
    	.innerRadius(radius - 40);


  var pie = d3.pie()
	  .value(function(d) { return d.count; })(dataSet);

  var svg = d3.select(".vote-chart")
  	.append("svg")
  	.attr("width", width)
   	.attr("height", height)
   		.append("g")
   		.attr("transform", "translate(" + width/2 + "," + height/2 +")"); // Moving the center point. 1/2 the width and 1/2 the height

  var g = svg.selectAll("arc")
 	  .data(pie)
  	.enter().append("g")
  	.attr("class", "arc");

  g.append("path")
  	.attr("d", arc)
  	.style("fill", function(d) { return color(d.data.label);})
    .each(function(d) { this._current = d; }); // store the initial angles

  g.append("text")
  	.attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
  	.text(function(d) { return d.data.count.toFixed(2) + "%";})
  	.style("fill", "#fff")
    .each(function(d) { this._current = d; }); // store the initial angles

  // make a legend
  function makeLegend() {
    var legend = $('.vote-tooltip');
    legend.empty();
    for (var i = 0; i < dataSet.length; i++) {
      var row = $('<div/>');
      row.attr("class", "row");

      var textCol = $('<div/>');
      textCol.attr("class", "col s6 m6");

      var svgCol = $('<div/>');
      svgCol.attr("class", "col s6 m6");

      var label = dataSet[i].label + " " + dataSet[i].count.toFixed(2) + "% of the time.";

      var svg = $('<svg/>');
      svg.attr({
        "width": "120",
        "height": "120"
      });

      var rect = $('<rect/>');
      rect.attr({
        "width": "25",
        "height": "25",
        "style": color.range[i]
      });

      svg.append(rect);

      textCol.append(label);
      svgCol.append(svg);
      row.append(textCol).append(svgCol);
      legend.append(row);
    };
  };

  makeLegend();

  // add in transitory functions
  function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
  }

  function labelarcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return "translate(" + labelArc.centroid(i(t)) + ")";
      };
  }

  function change(val) {
    // console.log(val);
    // check the passed value from the button to determine the dataset
    switch (val) {
      // for the inidividual
      case "member":
        dataSet = [
          {
            label: member.name + " missed a vote",
            count: member.missVote
          },
          {
            label: member.name + " voted",
            count: 100-member.missVote
          }
        ];
        break;
      // for the chamber, it gets a little more complicated
      case "chamber":
        switch (details.roles[0].chamber) {
          case "Senate":
            dataSet = [
              {
                label: "The average Senator missed votes ",
                count: d3.mean([statsR.senate.missed.mean, statsD.senate.missed.mean])
              },
              {
                label: "The average Senator voted ",
                count: 100-d3.mean([statsR.senate.missed.mean, statsD.senate.missed.mean])
              }
            ];
            break;
          case "House":
            dataSet = [
              {
                label: "The average Representative missed votes",
                count: d3.mean([statsR.house.missed.mean, statsD.house.missed.mean])
              },
              {
                label: "The average Represenative voted",
                count: 100-d3.mean([statsR.house.missed.mean, statsD.house.missed.mean])
              }
            ];
            break;
        };
        break;
      // for the party, it's still complicated
      case "party":
        switch (details.party) {
          case "R":
            dataSet = [
              {
                label: "The average Republican missed votes ",
                count: d3.mean([statsR.house.missed.mean, statsR.senate.missed.mean])
              },
              {
                label: "The average Republican voted ",
                count: 100-d3.mean([statsR.house.missed.mean, statsR.senate.missed.mean])
              }
            ];
            break;
          case "D":
            dataSet = [
              {
                label: "The average Democrat missed votes ",
                count: d3.mean([statsD.house.missed.mean, statsD.senate.missed.mean])
              },
              {
                label: "The average Democrat voted ",
                count: 100-d3.mean([statsD.house.missed.mean, statsD.senate.missed.mean])
              }
            ];
            break;
          default:
            dataSet = [
              {
                label: "There is no reliable data on independents",
                count: 1
              },
              {
                label: "There is no reliable data on independents",
                count: 1
              }
            ];
        };
        break;
    };

  	var pie = d3.pie()
  		.value(function(d) { return d.count; })(dataSet);
  	path = d3.select(".vote-chart").selectAll("path").data(pie); // Compute the new angles
  	path.transition().duration(500).attrTween("d", arcTween); // Smooth transition with arcTween
  	d3.selectAll("text").data(pie).transition().duration(500).attrTween("transform", labelarcTween) // Smooth transition with labelarcTween
    .text(function(d) { return d.data.count.toFixed(2) + "%";}); // recomputing the centroid and translating the text accordingly.

    makeLegend();
  };

  d3.selectAll('.vote-btn')
      .on('click touch', function() {
        change(d3.select(this).attr("data-val"));
      });
};

function sunBurstGen(roll) {
  var 


  var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;

  var x = d3.scale.linear()
      .range([0, 2 * Math.PI]);

  var y = d3.scale.linear()
      .range([0, radius]);

  var color = d3.scale.category20c();

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

  var partition = d3.layout.partition()
      .value(function(d) { return d.count; });

  var arc = d3.svg.arc()
      .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
      .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
      .innerRadius(function(d) { return Math.max(0, y(d.y)); })
      .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });

  var g = svg.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("g");

  var path = g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
    .on("click", click);

  var text = g.append("text")
    .attr("transform", function(d) { return "rotate(" + computeTextRotation(d) + ")"; })
    .attr("x", function(d) { return y(d.y); })
    .attr("dx", "6") // margin
    .attr("dy", ".35em") // vertical-align
    .text(function(d) { return d.name; });

  function click(d) {
    // fade out all text elements
    text.transition().attr("opacity", 0);

    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d))
      .each("end", function(e, i) {
          // check if the animated element's data e lies within the visible angle span given in d
          if (e.x >= d.x && e.x < (d.x + d.dx)) {
            // get a selection of the associated text element
            var arcText = d3.select(this.parentNode).select("text");
            // fade in the text element and recalculate positions
            arcText.transition().duration(750)
              .attr("opacity", 1)
              .attr("transform", function() { return "rotate(" + computeTextRotation(e) + ")" })
              .attr("x", function(d) { return y(d.y); });
          }
      });
  }

  d3.select(self.frameElement).style("height", height + "px");

  // Interpolate the scales!
  function arcTween(d) {
    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
        yd = d3.interpolate(y.domain(), [d.y, 1]),
        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
    return function(d, i) {
      return i
          ? function(t) { return arc(d); }
          : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
    };
  }

  function computeTextRotation(d) {
    return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
  }
};
