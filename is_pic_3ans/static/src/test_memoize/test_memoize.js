/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";

const { Component, useSubEnv, useState, onWillStart } = owl;

class TestMemoize extends Component {
    setup() {
        console.log("setup");
        this.action  = useService("action");
        //this.user_id = useService("user").context.uid;
        this.orm     = useService("orm");
        this.state   = useState({
            'state': {},
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
            console.log("onWillStart : state=",this.state)
            this.TestMemoizeAction();
         });
    } 

    OKclick(ev) {
        console.log("OKclick",ev);
        this.TestMemoizeAction();
    }


    async TestMemoizeAction(){
        console.log("TestMemoizeAction 1");
        var res = await this.orm.call("res.partner", 'test_memoize_action', []);
        this.state.res = res;
        this.state.test2 = "Test 2",
        console.log("TestMemoizeAction 2 state = ",this.state);
        console.log("TestMemoizeAction 3 state.partners = ",this.state.partners);        
    }

    ClickPartner(ev) {
        const partner_id = ev.target.attributes.partner_id.value;
        console.log("partner_id = ",partner_id);
        this.action.doAction({
            type: 'ir.actions.act_window',
            name: partner_id,
            target: 'current',
            res_id: parseInt(partner_id),
            res_model: 'res.partner',
            views: [[false, 'form']],
        });
    }
}
TestMemoize.components = {
    Layout,
};
TestMemoize.template = "is_pic_3ans.test_memoize_template";
registry.category("actions").add("is_pic_3ans.test_memoize_registry", TestMemoize);

