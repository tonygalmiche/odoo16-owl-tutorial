/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { PieChart } from "./pie_chart/pie_chart";
import { useService } from "@web/core/utils/hooks";

const { Component, useSubEnv, useState, onWillStart } = owl;

class TestOwlChart extends Component {
    setup() {
        this.state   = useState({
            'chart_values': { l: 16, m: 35, xl: 16, xxl: 16 }
         });
        // The useSubEnv below can be deleted if you're > 16.0
        useSubEnv({
            config: {
                ...getDefaultConfig(),
                ...this.env.config,
            },
        });
        this.display = {
            controlPanel: { "top-right": false, "bottom-right": false },
        };
        onWillStart(async () => {
            console.log("onWillStart");
            console.log(this.state);
        });
    } 
    OKclick(ev) {
        console.log("OKclick",ev);
    }
}
TestOwlChart.components = { Layout, PieChart };
TestOwlChart.template = "is_pic_3ans.test_owl_chart_template";
registry.category("actions").add("is_pic_3ans.test_owl_chart_registry", TestOwlChart);

