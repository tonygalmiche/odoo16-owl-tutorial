/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";
import { Domain } from "@web/core/domain";
import { TodoList } from "./todo_list/todo_list";

const { Component, useSubEnv, onWillStart } = owl;


console.log("## TEST 1 pic_3ans ##);")



class Pic3Ans extends Component {
    setup() {
        console.log("## TEST pic_3ans setup ##);")
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

        /*
        this.keyToString = {
            average_quantity: "Average amount of t-shirt by order this month",
            average_time: "Average time for an order to go from 'new' to 'sent' or 'cancelled'",
            nb_cancelled_orders: "Number of cancelled orders this month",
            nb_new_orders: "Number of new orders this month",
            total_amount: "Total amount of new orders this month",
        };
        */

        /*
        onWillStart(async () => {
            this.statistics = await this.rpc("/awesome_tshirt/statistics");
            console.log("statistics =",this.statistics)
            //this.statistics = await this.tshirtService.loadStatistics(); //2.4 Cache network calls, create a service 
        });
        */
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
    
    OK() {
        var input1 = $("#input1").val();
        var input2 = $("#input2").val();
        var input3 = $("#input3").val();
        console.log("OK input1=",input1,input2,input3);
    }
    
    OKkey(ev) {
        if (ev.keyCode === 13 && ev.target.value != "") {
            console.log("OKkey");
            this.OK();
        }
    }
}


console.log("## TEST 2 pic_3ans ##);")


Pic3Ans.components = { Layout, TodoList };
//Pic3Ans.components = { Layout };
Pic3Ans.template = "is_pic_3ans.pic_3ans_template";
registry.category("actions").add("is_pic_3ans.pic_3ans", Pic3Ans);


console.log("## TEST 3 pic_3ans ##", registry.category("actions"))

