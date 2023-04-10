/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";
import { CheckBox } from "@web/core/checkbox/checkbox";
import { DateTimePicker, DatePicker } from "@web/core/datepicker/datepicker";

const { Component, useSubEnv, useState, onWillStart } = owl;

class Pic3Mois extends Component {
    setup() {
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
            var partners = await this.orm.searchRead("res.partner", [], ["id","name"]);
            this.state.partners = partners;
            console.log("onWillStart",partners);
        });
    }   

    onChangeCheckbox1() {
        console.log("onChangeCheckbox1")
    }

    onChangeCheckbox2() {
        console.log("onChangeCheckbox2")
    }

    onChangeDate(date) {
        console.log("onChangeDate",date)
        this.state.date = date;
    }

    OKclick() {
        this.setHTML();
        console.log("OKclick input=",this.state);

        this.state.partners = [];
        var partners = this.getPartner(this.state.input1);
        console.log("OKclick partners=",partners);

    }
    
    OKkey(ev) {
        if  (ev.target.id=='input1') this.state.input1 = ev.target.value;
        if  (ev.target.id=='input2') this.state.input2 = ev.target.value;
        if  (ev.target.id=='input3') this.state.input3 = ev.target.value;

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
        console.log("getPartners",partners);

        

        // try {
        //     this.partners = await this.orm.searchRead("res.partner", [["name","ilike",name]], ["id","name"]);
        // } catch (error) {
        //     console.log("error =",error);
        // } finally {
        //     //console.log("partners =",this.partners);
        //     //return this.partners

        //     //this.state.partners = partners;

        //     this.partners.forEach(function (partner) {
        //         console.log("getPartner=",partner, partner.id, partner.name);
        //         //this.todoList.splice(partner.id, 1);
        //     });
        // }
    }
}
Pic3Mois.components = {
    Layout,
    CheckBox,
    DateTimePicker,
    DatePicker,
};
Pic3Mois.template = "is_pic_3ans.pic_3mois_template";
registry.category("actions").add("is_pic_3ans.pic_3mois", Pic3Mois);

