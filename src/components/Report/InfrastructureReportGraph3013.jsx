import React from 'react'
import { Select } from 'antd';
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useSelector } from 'react-redux';



export default function InfrastructureReportGraph3013({ arrGroupedGraphData }) {
  const filterDatawithHeaderName = useSelector((state) => state.header.arrGroupedGraph3013Data.graphData)
  
  const selectedleble = useSelector((state) => state.header.selectedField3013graph.label)

  const totalSch = arrGroupedGraphData.map((sch) => sch.totSch)
  const regionName = arrGroupedGraphData.map((region) => region.regionName)
  const selectedField = useSelector((state) => state.header.selectedField3013graph.field)

  const top10filterDatawithHeaderName = [...filterDatawithHeaderName].sort((a, b) => b[selectedField] - a[selectedField]).slice(0, 10)
  const headerData = useSelector((state) => state.header);

  const categoriestopTenData = top10filterDatawithHeaderName?.map((categories) => categories[selectedField])
  const categoriesallData = filterDatawithHeaderName?.map((categories) => categories[selectedField])
  const categories = filterDatawithHeaderName?.map((categories) => categories.regionName)
  const dataPoints = arrGroupedGraphData.map((total, index) => ({
    y: categoriesallData[index],
    x: totalSch[index],
    name: regionName[index]
  }));

  return (
    <>
      <div className="col-md-6 col-lg-6">
        <div className="impact-box-content-education mt-3">
          <div className="text-btn-d mb-0">
            <h2 className="heading-sm">
              Top 10 {headerData.regionName} by Number of Schools with {selectedleble}
            </h2>
          </div>
          <div className="piechart-box">
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  type: "bar",
                  marginTop: 50,
                  height: 525,
                  events: {
                    beforePrint: function () {
                      this.exportSVGElements[0].box.hide();
                      this.exportSVGElements[1].hide();
                    },
                    afterPrint: function () {
                      this.exportSVGElements[0].box.show();
                      this.exportSVGElements[1].show();
                    },
                  },
                },
                xAxis: {
                  categories: categories,
                  title: {
                    text: null,
                  },
                  gridLineWidth: 1,
                  lineWidth: 0,
                },
                yAxis: {
                  min: 0,
                  title: {
                    enabled: false,
                  },
                  labels: {
                    overflow: "justify",
                  },
                  gridLineWidth: 0,
                },
                title: {
                  text: "Top 10 State",
                },
                tooltip: {
                  pointFormatter: function () {
                    return `<span style="color:${this.color}">\u25CF</span> ${selectedleble}: <b>${this.y.toLocaleString("en-IN")}</b><br/>`;
                  }
                },
                plotOptions: {
                  bar: {
                    borderRadius: "50%",
                    dataLabels: {
                      enabled: true,
                      formatter: function () {
                        return "<b>" + this.point.y.toLocaleString("en-IN");
                      },
                    },
                    groupPadding: 0.1,
                    pointPadding: 0.1,
                  },
                },
                legend: {
                  layout: "horizontal",
                  align: "center",
                  verticalAlign: "bottom",
                  itemMarginTop: 10,
                  itemMarginBottom: 0,
                },
                credits: {
                  enabled: false,
                },
                series: [{
                  name: String(selectedleble),
                  color: '#e6694a',
                  data: categoriestopTenData,
                  pointWidth: 25,
                }],
                exporting: {
                  filename: "Top 10 State",
                  csv: {
                    columnHeaderFormatter: function (item) {
                      if (!item || item instanceof Highcharts.Axis) {
                        return;
                      }
                      return item.name;
                    },
                  },
                },
              }}
              // allowChartUpdate={true}
              immutable={true}
            />
          </div>
        </div>
      </div>

      <div className="col-md-6 col-lg-6">
        <div className="impact-box-content-education mt-3">
          <div className="text-btn-d mb-0">
            <h2 className="heading-sm">
             {headerData.regionName}-wise Comparison of Number of Schools Providing {selectedleble}
            </h2>
          </div>
          <div className="piechart-box">
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  type: 'scatter',
                  marginTop: 50,
                  height: 524,
                  zooming: {
                    type: 'xy'
                  }
                },
                title: {
                  text: "",
                  align: 'middle'
                },
                xAxis: {
                  title: {
                    // text: "Total School",
                    margin: 10,
                    style: {
                      color: '#000',
                      fontWeight: 'bold'
                    }
                  },
                  labels: {
                    format: '{value} '
                  },
                  startOnTick: true,
                  endOnTick: true,
                  showLastLabel: true,
                  lineWidth: 1,
                  lineColor: '#ddd'
                },
                yAxis: {
                  title: {
                    text: selectedleble,
                    style: {
                      color: '#000',
                      fontWeight: 'bold'
                    }
                  },
                  labels: {
                    format: '{value} '
                  },
                  gridLineWidth: 0,
                  lineWidth: 1,
                  lineColor: '#ddd'
                },
                legend: {
                  enabled: true
                },
                plotOptions: {
                  scatter: {
                    marker: {
                      radius: 2.5,
                      symbol: 'circle',
                      lineWidth: 0,
                      lineColor: null,
                      states: {
                        hover: {
                          enabled: true,
                          lineColor: 'rgb(100,100,100)'
                        }
                      }
                    },
                    states: {
                      hover: {
                        marker: {
                          enabled: false
                        }
                      }
                    },
                    jitter: {
                      x: 0.02,
                      y: 0.02
                    },

                    dataLabels: {
                      enabled: false,
                      formatter: function () {
                        return `${this.point.y}`;
                      }
                    }
                  }
                },
                tooltip: {
                  headerFormat: '',
                  pointFormat: `<b>${headerData.regionName}: {point.name}</b> <br/> Total School: {point.x} <br/>${selectedleble}: {point.y}`
                },
                credits: {
                  enabled: false
                },
                series: [
                  {
                    name: 'Total Schools',
                    data: dataPoints,
                    // color: '#f5bf55',
                    color: '#751539',
                    pointWidth: 20
                  }
                ],
                exporting: {
                  filename: "Top 10 State",
                  csv: {
                    columnHeaderFormatter: function (item) {
                      if (!item || item instanceof Highcharts.Axis) {
                        return "category";
                      }
                      return item.name;
                    },
                  },
                },
              }}
              immutable={true}
            />
          </div>
        </div>
      </div>
    </>

  )
}
