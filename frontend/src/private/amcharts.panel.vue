<template>
    <ext-container layout="vbox">
        <ext-button text="Resresh" @tap="refresh"/>

        <ext-amcharts5 :createChart="_createChart" flex="1"/>
    </ext-container>
</template>

<script>
import "#vue/components/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";

export default {
    "methods": {
        _createChart ( cmp ) {
            this.chart = cmp;

            const root = cmp.root,
                am5 = cmp.am5;

            // chart
            const chart = root.container.children.push( am5xy.XYChart.new( root, {
                "layout": root.verticalLayout,
                "panX": true,

                // "wheelX": "panX",
                "pinchZoomX": true,

                // "panY": true,
                // "wheelY": "zoomX",
            } ) );

            // title
            chart.children.unshift( am5.Label.new( root, {
                "text": l10n( "Total subscribed users" ),
                "fontSize": 12,
                "x": am5.percent( 50 ),
                "centerX": am5.percent( 50 ),
            } ) );

            // x axis
            const xAxis = chart.xAxes.push( am5xy.DateAxis.new( root, {
                "baseInterval": {
                    "timeUnit": "hour",
                    "count": 1,
                },
                "renderer": am5xy.AxisRendererX.new( root, {} ),
                "tooltipDateFormat": "i",
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // y axis
            const yAxis = chart.yAxes.push( am5xy.ValueAxis.new( root, {
                "renderer": am5xy.AxisRendererY.new( root, {} ),
                "tooltip": am5.Tooltip.new( root, {} ),
            } ) );

            // series 1
            const series1 = chart.series.push( am5xy.SmoothedXLineSeries.new( root, {
                "name": l10n( "Total subscribed users" ),
                xAxis,
                yAxis,
                "valueXField": "date",
                "valueYField": "value1",
                "tooltip": am5.Tooltip.new( root, {
                    "labelText": l10n( "Subscribed users" ) + ": {valueY}",
                } ),
                "stroke": am5.color( "#00ff00" ),
                "fill": am5.color( "#00ff00" ),
                "connect": true, // XXX
            } ) );

            // fill settings
            series1.fills.template.setAll( {
                "fillOpacity": 0.5,
                "visible": true,
            } );

            // date processor
            series1.data.processor = am5.DataProcessor.new( root, {
                "dateFields": [ "date" ],
                "dateFormat": "i",
            } );

            // scroll bar
            chart.set(
                "scrollbarX",
                am5.Scrollbar.new( root, {
                    "orientation": "horizontal",
                } )
            );

            // cursor
            chart.set(
                "cursor",
                am5xy.XYCursor.new( root, {
                    "behavior": "zoomX",
                } )
            );

            // legend
            const legend = chart.children.push( am5.Legend.new( root, {
                "centerX": am5.p50,
                "x": am5.p50,
            } ) );

            legend.data.setAll( chart.series.values );

            this.refresh();
        },

        async refresh () {
            const data = [];

            let instant = Temporal.Instant.from( "2023-01-01T00:00:00Z" );

            for ( let n = 0; n < 5; n++ ) {
                instant = instant.add( { "hours": 1 } );

                data.push( {
                    "date": instant.toString(),
                    "value1": Math.floor( Math.random() * 100 ),
                } );
            }

            this.chart.setData( data );
        },
    },
};
</script>
