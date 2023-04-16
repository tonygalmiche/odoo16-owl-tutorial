/** @odoo-module */
import { loadJS } from "@web/core/assets";
import { getColor } from "@web/views/graph/colors";

const { Component, onWillStart, useState, onMounted, onWillUnmount } = owl;

export class DhtmlxGantt extends Component {
    setup() {
        // this.canvasRef = useRef("canvas");
        // this.labels = Object.keys(this.props.data);
        // this.data = Object.values(this.props.data);
        // this.color = this.labels.map((_, index) => {
        //     return getColor(index);
        // });

        onWillStart(() => {
            return loadJS(["/is_pic_3ans/static/lib/gantt-master/codebase/dhtmlxgantt.js"]);
        });

        // onMounted(() => {
        //     //this.renderChart();

        //     this.state.gantt.config.xml_date = "%Y-%m-%d %H:%i";
    
        //     this.state.gantt.scales = [
        //         { unit: "year", step: 1, format: "%Y" }
        //     ];
             
        //     this.state.gantt.init("gantt_here");
        //     this.state.gantt.parse({
        //       data: [
        //         {id: 1, text: "Project #1", start_date: null, duration: null, parent:0, progress: 0, open: true},
        //         {id: 2, text: "Task #1", start_date: "2019-08-01 00:00", duration:5, parent:1, progress: 1},
        //         {id: 3, text: "Task #2", start_date: "2019-08-06 00:00", duration:2, parent:1, progress: 0.5},
        //         {id: 4, text: "Task #3", start_date: null, duration: null, parent:1, progress: 0.8, open: true},
        //         {id: 5, text: "Task #3.1", start_date: "2019-08-09 00:00", duration:2, parent:4, progress: 0.2},
        //         {id: 6, text: "Task #3.2", start_date: "2019-08-11 00:00", duration:1, parent:4, progress: 0}
        //       ],
        //       links:[
        //         {id:1, source:2, target:3, type:"0"},
        //         {id:2, source:3, target:4, type:"0"},
        //         {id:3, source:5, target:6, type:"0"}
        //       ]
        //     });



        //});

        // onWillUnmount(() => {
        //     if (this.chart) {
        //         this.chart.destroy();
        //     }
        // });
    }

    renderChart() {
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = new Chart(this.canvasRef.el, {
            type: "pie",
            data: {
                labels: this.labels,
                datasets: [
                    {
                        label: this.props.label,
                        data: this.data,
                        backgroundColor: this.color,
                    },
                ],
            },
        });
    }
}

DhtmlxGantt.template = "is_pic_3ans.DhtmlxGanttTemplate";