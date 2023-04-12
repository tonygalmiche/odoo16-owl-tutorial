/** @odoo-module **/
import { registry } from "@web/core/registry";
import { Layout } from "@web/search/layout";
import { getDefaultConfig } from "@web/views/view";
import { useService } from "@web/core/utils/hooks";

const { Component, useSubEnv, useState, onWillStart } = owl;

class Pic3Ans extends Component {
    setup() {
        //this.action  = useService("action");
        this.user_id = useService("user").context.uid;
        this.orm     = useService("orm");
        this.state   = useState({
            'pic3ans_soc': false,
            'pic3ans_client': false,
            'pic3ans_fournisseur': false,
            'pic3ans_codepg': false,
            'pic3ans_cat': false,
            'pic3ans_gest': false,
            'pic3ans_moule': false,
            'pic3ans_annee_realise': false,
            'pic3ans_annee_prev': false,
        });
        // PIC/PDP
        // Nb Lignes/Page
        
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
            this.state.pic3ans_soc           = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_soc"]);
            this.state.pic3ans_client        = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_client"]);
            this.state.pic3ans_fournisseur   = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_fournisseur"]);
            this.state.pic3ans_codepg        = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_codepg"]);
            this.state.pic3ans_cat           = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_cat"]);
            this.state.pic3ans_gest          = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_gest"]);
            this.state.pic3ans_moule         = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_moule"]);
            this.state.pic3ans_annee_realise = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_annee_realise"]);
            this.state.pic3ans_annee_prev    = await this.orm.call("is.mem.var", 'get', [false, this.user_id, "pic3ans_annee_prev"]);
        });
    } 

    OKclick(ev) {
        console.log("OKclick",ev);
    }

    onChangeInput(ev) {
        console.log("onChangeInput",ev);
        this.state[ev.target.name] = ev.target.value;
        this.orm.call("is.mem.var", 'set', [false, this.user_id, ev.target.name, ev.target.value]);
    }
}
Pic3Ans.components = {
    Layout,
};
Pic3Ans.template = "is_pic_3ans.pic_3ans_template";
registry.category("actions").add("is_pic_3ans.pic_3ans_registry", Pic3Ans);

