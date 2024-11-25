import * as d3 from 'd3';
import * as d3Sankey from "d3-sankey";

const width = 928;
const height = 600;
const format = d3.format(",.0f");
const linkColor = "source-target"; // source, target, source-target, or a color string.


// Constructs and configures a Sankey generator.
const sankey = d3Sankey.sankey()
  .nodeId(d => d.name)
  .nodeAlign(d3Sankey.sankeyJustify) // d3.sankeyLeft, etc.
  .nodeWidth(15)
  .nodePadding(10)
  .extent([[1, 5], [width - 1, height - 5]]);

  const data = await d3.json("data/jmu.json");

function data1() {

  const studentCost = data["student-costs"];
  var linkId = 4;
  const jmuNodes = [
    {name:1, title:"JMU Student", category:1, value:1},
    {name:2, title:"Fall", category:2, value:2},
    {name:3, title:"Spring", category:3, value:3}
  ];
  const jmuLinks = [
    {source:1,target:2,value:0},
    {source:1,target:3,value:0},
  ];

  studentCost.forEach(element => {
    if(element.type === "student itemized") {
      const semId = element.semester === "Fall" ? 2 : 3;
      jmuLinks[semId-2].value += element["in-state"];
      jmuNodes.push({name:linkId, title: element.name, category:4, value:1});
      jmuLinks.push({source:semId, target:linkId, value:element["in-state"]})
      linkId++;
    }
  });
  return {nodes:jmuNodes, links:jmuLinks};
}

function data2() {
  const studentCost = data["student-costs"];
  const feeNodes = [
    {name:1, title:"Auxiliary Comprehensive Fee", category: 1, value: 100}
  ];

  const feeLinks = [];
  var linkId = 3;

  studentCost.forEach(element => {
    if(element.type === "Auxiliary Comprehensive Fee Component") {
      feeNodes.push({name: linkId, title:element.name, category: linkId, value: 1});
      feeLinks.push({source: 1, target: linkId, value: element["amount"]});
    }
  })
  return {nodes: feeNodes, links: feeLinks};
}

function data3() {
  const revenues = data["jmu-revenues"];
  const nodes = [{name:1, title: "Nonoperating revenues", category: 2, value: 2},
    {name: 2, title: "Income before other revenues, expenses, gains, or losses", category:2, value:2},
    {name: 3, title: "Operating revenues", category: 2, value: 2},
    {name: 4, title: "JMU", category: 3, value: 3},
    {name: 5, title: "Nonoperating revenues 2", category:4, value: 4},
    {name: 6, title: "Operating Expense", category: 4, value: 4}
  ];

  const titles = ["none", "Nonoperating revenues", "Income before other revenues, expenses, gains, or losses",
      "Operating revenues", "JMU", "Nonoperating revenues 2", "Operating Expense"
    ];

    const links = [{source: 1, target: 4, value: 1},
      {source: 2, target: 4, value: 1},
      {source: 3, target: 4, value: 1},
      {source: 4, target: 5, value: 1},
      {source: 4, target: 6, value: 1}
    ];

    let rev = 7;
    revenues.forEach(element => {
      if(element.category === "income") {
        nodes.push({name: rev, title: element.name, category: 1, value: 1});
        let typeRev = titles.indexOf(element.type);
        links.push({source: rev, target: typeRev, value: (element[2023] + element[2022])});
        const index = links.findIndex(element=> element.source == typeRev && element.target == 4);
        if (index !== -1) {
          links[index].value += (element[2023] + element[2022]);
        }
      } else {
        nodes.push({name: rev, title: element.name, category:5, value: 5});
        if(element.type == "Nonoperating revenues"){
          links.push({source: 5, target: rev, value: (element[2022] + element[2023])});
          const index = links.findIndex(element=> element.source == 4 && element.target == 5);
          if (index !== -1) {
            links[index].value += (element[2023] + element[2022]);
          }
      } else {
          let typeExpense = titles.indexOf(element.type);
          links.push({source: typeExpense, target: rev, value: (element[2022] + element[2023])});
          const index = links.findIndex(element=> element.source == 4 && element.target == typeExpense);
          if (index !== -1) {
            links[index].value += (element[2023] + element[2022]);
          }
      }
    }
    rev++;
  });
  return {nodes: nodes, links: links};
}

function data4() {
  const athletics = data["jmu-athletics"];
  const nodes = [{name: 1, title: "Football", category: 1, value: 1},
    {name: 2, title: "Men's Basketball", category: 1, value: 1},
    {name: 3, title: "Women's Basketball", category: 1, value: 1},
    {name: 4, title: "Other sports", category: 1, value: 1},
    {name: 5, title: "Non-Program Specific", category: 1, value: 1},
    {name: 6, title: "JMU Athletics", category: 3, value: 3},
    {name: 7, title: "Football", category: 5, value: 5},
    {name: 8, title: "Men's Basketball", category: 5, value: 5},
    {name: 9, title: "Women's Basketball", category: 5, value: 5},
    {name: 10, title: "Other sports", category: 5, value: 5},
    {name: 11, title: "Non-Program Specific", category: 5, value: 5}
  ];
  const revenueMap = ["none", "Football", "Men's Basketball", "Other sports", "Non-Program Specific"];
  const expenseMap = ["n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "n/a", "Football", "Men's Basketball", "Other sports", "Non-Program Specific"];
  const links = [];

  let num = 12;
  athletics.forEach(element=> {
    if(element.type == "Operating Revenues") {
      nodes.push({name: num, title: element.name, category: 2, value: 2});
      links.push({source: 1, target: num, value: element["Football"]});
      links.push({source: 2, target: num, value: element["Men's Basketball"]});
      links.push({source: 3, target: num, value: element["Women's Basketball"]});
      links.push({source: 4, target: num, value: element["Other sports"]});
      links.push({source: 5, target: num, value: element["Non-Program Specific"]});
      links.push({source: num, target: 6, value: element["Total"]});
    } else {
      nodes.push({name: num, title: element.name, category: 4, value: 4});
      links.push({source: num, target: 7, value: element["Football"]});
      links.push({source: num, target: 8, value: element["Men's Basketball"]});
      links.push({source: num, target: 9, value: element["Women's Basketball"]});
      links.push({source: num, target: 10, value: element["Other sports"]});
      links.push({source: num, target: 11, value: element["Non-Program Specific"]});
      links.push({source: 6, target: num, value: element["Total"]});
    }
    num++;
  })
  return {nodes: nodes, links: links};
}


async function init(id, wrangle) {
  //const data = await d3.json("data/data_sankey.json");
  // Applies it to the data. We make a copy of the nodes and links objects
  // so as to avoid mutating the original.

  const sankeyData = wrangle();

  const { nodes, links } = sankey({
    //const tmp = sankey({
      nodes: sankeyData.nodes,
      links: sankeyData.links
  });

  const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Defines a color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes.
  const rect = svg.append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d.category));

  // Adds a title on the nodes.
  rect.append("title")
    .text(d => {
      console.log('d', d);
      return `${d.name}\n${format(d.value)}`
    });

  // Creates the paths that represent the links.
  const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  // Creates a gradient, if necessary, for the source-target color option.
  if (linkColor === "source-target") {
    const gradient = link.append("linearGradient")
      .attr("id", d => (d.uid = `link-${d.index}`))
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => d.source.x1)
      .attr("x2", d => d.target.x0);
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d => color(d.source.category));
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d => color(d.target.category));
  }

  link.append("path")
    .attr("d", d3Sankey.sankeyLinkHorizontal())
    .attr("stroke", linkColor === "source-target" ? (d) => `url(#${d.uid})`
      : linkColor === "source" ? (d) => color(d.source.category)
        : linkColor === "target" ? (d) => color(d.target.category)
          : linkColor)
    .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  // Adds labels on the nodes.
  svg.append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.title);

  // Adds labels on the links.
  svg.append("g")
    .selectAll()
    .data(links)
    .join("text")
    .attr("x", d => {
      console.log('linkd', d)
      const midX = (d.source.x1 + d.target.x0) / 2;
      return midX < width / 2 ? midX + 6 : midX - 6
    })
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => {
      console.log('linkd', d);
      return `${d.source.title} → ${d.value} → ${d.target.title}`
    });

  const svgNode = svg.node();
  document.getElementById(id).appendChild(svgNode);
  return svgNode;
}


init("one", data1);
init("two", data2);
init("three", data3);
init("four", data4);
