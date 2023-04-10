/** @odoo-module **/

import { Card } from "./card/card";
import { Counter } from "./counter/counter";
import { TodoList } from "./todo_list/todo_list";
import { Component } from "@odoo/owl";

export class Playground extends Component {
    static template = "owl_playground.playground";
    static components = { Counter, TodoList, Card };
}
