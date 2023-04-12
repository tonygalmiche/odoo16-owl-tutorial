/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";
import { CheckBox } from "@web/core/checkbox/checkbox";
import { DateTimePicker, DatePicker } from "@web/core/datepicker/datepicker";

const { Component, useSubEnv, useState, onWillStart, useRef } = owl;

class TestOwl01 extends Component {
    setup() {
        this.userService = useService("user");
        this.orm = useService("orm");
        this.state = useState({
            'checkbox1': true, 
            'checkbox2': false,
            'date': false,
            'html': false,
            'input1': false,
            'input2': false,
            'input3': false,
            'partners': false,
            'lines': [],
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
        this.action = useService("action");

        onWillStart(async () => {
            const user_id = this.userService.context.uid;
            this.state.input1 = await this.orm.call("is.mem.var", 'get', [false, user_id, "input1"]);
            this.state.input2 = await this.orm.call("is.mem.var", 'get', [false, user_id, "input2"]);
            this.state.input3 = await this.orm.call("is.mem.var", 'get', [false, user_id, "input3"]);
            console.log("mem_var",user_id,this.state.input1,this.state.input2,this.state.input3);

            var partners = await this.orm.searchRead("res.partner", [], ["id","name"]);
            this.state.partners = partners;
            console.log("onWillStart",partners);
            this.OKclick();
        });
    }   

    onChangeCheckbox1() {
        console.log("onChangeCheckbox1");
    }

    onChangeCheckbox2() {
        console.log("onChangeCheckbox2");
    }

    onChangeDate(date) {
        console.log("onChangeDate",date);
        this.state.date = date;
    }

    onChangeInput(event) {
        console.log("onChangeInput1",event.target,event.target.name,event.target.value);
        this.state[event.target.name] = event.target.value;
        const user_id = this.userService.context.uid;
        this.orm.call("is.mem.var", 'set', [false, user_id, event.target.name, event.target.value]);
    }

    OKclick() {
        this.setHTML();
        console.log("OKclick input=",this.state);

        this.state.partners = [];
        var partners = this.getPartner(this.state.input1);
        console.log("OKclick partners=",partners);
    }
    
    OKkey(ev) {
        //if  (ev.target.id=='input1') this.state.input1 = ev.target.value;
        if (ev.keyCode === 13) {
            console.log("OKkey", ev.target.id, ev.target.value);
            this.OKclick();
        }
    }

    setHTML(){
        this.state.html="<h1>TEST</h1>";

    }

    async getPartner(name){

        var partners = await this.orm.searchRead("res.partner", [["name","ilike",name]], ["id","name"]);
        this.state.partners = partners;
        console.log("getPartners 2",partners);

        var lines = await this.orm.call("res.partner", 'test_orm', [name]);
        this.state.lines = lines;
        console.log("test_orm 2 : lines =",lines);
    }


    ViewPartner(partner_id) {
        const ref="partner_id_"+partner_id;
        //const dom = useRef("rootRef");
        this.action.doAction({
            type: 'ir.actions.act_window',
            name: partner_id,
            target: 'current',
            res_id: partner_id,
            res_model: 'res.partner',
            views: [[false, 'form']],
        });
    }


}
TestOwl01.components = {
    Layout,
    CheckBox,
    DateTimePicker,
    DatePicker,
};
TestOwl01.template = "is_pic_3ans.test_owl_01_template";
registry.category("actions").add("is_pic_3ans.test_owl_01_registry", TestOwl01);

