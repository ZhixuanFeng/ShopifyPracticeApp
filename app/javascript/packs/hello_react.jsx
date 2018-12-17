// Run this example by adding <%= javascript_pack_tag 'hello_react' %> to the head of your layout file,
// like app/views/layouts/application.html.erb. All it does is render <div>Hello React</div> at the bottom
// of the page.

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {AppProvider, Page, Select} from '@shopify/polaris';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
class TestApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: props.selected,
        };
        this.renderChart(props.selected);
    }


    handleChange = (newValue) => {
        this.setState({selected: newValue});
        this.renderChart(newValue);
    };

    renderChart(newValue) {
        const node = document.getElementById('root');
        const data = JSON.parse(node.getAttribute('data'));
        switch (newValue) {
            case 'productVsPrice':
                ReactDOM.render(<ProductPriceChart {...data} />, node);
                break;
            case 'varientsVsPrice':
                ReactDOM.render(<VariantPriceChart {...data} />, node);
                break;
            case 'productVsWeight':
                ReactDOM.render(<ProductWeightChart {...data} />, node);
                break;
            case 'varientsVsInventory':
                ReactDOM.render(<VariantInventoryChart {...data} />, node);
                break;
            case 'physicalVsNonPhysical':
                ReactDOM.render(<PhysicalProductPieChart {...data} />, node);
                break;
            case 'inventoryWorth':
                ReactDOM.render(<InventoryWorthPieChart {...data} />, node);
                break;
        }
    }

    render() {
        const options = [
            {label: 'Product vs Price', value: 'productVsPrice'},
            {label: 'Variants vs Price', value: 'varientsVsPrice'},
            {label: 'Product vs Weight', value: 'productVsWeight'},
            {label: 'Variants vs Inventory', value: 'varientsVsInventory'},
            {label: 'Physical & Non-Physical', value: 'physicalVsNonPhysical'},
            {label: 'Inventory Worth Pie Chart', value: 'inventoryWorth'},
        ];

        return (
            <Select
                label="Select Chart"
                options={options}
                onChange={this.handleChange}
                value={this.state.selected}
            />
        );
    }
}


const ProductPriceChart = props => (
    <AppProvider>
        <Page title="Price Chart">
            <HighchartsReact
                highcharts={Highcharts}
                options={
                    {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Product Prices'
                        },
                        xAxis: {
                            categories: props.products.map(p => p.title),
                            crosshair: true
                        },
                        tooltip: {
                            pointFormat: 'Price: <b>{point.y:.1f} USD</b>'
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Price (USD)'
                            }
                        },
                        series: [{
                            name: 'Product',
                            data: props.products.map(product => parseFloat(product.variants[0].price))
                        }]
                    }
                }
            />
        </Page>
    </AppProvider>
)


const VariantPriceChart = props => (
    <AppProvider>
        <Page title="Price Chart">
            <HighchartsReact
                highcharts={Highcharts}
                options={
                    {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Variant Prices'
                        },
                        xAxis: {
                            categories: props.products.map(p => p.title),
                            crosshair: true
                        },
                        tooltip: {
                            pointFormat: 'Price of variant {series.titles[0]}: <b>{point.y:.1f} USD</b>'
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Price (USD)'
                            }
                        },
                        series: getChartSeriesForVarientProperty(props.products, 'price')
                    }
                }
            />
        </Page>
    </AppProvider>
);



const ProductWeightChart = props => (
    <AppProvider>
        <Page title="Weight Chart">
            <HighchartsReact
                highcharts={Highcharts}
                options={
                    {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Product Weight'
                        },
                        xAxis: {
                            categories: props.products.map(p => p.title),
                            crosshair: true
                        },
                        tooltip: {
                            pointFormat: 'Weight: <b>{point.y:.1f} kg</b>'
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Weight (kg)'
                            }
                        },
                        series: [{
                            name: 'Product',
                            data: props.products.map(product => parseFloat(product.variants[0].weight))
                        }]
                    }
                }
            />
        </Page>
    </AppProvider>
);



const VariantInventoryChart = props => (
    <AppProvider>
        <Page title="Inventory Chart">
            <HighchartsReact
                highcharts={Highcharts}
                options={
                    {
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: 'Variant Inventory'
                        },
                        xAxis: {
                            categories: props.products.map(p => p.title),
                            crosshair: true
                        },
                        tooltip: {
                            pointFormat: 'Inventory quantity of {series.name}: <b>{point.y:.1f}</b>'
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text: 'Inventory quantity'
                            }
                        },
                        series: getChartSeriesForVarientProperty(props.products, 'inventory_quantity')
                    }
                }
            />
        </Page>
    </AppProvider>
);



const PhysicalProductPieChart = props => (
    <AppProvider>
        <Page title="Physical Product Chart">
            <HighchartsReact
                highcharts={Highcharts}
                options={
                    {
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: 'Physical vs Non-Physical Products'
                        },
                        tooltip: {
                            pointFormat: '<b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: function() {
                            var series = [];
                            var name = 'Products';
                            var colorByPoint = true;
                            var data = [{
                                name: 'Physical Products',
                                y: 0,
                                sliced: true,
                                selected: true
                            },{
                                name: 'Non-Physical Products',
                                y: 0
                            }];
                            for(var i = 0; i < props.products.length; i++) {
                                data[props.products[i].variants[0].weight > 0 ? 0 : 1].y++;
                            }
                            series.push({name: name, colorByPoint: colorByPoint, data: data});
                            return series;
                        }()
                    }
                }
            />
        </Page>
    </AppProvider>
);


const InventoryWorthPieChart = props => (
    <AppProvider>
        <Page title="Inventory Worth Chart">
            <HighchartsReact
                highcharts={Highcharts}
                options={
                    {
                        chart: {
                            type: 'pie'
                        },
                        title: {
                            text: 'Inventory Worth'
                        },
                        subtitle: {
                            text: 'No access to inventory costs :('
                        },
                        tooltip: {
                            pointFormat: '{point.y} USD - {point.percentage:.1f}%'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        series: function() {
                            var series = [];
                            var name = 'Products';
                            var colorByPoint = true;
                            var data = [];
                            props.products.forEach((product) => {
                                product.variants.forEach((variant) => {
                                    data.push({
                                        name: product.title + (variant.title === 'Default Title' ? '' : ':' + variant.title),
                                        y: parseFloat((parseFloat(variant.price) * variant.inventory_quantity).toFixed(2))
                                    });
                                });
                            });
                            series.push({name: name, colorByPoint: colorByPoint, data: data});
                            return series;
                        }()
                    }
                }
            />
        </Page>
    </AppProvider>
);


function getMaxNumOfVariants(products) {
    return Math.max.apply(Math, products.map(product => product.variants.length));
}

function getChartSeriesForVarientProperty(products, prop) {
    var series = [];
    for (var i = 0; i < getMaxNumOfVariants(products); i++) {
        var titles = [];
        var data = [];
        var name = 'variant ' + (i+1);
        for (var j = 0; j < products.length; j++) {
            titles.push(products[j].variants.length > i ? products[j].variants[i].title : null);
            data.push(products[j].variants.length > i ? parseFloat(products[j].variants[i][prop]) : NaN);
        }
        series.push({name: name, data: data, title: titles});
    }
    return series;
}


// Render component with data
document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<AppProvider><Page><TestApp {...{selected: 'productVsPrice'}}/></Page></AppProvider>,
        document.getElementById("select"));
});

