/** @odoo-module */
import { Component } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";


export class Todo extends Component {
    setup() {
        this.action = useService("action");
    }

    onClick(ev) {
        this.props.toggleState(this.props.id);
    }

    onRemove() {
        this.props.removeTodo(this.props.id);
    }

    ViewPartner() {
        console.log("ViewPartner",this.props.id);

        this.action.doAction({
            type: 'ir.actions.act_window',
            name: this.props.id,
            target: 'current',
            res_id: this.props.id,
            res_model: 'res.partner',
            views: [[false, 'form']],
        });
    }
}

Todo.template = "is_pic_3ans.Todo";
Todo.props = {
    id: { type: Number },
    description: { type: String },
    done: { type: Boolean },
    toggleState: { type: Function },
    removeTodo: { type: Function},
};
