/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";
import { Domain } from "@web/core/domain";
import { Card } from "./card/card";
import { PieChart } from "./pie_chart/pie_chart";
import { sprintf } from "@web/core/utils/strings";

const { Component, useSubEnv, onWillStart } = owl;
//const { Component, useSubEnv } = owl;
//const { Component } = owl;


console.log("## TEST dashboard ##);")


//class AwesomeDashboard extends Component {}
class AwesomeDashboard extends Component {
    setup() {
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

        this.action = useService("action");
        this.rpc = useService("rpc");
        //this.tshirtService = useService("tshirtService"); //2.4 Cache network calls, create a service 

        this.keyToString = {
            average_quantity: "Average amount of t-shirt by order this month",
            average_time: "Average time for an order to go from 'new' to 'sent' or 'cancelled'",
            nb_cancelled_orders: "Number of cancelled orders this month",
            nb_new_orders: "Number of new orders this month",
            total_amount: "Total amount of new orders this month",
        };
        onWillStart(async () => {
            this.statistics = await this.rpc("/awesome_tshirt/statistics");
            //this.statistics = await this.tshirtService.loadStatistics(); //2.4 Cache network calls, create a service 

        });


    }

    openCustomerView() {
        this.action.doAction("base.action_partner_form");
    }

    openOrders(title, domain) {
        this.action.doAction({
            type: "ir.actions.act_window",
            name: title,
            res_model: "awesome_tshirt.order",
            domain: new Domain(domain).toList(),
            views: [
                [false, "list"],
                [false, "form"],
            ],
        });
    }
    openLast7DaysOrders() {
        const domain =
            "[('create_date','>=', (context_today() - datetime.timedelta(days=7)).strftime('%Y-%m-%d'))]";
        this.openOrders("Last 7 days orders", domain);
    }

    openLast7DaysCancelledOrders() {
        const domain =
            "[('create_date','>=', (context_today() - datetime.timedelta(days=7)).strftime('%Y-%m-%d')), ('state','=', 'cancelled')]";
        this.openOrders("Last 7 days cancelled orders", domain);
    }



    openFilteredBySizeOrders(size) {
        const title = sprintf(this.env._t("Filtered orders by %s size"), size);
        const domain = `[('size','=', '${size}')]`;
        this.openOrders(title, domain);
    }


}

//AwesomeDashboard.components = {};
//AwesomeDashboard.components = { Layout };
//AwesomeDashboard.components = { Layout, Card };
AwesomeDashboard.components = { Layout, Card, PieChart };

AwesomeDashboard.template = "awesome_tshirt.clientaction";
registry.category("actions").add("awesome_tshirt.dashboard", AwesomeDashboard);
