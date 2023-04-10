/** @odoo-module */
import { Todo } from "../todo/todo";
import { useAutofocus } from "../utils";
import { useService } from "@web/core/utils/hooks";
import { Component, useState, onWillStart } from "@odoo/owl";

//const { Component, onWillStart } = owl;


export class TodoList extends Component {
    setup() {
        this.rpc = useService("rpc");
        this.orm = useService("orm");
        useAutofocus("todoListInput");

        this.todoList = useState([]);

        /*
        const todoList = [
            { id: 3, description: "buy milk", done: false },
            { id: 4, description: "buy eggs", done: true },
            { id: 5, description: "buy avocado", done: true },
        ];
        //this.todoList = useState([]);
        this.todoList = useState(todoList);
        */

        onWillStart(async () => {
            const statistics = await this.rpc("/awesome_tshirt/statistics");
            console.log("statistics =",statistics);

            const partners = statistics.partners;
            console.log("partners =",partners);

            var todoList = []
            var id=0;
            var nextId=0;
            for (const [key, value] of Object.entries(partners)) {
                console.log(key, value);
                id = Number(key);
                if (id>nextId){
                    nextId=id;
                }
                this.todoList.push({ id: id, description: value, done: false });
            }
            console.log(todoList);
            this.nextId = nextId+1;
        });
    }

    onRemoveAll() {
        console.log("onRemoveAll",this.todoList);
        this.todoList = useState([]);


        //this.removeAllTodo();
    }


    async addPartner(data){
        const res_id = await this.orm.create("res.partner", [data], {});
        console.log("res_id =",res_id);
    }


    async removePartner(todoId){
        console.log("removePartner : todoId =",todoId);
        await this.orm.unlink("res.partner", [todoId]);
    }


    async getPartner(name){
        try {
            this.partners = await this.orm.searchRead("res.partner", [["name","ilike",name]], ["id","name"]);
        } catch (error) {
            console.log("error =",error);
        } finally {
            console.log("partners =",this.partners);
            //return this.partners

            //this.todoList = [];
            this.partners.forEach(function (partner) {
                console.log("partner=",partner, partner.id, partner.name);
                //this.todoList.splice(partner.id, 1);
            });
        }
    }


        

        // this.todoList = []
        // var id=0;
        // var nextId=0;
        // partners.forEach(function (partner) {
        //     console.log("partner=",partner, partner.id, partner.name);
        //     id = Number(partner.id);
        //     if (id>nextId){
        //         nextId=id;
        //     }
        //     this.todoList.push({ id: id, name: partner.name, done: false });
        // });
        // console.log("todoList=",todoList);
        // //this.todoList = todoList;
        // this.nextId = nextId+1;







    
    filtrePartners(ev) {
        if (ev.keyCode === 13 && ev.target.value != "") {
            console.log(ev.target.value);

            const statistics = this.rpc("/awesome_tshirt/statistics");
            console.log("statistics =",statistics);

            //const partners = statistics.partners;
            //console.log("partners =",partners);


            var partners = this.getPartner(ev.target.value);
            console.log(partners);
            console.log("typeof=",typeof partners);

            // for (const [key, value] of Object.entries(partners)) {
            //     console.log("TEST", key, value);
            // }

            // partners.forEach(function (partner) {
            //     console.log(partner);
            //   });


            //   var fields = 'comment,child_ids,bank_ids,additional_info'.split(',');
            //   fields.forEach(function (field) {
            //       delete data.company[field];
            //   });



            // partners.forEach((item, index) => {
            //     console.log(index,item);
            // });


            //this.todoList.push({ id: this.nextId++, description: ev.target.value, done: false });




    /*
     * @private
     * @returns {Promise<{id: number, name: string, dashboard_ids: number[]}[]>}
    _fetchGroups() {
        return this.orm.searchRead(
            "spreadsheet.dashboard.group",
            [["dashboard_ids", "!=", false]],
            ["id", "name", "dashboard_ids"]
        );
    }
     */


            // async _load() {
            //     await super._load();
            //     if (this.limit === 0) {
            //         this.data = [];
            //         return;
            //     }
            //     const { domain, orderBy, context } = this._searchParams;
            //     this.data = await this._orm.searchRead(
            //         this._metaData.resModel,
            //         domain,
            //         this._metaData.columns.filter((f) => this.getField(f)),
            //         {
            //             order: orderByToString(orderBy),
            //             limit: this.limit,
            //             context,
            //         }
            //     );
            // }

            // return this._rpc({
            //     model: 'account.journal',
            //     method: 'create_document_from_attachment',
            //     args: ["", attachent_ids],
            //     context: this.initialState.context,
            // }).then(function(result) {
            //     self.do_action(result);
            // }).catch(function () {
            //     // Reset the file input, allowing to select again the same file if needed
            //     self.$('.o_account_document_upload .o_input_file').val('');
            // });


            // const filtre=[
            //     ["name", "ilike", ev.target.value],
            // ];
            // const res = this.orm.searchRead(
            //     "res.partner",
            //     filtre
            // );
            // console.log("res=",res);
            // console.log("res.Promise=",res.all);


            // Promise.all(res).then(x=>{
            //     console.log(x);
            // });

            // for (const [key, value] of Object.entries(res.all)) {
            //     console.log("TEST",key, value);
            //  }



            // var todoList = []
            // var id=0;
            // var nextId=0;
            // for (const [key, value] of Object.entries(partners)) {
            //     console.log(key, value);
            //     id = Number(key);
            //     if (id>nextId){
            //         nextId=id;
            //     }
            //     this.todoList.push({ id: id, description: value, done: false });
            // }



        }
    }


    
    addTodo(ev) {
        if (ev.keyCode === 13 && ev.target.value != "") {

            let data = {
                name: ev.target.value,
            };
            this.addPartner(data);

            this.todoList.push({ id: this.nextId++, description: ev.target.value, done: false });
            ev.target.value = "";
        }
    }

    toggleTodo(todoId) {
        const todo = this.todoList.find((todo) => todo.id === todoId);
        if (todo) {
            todo.done = !todo.done;
        }
    }

    removeTodo(todoId) {
        const todoIndex = this.todoList.findIndex((todo) => todo.id === todoId);
        if (todoIndex >= 0) {
            this.removePartner(todoId);
            this.todoList.splice(todoIndex, 1);
        }




    }

    // removeAllTodo() {
    //     console.log("removeAllTodo");
    // }



    
}

TodoList.components = { Todo };
TodoList.template = "is_pic_3ans.TodoList";
// TodoList.props = {
//     removeAllTodo: { type: Function},
// };

